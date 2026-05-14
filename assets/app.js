const data = window.CCAH_DATA;

const app = document.querySelector("#app");
const collections = {
  chinese: {
    title: "Chinese American History",
    intro: "Local stories, timelines, and photographs connected to Chinese American life on the Central Coast.",
    pages: ["chinese-american-history", "chinese-american-stories", "chinese-american-photos"],
  },
  japanese: {
    title: "Japanese American History",
    intro: "Community stories, family histories, and records of Japanese American experiences in the region.",
    pages: ["japanese-american-history", "japanese-american-stories", "japanese-american-photos"],
  },
  filipino: {
    title: "Filipino American History",
    intro: "Migration, labor, literature, and community memory from Filipino American Central Coast history.",
    pages: ["filipino-american-history", "filipino-american-stories", "filipino-american-photos"],
  },
};

function html(strings, ...values) {
  return strings.reduce((out, str, index) => out + str + (values[index] ?? ""), "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphize(lines = []) {
  return lines
    .filter(Boolean)
    .map((line) => {
      if (/^(Works Cited|Recent Posts|See All)$/i.test(line)) {
        return `<h2>${escapeHtml(line)}</h2>`;
      }
      return `<p>${linkify(escapeHtml(line))}</p>`;
    })
    .join("");
}

function linkify(text) {
  return text.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>',
  );
}

function imageFor(item) {
  return item.image || data.fallbackImage;
}

function routeHash(path) {
  return `#/${path.replace(/^\/+/, "")}`;
}

function postCard(post) {
  return html`
    <article class="card">
      <a href="${routeHash(`post/${post.slug}`)}">
        <img class="card-image" src="${escapeHtml(imageFor(post))}" alt="">
        <div class="card-body">
          <span class="tag">${escapeHtml(post.category)}</span>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="meta">${escapeHtml(post.date || "Archive post")}</p>
          <p>${escapeHtml(post.description || post.excerpt || "")}</p>
        </div>
      </a>
    </article>
  `;
}

function pageCard(page) {
  return html`
    <article class="card">
      <a href="${routeHash(page.slug)}">
        <img class="card-image" src="${escapeHtml(imageFor(page))}" alt="">
        <div class="card-body">
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.description || page.excerpt || "")}</p>
        </div>
      </a>
    </article>
  `;
}

function renderHome() {
  const featured = data.posts.slice(0, 6);
  app.innerHTML = html`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Community archive</p>
        <h1>Central Coast Asian American History</h1>
        <p class="lede">A digital archive featuring stories, oral histories, and local photographs about Chinese, Japanese, Filipino, and Asian American communities across California's Central Coast.</p>
        <div class="actions">
          <a class="button primary" href="#/archive">Browse the archive</a>
          <a class="button" href="#/about">About the project</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${escapeHtml(data.heroImage)}" alt="">
      </div>
    </section>
    <section class="section">
      <div class="stats">
        <div class="stat"><strong>${data.posts.length}</strong><span>Posts migrated</span></div>
        <div class="stat"><strong>${data.pages.length}</strong><span>Pages indexed</span></div>
        <div class="stat"><strong>${data.galleryCount}</strong><span>Gallery images found</span></div>
        <div class="stat"><strong>2020</strong><span>Archive founded</span></div>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Collections</p>
          <h2>Start with a community</h2>
        </div>
        <p>Each collection gathers the original history pages, story indexes, posts, and photo galleries into one cleaner path.</p>
      </div>
      <div class="grid cards">
        ${Object.entries(collections)
          .map(([key, collection]) => {
            const firstPage = data.pages.find((page) => page.slug === collection.pages[0]) || data.pages[0];
            return html`
              <article class="card">
                <a href="#/collection/${key}">
                  <img class="card-image" src="${escapeHtml(imageFor(firstPage))}" alt="">
                  <div class="card-body">
                    <h3>${escapeHtml(collection.title)}</h3>
                    <p>${escapeHtml(collection.intro)}</p>
                  </div>
                </a>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Latest from the archive</p>
          <h2>Featured stories</h2>
        </div>
        <a class="button" href="#/archive">All posts</a>
      </div>
      <div class="grid posts">${featured.map(postCard).join("")}</div>
    </section>
  `;
}

function renderArchive(filter = "all") {
  const selected = filter === "all" ? data.posts : data.posts.filter((post) => post.categoryKey === filter);
  app.innerHTML = html`
    <section class="page-shell">
      <div class="page-title">
        <p class="eyebrow">Archive</p>
        <h1>Stories and posts</h1>
        <p class="lede">Search all migrated posts, or filter by the community collection most closely connected to the story.</p>
      </div>
      <div class="filters" aria-label="Archive filters">
        ${["all", "chinese", "japanese", "filipino", "community"]
          .map((key) => `<a class="chip ${key === filter ? "is-active" : ""}" href="#/archive/${key}">${key === "all" ? "All" : data.categoryLabels[key]}</a>`)
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="search-panel">
        <input id="archiveSearch" type="search" placeholder="Search by title, date, author, or text" aria-label="Search archive">
      </div>
      <div id="archiveGrid" class="grid posts">${selected.map(postCard).join("")}</div>
    </section>
  `;

  const search = document.querySelector("#archiveSearch");
  const grid = document.querySelector("#archiveGrid");
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    const results = selected.filter((post) => {
      const haystack = [post.title, post.description, post.author, post.date, post.category, post.body.join(" ")].join(" ").toLowerCase();
      return haystack.includes(query);
    });
    grid.innerHTML = results.length ? results.map(postCard).join("") : `<p class="empty">No posts matched that search.</p>`;
  });
}

function renderCollection(key) {
  const collection = collections[key] || collections.chinese;
  const pages = collection.pages.map((slug) => data.pages.find((page) => page.slug === slug)).filter(Boolean);
  const posts = data.posts.filter((post) => post.categoryKey === key);
  app.innerHTML = html`
    <section class="page-shell">
      <div class="page-title">
        <p class="eyebrow">Collection</p>
        <h1>${escapeHtml(collection.title)}</h1>
        <p class="lede">${escapeHtml(collection.intro)}</p>
      </div>
    </section>
    <section class="section">
      <div class="section-header"><h2>Original pages</h2></div>
      <div class="grid cards">${pages.map(pageCard).join("")}</div>
    </section>
    <section class="section">
      <div class="section-header"><h2>Related posts</h2></div>
      <div class="grid posts">${posts.length ? posts.map(postCard).join("") : `<p class="empty">No posts were automatically categorized here.</p>`}</div>
    </section>
  `;
}

function collectionKeyFromSlug(slug) {
  if (slug.includes("chinese")) return "chinese";
  if (slug.includes("japanese")) return "japanese";
  if (slug.includes("filipino")) return "filipino";
  return "community";
}

function normalizePageLine(line = "") {
  return line
    .replace(/^\/?\$\s*/g, "")
    .replace(/^\/\$\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function comparableTitle(value = "") {
  return normalizePageLine(value)
    .toLowerCase()
    .replace(/railraods/g, "railroads")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sanitizedPageLines(page) {
  const junk = /^(Safari Pinned Tab Icon|Segmenter Polyfill|Legacy Polyfills|Performance API Polyfills|Essential Viewer Model|Globals Definitions|BEGIN |END |Initial CSS|pageHtmlEmbeds|head performance|render-head|domStoreHtml|Polyfills check|initCustomElements|preloading pre-scripts|sentry|Add the rest|renderIndicator|versionIndicator|used platform|Business Manager|react|react-dom|lodash script|initial scripts|scriptTagsToPreload|Old Browsers|bi|warmup data|presets polyfill|detect browser zoom|Home|Central Coast Asian American History|We gratefully acknowledge)/i;
  return page.body.map(normalizePageLine).filter((line) => line && !junk.test(line));
}

function cleanPageBody(page) {
  const stopWords = [
    "Quick Facts:",
    "Chinese Stories",
    "Japanese History",
    "Filipino History",
    "Chinese American Stories",
    "Japanese American Stories",
    "Filipino American Stories",
  ];
  const lines = sanitizedPageLines(page);
  const titleIndex = lines.findIndex((line) => comparableTitle(line) === comparableTitle(page.title) || /History: Stories|Current Events/.test(line));
  const scoped = titleIndex >= 0 ? lines.slice(titleIndex + 1) : lines;
  const stopIndex = scoped.findIndex((line) => stopWords.some((word) => line.startsWith(word)) || data.posts.some((post) => comparableTitle(post.title) === comparableTitle(line)));
  return (stopIndex >= 0 ? scoped.slice(0, stopIndex) : scoped).filter((line) => !stopWords.some((word) => line.startsWith(word)));
}

function storyList(posts) {
  return posts
    .map((post) => html`
      <article class="story-row">
        <a class="story-thumb" href="${routeHash(`post/${post.slug}`)}">
          <img src="${escapeHtml(imageFor(post))}" alt="">
        </a>
        <div class="story-copy">
          <a href="${routeHash(`post/${post.slug}`)}"><h3>${escapeHtml(post.title)}</h3></a>
          <p>${escapeHtml(post.description || post.excerpt || "")}</p>
          <p class="meta">${escapeHtml([post.author, post.date].filter(Boolean).join(" · "))}</p>
        </div>
      </article>
    `)
    .join("");
}

function orderedPostsFromPage(page, fallbackPosts) {
  const normalized = new Map(fallbackPosts.map((post) => [comparableTitle(post.title), post]));
  const ordered = [];
  for (const line of sanitizedPageLines(page)) {
    const key = comparableTitle(line);
    if (normalized.has(key) && !ordered.includes(normalized.get(key))) {
      ordered.push(normalized.get(key));
    }
  }
  return ordered.length ? ordered : fallbackPosts;
}

function renderHistoryPage(page) {
  const key = collectionKeyFromSlug(page.slug);
  const quickFact = data.posts.find((post) => post.categoryKey === key && post.title.toLowerCase().includes("quick facts"));
  const stories = orderedPostsFromPage(page, data.posts.filter((post) => post !== quickFact)).filter((post) => post !== quickFact).slice(0, key === "chinese" ? 15 : 6);
  const storyPage = data.pages.find((item) => item.slug === `${key}-american-stories`);
  const photoPage = data.pages.find((item) => item.slug === `${key}-american-photos`);

  app.innerHTML = html`
    <section class="legacy-page">
      <div class="legacy-intro">
        <h1>${escapeHtml(page.title)}</h1>
        <div class="legacy-copy">${paragraphize(cleanPageBody(page).slice(0, 3))}</div>
        <div class="actions">
          ${storyPage ? `<a class="button primary" href="${routeHash(storyPage.slug)}">Stories</a>` : ""}
          ${photoPage ? `<a class="button" href="${routeHash(photoPage.slug)}">Photos</a>` : ""}
        </div>
      </div>
      ${quickFact ? html`
        <article class="feature-post">
          <a href="${routeHash(`post/${quickFact.slug}`)}">
            <img src="${escapeHtml(imageFor(quickFact))}" alt="">
            <div>
              <p class="eyebrow">Quick Facts</p>
              <h2>${escapeHtml(quickFact.title)}</h2>
              <p class="meta">${escapeHtml([quickFact.author, quickFact.date].filter(Boolean).join(" · "))}</p>
            </div>
          </a>
        </article>
      ` : ""}
      <div class="legacy-section-title">
        <h2>${escapeHtml(key === "chinese" ? "Chinese Stories" : key === "japanese" ? "Japanese History" : "Filipino History")}</h2>
      </div>
      <div class="story-list">${storyList(stories)}</div>
      ${storyPage ? `<div class="legacy-more"><a class="button" href="${routeHash(storyPage.slug)}">${escapeHtml(storyPage.title.replace(": Stories", " Stories"))}</a></div>` : ""}
    </section>
  `;
}

function renderStoryIndex(page) {
  const key = page.slug === "current" ? "community" : collectionKeyFromSlug(page.slug);
  const fallbackPosts = page.slug === "current"
    ? data.posts.filter((post) => ["little-south-east-asia-api-voices-at-a-hispanic-majority-school", "young-asian-american-voices", "face-mask-inventor-dr-wu-lien-teh", "california-honors-filipino-farm-workers-labor-movement-on-larry-itliong-day"].includes(post.slug))
    : data.posts.filter((post) => !post.title.toLowerCase().includes("quick facts"));
  const posts = orderedPostsFromPage(page, fallbackPosts);
  const bodyTitle = sanitizedPageLines(page).find((line) => /History: Stories|Current Events/.test(line));

  app.innerHTML = html`
    <section class="legacy-page">
      <div class="legacy-intro">
        <h1>${escapeHtml(bodyTitle || (page.slug === "current" ? "Current Events" : page.title))}</h1>
        ${page.slug === "current" ? `<div class="legacy-copy">${paragraphize(cleanPageBody(page).slice(0, 2))}</div>` : ""}
      </div>
      <div class="story-list">${storyList(posts)}</div>
    </section>
  `;
}

function renderPage(slug) {
  const page = data.pages.find((item) => item.slug === slug);
  if (!page) {
    renderNotFound();
    return;
  }

  if (/^(chinese|japanese|filipino)-american-history$/.test(slug)) {
    renderHistoryPage(page);
    return;
  }

  if (/^(chinese|japanese|filipino)-american-stories$/.test(slug) || slug === "current") {
    renderStoryIndex(page);
    return;
  }

  const gallery = page.gallery?.length
    ? `<section class="section"><div class="section-header"><h2>Photo gallery</h2></div><div class="gallery">${page.gallery.map((src) => `<img src="${escapeHtml(src)}" alt="">`).join("")}</div></section>`
    : "";

  app.innerHTML = html`
    <section class="page-shell">
      <div class="page-title">
        <p class="eyebrow">Page</p>
        <h1>${escapeHtml(page.title)}</h1>
        ${slug === "about" ? "" : `<p class="lede">${escapeHtml(page.description || page.excerpt || "")}</p>`}
      </div>
      <article class="article">
        ${page.image ? `<img class="article-hero" src="${escapeHtml(page.image)}" alt="">` : ""}
        <div class="article-body">
          ${paragraphize(page.body)}
          <p><a href="${escapeHtml(page.source)}" target="_blank" rel="noopener">View original page</a></p>
        </div>
      </article>
    </section>
    ${gallery}
  `;
}

function renderPost(slug) {
  const post = data.posts.find((item) => item.slug === slug);
  if (!post) {
    renderNotFound();
    return;
  }

  app.innerHTML = html`
    <section class="post-shell">
      <div class="post-title">
        <p class="eyebrow">${escapeHtml(post.category)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="meta">${escapeHtml([post.author, post.date, post.readTime].filter(Boolean).join(" · "))}</p>
      </div>
      <article class="article">
        ${post.image ? `<img class="article-hero" src="${escapeHtml(post.image)}" alt="">` : ""}
        <div class="article-body">
          ${paragraphize(post.body)}
          <p><a href="${escapeHtml(post.source)}" target="_blank" rel="noopener">View original post</a></p>
        </div>
      </article>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = `<section class="page-shell"><div class="empty">That page was not found in the migrated archive.</div></section>`;
}

function router() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [section, value] = parts;

  if (!section) renderHome();
  else if (section === "archive") renderArchive(value || "all");
  else if (section === "collection") renderCollection(value || "chinese");
  else if (section === "post") renderPost(value);
  else renderPage(section);

  window.scrollTo({ top: 0, behavior: "auto" });
}

window.addEventListener("hashchange", router);
router();
