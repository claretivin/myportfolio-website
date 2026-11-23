# Claret Ivin R — Portfolio

A personal portfolio built with plain HTML, CSS and JavaScript. No build step, no dependencies. All content comes from the resume in `assets/ClaretIvinR-Resume.pdf`.

Design: "The name as a monument" — the name set huge on the first screen, the Ink and paper palette (paper `#F2F2EF`, ink `#141414`, claret `#7A1631`) with a dark mode, and one typeface, General Sans.

## Structure

```
portfolio-website/
├── index.html                  # Hero, About, Skills, Experience, Projects, Education, Contact, footer
├── css/style.css               # All styling; colours and type sizes are tokens at the top
├── js/script.js                # Theme toggle, phone menu, live local time, entrances, contact form
├── assets/
│   ├── ClaretIvinR-Resume.pdf  # The "Download resume" file
│   ├── logo-ci.png             # CI monogram in the header
│   └── favicon-ci.png          # Browser tab icon
└── .vscode/                    # Editor settings + recommended extensions
```

## Run it locally

Open the folder in VS Code and use the **Live Server** extension ("Go Live"), or from a terminal in this folder:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

### With Docker

```bash
docker compose up -d
```

Then open `http://localhost:8080`. Stop it with `docker compose down`. The container serves only `index.html`, `css/`, `js/` and `assets/`, read-only; edits show up on refresh.

## Before you publish

- **Contact form**: in `index.html`, replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"` with your [Formspree](https://formspree.io) form ID. Until then the form opens the visitor's email app with the message filled in.
- **Resume**: when your resume changes, replace `assets/ClaretIvinR-Resume.pdf` (keep the file name) and update the matching text in `index.html`.
- **Logo**: `logo-ci.png` is your CI monogram with a transparent background; dark mode shows it as a light line.
- **GitHub, certifications, project links**: none are in the current resume, so the page leaves them out.

## Deploy

**GitHub Pages**
1. Push this folder to a GitHub repository.
2. In the repository, open Settings → Pages.
3. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, and save.
4. The site appears at `https://<your-username>.github.io/<repository>/` within a minute or two.

**Netlify**: drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

**Vercel**: import the repository at [vercel.com/new](https://vercel.com/new), choose the "Other" framework preset, leave the build command empty and the output directory as the root.
