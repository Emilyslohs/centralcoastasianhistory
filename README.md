# Central Coast Asian American History

Static migration of the original Wix site at <https://www.centralcoastasianhistory.org>.

## What is included

- 18 top-level pages discovered from the Wix sitemap.
- 62 blog posts discovered from the Wix blog-post sitemap.
- Searchable archive view with collection filters.
- Chinese American, Japanese American, and Filipino American collection views.
- Photo-gallery pages populated from Wix media URLs.

## Run Locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

1. Create a new public repository.
2. Push these files to the repository's default branch.
3. In the repository settings, go to `Pages`.
4. Select `Deploy from a branch`, choose the default branch, and use `/ (root)`.
5. Save, then wait for the site to publish.

The site has no build step, so static hosting can serve it directly.
