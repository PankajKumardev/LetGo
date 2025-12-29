<div align="center">

# 🔥 LetGo

**Release what no longer serves you.**

A mindful digital ritual for emotional release — write it down, burn it away, breathe through it, and embrace a new dawn.

[![Made with React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)

</div>

---

## ✨ What is LetGo?

LetGo is an immersive web experience that guides you through a symbolic ritual of letting go. Whether it's past regrets, negative thoughts, or emotional baggage — write it on virtual paper, watch it burn in beautiful flames, breathe through the transition, and witness a calming sunrise reveal.

### 🎯 The Ritual Flow

1. **📝 Write** — Express what you want to release on the ritual paper
2. **🔥 Burn** — Drag the paper to the flames and watch it ignite with realistic fire particles
3. **🌬️ Breathe** — Follow the guided breathing exercise to center yourself
4. **🌅 Reveal** — Experience a beautiful sunrise as a symbol of new beginnings

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/letgo.git
cd letgo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Styling |
| **Framer Motion** | Animations |
| **Canvas API** | Fire Particle System |

---

## 📁 Project Structure

```
letgo/
├── components/
│   ├── BreathingGuide.tsx    # Guided breathing animation
│   ├── FireSystem.tsx        # Canvas-based fire particles
│   ├── FogBackground.tsx     # Atmospheric fog effect
│   ├── RitualPaper.tsx       # Draggable paper component
│   └── SunriseReveal.tsx     # Final sunrise animation
├── App.tsx                    # Main app with stage management
├── index.tsx                  # Entry point
├── index.css                  # Tailwind & custom styles
├── types.ts                   # TypeScript types
└── vite.config.ts            # Vite configuration
```

---

## 🎨 Customization

### Theme Colors

Edit the theme in `index.css`:

```css
@theme {
  --color-void: #030303;    /* Background */
  --color-flame: #FF5500;   /* Fire accent */
  --color-dawn: #3b0764;    /* Purple accent */
  --color-text: #E2E8F0;    /* Text color */
}
```

### Fonts

The app uses:
- **Instrument Serif** — Elegant headers
- **Caveat** — Handwritten paper text
- **Inter Tight** — UI elements

---

## 💡 Suggestions for Enhancement

- [ ] **🔊 Sound Effects** — Add ambient fire crackling, paper burning, and calming music
- [ ] **💾 History** — Save past releases (anonymously) for reflection
- [ ] **🌙 Dark/Light Themes** — Alternative color schemes
- [ ] **📱 PWA Support** — Install as mobile app
- [ ] **🔗 Share** — Generate shareable affirmation cards after the ritual
- [ ] **🌍 Localization** — Multi-language support

---

## 📄 License

MIT License — feel free to use, modify, and share.

---

<div align="center">

Made with 🔥 for those ready to **let go**

</div>
