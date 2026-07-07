(function () {
  const STORAGE_KEY = "hvoy-docs-sidebar-collapsed";
  const BUTTON_ID = "sidebar-collapse-toggle";

  function setCollapsed(collapsed) {
    document.documentElement.dataset.sidebarCollapsed = collapsed ? "true" : "false";
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "true" : "false");
    } catch (_) {}

    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.setAttribute("aria-expanded", collapsed ? "false" : "true");
      button.setAttribute("aria-label", collapsed ? "展开左侧导航" : "收起左侧导航");
      button.title = collapsed ? "展开左侧导航" : "收起左侧导航";
    }
  }

  function getInitialCollapsed() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch (_) {
      return false;
    }
  }

  function ensureToggle() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || document.getElementById(BUTTON_ID)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.innerHTML = '<span aria-hidden="true"></span>';
    button.addEventListener("click", function () {
      setCollapsed(document.documentElement.dataset.sidebarCollapsed !== "true");
    });

    document.body.appendChild(button);
    setCollapsed(getInitialCollapsed());
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    return Promise.resolve();
  }

  function bindCopyButtons() {
    document.querySelectorAll(".support-copy:not([data-copy-bound])").forEach(function (button) {
      button.dataset.copyBound = "true";
      button.addEventListener("click", function () {
        const text = button.dataset.copyText || "";
        const original = button.innerHTML;
        copyText(text).then(function () {
          button.innerHTML = button.textContent.trim().toLowerCase().startsWith("copy")
            ? "Copied <span>✓</span>"
            : "已复制 <span>✓</span>";
          window.setTimeout(function () {
            button.innerHTML = original;
          }, 1400);
        });
      });
    });
  }

  function boot() {
    ensureToggle();
    bindCopyButtons();
    const observer = new MutationObserver(function () {
      ensureToggle();
      bindCopyButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
