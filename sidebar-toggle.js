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

  function boot() {
    ensureToggle();
    const observer = new MutationObserver(ensureToggle);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
