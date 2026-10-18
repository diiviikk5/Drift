#!/usr/bin/env bash
# Build the small ffmpeg Drift bundles on macOS (as drift-ffmpeg).
#
# Only what Drift uses: screen capture through AVFoundation, H.264 through
# VideoToolbox (present on every Mac), screenshots as raw RGBA, and the
# WebM -> MP4 export fallback. No GPL parts, so it stays LGPL.
#
#   scripts/build-ffmpeg-macos.sh <arm64|x86_64> <output file>
set -euo pipefail

ARCH="$1"
OUT="$2"
VERSION="${FFMPEG_VERSION:-8.0}"
WORK="${RUNNER_TEMP:-/tmp}/drift-ffmpeg-src"
MIN_MACOS=11.0

mkdir -p "$WORK"
if [ ! -d "$WORK/ffmpeg-$VERSION" ]; then
    curl -fsSL "https://ffmpeg.org/releases/ffmpeg-$VERSION.tar.xz" | tar -xJ -C "$WORK"
fi

BUILD="$WORK/build-$ARCH"
rm -rf "$BUILD"
cp -R "$WORK/ffmpeg-$VERSION" "$BUILD"
cd "$BUILD"

CROSS=()
if [ "$ARCH" != "$(uname -m)" ]; then
    CROSS=(--enable-cross-compile --target-os=darwin)
fi

./configure \
    --arch="$ARCH" ${CROSS[@]+"${CROSS[@]}"} \
    --cc="clang -arch $ARCH" \
    --extra-cflags="-mmacosx-version-min=$MIN_MACOS" \
    --extra-ldflags="-arch $ARCH -mmacosx-version-min=$MIN_MACOS" \
    --disable-everything --disable-autodetect --disable-doc --disable-debug \
    --disable-network --disable-ffplay --disable-ffprobe \
    --enable-avfoundation --enable-videotoolbox --enable-audiotoolbox \
    --enable-avdevice --enable-avfilter --enable-swscale --enable-swresample \
    --enable-indev=avfoundation \
    --enable-encoder=h264_videotoolbox,aac,rawvideo \
    --enable-decoder=rawvideo,h264,vp8,vp9,opus,vorbis,aac,pcm_s16le,pcm_f32le \
    --enable-parser=h264,vp8,vp9,opus,vorbis,aac \
    --enable-demuxer=matroska,mov,wav,rawvideo \
    --enable-muxer=mp4,mov,rawvideo \
    --enable-protocol=file,pipe \
    --enable-filter=scale,format,null,anull,fps,aresample,aformat,setpts,asetpts,trim,atrim,copy,acopy

make -j"$(sysctl -n hw.ncpu)" ffmpeg
mkdir -p "$(dirname "$OUT")"
cp ffmpeg "$OUT"
strip "$OUT"
ls -la "$OUT"
