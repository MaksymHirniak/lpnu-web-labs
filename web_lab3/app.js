document.addEventListener("DOMContentLoaded", () => {
  const defaultData = [
    {
      id: 1,
      name: 'Ноутбук "Pro"',
      description: "Потужний ноутбук для професіоналів.",
      price: 45000,
    },
    {
      id: 2,
      name: "Механічна клавіатура",
      description: "Клавіатура з підсвіткою.",
      price: 3200,
    },
    {
      id: 3,
      name: "Бездротова миша",
      description: "Ергономічна миша для роботи.",
      price: 1500,
    },
    {
      id: 4,
      name: "4K Монітор",
      description: "Яскравий дисплей з високою роздільною здатністю.",
      price: 12000,
    },
    {
      id: 5,
      name: "Веб-камера HD",
      description: "Для відеоконференцій.",
      price: 2100,
    },
    {
      id: 6,
      name: 'Ноутбук "Air"',
      description: "Легкий та тонкий.",
      price: 31000,
    },
  ];

  const itemList = document.getElementById("item-list");
  const searchInput = document.getElementById("search-input");
  const sortAscBtn = document.getElementById("sort-asc");
  const sortDescBtn = document.getElementById("sort-desc");
  const totalSumEl = document.getElementById("total-sum");

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str.replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[ch])
    );
  }

  function renderItems(items) {
    if (!itemList) return;
    itemList.innerHTML = "";
    if (!items || items.length === 0) {
      itemList.innerHTML =
        '<p style="text-align:center;">Нічого не знайдено.</p>';
      return;
    }
    const itemCards = items
      .map(
        (item) => `
      <div class="item-card" data-id="${item.id}">
        <h4>${escapeHtml(item.name)}</h4>
        <p class="description">${escapeHtml(item.description)}</p>
        <p class="price">${Number(item.price).toLocaleString()} грн</p>
        <div class="card-actions">
          <button class="edit-btn" data-id="${item.id}">Редагувати</button>
        </div>
      </div>
    `
      )
      .join("");
    itemList.innerHTML = itemCards;
  }

  function calculateTotal(items) {
    if (!totalSumEl) return;
    const total = (items || []).reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    );
    totalSumEl.textContent = total.toLocaleString();
  }

  function loadData() {
    try {
      const raw = localStorage.getItem("products");
      if (!raw) return defaultData.slice();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0)
        return defaultData.slice();
      return parsed;
    } catch (e) {
      return defaultData.slice();
    }
  }

  function saveData(list) {
    try {
      localStorage.setItem("products", JSON.stringify(list));
    } catch (e) {}
  }

  let list = loadData();
  
  renderItems(list);
  calculateTotal(list);

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const searchTerm = String(event.target.value || "").toLowerCase();
      const filtered = list.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      renderItems(filtered);
      calculateTotal(filtered);
    });
  }

  if (sortAscBtn) {
    sortAscBtn.addEventListener("click", () => {
      const sorted = [...list].sort((a, b) => a.price - b.price);
      renderItems(sorted);
      calculateTotal(sorted);
    });
  }

  if (sortDescBtn) {
    sortDescBtn.addEventListener("click", () => {
      const sorted = [...list].sort((a, b) => b.price - a.price);
      renderItems(sorted);
      calculateTotal(sorted);
    });
  }

  // Modal/add/edit functionality
  const addBtn = document.getElementById("add-item");
  const modal = document.getElementById("modal");
  const modalCancel = document.getElementById("modal-cancel");
  const form = document.getElementById("item-form");
  const idInput = document.getElementById("item-id");
  const nameInput = document.getElementById("item-name");
  const descInput = document.getElementById("item-desc");
  const priceInput = document.getElementById("item-price");
  const formError = document.getElementById("form-error");

  function openModal(mode, item) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (mode === "edit" && item) {
      idInput.value = item.id;
      nameInput.value = item.name;
      descInput.value = item.description;
      priceInput.value = item.price;
      document.getElementById("modal-title").textContent = "Редагувати товар";
    } else {
      idInput.value = "";
      nameInput.value = "";
      descInput.value = "";
      priceInput.value = "";
      document.getElementById("modal-title").textContent = "Додати товар";
    }
    if (formError) formError.textContent = "";
    nameInput && nameInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  if (addBtn) addBtn.addEventListener("click", () => openModal("create"));
  if (modalCancel) modalCancel.addEventListener("click", closeModal);

  // delegate edit button clicks
  if (itemList) {
    itemList.addEventListener("click", (e) => {
      const btn = e.target.closest(".edit-btn");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const item = list.find((i) => i.id === id);
      if (item) openModal("edit", item);
    });
  }

  // sanitize digits for price input
  if (priceInput) {
    priceInput.addEventListener("input", (e) => {
      const v = String(e.target.value || "");
      const cleaned = v.replace(/[^0-9]/g, "");
      if (cleaned !== v) e.target.value = cleaned;
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = String(nameInput.value || "").trim();
      const desc = String(descInput.value || "").trim();
      const price = Number(priceInput.value);
      if (!name) {
        if (formError) formError.textContent = "Введіть назву.";
        nameInput.focus();
        return;
      }
      if (!desc) {
        if (formError) formError.textContent = "Введіть опис.";
        descInput.focus();
        return;
      }
      if (isNaN(price) || price < 0) {
        if (formError) formError.textContent = "Введіть коректну ціну.";
        priceInput.focus();
        return;
      }

      const idVal = idInput.value ? Number(idInput.value) : null;
      if (idVal) {
        const idx = list.findIndex((i) => i.id === idVal);
        if (idx >= 0) {
          list[idx].name = name;
          list[idx].description = desc;
          list[idx].price = price;
        }
      } else {
        const newId = list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1;
        list.push({ id: newId, name, description: desc, price });
      }
      saveData(list);
      renderItems(list);
      calculateTotal(list);
      closeModal();
    });
  }
});
