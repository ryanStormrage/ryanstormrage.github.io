# ryanstormrage.github.io

My portfolio site: plain HTML, CSS and JavaScript with no build step.

- **Featured projects** are listed in the `FEATURED` array at the top of `script.js`.
- **All repositories** are fetched live from the GitHub REST API (`/users/ryanstormrage/repos`), and you can filter them by language.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

Because the repository is named `ryanstormrage.github.io`, GitHub Pages serves it automatically at
**https://ryanstormrage.github.io** once it's pushed. You can check this under **Settings → Pages**, where the source should be the `main` branch, root folder.
