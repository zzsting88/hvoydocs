// matomo.js (Mintlify: included globally)
window._paq = window._paq || [];
window._paq.push(["trackPageView"]);
window._paq.push(["enableLinkTracking"]);

(function () {
    var u = "https://matomo.xbqx.com/"; // 建议写死 https
    window._paq.push(["setTrackerUrl", u + "matomo.php"]);
    window._paq.push(["setSiteId", "2"]);

    var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = u + "matomo.js";
    s.parentNode.insertBefore(g, s);
})();
