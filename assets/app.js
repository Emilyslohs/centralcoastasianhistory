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

const inlineArticleImages = {
  "1. Kalani Gaviola": {
    src: "assets/images/kalani-gaviola.png",
    alt: "Kalani Gaviola holding a handwritten card",
  },
  "2. Mathew Thaisuriya": {
    src: "assets/images/mathew-thaisuriya.png",
    alt: "Mathew Thaisuriya smiling and giving thumbs up",
  },
  "3. Brandon Nguyen": {
    src: "assets/images/brandon-nguyen.png",
    alt: "Brandon Nguyen smiling outdoors",
  },
  "4. Drais Thai": {
    src: "assets/images/drais-thai.png",
    alt: "Drais Thai standing against a wall",
  },
  "5. Devon Kinder": {
    src: "assets/images/devon-kinder.png",
    alt: "Devon Kinder smiling outdoors",
  },
  "6. Raphaelle Fuentes": {
    src: "assets/images/raphaelle-fuentes.png",
    alt: "Raphaelle Fuentes smiling in a classroom",
  },
  "7. Quinn Kobayashi": {
    src: "assets/images/quinn-kobayashi.png",
    alt: "Quinn Kobayashi smiling against a wall",
  },
  "8. Kaela Tran": {
    src: "assets/images/kaela-tran.png",
    alt: "Kaela Tran smiling outdoors",
  },
  "9. Alivia Vogtman": {
    src: "assets/images/alivia-vogtman.png",
    alt: "Alivia Vogtman smiling against a wall",
  },
  "On March 10, 2021, Google's logo tribute featured Dr. Wu Lien-teh, a Chinese man who saved so many lives during the coronavirus pandemic, on his 142nd birthday. Dr. Wu Lien-teh is credited for creating the surgical face mask.": {
    src: "assets/images/wu-lien-teh.jpg",
    alt: "Portrait of Dr. Wu Lien-teh",
    className: "is-large",
  },
  "The Filipinos who first landed in Morrow Bay were described as “Luzones Indios” in the ship’s log, and they were sailors aboard a Spanish galleon that traveled between Mexico and Manila in the Philippines. The Central Coast Chapter of the Filipino American National Historical Society (FANHS) created a plaque in remembrance of the first recorded landing of Filipinos on American shores in 1995. Find out more about Routes and Roots exhibit done by Cal Poly students.": {
    src: "assets/images/routes-and-roots-screenshot.png",
    alt: "Routes and Roots exhibit introduction page",
    className: "is-wide",
  },
  "During World War II, as many as 250,000 Filipinos served in the U.S. Army, even though most of them could not become naturalized citizens. Nevertheless, they served for the United States, showing their patriotism to America.": {
    src: "assets/images/robert-offley.jpg",
    alt: "Filipino soldiers and U.S. Army officers during World War II",
    className: "is-wide",
    caption: "The First Filipino Regiment (U.S. Army Photograph)",
  },
  "Gila River Detention Camp (National Archives)": {
    src: "assets/images/gila-river-detention-camp.jpg",
    alt: "Gila River detention camp in Arizona",
    className: "is-wide",
    caption: "Gila River Detention Camp (National Archives)",
    hideText: true,
  },
  "Dohi Family Photo courtesy of the Pismo-Oceano Vegetable Exchange.": {
    src: "assets/images/dohi-family.jpg",
    alt: "Dohi family portrait",
    className: "is-large-portrait",
    caption: "Dohi Family Photo courtesy of the Pismo-Oceano Vegetable Exchange.",
    hideText: true,
  },
  "91 year old Haruo Hayashi": {
    src: "assets/images/haruo-hayashi-91.avif",
    alt: "91 year old Haruo Hayashi",
    className: "is-large-portrait",
    caption: "91 year old Haruo Hayashi",
    hideText: true,
  },
  "Narrow Gauge Railraod (Photo courtesy of Elliot Gong)": {
    src: "assets/images/narrow-gauge-railroad.avif",
    alt: "Narrow gauge railroad near Avila Beach",
    className: "is-large",
    caption: "Narrow Gauge Railraod (Photo courtesy of Elliot Gong)",
    hideText: true,
  },
  "Ah Louis' Brickyard [1]": {
    src: "assets/images/ah-louis-brickyard.avif",
    alt: "Ah Louis' Brickyard",
    className: "is-large",
    caption: "Ah Louis' Brickyard [1]",
    hideText: true,
  },
  "Photo Courtesy of Emily Pan": {
    src: "assets/images/chinese-population-emily-pan.avif",
    alt: "San Luis Obispo Chinatown",
    className: "is-large",
    caption: "Photo Courtesy of Emily Pan",
    hideText: true,
  },
  "Carlos Bulosan's semi-autobiographical novel tells his story in the Philippines (part I), his journey in America (Part II), his work in the Filipino labor movement (Part III), and his later days as a writer. Bulosan, at the age of 17, bought a steerage ticket to America in search of new opportunities. Here, we will give a brief description of Bulosan's life in America and the Filipino struggle for representation, but no one could tell his story as well as himself, whose words are forever contained in his novel, America is in the Heart, which so vividly describes his feelings and experiences being an immigrant in a foreign land.": {
    src: "assets/images/carlos-bulosan-edited.jpg",
    alt: "Carlos Bulosan standing in a suit and hat",
    className: "is-tall",
  },
};

function paragraphize(lines = [], item = {}) {
  const sectionHeadings = new Set(item.sectionHeadings || []);
  const smallText = new Set(item.smallText || []);
  const italicText = new Set(item.italicText || []);

  return lines
    .filter(Boolean)
    .map((line) => {
      if (typeof line === "object" && line.type === "bullet") {
        const level = Math.max(0, Math.min(Number(line.level) || 0, 3));
        const text = line.text || "";
        return `<p class="article-bullet article-bullet-level-${level}"><span>${formatArticleText(text, item)}</span></p>`;
      }

      const inlineImage = inlineArticleImages[line];
      if (inlineImage) {
        return html`
          <div class="article-inline-photo ${escapeHtml(inlineImage.className || "")}">
            <img src="${escapeHtml(inlineImage.src)}" alt="${escapeHtml(inlineImage.alt)}">
            ${inlineImage.caption ? `<span class="article-inline-caption">${escapeHtml(inlineImage.caption)}</span>` : ""}
            ${inlineImage.hideText ? "" : `<p>${formatArticleText(line, item)}</p>`}
          </div>
        `;
      }

      if (line.startsWith("body-label:")) {
        return `<p>${escapeHtml(line.replace("body-label:", ""))}</p>`;
      }

      if (sectionHeadings.has(line)) {
        return `<p class="article-section-title"><strong>${escapeHtml(line)}</strong></p>`;
      }
      if (/^Works Cited$/i.test(line)) {
        return `<p class="works-cited-heading">${escapeHtml(line)}</p>`;
      }
      if (/^(Recent Posts|See All)$/i.test(line)) {
        return `<h2>${escapeHtml(line)}</h2>`;
      }
      if (/^- [“"]/.test(line)) {
        return `<p class="speaker-quote">${formatArticleText(line, item)}</p>`;
      }
      const classes = [
        smallText.has(line) ? "article-small-text" : "",
        italicText.has(line) ? "article-italic-text" : "",
      ].filter(Boolean).join(" ");
      return `<p${classes ? ` class="${classes}"` : ""}>${formatArticleText(line, item)}</p>`;
    })
    .join("");
}

function formatArticleText(text, item = {}) {
  return applyArticleLinks(linkify(applyBoldPhrases(escapeHtml(text), item)), item, text);
}

function applyArticleLinks(text, item = {}, sourceText = "") {
  return (item.links || []).reduce((out, link) => {
    if (link.line && link.line !== sourceText) return out;
    const label = escapeHtml(link.text);
    const url = escapeHtml(link.url);
    return out.replaceAll(label, `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
  }, text);
}

function applyBoldPhrases(text, item = {}) {
  return (item.boldPhrases || []).reduce((out, phrase) => {
    const label = escapeHtml(phrase);
    return out.replaceAll(label, `<strong>${label}</strong>`);
  }, text);
}

function linkify(text) {
  return text.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>',
  );
}

function renderArticleMedia(item) {
  if (item.hideHeroImage) return "";

  if (item.videoEmbed) {
    return html`
      <div class="video-frame">
        <iframe
          src="${escapeHtml(item.videoEmbed)}"
          title="${escapeHtml(item.videoTitle || item.title || "Video")}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      ${item.videoCaption ? `<p class="article-hero-caption">${formatArticleText(item.videoCaption, item)}</p>` : ""}
    `;
  }

  if (!item.image) return "";

  const imageClass = item.heroImageClass ? ` ${escapeHtml(item.heroImageClass)}` : "";
  return html`
    <img class="article-hero${imageClass}" src="${escapeHtml(item.image)}" alt="">
    ${item.heroCaption ? `<p class="article-hero-caption">${formatArticleText(item.heroCaption, item)}</p>` : ""}
  `;
}

function renderArticleGallery(item) {
  if (!item.gallery?.length) return "";

  if (item.wrapGalleryText) {
    return html`
      <div class="article-gallery article-gallery-inline">
        ${item.gallery
          .map((image) => {
            const src = typeof image === "string" ? image : image.src;
            const alt = typeof image === "string" ? "" : image.alt || "";
            return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
          })
          .join("")}
      </div>
    `;
  }

  return html`
    <div class="article-gallery">
      ${item.gallery
        .map((image) => {
          const src = typeof image === "string" ? image : image.src;
          const alt = typeof image === "string" ? "" : image.alt || "";
          return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
        })
        .join("")}
    </div>
  `;
}

function renderSourceGallery(items = [], title = "Photo gallery") {
  if (!items.length) return "";

  return html`
    <section class="section source-gallery-section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Photo archive</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
      </div>
      <div class="source-gallery">
        ${items
          .map((item) => html`
            <article class="source-photo-card">
              <button
                class="photo-zoom"
                type="button"
                data-lightbox-src="${escapeHtml(item.image)}"
                data-lightbox-title="${escapeHtml(item.title)}"
                data-lightbox-description="${escapeHtml(item.description)}"
                aria-label="Enlarge ${escapeHtml(item.title)}"
              >
                <img src="${escapeHtml(item.image)}" alt=""${item.imagePosition ? ` style="object-position: ${escapeHtml(item.imagePosition)};"` : ""}>
              </button>
              <div class="source-photo-body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                ${item.source ? `<a href="${escapeHtml(item.source)}" target="_blank" rel="noopener">Original source</a>` : ""}
              </div>
            </article>
          `)
          .join("")}
      </div>
    </section>
  `;
}

function openLightbox({ src, title = "", description = "" }) {
  let lightbox = document.querySelector("#photoLightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "photoLightbox";
    lightbox.className = "photo-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML = html`
      <button class="photo-lightbox-close" type="button" aria-label="Close enlarged photo">Close</button>
      <div class="photo-lightbox-frame">
        <img alt="">
        <div class="photo-lightbox-copy">
          <h2></h2>
          <p></p>
        </div>
      </div>
    `;
    document.body.append(lightbox);
  }

  const image = lightbox.querySelector("img");
  const heading = lightbox.querySelector("h2");
  const copy = lightbox.querySelector("p");
  image.src = src;
  image.alt = title;
  heading.textContent = title;
  copy.textContent = description;
  heading.hidden = !title;
  copy.hidden = !description;
  lightbox.classList.add("is-open");
  document.body.classList.add("has-lightbox");
  lightbox.querySelector(".photo-lightbox-close").focus();
}

function closeLightbox() {
  const lightbox = document.querySelector("#photoLightbox");
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  document.body.classList.remove("has-lightbox");
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
          <a class="button" href="#/about">About the website</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${escapeHtml(data.heroImage)}" alt="">
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Collections</p>
          <h2>Start with a community</h2>
        </div>
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
        ${["all", "chinese", "japanese", "filipino", "current-events", "community"]
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

function orderedPostsFromPageWithExtras(page, fallbackPosts) {
  const ordered = orderedPostsFromPage(page, fallbackPosts);
  return [...ordered, ...fallbackPosts.filter((post) => !ordered.includes(post))];
}

function renderHistoryPage(page) {
  const key = collectionKeyFromSlug(page.slug);
  const quickFact = data.posts.find((post) => post.categoryKey === key && post.title.toLowerCase().includes("quick facts"));
  const storyCandidates = data.posts.filter((post) => post.categoryKey === key && post !== quickFact);
  const stories = orderedPostsFromPageWithExtras(page, storyCandidates).filter((post) => post !== quickFact);
  const storyPage = data.pages.find((item) => item.slug === `${key}-american-stories`);
  const photoPage = data.pages.find((item) => item.slug === `${key}-american-photos`);
  const showStoryLinks = false;

  app.innerHTML = html`
    <section class="legacy-page">
      <div class="legacy-intro">
        <h1>${escapeHtml(page.title)}</h1>
        <div class="legacy-copy">${paragraphize(cleanPageBody(page).slice(0, 3))}</div>
        <div class="actions">
          ${showStoryLinks && storyPage ? `<a class="button primary" href="${routeHash(storyPage.slug)}">Stories</a>` : ""}
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
      ${showStoryLinks && storyPage ? `<div class="legacy-more"><a class="button" href="${routeHash(storyPage.slug)}">${escapeHtml(storyPage.title.replace(": Stories", " Stories"))}</a></div>` : ""}
    </section>
  `;
}

function renderStoryIndex(page) {
  const key = page.slug === "current" ? "community" : collectionKeyFromSlug(page.slug);
  const fallbackPosts = page.slug === "current"
    ? data.posts.filter((post) => post.categoryKey === "current-events")
    : data.posts.filter((post) => post.categoryKey === key && !post.title.toLowerCase().includes("quick facts"));
  const posts = orderedPostsFromPageWithExtras(page, fallbackPosts);
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
    ? `<section class="section"><div class="section-header"><h2>Photo gallery</h2></div><div class="gallery">${page.gallery.map((src) => html`
      <button class="photo-zoom" type="button" data-lightbox-src="${escapeHtml(src)}" aria-label="Enlarge photo">
        <img src="${escapeHtml(src)}" alt="">
      </button>
    `).join("")}</div></section>`
    : "";
  const sourceGallery = renderSourceGallery(page.sourceGallery, page.sourceGalleryTitle);
  const lede = page.description || page.excerpt;
  const article = page.image || page.body?.length
    ? html`
      <article class="article">
        ${page.image ? `<img class="article-hero" src="${escapeHtml(page.image)}" alt="">` : ""}
        <div class="article-body">
          ${paragraphize(page.body, page)}
        </div>
      </article>
    `
    : "";

  app.innerHTML = html`
    <section class="page-shell">
      <div class="page-title">
        <p class="eyebrow">Page</p>
        <h1>${escapeHtml(page.title)}</h1>
        ${slug === "about" || !lede ? "" : `<p class="lede">${escapeHtml(lede)}</p>`}
      </div>
      ${article}
    </section>
    ${gallery}
    ${sourceGallery}
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
        ${renderArticleMedia(post)}
        <div class="article-body">
          ${renderArticleGallery(post)}
          ${paragraphize(post.body, post)}
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
app.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-lightbox-src]");
  if (!trigger) return;
  openLightbox({
    src: trigger.dataset.lightboxSrc,
    title: trigger.dataset.lightboxTitle || "",
    description: trigger.dataset.lightboxDescription || "",
  });
});
document.addEventListener("click", (event) => {
  const lightbox = event.target.closest("#photoLightbox");
  if (!lightbox) return;
  if (event.target === lightbox || event.target.closest(".photo-lightbox-close")) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
router();
