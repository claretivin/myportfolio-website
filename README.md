# Claret Ivin R — Portfolio

A modern, responsive personal portfolio site built with plain HTML, CSS, and JavaScript. No build step, no dependencies.

## Structure

```
portfolio-website/
├── index.html          # All page markup (hero, about, experience, projects, contact)
├── css/
│   └── style.css        # All styling
├── js/
│   └── script.js         # Nav, scroll animations, project modals, contact form
├── assets/              # (create this) images such as a profile photo and project screenshots
├── .vscode/              # Editor settings + recommended extensions
└── .gitignore
```

## Open in VS Code

1. Open this folder (`portfolio-website/`) in VS Code: `File > Open Folder...`
2. Install the recommended **Live Server** extension when prompted (or from the Extensions panel).
3. Right-click `index.html` → **Open with Live Server**, or click "Go Live" in the status bar.
4. The site opens at `http://127.0.0.1:5500` and auto-reloads on save.

No Live Server? Any static file server works, e.g. from a terminal in this folder:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Before you publish

- **Contact form**: open `index.html`, find `YOUR_FORM_ID` in the `<form action="https://formspree.io/f/YOUR_FORM_ID">` line, and replace it with your real [Formspree](https://formspree.io) form ID so submissions actually reach your inbox. Until then, submitting the form opens the visitor's email app with the message pre-filled.
- **Share preview image**: once you know the live URL, add `<meta property="og:url">` and `<meta property="og:image">` (a 1200×630 image) in `<head>` so LinkedIn shows a picture.
- **Project images**: drop screenshots into `assets/` and swap them in for the icon placeholders in the `.project-thumb` divs in `index.html` if you want visuals instead of icons.

## Deploy

Any static host works — drag-and-drop the folder into [Netlify](https://app.netlify.com/drop), or push to GitHub and enable **GitHub Pages** in the repo settings (serve from the root of the `main` branch).
