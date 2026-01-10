# Drift

> **Cinema-grade screen recording. Zero cost. Privacy-first.**

Professional screen recording studio that runs entirely in your browser. Powered by native browser APIs and client-side WebAssembly.

![Drift Landing Page](![Uploading image.png…]()
)

## ✨ Features (Coming Soon)

- **Unified Capture** - Record screen, window, or browser tab
- **Webcam Overlay** - Picture-in-picture with customizable shapes
- **The Drift Effect** - Cinematic auto-zoom with smooth cursor tracking
- **Privacy First** - 100% local processing, no uploads
- **Timeline Editor** - Adjust zoom keyframes after recording
- **Export Anywhere** - MP4, WebM, or high-quality GIF

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/drift.git
cd drift

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Vanilla CSS + CSS Variables |
| Animations | Framer Motion |
| Fonts | Geist Sans & Geist Mono |

## 📁 Project Structure

```
drift/
├── src/
│   └── app/
│       ├── components/      # UI components
│       │   ├── DriftBackground.jsx
│       │   ├── Hero.jsx
│       │   ├── Features.jsx
│       │   ├── HowItWorks.jsx
│       │   ├── WaitlistForm.jsx
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       ├── globals.css      # Design system
│       ├── layout.js        # Root layout
│       └── page.js          # Landing page
├── public/                  # Static assets
└── package.json
```

## 🎨 Design System

The design uses a premium dark theme with purple/cyan gradient accents:

```css
--bg-primary: #030303;
--accent-purple: #a855f7;
--accent-cyan: #06b6d4;
--accent-pink: #ec4899;
```

## 📝 Roadmap

- [x] Phase 1: Waitlist Landing Page
- [ ] Phase 2: Core Recording Engine
- [ ] Phase 3: Cinematic Intelligence (Drift Effect)
- [ ] Phase 4: Post-Recording Studio
- [ ] Phase 5: Public Launch

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Building in public.** Follow the journey on [Twitter/X](https://twitter.com).
