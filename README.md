# Thanh Tam Phan — YouTube Scriptwriter Portfolio

A responsive, bilingual portfolio built as a lightweight static site. It uses official YouTube thumbnails for selected channel work and requires no build tools.

## Edit the portfolio

Most updates happen in **`portfolio-data.js`**:

- Change metrics in `stats`
- Add or remove video cards in `projects`
- Update services in `expertise`
- Add your email and LinkedIn URL in `contact`

Main bilingual interface copy is in the `translations` object inside **`app.js`**. Layout lives in **`index.html`**, and visual styling lives in **`styles.css`**.

## Preview locally

Open `index.html` directly, or run any static web server in the repository folder.

## Publish with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main**, choose **/(root)**, and save.
4. GitHub will publish the site at `https://thanhtamphann.github.io/thanhtamphan-portfolio/`.

## Metrics note

Channel and video figures are public snapshots verified on September 13, 2026 and may change. Update `portfolio-data.js` whenever you want to refresh them.
