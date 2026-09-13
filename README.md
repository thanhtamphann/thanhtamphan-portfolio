# Thanh Tam Phan — YouTube Scriptwriter Portfolio

A responsive, bilingual portfolio built as a lightweight static site. It uses official YouTube thumbnails for selected video work and requires no build tools.

## Edit without code (Pages CMS)

1. Open the site's [admin shortcut](https://thanhtamphann.github.io/thanhtamphan-portfolio/admin/) and sign in to Pages CMS with GitHub.
2. Give Pages CMS access to this repository and select `thanhtamphann/thanhtamphan-portfolio`.
3. Open **Video, số liệu & liên hệ** to edit projects, thumbnails, performance metrics, your portrait, skills, process, tags, email, and social links.
4. Open **Toàn bộ chữ trên trang** to edit all English and Vietnamese page copy.
5. Save. Pages CMS commits the update to `main`, and GitHub Pages republishes the site automatically.

For a custom project image, upload it in the **Ảnh tùy chỉnh** field. Leave that field empty to keep using the official YouTube thumbnail automatically.

The editor is configured by **`.pages.yml`**. Editable content is stored in **`content/portfolio.json`** and **`content/copy.json`**. Layout lives in **`index.html`**, behavior in **`app.js`**, and styling in **`styles.css`**.

## Preview locally

Run any static web server in the repository folder. The site now loads editable JSON content with `fetch`, so opening `index.html` directly through `file://` is not supported.

## Publish with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main**, choose **/(root)**, and save.
4. GitHub will publish the site at `https://thanhtamphann.github.io/thanhtamphan-portfolio/`.

## Metrics note

Channel and video figures are public snapshots verified on September 13, 2026 and may change. Update them through Pages CMS whenever you want to refresh them.
