# Madini Mishra — Portfolio

Personal portfolio website.

A single-page portfolio site: HTML/CSS/vanilla JS, no build step or dependencies.

## Project structure

```
index.html              main page
style.css                all styles
script.js                all interactivity (nav, modals, animations, AI widget)
assets/photo.jpg         profile photo
assets/resume.pdf        resume PDF
assets/certificates/     certificate images shown in the "View Certificate" modals
```

## Running it locally

Opening `index.html` directly by double-clicking works for browsing, but the
"View Resume" and "View Certificate" modals load files with JavaScript
`fetch()`, which most browsers block on the `file://` protocol. To get full
functionality, serve the folder over local HTTP instead:

**VS Code (recommended):** install the **Live Server** extension, then
right-click `index.html` → "Open with Live Server".

**Or via a terminal**, from inside this folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000` in your browser.

## Editing content

- Text content, sections, and links live directly in `index.html`.
- Colors and layout are in `style.css` (CSS custom properties at the top set
  the color palette).
- Interactive behavior (scroll-spy nav, modals, the resume/certificate
  viewers, the "Ask Madini AI" widget) is in `script.js`.
- To swap the photo, resume, or a certificate, just replace the matching file
  under `assets/` with the same filename.
