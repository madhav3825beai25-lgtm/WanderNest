# React + Vite

## WanderNest travel assistant

Open **Ask WanderNest** on any page to ask about destinations, packages, and itineraries.
For local development, set `GEMINI_API_KEY` in `.env` at the project root or in
`backend/.env`, start the Express backend from `backend` with `node server.js`,
then run `npm run dev` from the root. The widget uses `VITE_API_URL` when set.

For Vercel, set `GEMINI_API_KEY` in the project environment and redeploy. The
production widget calls the same-origin `/api/chat` function by default. Set
`VITE_CHAT_API_URL` to use a separately hosted Express backend for chat.
Set `GEMINI_MODEL` on the server to override the default `gemini-3.8-flash`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
