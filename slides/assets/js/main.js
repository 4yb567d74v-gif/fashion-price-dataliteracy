(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var current = 0;

  var counterEl = document.getElementById("slide-counter");
  var progressFill = document.querySelector(".progress-fill");
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");

  function resetStagger(nodeList, fromVars) {
    nodeList.forEach(function (node) {
      if (fromVars.opacity != null) node.style.opacity = fromVars.opacity;
      if (fromVars.translateY != null) node.style.transform = "translateY(" + fromVars.translateY + "px)";
    });
  }

  function staggerIn(nodeList, opts) {
    opts = opts || {};
    resetStagger(nodeList, { opacity: 0, translateY: opts.fromY != null ? opts.fromY : 14 });
    if (window.anime) {
      window.anime({
        targets: nodeList,
        opacity: [0, 1],
        translateY: [opts.fromY != null ? opts.fromY : 14, 0],
        duration: opts.duration || 560,
        delay: window.anime.stagger(opts.stagger || 90, { start: opts.start || 0 }),
        easing: "easeOutCubic"
      });
    } else {
      nodeList.forEach(function (n) { n.style.opacity = 1; n.style.transform = "translateY(0)"; });
    }
  }

  // ------------------------------------------------------------------
  // Per-slide animation triggers
  // ------------------------------------------------------------------
  var animators = {
    cover: function (slide) {
      var kicker = slide.querySelector(".kicker");
      var title = slide.querySelector(".title");
      var sub = slide.querySelector(".sub-title");
      var lede = slide.querySelector(".lede");
      staggerIn([kicker, title, sub, lede].filter(Boolean), { stagger: 110, fromY: 18 });
    },

    summary: function (slide) {
      var cards = slide.querySelectorAll(".stat-card");
      staggerIn(cards, { stagger: 130, fromY: 20 });
      cards.forEach(function (card, i) {
        var valueEl = card.querySelector(".stat-value");
        if (!valueEl) return;
        var to = parseFloat(valueEl.getAttribute("data-to"));
        var decimals = parseInt(valueEl.getAttribute("data-decimals") || "1", 10);
        var prefix = valueEl.getAttribute("data-prefix") || "";
        var suffix = valueEl.getAttribute("data-suffix") || "";
        window.DeckCharts.countUp(valueEl, {
          from: 0, to: to, decimals: decimals, prefix: prefix, suffix: suffix,
          duration: 1300, delay: 260 + i * 130
        });
      });
    },

    "cpi-level": function () {
      window.DeckCharts.renderCpiLineChart("cpi-level-chart");
    },

    "cpi-yoy": function () {
      window.DeckCharts.renderYoyBarChart("cpi-yoy-chart");
    },

    share: function (slide) {
      window.DeckCharts.renderShareChart("share-chart");
      var valueEl = slide.querySelector(".stat-value[data-to]");
      if (valueEl) {
        var to = parseFloat(valueEl.getAttribute("data-to"));
        window.DeckCharts.countUp(valueEl, { from: 5.6, to: to, decimals: 1, suffix: "%", duration: 1300, delay: 300 });
      }
    },

    covid: function (slide) {
      var cards = slide.querySelectorAll(".timeline-card");
      staggerIn(cards, { stagger: 150, fromY: 18 });
      window.DeckCharts.renderSparkline("spark-pre", window.DeckCharts.DATA.sparkPre, "#2a78d6");
      window.DeckCharts.renderSparkline("spark-mid", window.DeckCharts.DATA.sparkMid, "#eb6834");
      window.DeckCharts.renderSparkline("spark-post", window.DeckCharts.DATA.sparkPost, "#eb6834");
    },

    news: function (slide) {
      var cards = slide.querySelectorAll(".news-card");
      staggerIn(cards, { stagger: 110, fromY: 16, start: 250 });
    },

    interpretation: function (slide) {
      var pills = slide.querySelectorAll(".flow-pill, .flow-arrow");
      staggerIn(pills, { stagger: 90, fromY: 10 });
      var quote = slide.querySelector(".quote-card");
      if (quote) staggerIn([quote], { stagger: 0, fromY: 14, start: 520 });
    },

    limitations: function (slide) {
      var rows = slide.querySelectorAll(".callout-row");
      staggerIn(rows, { stagger: 120, fromY: 14 });
    },

    appendix: function (slide) {
      var cards = slide.querySelectorAll(".thumb-card");
      staggerIn(cards, { stagger: 110, fromY: 16 });
    },

    closing: function (slide) {
      var items = slide.querySelectorAll(".kicker, .title, .sub-title, .closing-list");
      staggerIn(items, { stagger: 120, fromY: 16 });
    }
  };

  function playAnimations(slide) {
    var key = slide.getAttribute("data-slide");
    if (animators[key]) animators[key](slide);
  }

  // ------------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------------
  function render() {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
    counterEl.textContent = (current + 1) + " / " + total;
    progressFill.style.width = ((current + 1) / total * 100) + "%";
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    playAnimations(slides[current]);
  }

  function goTo(i) {
    if (i < 0 || i >= total) return;
    current = i;
    render();
  }

  prevBtn.addEventListener("click", function () { goTo(current - 1); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
  });

  // ------------------------------------------------------------------
  // Appendix lightbox
  // ------------------------------------------------------------------
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  document.querySelectorAll(".thumb-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var src = card.querySelector("img").getAttribute("src");
      lightboxImg.setAttribute("src", src);
      lightbox.classList.add("open");
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function () { lightbox.classList.remove("open"); });
  }

  render();
})();
