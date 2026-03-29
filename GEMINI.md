# Sabari Vijayan's Portfolio - Developer Manifest

This document serves as a foundational reference for the architecture, design, and accessibility standards of this portfolio project.

## Project Overview
- **Owner:** Sabari Vijayan
- **Purpose:** A professional, minimal, and highly accessible developer portfolio.
- **Current Education:** B.Tech in Computer Science, RIT Kottayam (2023–2027).
- **Location:** Pathanamthitta, Kerala, India.

## Tech Stack
- **Framework:** React 19 (Vite + TypeScript)
- **Routing:** `react-router-dom` using `HashRouter` (optimized for GitHub Pages).
- **Icons:** `lucide-react`
- **Deployment:** GitHub Pages via `gh-pages` package.

## Core Design Principles
1. **Minimalist & Professional:** Clean typography, generous whitespace, and a high-signal-to-noise ratio.
2. **"Architectural" Mindset:** Focus on clean code, modular components, and system-wide scalability.
3. **Responsive & Fluid:** Mobile-first layout with smooth transitions (e.g., animated hamburger menu).
4. **Theme Persistence:** Dark/Light mode toggle synchronized with `localStorage` and system preferences.
   - **Colors (Original Blue Theme):**
     - Light Mode: White background, Blue (`#0056b3`) accent.
     - Dark Mode: Dark gray background, Light Blue (`#99ccff`) accent.

## Accessibility (WCAG 2.0 AAA Standards)
- **High Contrast:** All text/background combinations exceed AAA contrast ratios.
- **Keyboard Navigation:** 
  - "Skip to main content" link included at the DOM root.
  - Consistent focus rings with `outline-offset` for high visibility.
- **Semantic HTML:** Strict use of landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`).
- **ARIA:** Proper use of `aria-label`, `aria-expanded`, and `aria-current` for screen readers.

## Directory Structure
- `src/components/`: Shared layout and navigation components.
- `src/pages/`: Modular page components (About, Experience, Portfolio, Blog, Contact).
- `src/index.css`: Global styles, CSS variables, and accessibility overrides.
- `public/`: Static assets (Profile image, `robots.txt`, icons).

## Key Features
- **Portfolio Filtering:** Dynamic category-based filtering (All, Projects, Designs, Papers) on a single "Hub" page.
- **Unified Experience:** Merged volunteering and education into a single chronological timeline.
- **SEO Ready:** Properly configured `robots.txt` and meta tags.
