
# VoteAssist

VoteAssist is a mobile-first civic information prototype designed to help users explore candidates, compare political platforms, and follow election-related information.

## Current Status

VoteAssist is an early frontend prototype. Candidate information and stories currently use demonstration data. The application is not connected to official election databases or live news services.

## Features

- Candidate browsing
- Candidate comparison
- Election-related story feed
- Mobile-oriented navigation

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Oxlint
- Bun

## Getting Started

### Prerequisites

Install [Bun](https://bun.sh/).

### Installation

```bash
git clone https://github.com/blobfsh41/voteassist.git
cd voteassist
bun install
```

### Development

```bash
bun run dev
```

Vite will provide a local development URL, usually http://localhost:5173.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run lint` | Run Oxlint |
| `bun run preview` | Preview production build |

## Project Structure

```text
src/
├── components/   # Reusable UI components
├── data/         # Demonstration data
├── pages/        # Application pages
├── assets/       # Images and static assets
├── App.tsx       # Application state and navigation
├── App.css       # Application styles
└── index.css     # Global styles
```

## Disclaimer

VoteAssist is an educational prototype and is not an official election service. Verify candidate information and policies against authoritative sources. The application does not endorse candidates or provide voting recommendations.
