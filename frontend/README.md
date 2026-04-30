# Tamank Frontend (ثمنك)

React + Vite + TailwindCSS frontend for the Moroccan marketplace.

## Setup

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Starts dev server at `http://localhost:5173`.

## Build

```bash
npm run build
```

Creates production build in `dist/`.

## Configuration

Create `.env` from `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Project Structure

```
src/
  ├── pages/          # Page components
  ├── components/     # Reusable components
  ├── api/            # API service (Axios)
  ├── utils/          # Utilities (auth, token management)
  ├── App.jsx         # Root with routing
  └── main.jsx        # Entry point
```

## Features

- Auth (register, login, email verification)
- Listings (browse, create, details, price feedback)
- Chat (inbox, messages, block user)
- Deals (initiate, agree, confirm arrival, complete)
- Profiles (view, ratings, badges, trust score)
- Meetups (safe location suggestions, arrival confirmation)

## API Integration

All API calls use centralized `src/api/apiService.js` with automatic JWT auth header injection.

Backend base: `VITE_API_BASE_URL` (default: `http://localhost:4000`)
