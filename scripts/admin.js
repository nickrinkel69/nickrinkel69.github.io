/**
 * Admin functionality for Greenflag website
 */

function getProductData() {
    let data = localStorage.getItem('productData');

    if (data) {
        return JSON.parse(data);
    }

    return [];
}

function saveProductData(data) {
    localStorage.setItem('productData', JSON.stringify(data));
}

function resetCart() {
    localStorage.removeItem('cart');

    // Update UI
    const alertElement = document.getElementById('alertReset');
    alertElement.textContent = 'Winkelmandje is gereset!';
    alertElement.classList.remove('d-none');

    // Update cart badge
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    // Hide alert after 3 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 3000);

    showToast('Winkelmandje is gereset!');
}

function addProduct(event) {
    event.preventDefault();

    // Get form values
    const productName = document.getElementById('addProductName').value.trim();
    const productPrice = parseFloat(
        document.getElementById('addProductPrice').value,
    );
    const productStock = parseInt(
        document.getElementById('addProductStock').value,
    );
    const productSize = document.getElementById('addProductSize').value.trim();
    const productDiscount =
        parseInt(document.getElementById('addProductDiscount').value) || 0;

    // Validate inputs
    if (
        !productName ||
        isNaN(productPrice) ||
        isNaN(productStock) ||
        !productSize
    ) {
        showToast('Vul alle verplichte velden in', 'danger');
        return;
    }

    // Get existing products
    const products = getProductData();

    // Generate new ID
    const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    // Create new product object
    const newProduct = {
        id: newId,
        name: productName,
        prize: productPrice,
        stock: productStock,
        size: productSize,
        discount: productDiscount,
    };

    // Add to products array
    products.push(newProduct);

    // Save updated products
    saveProductData(products);

    // Update UI
    document.getElementById('addProductForm').reset();
    const alertElement = document.getElementById('alertAdd');
    alertElement.textContent = `Product "${productName}" is toegevoegd!`;
    alertElement.classList.remove('d-none');

    // Hide alert after 3 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 3000);

    // Update product selector
    updateProductSelector();

    showToast(`Product "${productName}" is toegevoegd!`);
}

function removeProduct() {
    const selectElement = document.getElementById('productSelector');
    const productId = parseInt(selectElement.value);

    if (!productId) {
        showToast('Selecteer een product om te verwijderen', 'danger');
        return;
    }

    // Get products
    const products = getProductData();

    // Find product
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        showToast('Product niet gevonden', 'danger');
        return;
    }

    // Store product name for notification
    const productName = products[productIndex].name;

    // Remove product
    products.splice(productIndex, 1);

    // Save updated products
    saveProductData(products);

    // Update UI
    selectElement.value = '';
    const alertElement = document.getElementById('alertRemove');
    alertElement.textContent = `Product "${productName}" is verwijderd!`;
    alertElement.classList.remove('d-none');

    // Hide alert after 3 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 3000);

    // Update product selector
    updateProductSelector();

    showToast(`Product "${productName}" is verwijderd!`);
}

function updateProductSelector() {
    const selectElement = document.getElementById('productSelector');

    if (!selectElement) return;

    // Clear current options except first one
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }

    // Get products
    const products = getProductData();

    // Add product options
    products.forEach((product) => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - €${product.prize.toFixed(
            2,
        )} - Maat: ${product.size}`;
        selectElement.appendChild(option);
    });
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'show');
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Greenflag</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body ${type === 'danger' ? 'text-danger' : ''}">
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

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Update product selector
    updateProductSelector();

    // Add event listeners
    const resetCartButton = document.getElementById('resetCartButton');
    if (resetCartButton) {
        resetCartButton.addEventListener('click', resetCart);
    }

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addProduct);
    }

    const removeProductButton = document.getElementById('removeProductButton');
    if (removeProductButton) {
        removeProductButton.addEventListener('click', removeProduct);
    }

    // Update cart badge
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
});
