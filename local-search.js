(function () {
  const PAGES = [
    ["/cn/docs/get-started/about", "关于我们"],
    ["/cn/docs/get-started/help", "获取支持"],
    ["/cn/docs/faq/user", "用户FAQ"],
    ["/cn/docs/faq/partner", "站长FAQ"],
    ["/cn/docs/hvoyai/user-benefits", "hvoy用户福利"],
    ["/cn/docs/hvoyai/tokenUsage", "免费 Token 使用"],
    ["/cn/docs/hvoyai/verify", "注册专属验证链接"],
    ["/cn/docs/hvoyai/price-api", "第三方价格接口规范"],
    ["/cn/docs/hvoyai/rank", "hvoy榜单排序逻辑"],
    ["/cn/docs/hvoyai/index-rank", "hvoy首页推荐逻辑"],
    ["/cn/docs/hvoyai/cpm", "CPM广告投放"],
    ["/en/docs/get-started/about", "About us"],
    ["/en/docs/get-started/help", "Get support"],
    ["/en/docs/faq/user", "User FAQ"],
    ["/en/docs/faq/partner", "Partner FAQ"],
    ["/en/docs/hvoyai/user-benefits", "hvoy user benefits"],
    ["/en/docs/hvoyai/tokenUsage", "Free Token usage"],
    ["/en/docs/hvoyai/verify", "Dedicated verification link"],
    ["/en/docs/hvoyai/price-api", "Third-party price API"],
    ["/en/docs/hvoyai/rank", "hvoy ranking logic"],
    ["/en/docs/hvoyai/index-rank", "hvoy homepage recommendation logic"],
    ["/en/docs/hvoyai/cpm", "CPM advertising"]
  ];

  let indexPromise;
  let overlay;
  let input;
  let results;

  function currentLanguage() {
    return location.pathname.startsWith("/en/") ? "en" : "cn";
  }

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function extractMainText(doc) {
    const main = doc.querySelector("main") || doc.querySelector("#content") || doc.body;
    const clone = main.cloneNode(true);
    clone.querySelectorAll("script, style, nav, aside, header, footer, svg, button").forEach((el) => el.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function fallbackText(url, title) {
    return `${title} ${url.replace(/[-/]/g, " ")}`;
  }

  function buildIndex() {
    if (indexPromise) return indexPromise;

    const lang = currentLanguage();
    const pages = PAGES.filter(([url]) => url.startsWith(`/${lang}/`));
    indexPromise = Promise.all(
      pages.map(([url, title]) =>
        fetch(url, { credentials: "same-origin" })
          .then((res) => (res.ok ? res.text() : ""))
          .then((html) => {
            if (!html) return { url, title, text: fallbackText(url, title) };
            const doc = new DOMParser().parseFromString(html, "text/html");
            const pageTitle = doc.querySelector("h1")?.textContent?.trim() || title;
            return { url, title: pageTitle, text: extractMainText(doc) || fallbackText(url, title) };
          })
          .catch(() => ({ url, title, text: fallbackText(url, title) }))
      )
    );
    return indexPromise;
  }

  function scorePage(page, terms, rawQuery) {
    const title = normalize(page.title);
    const text = normalize(page.text);
    let score = 0;

    if (title.includes(rawQuery)) score += 20;
    if (text.includes(rawQuery)) score += 8;

    for (const term of terms) {
      if (!term) continue;
      if (title.includes(term)) score += 10;
      if (text.includes(term)) score += 3;
    }

    return score;
  }

  function snippet(page, terms) {
    const text = page.text.replace(/\s+/g, " ").trim();
    const lower = text.toLowerCase();
    const firstHit = terms.map((term) => lower.indexOf(term)).filter((pos) => pos >= 0).sort((a, b) => a - b)[0] || 0;
    const start = Math.max(0, firstHit - 36);
    const value = text.slice(start, start + 118);
    return `${start > 0 ? "..." : ""}${value}${start + 118 < text.length ? "..." : ""}`;
  }

  function renderResults(query, pages) {
    const rawQuery = normalize(query);
    const terms = rawQuery.split(/[ ,，。；;、]+/).filter(Boolean);

    if (!rawQuery) {
      results.innerHTML = '<div class="local-search-empty">请输入标题或正文关键词</div>';
      return;
    }

    const matches = pages
      .map((page) => ({ ...page, score: scorePage(page, terms, rawQuery) }))
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (!matches.length) {
      results.innerHTML = '<div class="local-search-empty">没有找到匹配教程</div>';
      return;
    }

    results.innerHTML = matches
      .map(
        (page) => `
          <a class="local-search-result" href="${page.url}">
            <span>${page.title}</span>
            <small>${snippet(page, terms)}</small>
          </a>
        `
      )
      .join("");
  }

  function ensureOverlay() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "local-search-overlay";
    overlay.innerHTML = `
      <div class="local-search-backdrop"></div>
      <div class="local-search-dialog" role="dialog" aria-modal="true" aria-label="搜索帮助文档">
        <div class="local-search-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input class="local-search-input" type="search" placeholder="搜索教程标题或正文关键词" />
          <button class="local-search-close" type="button" aria-label="关闭搜索">×</button>
        </div>
        <div class="local-search-results">
          <div class="local-search-empty">请输入标题或正文关键词</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    input = overlay.querySelector(".local-search-input");
    results = overlay.querySelector(".local-search-results");

    overlay.querySelector(".local-search-backdrop").addEventListener("click", closeSearch);
    overlay.querySelector(".local-search-close").addEventListener("click", closeSearch);
    input.addEventListener("input", function () {
      buildIndex().then((pages) => renderResults(input.value, pages));
    });
    overlay.addEventListener("click", function (event) {
      const link = event.target.closest(".local-search-result");
      if (link) closeSearch();
    });
  }

  function openSearch(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    ensureOverlay();
    overlay.dataset.open = "true";
    document.documentElement.classList.add("local-search-open");
    input.value = "";
    results.innerHTML = '<div class="local-search-empty">正在准备搜索...</div>';
    buildIndex().then((pages) => {
      renderResults("", pages);
      input.focus();
    });
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.dataset.open = "false";
    document.documentElement.classList.remove("local-search-open");
  }

  function bindSearchEntry() {
    document.querySelectorAll("#search-bar-entry, #search-bar-entry-mobile").forEach((entry) => {
      if (entry.dataset.localSearchBound) return;
      entry.dataset.localSearchBound = "true";
      entry.addEventListener("click", openSearch, true);
    });
  }

  function hideAssistantWidgets() {
    document
      .querySelectorAll(
        '#assistant-entry, #assistant-entry-mobile, [id*="assistant"], [data-testid*="assistant"], [aria-label*="assistant" i], [aria-label*="ask" i]'
      )
      .forEach((el) => {
        if (!el.closest(".local-search-overlay")) el.style.setProperty("display", "none", "important");
      });

    document.querySelectorAll("button, a, [role='button']").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const text = `${el.id} ${el.className || ""} ${el.getAttribute("aria-label") || ""} ${el.textContent || ""}`.toLowerCase();
      const looksLikeAssistant = /assistant|ask|chat|ai/.test(text);
      const isFloatingCorner =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        (style.position === "fixed" || style.position === "sticky") &&
        rect.width <= 96 &&
        rect.height <= 96 &&
        (rect.right > window.innerWidth - 160 || rect.left < 160) &&
        rect.bottom > window.innerHeight - 180;

      if (el.id !== "sidebar-collapse-toggle" && (looksLikeAssistant || isFloatingCorner)) {
        el.style.setProperty("display", "none", "important");
      }
    });
  }

  function boot() {
    bindSearchEntry();
    hideAssistantWidgets();

    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        openSearch(event);
      } else if (event.key === "Escape") {
        closeSearch();
      }
    });

    const observer = new MutationObserver(function () {
      bindSearchEntry();
      hideAssistantWidgets();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
