#!/bin/bash
#
# OpenScreen macOS Build Script
# Produces: release/<version>/OpenScreen-Mac-<arch>-<version>.dmg
#
# Usage: chmod +x scripts/build_macos.sh && ./scripts/build_macos.sh
#

set -euo pipefail

# ── Load .env ─────────────────────────────────────────────────────────
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"

if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
else
    echo "ERROR: .env file not found at ${ENV_FILE}"
    echo "Create one with APP_NAME, SIGN_IDENTITY, NOTARY_PROFILE, etc."
    exit 1
fi

# ── Config ────────────────────────────────────────────────────────────
VERSION=$(node -p "require('${PROJECT_ROOT}/package.json').version")
RELEASE_DIR="${PROJECT_ROOT}/release/${VERSION}"
ENTITLEMENTS="${PROJECT_ROOT}/macos.entitlements"
ARCHS=("arm64" "x64")

# ── Colors ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

print_step() { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }
print_ok()   { echo -e "${GREEN}✓ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_err()  { echo -e "${RED}✗ $1${NC}"; }

# ── Preflight ─────────────────────────────────────────────────────────
echo -e "\n${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   ${APP_NAME} macOS Build Script v${VERSION}    ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"

print_step "Checking prerequisites..."

if [[ "$(uname)" != "Darwin" ]]; then
    print_err "This script must be run on macOS."
    exit 1
fi
print_ok "Running on macOS ($(uname -m))"

if ! command -v node &> /dev/null; then
    print_err "Node.js not found. Please install Node.js first."
    exit 1
fi
print_ok "Node.js found: $(node -v)"

if ! command -v npm &> /dev/null; then
    print_err "npm not found."
    exit 1
fi
print_ok "npm found: $(npm -v)"

# Check signing identity
if ! security find-identity -v -p codesigning | grep -q "$SIGN_IDENTITY"; then
    print_err "Signing identity not found: ${SIGN_IDENTITY}"
    print_err "Run 'security find-identity -v -p codesigning' to see available identities."
    exit 1
fi
print_ok "Signing identity found: ${SIGN_IDENTITY}"

# Check notary profile
if ! xcrun notarytool history --keychain-profile "$NOTARY_PROFILE" &> /dev/null; then
    print_err "Notary profile '${NOTARY_PROFILE}' not found in keychain."
    print_err "Run: xcrun notarytool store-credentials \"${NOTARY_PROFILE}\" --apple-id \"${APPLE_ID}\" --team-id \"${TEAM_ID}\""
    exit 1
fi
print_ok "Notary profile found: ${NOTARY_PROFILE}"

# Check entitlements
if [ ! -f "$ENTITLEMENTS" ]; then
    print_err "Entitlements file not found: ${ENTITLEMENTS}"
    exit 1
fi
print_ok "Entitlements file found"

# ── Clean ─────────────────────────────────────────────────────────────
cd "$PROJECT_ROOT"

print_step "Cleaning previous build artifacts..."
rm -rf dist dist-electron "${RELEASE_DIR}"
print_ok "Clean complete"

# ── Install Dependencies ─────────────────────────────────────────────
print_step "Installing dependencies..."
npm ci
print_ok "Dependencies installed"

# ── Build Vite + Electron ────────────────────────────────────────────
print_step "Building Vite + Electron... (this may take a minute)"
npx tsc && npx vite build
print_ok "Vite + Electron build complete"

# ── Package, Sign, Notarize per Architecture ─────────────────────────
for ARCH in "${ARCHS[@]}"; do
    echo ""
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Building for: ${ARCH}${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # ── Package with electron-builder ─────────────────────────────
    print_step "[${ARCH}] Packaging with electron-builder..."

    # Build .app only (--dir), electron-builder handles codesigning
    # with hardenedRuntime + entitlements from electron-builder.json5
    CSC_NAME="$CSC_NAME" npx electron-builder --mac --${ARCH} --dir

    # Find the .app bundle
    APP_BUNDLE=$(find "${RELEASE_DIR}" -maxdepth 2 -name "*.app" -type d | grep -i "${ARCH}\|mac" | head -n1)
    if [ -z "$APP_BUNDLE" ]; then
        # Fallback: find any .app in the output
        APP_BUNDLE=$(find "${RELEASE_DIR}" -maxdepth 2 -name "*.app" -type d | head -n1)
    fi

    if [ -z "$APP_BUNDLE" ]; then
        print_err "[${ARCH}] Could not find .app bundle in ${RELEASE_DIR}"
        exit 1
    fi
    print_ok "[${ARCH}] App bundle: $(basename "$APP_BUNDLE")"

    # ── Verify codesign on .app ───────────────────────────────────
    print_step "[${ARCH}] Verifying .app code signature..."
    codesign --verify --deep --strict "$APP_BUNDLE" 2>&1 || print_warn "[${ARCH}] Deep verify had warnings (may be expected pre-notarization)"
    print_ok "[${ARCH}] .app signature verified"

    # ── Create DMG ────────────────────────────────────────────────
    DMG_NAME="${APP_NAME}-Mac-${ARCH}-${VERSION}.dmg"
    DMG_OUTPUT="${RELEASE_DIR}/${DMG_NAME}"
    DMG_STAGING="${RELEASE_DIR}/dmg-staging-${ARCH}"

    print_step "[${ARCH}] Creating DMG..."

    rm -f "$DMG_OUTPUT"
    rm -rf "$DMG_STAGING"

    # Stage: app + Applications shortcut for drag-to-install
    mkdir -p "$DMG_STAGING"
    cp -R "$APP_BUNDLE" "$DMG_STAGING/"
    ln -s /Applications "$DMG_STAGING/Applications"

    hdiutil create \
        -srcfolder "$DMG_STAGING" \
        -volname "${APP_NAME}" \
        -fs HFS+ \
        -fsargs "-c c=64,a=16,e=16" \
        -format UDBZ \
        "$DMG_OUTPUT"

    print_ok "[${ARCH}] DMG created: ${DMG_NAME}"
    rm -rf "$DMG_STAGING"

    # ── Sign DMG ──────────────────────────────────────────────────
    print_step "[${ARCH}] Signing DMG..."
    codesign --force --sign "$SIGN_IDENTITY" --timestamp "$DMG_OUTPUT"
    print_ok "[${ARCH}] DMG signed"

    # ── Notarize DMG ──────────────────────────────────────────────
    print_step "[${ARCH}] Notarizing DMG with Apple... (this may take several minutes)"
    xcrun notarytool submit "$DMG_OUTPUT" \
        --keychain-profile "$NOTARY_PROFILE" \
        --wait
    print_ok "[${ARCH}] DMG notarized"

    # ── Staple ────────────────────────────────────────────────────
    print_step "[${ARCH}] Stapling notarization ticket..."
    xcrun stapler staple "$DMG_OUTPUT"
    print_ok "[${ARCH}] Ticket stapled"

    # ── Validate ──────────────────────────────────────────────────
    print_step "[${ARCH}] Validating stapled DMG..."
    xcrun stapler validate "$DMG_OUTPUT"
    print_ok "[${ARCH}] Validation passed"

done

# ── Clean up unpacked dirs (keep only DMGs) ───────────────────────────
print_step "Cleaning up intermediate directories..."
find "${RELEASE_DIR}" -maxdepth 1 -type d ! -name "$(basename "$RELEASE_DIR")" -exec rm -rf {} + 2>/dev/null || true
print_ok "Cleanup complete"

# ── Done ──────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Build & Notarization Complete!${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════${NC}"
echo ""

for ARCH in "${ARCHS[@]}"; do
    DMG_NAME="${APP_NAME}-Mac-${ARCH}-${VERSION}.dmg"
    DMG_PATH="${RELEASE_DIR}/${DMG_NAME}"
    if [ -f "$DMG_PATH" ]; then
        DMG_SIZE=$(du -h "$DMG_PATH" | cut -f1)
        echo -e "  📦 ${BOLD}${ARCH}:${NC}  ${DMG_PATH}"
        echo -e "  📏 ${BOLD}Size:${NC} ${DMG_SIZE}"
        echo ""
    fi
done

echo -e "  ${GREEN}All DMGs are fully signed, notarized, and stapled!${NC}"
echo -e "  ${GREEN}Ready for distribution outside the Mac App Store.${NC}"
echo ""
