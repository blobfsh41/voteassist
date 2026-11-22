# VoteAssist

VoteAssist is an independent civic information prototype designed to help Victorian voters explore election candidates, compare policy positions, and understand how candidates align with their own priorities.

The goal is to make election information easier to navigate without telling users who to vote for.

## Current Status

VoteAssist is an actively developed frontend prototype focused on the **2026 Victorian State Election**.

The candidate and electorate dataset is derived from the Victorian Electoral Commission (VEC) nominations report dated 9 November 2026. Candidate policy assessments are a separate system and are not yet populated with published assessments.

The application currently operates without a backend. User preferences are stored locally, and election data is bundled with the application.

## Features

- **Candidate directory** — Browse candidates and filter by electorate.
- **Candidate comparison** — Compare candidates' policy positions and supporting evidence.
- **Policy preferences** — Set your positions on policy issues and assign importance to each issue.
- **Candidate matching** — Compare your preferences against assessed candidate positions.
- **Alignment range** — Account for uncertainty in candidate policy assessments.
- **Weighted coverage** — Measure how much of your weighted policy preferences have been assessed.
- **Conservative matching** — Consider potential alignment when candidate positions are unknown.
- **Evidence-based assessments** — Candidate policy assessments are designed to include sourced evidence, rationale, and review metadata.

## Candidate Policy Assessment Standards

Candidate policy positions are assessed using a structured scale:

| Score | Meaning |
|---|---|
| -2 | Strongly opposes |
| -1 | Somewhat opposes |
| 0 | Explicitly neutral, mixed, or genuinely balanced |
| +1 | Somewhat supports |
| +2 | Strongly supports |
| null | Insufficient evidence to assess |

Unknown positions are not treated as neutral.

Assessments are expected to include supporting evidence and a written rationale. Published assessments require approval and at least two evidence sources.

Evidence is prioritised from official policy documents, candidate statements, parliamentary voting records, and reliable secondary reporting.

## Matching Methodology

VoteAssist compares a user's policy preferences with assessed candidate positions.

- **Policy alignment:** Measures the distance between user preferences and candidate positions.
- **Importance weighting:** Gives greater influence to policies the user considers more important.
- **Weighted coverage:** Measures how much of the user's weighted policy preferences have been assessed.
- **Missing assessments:** Unknown positions are not silently treated as agreement or disagreement.
- **Alignment range:** Represents uncertainty caused by unassessed policy positions.
- **Conservative matching:** Uses a more cautious approach to ranking candidates when positions are unknown.

Match scores are an alignment index, not a probability, endorsement, or percentage of policies agreed upon.

Read the [matching methodology](docs/matching-methodology.md) for further detail.

## Tech Stack

- React
- TypeScript
- Vite
- Bun
- Vitest
- CSS

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

Vite will provide a local development URL, usually `http://localhost:5173`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server |
| `bun run build` | Type-check and build for production |
| `bun run lint` | Run linting |
| `bun run preview` | Preview the production build |
| `bunx vitest run` | Run the test suite |
| `bunx tsc -b` | Run TypeScript project checks |

## Project Structure

```text
src/
├── components/       # Reusable UI components
├── data/            # Election, candidate, electorate and policy data
│   └── generated/   # Imported VEC election data
├── lib/             # Matching, storage and application logic
├── pages/            # Application pages
├── assets/           # Images and static assets
├── App.tsx           # Application state and navigation
└── main.tsx          # Application entry point

docs/
├── matching-methodology.md
└── candidate-assessment-guidelines.md
```

## Data Limitations

- Candidate data is a static snapshot and may change after the source report is published.
- Candidate policy assessments are not yet populated with published assessments.
- The application is not connected to live VEC databases or live news services.
- The matching system's usefulness depends on the quality, completeness, and accuracy of policy assessments.
- Local preference storage is not synced between devices.

## Disclaimer

VoteAssist is an independent educational prototype and is not affiliated with or endorsed by the Victorian Electoral Commission or any political party.

It does not endorse candidates, predict election outcomes, or provide voting recommendations. Policy assessments may be incomplete and should be verified against original sources. Users should consult authoritative sources before making voting decisions.
