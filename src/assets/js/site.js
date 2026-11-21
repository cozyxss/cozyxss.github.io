// Theme toggle (remembers choice, also re-themes the giscus comments)
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");

  function giscusTheme(t) { return t === "dark" ? "transparent_dark" : "light"; }

  function syncGiscus() {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme(root.dataset.theme) } } },
      "https://giscus.app"
    );
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncGiscus();
    });
  }

  // Label code blocks with their language (```http → "HTTP")
  document.querySelectorAll('.prose pre[class*="language-"]').forEach(function (pre) {
    var m = pre.className.match(/language-([\w-]+)/);
    if (m && m[1] !== "text" && m[1] !== "plaintext") pre.setAttribute("data-lang", m[1]);
  });

  // Copy link button
  var copy = document.querySelector(".copy-link");
  if (copy) {
    copy.addEventListener("click", function () {
      var url = copy.getAttribute("data-url");
      var done = function () {
        var old = copy.textContent;
        copy.textContent = "copied ✓";
        setTimeout(function () { copy.textContent = old; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
    });
  }
})();
