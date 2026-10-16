/* Native SVG chart builders + anime.js animations.
 * Data is hardcoded from analysis/report.md so the deck works when opened
 * directly as a file (no fetch()/CSV loading needed).
 */
(function (global) {
  "use strict";

  var COLOR = {
    blue: "#2a78d6",
    orange: "#eb6834",
    grid: "#e1e0d9",
    baseline: "#c3c2b7",
    ink: "#0b0b0b",
    inkSecondary: "#52514e",
    inkMuted: "#898781",
    covid: "rgba(137,135,129,0.18)"
  };

  var SVG_NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        node.setAttribute(k, attrs[k]);
      }
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function scale(domain, range) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    return function (v) {
      return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
    };
  }

  function niceMax(v) { return Math.ceil(v); }

  // ---------------------------------------------------------------------
  // DATA (source: analysis/report.md, KOSIS DT_1J22001 / DT_1L9U101)
  // ---------------------------------------------------------------------
  var DATA = {
    years1: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    cpiTotal: [95.783, 97.645, 99.086, 99.466, 100.0, 102.5, 107.72, 111.59, 114.18, 116.61],
    cpiCloth: [97.029, 98.082, 99.169, 99.27, 100.0, 100.56, 103.71, 110.66, 114.34, 116.57],

    years2: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    yoyTotal: [1.94, 1.48, 0.38, 0.54, 2.5, 5.09, 3.59, 2.32, 2.13],
    yoyCloth: [1.09, 1.11, 0.1, 0.74, 0.56, 3.13, 6.7, 3.33, 1.95],

    years3: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    share: [5.62, 4.92, 5.04, 5.16, 4.99, 4.89, 4.8],

    // decorative but real-data sparklines for the covid timeline cards
    sparkPre: [1.09, 1.11, 0.1], // 의류·신발 CPI YoY 2017-2019
    sparkMid: [138179.956, 118084.815, 125742.151], // 가구 의류·신발 월지출(원) 2019-2021
    sparkPost: [3.13, 6.7, 3.33] // 의류·신발 CPI YoY 2022-2024
  };

  // ---------------------------------------------------------------------
  // Chart 1: CPI level line chart (total vs clothing), 2016-2025
  // ---------------------------------------------------------------------
  function renderCpiLineChart(containerId) {
    var host = document.getElementById(containerId);
    if (!host) return;
    clear(host);

    var W = 640, H = 360, M = { t: 16, r: 18, b: 34, l: 42 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid meet" }, host);

    var years = DATA.years1;
    var yMin = 94, yMax = 118;
    var x = scale([years[0], years[years.length - 1]], [M.l, W - M.r]);
    var y = scale([yMin, yMax], [H - M.b, M.t]);

    // covid band (2019.5 - 2021.5)
    el("rect", {
      x: x(2019.5), y: M.t, width: x(2021.5) - x(2019.5), height: H - M.t - M.b,
      fill: COLOR.covid
    }, svg);
    var covidLabel = el("text", {
      x: (x(2019.5) + x(2021.5)) / 2, y: M.t + 16, "text-anchor": "middle",
      "font-size": "10", fill: COLOR.inkMuted, "font-family": "inherit"
    }, svg);
    covidLabel.textContent = "코로나19";

    // gridlines + y ticks
    var yTicks = [95, 100, 105, 110, 115];
    yTicks.forEach(function (t) {
      el("line", { x1: M.l, x2: W - M.r, y1: y(t), y2: y(t), stroke: COLOR.grid, "stroke-width": 1 }, svg);
      var lab = el("text", { x: M.l - 8, y: y(t) + 3, "text-anchor": "end", "font-size": "10", fill: COLOR.inkMuted }, svg);
      lab.textContent = t;
    });

    // x ticks (every other year to avoid crowding)
    years.forEach(function (yr, i) {
      if (i % 2 !== 0 && yr !== years[years.length - 1]) return;
      var lab = el("text", { x: x(yr), y: H - M.b + 16, "text-anchor": "middle", "font-size": "10", fill: COLOR.inkMuted }, svg);
      lab.textContent = yr;
    });

    function path(values) {
      return values.map(function (v, i) { return (i === 0 ? "M" : "L") + x(years[i]) + "," + y(v); }).join(" ");
    }

    function drawSeries(values, color, delay) {
      var p = el("path", { d: path(values), fill: "none", stroke: color, "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
      var len = p.getTotalLength();
      p.setAttribute("stroke-dasharray", len);
      p.setAttribute("stroke-dashoffset", len);
      values.forEach(function (v, i) {
        el("circle", { cx: x(years[i]), cy: y(v), r: 3.2, fill: color }, svg);
      });
      var lastV = values[values.length - 1];
      var lab = el("text", {
        x: x(years[years.length - 1]) + 6, y: y(lastV) + 4, "font-size": "12", "font-weight": "700", fill: color
      }, svg);
      lab.textContent = lastV.toFixed(1);

      if (global.anime) {
        global.anime({ targets: p, strokeDashoffset: [len, 0], duration: 1400, delay: delay, easing: "easeInOutQuad" });
      } else {
        p.setAttribute("stroke-dashoffset", 0);
      }
    }

    drawSeries(DATA.cpiTotal, COLOR.blue, 150);
    drawSeries(DATA.cpiCloth, COLOR.orange, 450);
  }

  // ---------------------------------------------------------------------
  // Chart 2: YoY grouped bar chart, 2017-2025
  // ---------------------------------------------------------------------
  function renderYoyBarChart(containerId) {
    var host = document.getElementById(containerId);
    if (!host) return;
    clear(host);

    var W = 640, H = 360, M = { t: 16, r: 10, b: 34, l: 36 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid meet" }, host);

    var years = DATA.years2;
    var yMax = 7;
    var x0 = M.l, x1 = W - M.r;
    var groupW = (x1 - x0) / years.length;
    var barW = groupW * 0.32;
    var y = scale([0, yMax], [H - M.b, M.t]);
    var baseline = y(0);

    [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (t) {
      el("line", { x1: x0, x2: x1, y1: y(t), y2: y(t), stroke: COLOR.grid, "stroke-width": 1 }, svg);
    });
    el("text", { x: x0 - 6, y: y(0) + 3, "text-anchor": "end", "font-size": "10", fill: COLOR.inkMuted }, svg).textContent = "0%";
    [2, 4, 6].forEach(function (t) {
      el("text", { x: x0 - 6, y: y(t) + 3, "text-anchor": "end", "font-size": "10", fill: COLOR.inkMuted }, svg).textContent = t + "%";
    });

    var bars = [];
    years.forEach(function (yr, i) {
      var cx = x0 + groupW * i + groupW / 2;
      el("text", { x: cx, y: H - M.b + 16, "text-anchor": "middle", "font-size": "10", fill: COLOR.inkMuted }, svg).textContent = yr;

      var totalV = DATA.yoyTotal[i];
      var clothV = DATA.yoyCloth[i];

      var rTotal = el("rect", { x: cx - barW - 2, y: baseline, width: barW, height: 0, fill: COLOR.blue, rx: 2 }, svg);
      var rCloth = el("rect", { x: cx + 2, y: baseline, width: barW, height: 0, fill: COLOR.orange, rx: 2 }, svg);
      bars.push({ rect: rTotal, value: totalV, color: COLOR.blue, cx: cx - barW - 2 + barW / 2 });
      bars.push({ rect: rCloth, value: clothV, color: COLOR.orange, cx: cx + 2 + barW / 2 });

      if (Math.abs(clothV - 6.7) < 0.01) {
        el("text", { x: cx + 2 + barW / 2, y: y(clothV) - 8, "text-anchor": "middle", "font-size": "11", "font-weight": "700", fill: COLOR.orange }, svg).textContent = "+6.7%";
      }
    });

    bars.forEach(function (b, idx) {
      var finalY = y(b.value);
      var finalH = baseline - finalY;
      if (global.anime) {
        global.anime({
          targets: b.rect,
          y: [baseline, finalY],
          height: [0, finalH],
          duration: 900,
          delay: 100 + idx * 28,
          easing: "easeOutCubic"
        });
      } else {
        b.rect.setAttribute("y", finalY);
        b.rect.setAttribute("height", finalH);
      }
    });
  }

  // ---------------------------------------------------------------------
  // Chart 3: clothing share-of-expenditure line/area chart, 2019-2025
  // ---------------------------------------------------------------------
  function renderShareChart(containerId, onComplete) {
    var host = document.getElementById(containerId);
    if (!host) return;
    clear(host);

    var W = 640, H = 320, M = { t: 20, r: 18, b: 34, l: 42 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid meet" }, host);

    var years = DATA.years3;
    var yMin = 4.5, yMax = 5.8;
    var x = scale([years[0], years[years.length - 1]], [M.l, W - M.r]);
    var y = scale([yMin, yMax], [H - M.b, M.t]);

    el("rect", {
      x: x(2019.5), y: M.t, width: x(2021.5) - x(2019.5), height: H - M.t - M.b, fill: COLOR.covid
    }, svg);
    el("text", {
      x: (x(2019.5) + x(2021.5)) / 2, y: H - M.b - 8, "text-anchor": "middle", "font-size": "10", fill: COLOR.inkMuted
    }, svg).textContent = "코로나19";

    [4.5, 5.0, 5.5].forEach(function (t) {
      el("line", { x1: M.l, x2: W - M.r, y1: y(t), y2: y(t), stroke: COLOR.grid, "stroke-width": 1 }, svg);
      el("text", { x: M.l - 8, y: y(t) + 3, "text-anchor": "end", "font-size": "10", fill: COLOR.inkMuted }, svg).textContent = t + "%";
    });
    years.forEach(function (yr) {
      el("text", { x: x(yr), y: H - M.b + 16, "text-anchor": "middle", "font-size": "10", fill: COLOR.inkMuted }, svg).textContent = yr;
    });

    var linePath = DATA.share.map(function (v, i) { return (i === 0 ? "M" : "L") + x(years[i]) + "," + y(v); }).join(" ");
    var areaPath = linePath + " L" + x(years[years.length - 1]) + "," + y(yMin) + " L" + x(years[0]) + "," + y(yMin) + " Z";

    var area = el("path", { d: areaPath, fill: COLOR.orange, opacity: 0.08 }, svg);
    var p = el("path", { d: linePath, fill: "none", stroke: COLOR.orange, "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    var len = p.getTotalLength();
    p.setAttribute("stroke-dasharray", len);
    p.setAttribute("stroke-dashoffset", len);

    DATA.share.forEach(function (v, i) {
      el("circle", { cx: x(years[i]), cy: y(v), r: 3.4, fill: COLOR.orange }, svg);
      el("text", { x: x(years[i]), y: y(v) - 10, "text-anchor": "middle", "font-size": "10", fill: COLOR.inkSecondary }, svg).textContent = v.toFixed(1) + "%";
    });

    if (global.anime) {
      global.anime({ targets: p, strokeDashoffset: [len, 0], duration: 1300, easing: "easeInOutQuad", complete: onComplete });
    } else if (onComplete) {
      onComplete();
    }
  }

  // ---------------------------------------------------------------------
  // Sparklines (slide 06 timeline cards)
  // ---------------------------------------------------------------------
  function renderSparkline(containerId, values, color) {
    var host = document.getElementById(containerId);
    if (!host) return;
    clear(host);
    var W = 220, H = 44, pad = 6;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" }, host);
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    if (min === max) { min -= 1; max += 1; }
    var x = scale([0, values.length - 1], [pad, W - pad]);
    var y = scale([min, max], [H - pad, pad]);
    var d = values.map(function (v, i) { return (i === 0 ? "M" : "L") + x(i) + "," + y(v); }).join(" ");
    var p = el("path", { d: d, fill: "none", stroke: color, "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    values.forEach(function (v, i) { el("circle", { cx: x(i), cy: y(v), r: 2.6, fill: color }, svg); });
    var len = p.getTotalLength();
    p.setAttribute("stroke-dasharray", len);
    p.setAttribute("stroke-dashoffset", len);
    if (global.anime) {
      global.anime({ targets: p, strokeDashoffset: [len, 0], duration: 900, easing: "easeInOutQuad" });
    } else {
      p.setAttribute("stroke-dashoffset", 0);
    }
  }

  // ---------------------------------------------------------------------
  // Count-up numbers
  // ---------------------------------------------------------------------
  function countUp(elNode, opts) {
    if (!elNode) return;
    var from = opts.from != null ? opts.from : 0;
    var to = opts.to;
    var decimals = opts.decimals != null ? opts.decimals : 1;
    var prefix = opts.prefix || "";
    var suffix = opts.suffix || "";
    var duration = opts.duration || 1400;
    var delay = opts.delay || 0;

    if (!global.anime) {
      elNode.textContent = prefix + to.toFixed(decimals) + suffix;
      return;
    }
    var obj = { v: from };
    global.anime({
      targets: obj,
      v: to,
      duration: duration,
      delay: delay,
      easing: "easeOutCubic",
      round: decimals === 0 ? 1 : false,
      update: function () {
        elNode.textContent = prefix + obj.v.toFixed(decimals) + suffix;
      }
    });
  }

  global.DeckCharts = {
    DATA: DATA,
    renderCpiLineChart: renderCpiLineChart,
    renderYoyBarChart: renderYoyBarChart,
    renderShareChart: renderShareChart,
    renderSparkline: renderSparkline,
    countUp: countUp
  };
})(window);
