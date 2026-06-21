# clatonhendricks.github.io

Personal profile & portfolio site for **Claton Hendricks** — Product Manager @ Microsoft.

🔗 Live: https://clatonhendricks.github.io/

## About

A clean, responsive, single-page site (plain HTML/CSS/JS — no build step) featuring:

- **Hero** — intro and quick links
- **About** — background in performance tooling & developer experience
- **Projects** — selected GitHub projects
- **Woodworking** — *Dust & Smoke* craft (Instagram)
- **Skills** — product & engineering tooling
- **Experience** — career timeline
- **Contact** — social links

Includes a dark/light theme toggle (persisted, respects system preference).

## Structure

```
index.html            # single-page site
assets/
  css/styles.css      # theming + responsive layout
  js/main.js          # theme toggle, mobile nav
  img/                # profile image, favicon
.nojekyll             # serve files as-is (no Jekyll processing)
```

## Local preview

Open `index.html` directly, or serve the folder:

```powershell
python -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

- **Projects:** edit the `<article class="card">` blocks in `index.html`.
- **Skills / Experience:** edit the corresponding sections in `index.html`.
- **Colors / theme:** edit the CSS variables at the top of `assets/css/styles.css`.
