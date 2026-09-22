(function () {
  // Visit Grid B (Burlington visit landing). 0=Sun … 6=Sat. null = closed.
  var HOURS = {
    0: [11, 21],
    1: null,
    2: [11, 21],
    3: [11, 21],
    4: [11, 21],
    5: [11, 22],
    6: [11, 22]
  };
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function torontoNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Toronto",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var wdMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: wdMap[map.weekday],
      minutes: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10)
    };
  }

  function fmtTime(hour24) {
    var ampm = hour24 >= 12 ? "pm" : "am";
    var h = hour24 % 12; if (h === 0) h = 12;
    return h + ampm;
  }

  function nextOpening(now) {
    var today = HOURS[now.day];
    if (today && now.minutes < today[0] * 60) return "today " + fmtTime(today[0]);
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var label = i === 1 ? "tomorrow" : DAY_NAMES[d];
        return label + " " + fmtTime(HOURS[d][0]);
      }
    }
    return "soon";
  }

  function computeStatus() {
    var now = torontoNow();
    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60) {
      var minsLeft = today[1] * 60 - now.minutes;
      if (minsLeft <= 60) return { open: true, text: "Open now · closes " + fmtTime(today[1]) };
      return { open: true, text: "Open now · until " + fmtTime(today[1]) };
    }
    return { open: false, text: "Closed — opens " + nextOpening(now) };
  }

  function render() {
    var s = computeStatus();
    document.querySelectorAll("[data-hours-pill]").forEach(function (el) {
      el.classList.remove("is-open", "is-closed");
      el.classList.add(s.open ? "is-open" : "is-closed");
      var t = el.querySelector(".status-text");
      if (t) t.textContent = s.text;
    });
  }

  render();
  setInterval(render, 60000);
})();

(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (e) { e.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var group = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(group, 6) * 70 + "ms";
      el.classList.add("in");
      io.unobserve(el);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (e) { io.observe(e); });
})();

(function () {
  var bar = document.querySelector(".topbar");
  var btn = document.querySelector(".nav-toggle");
  if (!bar || !btn) return;
  btn.addEventListener("click", function () {
    var open = bar.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
