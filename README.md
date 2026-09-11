# Nuwanandun Kalhara — Portfolio

A responsive, interactive personal portfolio built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, and Three.js.

## Develop

Run `npm ci`, then `npm run dev`.

## Production

Run `npm run build`. The static website is exported into `out/`, ready for static hosting. To deploy to Vercel, import this project using the Next.js preset. For local production review, serve the `out/` directory with a static HTTP server.

## Features

- Interactive WebGL portrait: drag to rotate, scroll or use the controls to zoom, and use arrow keys when focused.
- Motion toggle with reduced-motion support.
- Filterable project gallery with accessible detail dialogs.
- Responsive layouts, scroll progress, project-card tilt, and clipboard contact action.

## Content

- Edit portfolio content and project details in `data/portfolio.ts`.
- Edit the page composition in `components/portfolio/portfolio.tsx`.
- Edit the Three.js portrait scene in `components/portfolio/scene.tsx`.
- Edit colors, layout, and responsive styling in `app/globals.css`.
- Edit metadata in `app/layout.tsx`.
- Replace `public/Nuwanandun-Kalhara-CV.pdf` to update the CV download.
- Replace the portrait files in `public/images/` to update the hero and About imagery.

Content is based on the supplied CV and LinkedIn URL. Project-specific live and repository URLs were not provided; no speculative project links or performance claims were added. Contact links open the relevant email or profile destination. No contact form backend is required.
