# Mémoire Photobooth

Mémoire is a web-based photobooth application designed for aesthetic, theme-driven photo creation. It allows users to capture or upload photos, place them into predefined layouts, apply stickers, switch themes, and export high‑resolution photostrips. The project focuses on clean UI, consistent geometry, and a reliable canvas export pipeline.

---

## Features

### Theme System
- Multiple themes with unique backgrounds and sticker packs
- Main and alternate background variants
- Moodboard-style preview tiles
- Fully configurable through a central theme registry

### Layout Templates
- Universal frame system using 1080×1920 canvases
- Multiple layout types including:
  - Single photo
  - Vertical 2-photo
  - 2×2 staggered
  - 3-photo strip
  - 4-photo grid
- Each layout defined by:
  - Canvas dimensions
  - Frame image
  - Slot definitions (x, y, width, height)

### Sticker Engine
- Drag, rotate, and scale interactions
- Pixel-accurate placement
- Non-destructive editing
- Export-safe transformations

### Canvas Export Pipeline
- High-resolution export (2× scale)
- Object-fit: cover photo placement
- Slot clipping using canvas masks
- Stickers rendered above photos
- Frame rendered last for consistent layering

### Frontend Architecture
- React + TypeScript
- Vite development environment
- TailwindCSS for styling
- Modular component structure

---

## Getting Started

### Clone the repository
```bash
git clone https://github.com/icedgreentee/Memoire.git
cd Memoire
