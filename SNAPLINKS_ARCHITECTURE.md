# SnapLinks - Complete Architecture & Feature Overview

This document serves as a comprehensive codebase summary of the SnapLinks platform, intended for developer onboarding or AI handoff.

## 🛠 Tech Stack
*   **Frontend:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
*   **Backend:** FastAPI (Python), Uvicorn, SQLAlchemy (ORM).
*   **Database:** PostgreSQL (with automated schema migrations on startup).
*   **Storage:** Local file system for uploads (`/uploads`, `/compressed`) with automated 30-minute background cleanup tasks.

## 🚀 Core Platform Features

### 1. URL Shortener (`/url-shortener`)
*   Create short links (`/f/[shortCode]`) with password protection and expiration dates.
*   Advanced redirection logic capturing real-time analytics.

### 2. Link-in-Bio Builder (`/bio/[alias]`)
*   A fully-featured Linktree alternative.
*   Users can add social links, profile pictures, and apply custom visual themes (solid colors, gradients).
*   Tracks views and clicks independently.

### 3. Digital Business Card / vCard (`/digital-business-card`)
*   Shareable digital profiles (`/v/[alias]`) generating instant VCF contact files.

### 4. File Sharing (`/file-sharing`)
*   Secure file hosting and sharing capabilities.

### 5. SnapTools (Document & Image Utilities) (`/tools`)
A premium suite of client-side and server-side utilities built with a uniform 3-column UI layout (AdSidebar / Main / AdSidebar).
*   **Image Compressor:** World-class FastAPI-powered image compressor. Supports Target File Size (via binary-search color quantization and Lanczos auto-scaling), Smart Compress, EXIF stripping, and WebP/AVIF conversions.
*   **PDF Utilities (Client-side via `pdf-lib`):** Merge PDF, Split PDF, Compress PDF, Rotate PDF, Protect PDF (encryption), Unlock PDF, Watermark PDF, Page Numbers.

### 6. SnapPlay Daily Challenges (`/play`)
*   A Wordle-style 365-day rotation of addictive browser mini-games.
*   **Games include:** Speed Math, Reflex Rush, Precision Click, Memory Match, Color Rush, Find the Odd Emoji, Number Memory.
*   *Timezone Logic:* Utilizes local device timezone (`new Date().getDate()`) to guarantee midnight rollovers globally.

## 📁 Key File Structure

### Frontend (`frontend/src/`)
*   `/app/api/`: Frontend API routes.
*   `/app/tools/`: Directory containing all SnapTools utilities.
*   `/app/play/`: SnapPlay game engine and components.
*   `/app/dashboard/`: Protected user dashboard (Analytics, Link Management, Settings).
*   `/components/`: Global components (`Navbar.tsx`, `Footer.tsx`, `AdBanner.tsx`, `AdSidebar.tsx`).

### Backend (`backend/app/`)
*   `main.py`: FastAPI entry point, background thread initialization, and database creation.
*   `/api/`: Endpoint routers (`image.py`, `auth.py`, `links.py`, `analytics.py`, `bio.py`, `vcard.py`, `files.py`).
*   `/models/`: SQLAlchemy ORM definitions (`User`, `Link`, `Click`, `BioPage`, etc.).
*   `/database/`: PostgreSQL connection setup.

## ⚙️ Design & Conventions
*   **Responsive:** Mobile-first Tailwind implementation.
*   **Monetization:** UI explicitly designed with placeholders for Google AdSense (`AdBanner`, `AdSidebar`) ensuring layout stability.
*   **Clean Architecture:** Strict separation of FastAPI business logic and Next.js presentation.
