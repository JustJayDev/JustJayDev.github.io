# JustJayDev — Personal Digital Identity Website

A production-quality, mobile-first personal digital identity website for Jay Kumar.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Firebase** (Auth, Firestore, Storage) for backend/data
- **React Router v6** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Features

- 🎨 Premium dark/light theme with CSS variables design system
- 📱 Mobile-first responsive design with bottom navigation
- 🏠 Beautiful landing page with elegant entrance animations
- 🎮 Gaming profiles with UID copy functionality (Free Fire MAX, BGMI, etc.)
- 🔒 Password-protected esports section with rate-limiting
- 🔗 Social links (Discord, YouTube, Instagram, X, Reddit, GitHub)
- 💬 Contact section
- 💝 Support/request payment workflow
- 🗝️ Hidden archive section (unlock by triple-tapping the logo)
- 📊 Full admin dashboard for content management
- 🔐 Firebase authentication for admin
- 📈 Privacy-conscious analytics
- 🌐 SEO meta tags and Open Graph
- ♿ Accessibility (reduced-motion support, semantic HTML)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Enable **Storage**
5. Copy your Firebase config and update `src/firebase/config.ts`

### 3. Environment Variables (Optional)

Copy `.env.example` to `.env` and configure if needed:

```bash
cp .env.example .env
```

### 4. Run Locally

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Deployment to GitHub Pages

The site deploys to: **https://JustJayDev.github.io/just-jay-site/**

### Option A: Using the deploy script

```bash
npm run deploy
```

### Option B: Manual build + push

1. `npm run build` — builds to `dist/`
2. Push `dist/` contents to the `gh-pages` branch
3. Or use GitHub Actions

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx   # Main app shell with nav
│   └── ProtectedRoute.tsx
├── context/         # React contexts
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx
├── firebase/        # Firebase services
│   ├── config.ts    # Firebase initialization
│   ├── auth.ts      # Authentication helpers
│   └── dataService.ts # Firestore CRUD operations
├── hooks/           # Custom React hooks
│   └── useData.ts   # Data fetching hooks (demo/Firebase)
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Gaming.tsx
│   ├── Esports.tsx
│   ├── Social.tsx
│   ├── Contact.tsx
│   ├── Support.tsx
│   ├── Archive.tsx
│   ├── Admin.tsx
│   └── AdminLogin.tsx
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css       # Global styles + CSS variables
```

## Admin Access

- URL: `/admin-login`
- Requires Firebase Authentication
- Register first user via the login page (it auto-creates the admin document)
- All subsequent logins require the same credentials

## QR Code Setup

The website URL is stable: `https://JustJayDev.github.io/just-jay-site/`

Generate a QR code pointing to this URL using any QR service. Replace the image on your Fire-Boltt watch as needed.

## Data Model

All data entities are defined in `src/types/index.ts`:
- `Profile` — Personal info, bio, roles
- `Game` — Gaming profiles with stats
- `SocialLink` — Social media connections
- `EsportsRecord` — Tournament/competition records
- `SupportRequest` — Support/payment requests
- `ArchiveItem` — Hidden archive content
- `SiteSettings` — Global site configuration

## Security Notes

- Admin routes are protected server-side via Firebase Auth
- Esports password uses SHA-256 hashing
- Rate-limiting on esports unlock attempts
- File uploads validated (type + size)
- No secrets in frontend source code
- Proper input sanitization throughout

## Demo Mode

When Firebase is not configured, the site runs in demo mode with placeholder data. This allows previewing the UI without backend setup.
