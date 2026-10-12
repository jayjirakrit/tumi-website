# Quickstart: Verify the Dependabot fix

Run from the repo root after the implementation.

1. Clean install from lock: `npm ci` (must succeed, no peer-dependency errors).
2. Audit: `npm audit` -> expected 0 vulnerabilities (braces removed together with gh-pages, see research D6).
3. Versions: `npm ls react-router vite postcss nanoid picomatch @babel/core browserslist fast-uri serialize-javascript turbo-stream` -> all >= fixed versions in research D2 (serialize-javascript, turbo-stream, fast-uri expected absent after webpack removal).
   Also `npm ls webpack` -> `(empty)`: confirms webpack/webpack-cli are gone and nothing depends on them.
4. Gate: `npm run build` -> succeeds, no new warnings (also proves nothing imported webpack).
5. Browser walkthrough: `npm run preview`, open `http://localhost:4173/tumi-website/`.
   - Desktop (>=1200px) and phone (~390px): visit every Navbar route and click through; hard-reload a sub-route.
   - Check: loading drawing animates, images load, modals/sliders work, no console errors, assets resolve under `/tumi-website`.
6. Dashboard: after merge, GitHub Security > Dependabot shows 0 open alerts (allow a few minutes to re-scan).
