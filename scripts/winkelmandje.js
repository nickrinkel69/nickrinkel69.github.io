/**
 * Shopping Cart functionality for Greenflag website
 */

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Add a product to the shopping cart
 * @param {Object} product - The product to add
 */
function addToCart(product) {
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id,
    );

    if (existingProductIndex !== -1) {
        // Product exists, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Product doesn't exist, add to cart with quantity 1
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    // Save cart to localStorage
    saveCart();

    // Update cart badge count
    updateCartBadge();

    // Show success message
    showToast(`${product.name} is toegevoegd aan je winkelmandje!`);
}

/**
 * Show a toast message
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'show');
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Greenflag</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toastElement);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toastElement.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toastElement);
        }, 300);
    }, 3000);
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update cart badge with current item count
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (!cartBadge) return;

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('d-none');
    } else {
        cartBadge.classList.add('d-none');
    }
}

/**
 * Remove an item from the cart
 * @param {number} productId - ID of the product to remove
 */
function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    displayCart();
    updateCartBadge();
}

/**
 * Change the quantity of a product in the cart
 * @param {number} productId - ID of the product
 * @param {number} newQuantity - New quantity (must be > 0)
 */
function updateQuantity(productId, newQuantity) {
    // Ensure quantity is valid
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;

    const productIndex = cart.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = newQuantity;
        saveCart();
        displayCart();
        updateCartBadge();
    }
}

/**
 * Calculate final price considering discount
 * @param {number} originalPrice - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} - Final price with discount applied
 */
function calculateFinalPrice(originalPrice, discount) {
    if (!discount || discount <= 0) return originalPrice;
    const discountAmount = originalPrice * (discount / 100);
    return Math.round((originalPrice - discountAmount) * 100) / 100;
}

/**
 * Display the cart contents in the UI
 */
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartContainer || !emptyCartMessage || !cartSummary) return;

    // Clear current cart display
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        // Show empty cart message
        emptyCartMessage.classList.remove('d-none');
        cartSummary.classList.add('d-none');
        return;
    }

    // Hide empty cart message and show summary
    emptyCartMessage.classList.add('d-none');
    cartSummary.classList.remove('d-none');

    // Calculate totals
    let subtotal = 0;
    let totalSavings = 0;

    // Add each item to the cart display
    cart.forEach((item) => {
        const originalPrice = item.prize * item.quantity;
        const finalPrice =
            item.discount > 0
                ? calculateFinalPrice(item.prize, item.discount) * item.quantity
                : originalPrice;

        subtotal += finalPrice;

        if (item.discount > 0) {
            totalSavings += originalPrice - finalPrice;
        }

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('card', 'mb-3', 'shadow-sm');

        cartItemElement.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <div class="bg-light text-center p-3 rounded">
                            <p class="m-0 text-secondary">Product</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text small mb-1">Maat: ${item.size}</p>
                        ${
                            item.discount > 0
                                ? `<p class="card-text text-danger small mb-1">Korting: ${item.discount}%</p>`
                                : ''
                        }
                    </div>
                    <div class="col-md-2 text-center text-md-start">
                        ${
                            item.discount > 0
                                ? `<p class="card-text mb-0"><span class="text-decoration-line-through text-secondary">€${item.prize.toFixed(
                                      2,
                                  )}</span></p>
                            <p class="card-text text-danger">€${calculateFinalPrice(
                                item.prize,
                                item.discount,
                            ).toFixed(2)}</p>`
                                : `<p class="card-text">€${item.prize.toFixed(
                                      2,
                                  )}</p>`
                        }
                    </div>
                    <div class="col-md-2">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" 
                                onclick="updateQuantity(${item.id}, ${
            item.quantity - 1
        })">-</button>
                            <input type="number" class="form-control text-center" value="${
                                item.quantity
                            }" min="1" 
                                onchange="updateQuantity(${
                                    item.id
                                }, this.value)">
                            <button class="btn btn-outline-secondary" type="button" 
                                onclick="updateQuantity(${item.id}, ${
            item.quantity + 1
        })">+</button>
                        </div>
                    </div>
                    <div class="col-md-1 text-end">
                        <p class="card-text fw-bold">€${finalPrice.toFixed(
                            2,
                        )}</p>
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${
                            item.id
                        })">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        cartContainer.appendChild(cartItemElement);
    });

    // Update summary totals
    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;

    const savingsElement = document.getElementById('total-savings');
    if (totalSavings > 0) {
        savingsElement.textContent = `€${totalSavings.toFixed(2)}`;
        document.getElementById('savings-row').classList.remove('d-none');
    } else {
        document.getElementById('savings-row').classList.add('d-none');
    }

    // Fixed shipping cost
    const shippingCost = subtotal >= 50 ? 0 : 4.95;
    document.getElementById('shipping-cost').textContent =
        shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`;

    // Calculate total
    const total = subtotal + shippingCost;
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

/**
 * Empty the entire cart
 */
function emptyCart() {
    if (confirm('Weet je zeker dat je je winkelmandje wilt leegmaken?')) {
        cart = [];
        saveCart();
        displayCart();
        updateCartBadge();
    }
}

/**
 * Finish the order (simple alert for demonstration)
 */
function finishOrder() {
    alert(
        'Bestelling geplaatst! Dit is een demonstratie, dus er wordt niets afgerekend.',
    );
    cart = [];
    saveCart();
    displayCart();
    updateCartBadge();
}

// Update products.js to use our addToCart function
// This function will be called when the page loads
function updateAddToCartButtons() {
    // Check if we're on the products page
    if (window.location.pathname.includes('products.html')) {
        // Replace the existing click handlers on add buttons
        const addButtons = document.querySelectorAll('.btn-success');
        addButtons.forEach((button) => {
            // Get the product data
            const productCard = button.closest('.card');
            if (!productCard) return;

            // Clear existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add new event listener
            newButton.addEventListener('click', function () {
                const nameElement = productCard.querySelector('.card-title');
                if (!nameElement) return;

                const stockElement = productCard.querySelector(
                    '.card-text:nth-of-type(1)',
                );
                const sizeElement = productCard.querySelector(
                    '.card-text:nth-of-type(2)',
                );

                let priceText = '';
                let price = 0;
                let discount = 0;

                // Extract price and discount information
                const priceElement = productCard.querySelector(
                    '.card-text:nth-of-type(3)',
                );
                if (priceElement) {
                    const discountElement = productCard.querySelector(
                        '.card-text:nth-of-type(4)',
                    );

                    if (
                        discountElement &&
                        discountElement.textContent.includes('Korting')
                    ) {
                        // Has discount
                        discount = parseInt(
                            discountElement.textContent.match(/\d+/)[0],
                        );

                        const originalPriceElement = priceElement.querySelector(
                            '.text-decoration-line-through',
                        );
                        if (originalPriceElement) {
                            price = parseFloat(
                                originalPriceElement.textContent.replace(
                                    '€',
                                    '',
                                ),
                            );
                        }
                    } else {
                        // No discount
                        price = parseFloat(
                            priceElement.textContent.replace('€', ''),
                        );
                    }
                }

                // Create a product object
                const product = {
                    id: Date.now(), // Use timestamp as unique ID for the demo
                    name: nameElement.textContent.trim(),
                    size: sizeElement
                        ? sizeElement.textContent.replace('Maat:', '').trim()
                        : '',
                    prize: price,
                    discount: discount,
                    stock: stockElement
                        ? parseInt(
                              stockElement.textContent
                                  .replace('Voorraad:', '')
                                  .trim(),
                          )
                        : 10,
                };

                // Add product to cart
                addToCart(product);
            });
        });
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart badge
    updateCartBadge();

    // Display cart if we're on the cart page
    if (window.location.pathname.includes('winkelmandje.html')) {
        displayCart();
    }

    // Update product add buttons if we're on the products page
    // Use a slight delay to ensure products are loaded
    setTimeout(updateAddToCartButtons, 500);
});

// Listen for changes from products.js
if (typeof window.addEventListener === 'function') {
    window.addEventListener('productsLoaded', updateAddToCartButtons);
}

/**
 * Add a product to the shopping cart and update stock
 * @param {Object} product - The product to add
 */
function addToCart(product) {
    // First, update the product stock in localStorage
    updateProductStock(product.id);

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id,
    );

    if (existingProductIndex !== -1) {
        // Product exists, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Product doesn't exist, add to cart with quantity 1
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    // Save cart to localStorage
    saveCart();

    // Update cart badge count
    updateCartBadge();

    // Show success message
    showToast(`${product.name} is toegevoegd aan je winkelmandje!`);
}

/**
 * Update product stock in localStorage when adding to cart
 * @param {number} productId - ID of the product to update
 */
function updateProductStock(productId) {
    // Get current product data from localStorage
    let productData = JSON.parse(localStorage.getItem('productData')) || [];

    // Find the product and decrease stock
    const productIndex = productData.findIndex((item) => item.id === productId);

    if (productIndex !== -1 && productData[productIndex].stock > 0) {
        // Decrease stock by 1
        productData[productIndex].stock -= 1;

        // Update localStorage with new stock value
        localStorage.setItem('productData', JSON.stringify(productData));

        // If we're on the products page, refresh the display
        if (window.location.pathname.includes('products.html')) {
            // Trigger product refresh (will be picked up by products.js)
            const event = new CustomEvent('productStockUpdated');
            window.dispatchEvent(event);
        }
    }
}
