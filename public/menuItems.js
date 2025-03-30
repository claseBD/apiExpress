document.addEventListener("DOMContentLoaded", function () {
  const showFormBtn = document.getElementById("show-form-btn");
  const cancelFormBtn = document.getElementById("cancel-form-btn");
  const addForm = document.getElementById("add-form");
  const menuItemForm = document.getElementById("menu-item-form");
  const container = document.getElementById("menu-items-container");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const itemIdInput = document.getElementById("item-id") || { value: "" };
  const itemNameInput = document.getElementById("item-name");
  const itemDescInput = document.getElementById("item-description");
  const itemPriceInput = document.getElementById("item-price");

  if (
    !formTitle ||
    !submitBtn ||
    !itemNameInput ||
    !itemDescInput ||
    !itemPriceInput
  ) {
    console.error("Critical form elements missing!");
    return;
  }

  let isEditing = false;
  let currentEditId = null;

  // Event Listeners
  showFormBtn.addEventListener("click", toggleFormVisibility);
  cancelFormBtn.addEventListener("click", resetForm);
  menuItemForm.addEventListener("submit", handleFormSubmit);
  container.addEventListener("click", handleContainerClick);

  // Functions
  function toggleFormVisibility() {
    addForm.classList.toggle("d-none");
    showFormBtn.classList.toggle("btn-primary");
    showFormBtn.classList.toggle("btn-outline-primary");
    showFormBtn.innerHTML = addForm.classList.contains("d-none")
      ? '<i class="fas fa-plus me-2"></i>Add New Menu Item'
      : '<i class="fas fa-minus me-2"></i>Hide Form';
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const name = itemNameInput.value;
    const description = itemDescInput.value;
    const price = parseFloat(itemPriceInput.value).toFixed(2);

    if (isEditing && currentEditId) {
      updateMenuItem(currentEditId, { name, description, price });
    } else {
      createMenuItem({ name, description, price });
    }
  }

  function handleContainerClick(e) {
    // Delete button
    if (
      e.target.classList.contains("delete-btn") ||
      e.target.closest(".delete-btn")
    ) {
      const button = e.target.classList.contains("delete-btn")
        ? e.target
        : e.target.closest(".delete-btn");
      const itemDiv = button.closest(".col-md-6");
      const id = button.dataset.id;

      if (confirm("Are you sure you want to delete this item?")) {
        deleteMenuItem(id, itemDiv);
      }
    }

    // Edit button
    if (
      e.target.classList.contains("edit-btn") ||
      e.target.closest(".edit-btn")
    ) {
      const button = e.target.classList.contains("edit-btn")
        ? e.target
        : e.target.closest(".edit-btn");
      const itemDiv = button.closest(".col-md-6");
      const card = button.closest(".card");

      setupEditForm(
        button.dataset.id,
        card.querySelector(".card-title").textContent,
        card.querySelector(".card-text").textContent,
        card.querySelector(".badge").textContent.replace("$", ""),
      );
    }
  }

  // API Functions
  async function createMenuItem(itemData) {
    try {
      const response = await fetch("http://localhost:3000/menuItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newItem = await response.json();

      // Remove empty state if it exists
      const emptyState = container.querySelector(".empty-state");
      if (emptyState) emptyState.parentElement.remove();

      // Create and append new item
      container.prepend(createMenuItemCard(newItem));
      resetForm();

      return newItem;
    } catch (error) {
      console.error("Error creating menu item:", error);
      alert("Failed to create menu item. Please try again.");
      throw error;
    }
  }

  async function updateMenuItem(id, itemData) {
    try {
      const response = await fetch(`http://localhost:3000/menuItems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedItem = await response.json();

      const itemDiv = container.querySelector(`[data-id="${id}"]`);
      if (itemDiv) {
        itemDiv.querySelector(".card-title").textContent = updatedItem.name;
        itemDiv.querySelector(".card-text").textContent =
          updatedItem.description;
        itemDiv.querySelector(".badge").textContent = `$${updatedItem.price}`;
      }
      resetForm();
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item. Please try again.");
    }
  }

  async function deleteMenuItem(id, element) {
    try {
      const response = await fetch(`http://localhost:3000/menuItems/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        element.remove();
        checkEmptyState();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    }
  }

  // Helper Functions
  function createMenuItemCard(item) {
    const div = document.createElement("div");
    div.className = "col-md-6 col-lg-4";
    div.dataset.id = item._id || item.id;
    div.innerHTML = `
      <div class="card menu-card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h3 class="card-title h5 mb-3">${item.name}</h3>
            <span class="badge price-badge rounded-pill">$${item.price}</span>
          </div>
          <p class="card-text text-muted">${item.description}</p>
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${item._id || item.id}">
              <i class="fas fa-edit me-1"></i>Edit
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item._id || item.id}">
              <i class="fas fa-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>
    `;
    return div;
  }

  function setupEditForm(id, name, description, price) {
    try {
      isEditing = true;
      currentEditId = id;

      // Update form UI
      formTitle.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit Item';
      submitBtn.innerHTML = '<i class="fas fa-save me-1"></i>Update Item';

      // Set form values
      if (itemIdInput) itemIdInput.value = id;
      itemNameInput.value = name;
      itemDescInput.value = description;
      itemPriceInput.value = price;

      // Show form if hidden
      if (addForm.classList.contains("d-none")) {
        toggleFormVisibility();
      }
    } catch (error) {
      console.error("Error in setupEditForm:", error);
      alert("Failed to setup edit form. Please try again.");
    }
  }

  function checkEmptyState() {
    if (container.children.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="empty-state">
            <i class="fas fa-utensils fa-4x mb-3"></i>
            <h3 class="h4">No Menu Items Found</h3>
            <p class="text-muted">Click the "Add Menu Item" button to get started</p>
          </div>
        </div>
      `;
    }
  }

  function resetForm() {
    try {
      isEditing = false;
      currentEditId = null;

      // Reset form values
      if (itemIdInput) itemIdInput.value = "";
      menuItemForm.reset();

      // Reset UI
      formTitle.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Add Item';
      submitBtn.innerHTML = '<i class="fas fa-save me-1"></i>Save Item';
      addForm.classList.add("d-none");

      // Reset button state
      showFormBtn.classList.remove("btn-outline-primary");
      showFormBtn.classList.add("btn-primary");
      showFormBtn.innerHTML =
        '<i class="fas fa-plus me-2"></i>Add New Menu Item';
    } catch (error) {
      console.error("Error resetting form:", error);
    }
  }
});
