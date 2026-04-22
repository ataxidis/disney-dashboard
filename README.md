# Disney dashboard

A small React app that lists Disney API characters, filters them, inspects details in a modal, charts film counts, and exports film data to Excel. Data comes from the public [Disney API](https://api.disneyapi.dev) (`https://api.disneyapi.dev`).

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Redux Toolkit** and **RTK Query** for state and data fetching
- **MUI** for layout and UI
- **Highcharts** for the films chart
- **SheetJS (xlsx)** for spreadsheet export

## Setup

```bash
npm install
```

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start the dev server (Vite)   |
| `npm run build`    | Typecheck and production build  |
| `npm run preview`  | Serve the production build     |
| `npm run lint`     | Run ESLint                     |
| `npm run format`   | Format with Prettier           |
| `npm run format:check` | Check formatting with Prettier |

## Requirements

- **Node.js** (built on v24.11.1)
