(function () {
  var root = document.getElementById("menuApp");
  if (!root || !window.DEAR_SAIGON_MENU) return;

  var state = { cat: "all", q: "", veg: false };
  var cats = window.DEAR_SAIGON_MENU;

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function matches(item) {
    if (state.veg && item.tags.indexOf("veg") === -1) return false;
    if (!state.q) return true;
    var hay = (item.code + " " + item.name + " " + (item.note || "")).toLowerCase();
    return hay.indexOf(state.q) !== -1;
  }

  function card(item) {
    var photo = item.photo
      ? '<div class="dish-photo"><img src="' + esc(item.photo) + '" alt="' + esc(item.name) + '" loading="lazy" width="1200" height="900" /></div>'
      : '<div class="dish-photo no-photo" aria-hidden="true"><span>' + esc(item.code) + "</span></div>";
    var tags = "";
    if (item.tags.indexOf("veg") !== -1) tags += '<span class="tag tag-veg">Vegetarian</span>';
    if (item.tags.indexOf("spicy") !== -1) tags += '<span class="tag tag-spicy">Spicy</span>';
    var note = item.note ? '<p class="dish-note">' + esc(item.note) + "</p>" : "";
    return (
      '<article class="dish" id="' + esc(item.code.toLowerCase()) + '">' +
        photo +
        '<div class="dish-body">' +
          '<span class="dish-code">' + esc(item.code) + "</span>" +
          "<h3 class=\"dish-name\">" + esc(item.name) + "</h3>" +
          note +
          '<div class="dish-foot">' + tags + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    var html = "";
    var shown = 0;
    cats.forEach(function (cat) {
      if (state.cat !== "all" && state.cat !== cat.id) return;
      var items = cat.items.filter(matches);
      if (!items.length) return;
      shown += items.length;
      html += '<section class="menu-section" id="' + esc(cat.id) + '">';
      html += "<h2>" + esc(cat.label) + " <span>" + items.length + "</span></h2>";
      html += '<div class="menu-grid">';
      html += items.map(card).join("");
      html += "</div></section>";
    });
    if (!shown) {
      html = '<p class="menu-empty">No dishes match that search. Try another word, or call us and we will help you choose.</p>';
    }
    root.innerHTML = html;
  }

  var chips = document.getElementById("menuChips");
  if (chips) {
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.cat = btn.getAttribute("data-cat");
      chips.querySelectorAll("[data-cat]").forEach(function (el) {
        el.setAttribute("aria-pressed", el === btn ? "true" : "false");
        el.classList.toggle("is-on", el === btn);
      });
      render();
    });
  }

  var search = document.getElementById("menuSearch");
  if (search) {
    search.addEventListener("input", function () {
      state.q = search.value.trim().toLowerCase();
      render();
    });
  }

  var veg = document.getElementById("vegFilter");
  if (veg) {
    veg.addEventListener("click", function () {
      state.veg = !state.veg;
      veg.setAttribute("aria-pressed", state.veg ? "true" : "false");
      veg.classList.toggle("is-on", state.veg);
      render();
    });
  }

  var hash = (location.hash || "").replace("#", "");
  if (hash && cats.some(function (c) { return c.id === hash; })) {
    state.cat = hash;
    if (chips) {
      chips.querySelectorAll("[data-cat]").forEach(function (el) {
        var on = el.getAttribute("data-cat") === hash;
        el.setAttribute("aria-pressed", on ? "true" : "false");
        el.classList.toggle("is-on", on);
      });
    }
  }

  render();
})();
