(() => {
  "use strict";

  const listKey = "xingyuji-atelier-list-v1";
  const bookingUrl = "https://calendar.app.google/r2s8EAw3cbqEc4dr8";

  function loadList() {
    try {
      const stored = JSON.parse(localStorage.getItem(listKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function saveList(items) {
    localStorage.setItem(listKey, JSON.stringify(items));
    updateListCounts(items.length);
  }

  function updateListCounts(count = loadList().length) {
    document.querySelectorAll("[data-list-count]").forEach((element) => {
      element.textContent = String(count);
      element.setAttribute("aria-label", `${count} item${count === 1 ? "" : "s"} in Atelier List`);
    });
  }

  function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function addItem(button) {
    const item = {
      id: button.dataset.id,
      name: button.dataset.name,
      category: button.dataset.category
    };
    const items = loadList();
    if (items.some((existing) => existing.id === item.id)) {
      showToast(`${item.name} is already on your Atelier List.`);
      return;
    }
    items.push(item);
    saveList(items);
    showToast(`${item.name} added to your Atelier List.`);
    button.textContent = "Added to Atelier List";
    button.setAttribute("aria-pressed", "true");
  }

  function syncAddButtons() {
    const ids = new Set(loadList().map((item) => item.id));
    document.querySelectorAll("[data-add-item]").forEach((button) => {
      if (ids.has(button.dataset.id)) {
        button.textContent = "Added to Atelier List";
        button.setAttribute("aria-pressed", "true");
      }
    });
  }

  function renderList() {
    const container = document.querySelector("[data-list-items]");
    if (!container) return;

    const items = loadList();
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-list">
          <p>Your list is empty.</p>
          <a class="text-link" href="collection.html">Explore the collection <span aria-hidden="true">→</span></a>
        </div>`;
      updateSubscriptionPreferences(items);
      return;
    }

    container.innerHTML = items.map((item, index) => `
      <article class="atelier-list-item">
        <div class="item-swatch" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <p>${escapeHtml(item.category)}</p>
          <h3>${escapeHtml(item.name)}</h3>
        </div>
        <button class="remove-item" type="button" data-remove-item="${escapeHtml(item.id)}">Remove</button>
      </article>`).join("");

    updateSubscriptionPreferences(items);
  }

  function updateSubscriptionPreferences(items) {
    const fields = document.querySelector("[data-subscription-preferences]");
    if (!fields) return;
    fields.hidden = !items.some((item) => item.category === "Seasonal subscription");
  }

  function removeItem(id) {
    const items = loadList().filter((item) => item.id !== id);
    saveList(items);
    renderList();
  }

  function setupFilters() {
    const buttons = document.querySelectorAll("[data-filter]");
    if (!buttons.length) return;
    const groups = document.querySelectorAll("[data-collection-group]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));
        groups.forEach((group) => {
          group.hidden = filter !== "all" && group.dataset.collectionGroup !== filter;
        });
      });
    });
  }

  function setupEnquiryForm() {
    const form = document.querySelector("[data-enquiry-form]");
    const status = document.querySelector("[data-form-status]");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const count = loadList().length;
      status.className = "form-status is-success";
      status.innerHTML = `
        <strong>Prototype review complete.</strong><br>
        ${count ? `${count} selection${count === 1 ? "" : "s"} would be included in the enquiry.` : "No selections are currently included."}
        Nothing was transmitted. In production, the hosted form will deliver this privately to the atelier.
        <br><br><a href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Continue to optional fitting booking →</a>`;
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function setupNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.textContent = open ? "Menu" : "Close";
      nav.classList.toggle("is-open", !open);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-item]");
    if (addButton) addItem(addButton);

    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton) removeItem(removeButton.dataset.removeItem);
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  updateListCounts();
  syncAddButtons();
  renderList();
  setupFilters();
  setupEnquiryForm();
  setupNavigation();
})();
