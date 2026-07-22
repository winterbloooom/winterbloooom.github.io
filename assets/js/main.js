/* winterbloooom — site behavior (vanilla, no jQuery) */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ── Theme toggle ───────────────────────────────────────── */
  var toggle = document.getElementById("theme-toggle");
  var icon = document.getElementById("theme-icon");

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintIcon(theme) {
    if (icon) icon.innerHTML = '<use href="#i-' + (theme === "dark" ? "sun" : "moon") + '"/>';
  }
  paintIcon(currentTheme());
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintIcon(next);
    });
  }

  /* ── Mobile nav ─────────────────────────────────────────── */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ── Scroll to top ──────────────────────────────────────── */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── Table of contents (from rendered h2/h3) + scrollspy ── */
  var toc = document.getElementById("toc");
  var tocList = document.getElementById("toc-list");
  var body = document.querySelector(".post-body");
  if (toc && tocList && body) {
    var heads = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
    if (heads.length >= 2) {
      var links = [];
      heads.forEach(function (h, i) {
        if (!h.id) h.id = "sec-" + i;
        var li = document.createElement("li");
        if (h.tagName === "H3") li.className = "toc-h3";
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        tocList.appendChild(li);
        links.push(li);
      });
      toc.hidden = false;

      /* scrollspy: 화면 상단을 지난 마지막 heading 을 활성화 */
      var spy = function () {
        var pos = window.scrollY + 100;
        var idx = 0;
        for (var i = 0; i < heads.length; i++) {
          if (heads[i].offsetTop <= pos) idx = i; else break;
        }
        links.forEach(function (li, i) { li.classList.toggle("is-active", i === idx); });
      };
      window.addEventListener("scroll", spy, { passive: true });
      spy();
    }
  }

  /* ── Disqus lazy load (click or scroll into view) ───────── */
  var comments = document.getElementById("comments");
  if (comments) {
    var loaded = false;
    var loadDisqus = function () {
      if (loaded) return;
      loaded = true;
      var placeholder = document.getElementById("comments-placeholder");
      if (placeholder) placeholder.style.display = "none";
      window.disqus_config = function () {
        this.page.url = comments.getAttribute("data-disqus-url");
        this.page.identifier = comments.getAttribute("data-disqus-identifier");
      };
      var s = document.createElement("script");
      s.src = "https://" + comments.getAttribute("data-disqus-shortname") + ".disqus.com/embed.js";
      s.setAttribute("data-timestamp", +new Date());
      (document.head || document.body).appendChild(s);
    };
    var btn = document.getElementById("comments-load");
    if (btn) btn.addEventListener("click", loadDisqus);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { loadDisqus(); io.disconnect(); } });
      }, { rootMargin: "400px" });
      io.observe(comments);
    }
  }
})();
