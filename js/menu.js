(function () {
  var root = document.getElementById("menuApp");
  if (!root || !window.DEAR_SAIGON_MENU) return;

  var state = { cat: "all", q: "", veg: false };
  var cats = window.DEAR_SAIGON_MENU;

  function fold(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function matches(item) {
    if (state.veg && item.tags.indexOf("veg") === -1) return false;
    if (!state.q) return true;
    var hay = fold(item.code + " " + item.name + " " + (item.note || ""));
    return hay.indexOf(state.q) !== -1;
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (!attrs) return node;
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : String(value));
    });
    return node;
  }

  function card(item) {
    var article = el("article", { className: "dish", id: item.code.toLowerCase() });
    var photo;
    if (item.photo) {
      photo = el("div", { className: "dish-photo" });
      photo.appendChild(el("img", {
        src: item.photo,
        alt: item.name,
        loading: "lazy",
        width: "1200",
        height: "900"
      }));
    } else {
      photo = el("div", { className: "dish-photo no-photo", "aria-hidden": "true" });
      photo.appendChild(el("span", { text: item.code }));
    }
    var body = el("div", { className: "dish-body" });
    body.appendChild(el("span", { className: "dish-code", text: item.code }));
    body.appendChild(el("h3", { className: "dish-name", text: item.name }));
    if (item.note) body.appendChild(el("p", { className: "dish-note", text: item.note }));
    var foot = el("div", { className: "dish-foot" });
    if (item.tags.indexOf("veg") !== -1) {
      foot.appendChild(el("span", { className: "tag tag-veg", text: "Vegetarian" }));
    }
    if (item.tags.indexOf("spicy") !== -1) {
      foot.appendChild(el("span", { className: "tag tag-spicy", text: "Spicy" }));
    }
    body.appendChild(foot);
    article.appendChild(photo);
    article.appendChild(body);
    return article;
  }

  function render() {
    var fragment = document.createDocumentFragment();
    var shown = 0;
    cats.forEach(function (cat) {
      if (state.cat !== "all" && state.cat !== cat.id) return;
      var items = cat.items.filter(matches);
      if (!items.length) return;
      shown += items.length;
      var section = el("section", { className: "menu-section", id: cat.id });
      var heading = el("h2", { text: cat.label });
      heading.appendChild(el("span", { text: String(items.length) }));
      var grid = el("div", { className: "menu-grid" });
      items.forEach(function (item) { grid.appendChild(card(item)); });
      section.appendChild(heading);
      section.appendChild(grid);
      fragment.appendChild(section);
    });
    if (!shown) {
      fragment.appendChild(el("p", {
        className: "menu-empty",
        text: "No dishes match that search. Try another word, or call us and we will help you choose."
      }));
    }
    root.replaceChildren(fragment);
  }

  var chips = document.getElementById("menuChips");
  if (chips) {
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.cat = btn.getAttribute("data-cat");
      chips.querySelectorAll("[data-cat]").forEach(function (node) {
        node.setAttribute("aria-pressed", node === btn ? "true" : "false");
        node.classList.toggle("is-on", node === btn);
      });
      render();
    });
  }

  var search = document.getElementById("menuSearch");
  if (search) {
    search.addEventListener("input", function () {
      state.q = fold(search.value.trim());
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
      chips.querySelectorAll("[data-cat]").forEach(function (node) {
        var on = node.getAttribute("data-cat") === hash;
        node.setAttribute("aria-pressed", on ? "true" : "false");
        node.classList.toggle("is-on", on);
      });
    }
  }

  render();
})();
