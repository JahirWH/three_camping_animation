# three_camping_animation

A lightweight Three.js project that renders a small animated camping scene (tent, campfire, environment lighting, simple particle/smoke effects and camera controls). Use this README to run, develop and extend the scene.

## Features
- WebGL 3D scene built with Three.js
- Animated campfire and simple particle/smoke system
- Directional and ambient lighting with a night-time atmosphere
- Orbit camera controls and simple keyboard interaction
- Easy-to-add assets (textures, models, sounds)

## Quick start

Prerequisites
- Node.js (14+) and npm/yarn if you plan to use a local dev server or bundler
- Modern browser (Chrome, Firefox)

Install & run (recommended)
1. Clone the repo:
    git clone <repo-url>
2. Install dependencies (if project uses a bundler):
    npm install
3. Start dev server:
    npm start
4. Open http://localhost:3000 (or the port printed by the server)

If the project is a plain static site, you can open index.html in a browser or serve it:
npx http-server -c-1 . -p 8080

## Usage
- Orbit drag to rotate the camera
- Scroll to zoom
- Press keys (if implemented) for toggling effects (e.g., "F" for fire, "L" for lights)

Adjust scene parameters in src/config.js (or the top of main script):
- lighting intensity, fog density, particle count, animation speeds

## Project structure (suggested)
- index.html
- src/
  - main.js (scene bootstrap)
  - scene.js (objects and animation loop)
  - controls.js (camera/input)
  - particles.js (fire/smoke)
  - assets/ (textures, models, audio)
- package.json
- README.md

## Development notes
- Keep assets small and compressed for fast load
- Use GLTF for models and KTX2 or basis for compressed textures where possible
- Throttle particle counts for mobile
- Prefer requestAnimationFrame loop tied to delta time for consistent animation

## Building & Deploying
- Build with your bundler (npm run build) or copy static files to a web host
- Deploy to GitHub Pages, Netlify, or any static-hosting service

## Contributing
- Open an issue for bugs or feature requests
- Send pull requests against the main branch
- Keep changes small and focused; include brief tests or demos for new features

## License
MIT — see LICENSE file

## Credits
- Built with Three.js (https://threejs.org)
- Any third-party assets should be credited inside assets/credits.md

If you want, tell me which bundler or tooling you use (Vite / webpack / plain static) and I will add exact scripts and package.json snippets.