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

    if (
      e.target.classList.contains("add-to-cart-btn") ||
      e.target.closest(".add-to-cart-btn")
    ) {
      const button = e.target.classList.contains("add-to-cart-btn")
        ? e.target
        : e.target.closest(".add-to-cart-btn");
      const itemId = button.dataset.id;
      const itemCard = button.closest(".card");

      const item = {
        id: itemId,
        name: itemCard.querySelector(".card-title").textContent,
        price: parseFloat(
          itemCard.querySelector(".badge").textContent.replace("$", ""),
        ),
        quantity: 1,
      };

      addToCart(item);
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

  let cart = [];
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(item);
    }

    updateCartUI();
    showToast(`${item.name} added to cart!`);
  }

  function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "inline-block" : "none";

    // Update cart items list
    if (cart.length === 0) {
      cartItems.innerHTML =
        '<div class="text-center py-3 text-muted">Your cart is empty</div>';
      cartTotal.textContent = "$0.00";
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    let html = "";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      html += `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">$${item.price.toFixed(2)} × ${item.quantity}</small>
          </div>
          <div class="d-flex align-items-center">
            <span class="me-2">$${itemTotal.toFixed(2)}</span>
            <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.currentTarget.dataset.id;
        removeFromCart(itemId);
      });
    });
  }

  function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    updateCartUI();
    showToast("Item removed from cart");
  }

  function showToast(message) {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = "position-fixed bottom-0 end-0 p-3";
    toast.style.zIndex = "1100";
    toast.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    // Here you would typically send the cart to your server
    console.log("Checking out:", cart);
    alert(
      `Order placed! Total: $${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`,
    );

    // Clear cart after checkout
    cart = [];
    updateCartUI();
  });
});
