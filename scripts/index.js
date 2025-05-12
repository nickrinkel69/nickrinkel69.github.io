/**
 * Homepage functionality for Greenflag website
 * This script loads and displays discounted products on the homepage
 */

/**
 * Gets product data from localStorage or initializes from JSON
 * @returns {Promise<Array>} Product data
 */
async function getProductData() {
    let data = localStorage.getItem('productData');

    if (data) {
        // If data is already in localStorage
        return JSON.parse(data);
    } else {
        // If data is not in localStorage, fetch from JSON
        const APIurl = './products.json';
        try {
            const response = await fetch(APIurl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJSON = await response.json();
            localStorage.setItem('productData', JSON.stringify(responseJSON));
            console.debug('Data retrieved from JSON and saved to localStorage');
            return responseJSON;
        } catch (error) {
            console.error('Error fetching product data:', error);
            return [];
        }
    }
}

/**
 * Calculate the discounted price
 * @param {number} originalPrice - The original price
 * @param {number} discountPercentage - The discount percentage
 * @returns {number} - The discounted price rounded to 2 decimal places
 */
function calculateDiscountedPrice(originalPrice, discountPercentage) {
    const discountAmount = originalPrice * (discountPercentage / 100);
    const discountedPrice = originalPrice - discountAmount;
    return Math.round(discountedPrice * 100) / 100;
}

/**
 * Gets the appropriate image for a product based on its ID
 * @param {Object} product - The product object
 * @returns {HTMLImageElement} - Image element with proper source
 */
function createProductImage(product) {
    const img = document.createElement('img');
    img.classList.add('card-img-top', 'product-image');
    img.alt = product.name;

    // Map product names to the actual image paths
    const imageMap = {
        'Galaxy Wolf Hoodie': 'images/galaxy-wolf-hoodie.jpg',
        'Rode Pet': 'images/rode-pet.jpg',
        'Gele Sweater': 'images/gele-sweater.jpg',
        'Groen T-shirt': 'images/groen-shirt.jpg',
        'Underarmor T-shirt': 'images/underarmor.jpg',
        'Greenflag Sweatpants': 'images/greenflag-sweatpants.jpg',
        'Greenflag Hoodie': 'images/greenflag-hoodie.jpg',
        'Greenflag T-shirt': 'images/greenflag-shirt.jpg',
    };

    // Set proper image path if available, or use a fallback
    if (imageMap[product.name]) {
        img.src = imageMap[product.name];
    } else {
        // Use a gray placeholder if image not found
        img.src = 'images/placeholder.jpg';
    }

    img.style.height = '180px';
    img.style.objectFit = 'cover';

    return img;
}

/**
 * Display discounted products on the homepage
 */
async function displayDiscountedProducts() {
    // Get the container element
    const dealsSection = document.getElementById('deals');

    if (!dealsSection) {
        console.error('Deals section not found in the DOM');
        return;
    }

    // Clear the current content
    dealsSection.innerHTML = '';

    try {
        // Get product data
        const products = await getProductData();

        // Filter for products with discount > 0
        const discountedProducts = products.filter(
            (product) => product.discount > 0,
        );

        if (discountedProducts.length === 0) {
            // No discounted products found
            const noDealsMessage = document.createElement('h2');
            noDealsMessage.classList.add(
                'section-title',
                'text-center',
                'w-100',
            );
            noDealsMessage.textContent =
                'Geen aanbiedingen momenteel beschikbaar';
            dealsSection.appendChild(noDealsMessage);
            return;
        }

        // Create a title for the deals section
        const sectionTitle = document.createElement('h2');
        sectionTitle.classList.add(
            'section-title',
            'text-center',
            'w-100',
            'mb-4',
        );
        sectionTitle.textContent = 'Aanbiedingen';
        dealsSection.appendChild(sectionTitle);

        // Create container for the deals cards
        const productsContainer = document.createElement('div');
        productsContainer.classList.add(
            'd-flex',
            'flex-wrap',
            'justify-content-center',
            'gap-4',
            'w-100',
        );
        dealsSection.appendChild(productsContainer);

        // Loop through each discounted product and create a card
        discountedProducts.forEach((product) => {
            // Create the main card container
            const card = document.createElement('div');
            card.classList.add('card', 'shadow-sm', 'd-flex', 'flex-column');
            card.style.width = '15rem';

            // Add discount badge
            const discountBadge = document.createElement('div');
            discountBadge.classList.add(
                'position-absolute',
                'bg-danger',
                'text-white',
                'fw-bold',
                'rounded',
            );
            discountBadge.style.top = '10px';
            discountBadge.style.right = '10px';
            discountBadge.style.padding = '5px 10px';
            discountBadge.style.zIndex = '1';
            discountBadge.innerText = `-${product.discount}%`;
            card.appendChild(discountBadge);

            // Add product image instead of placeholder
            const productImage = createProductImage(product);
            card.appendChild(productImage);

            // Create card body for product details
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'flex-grow-1');

            // Product name
            const nameElement = document.createElement('h5');
            nameElement.classList.add('card-title', 'mb-2', 'fs-4');
            nameElement.innerText = product.name;
            cardBody.appendChild(nameElement);

            // Stock information
            const stockElement = document.createElement('p');
            stockElement.classList.add(
                'card-text',
                'text-success',
                'mb-2',
                'small',
            );
            stockElement.innerHTML = `<strong>Voorraad:</strong> ${product.stock}`;
            cardBody.appendChild(stockElement);

            // Size information
            const sizeElement = document.createElement('p');
            sizeElement.classList.add('card-text', 'mb-2', 'small');
            sizeElement.innerHTML = `<strong>Maat:</strong> ${product.size}`;
            cardBody.appendChild(sizeElement);

            // Price information with discount
            const priceElement = document.createElement('p');
            priceElement.classList.add('card-text', 'mb-2', 'fw-bold');

            // Calculate the discounted price
            const discountedPrice = calculateDiscountedPrice(
                product.prize,
                product.discount,
            );

            // Create the original price with a stripe through it
            const originalPriceSpan = document.createElement('span');
            originalPriceSpan.classList.add(
                'text-decoration-line-through',
                'text-secondary',
                'me-2',
            );
            originalPriceSpan.innerText = `€${product.prize.toFixed(2)}`;

            // Create the discounted price
            const discountedPriceSpan = document.createElement('span');
            discountedPriceSpan.classList.add('text-danger');
            discountedPriceSpan.innerText = `€${discountedPrice.toFixed(2)}`;

            // Assemble the price element
            priceElement.appendChild(originalPriceSpan);
            priceElement.appendChild(discountedPriceSpan);
            cardBody.appendChild(priceElement);

            // Discount percentage
            const discountElement = document.createElement('p');
            discountElement.classList.add(
                'card-text',
                'text-danger',
                'mb-2',
                'small',
            );
            discountElement.innerHTML = `<strong>Korting:</strong> ${product.discount}%`;
            cardBody.appendChild(discountElement);

            card.appendChild(cardBody);

            // Create separate div for button
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('card-footer', 'border-top');

            // Add button
            const addButton = document.createElement('button');
            addButton.classList.add('btn', 'btn-success', 'w-100');
            addButton.innerText = 'Toevoegen';
            addButton.dataset.productId = product.id;

            // Add click handler to button
            addButton.addEventListener('click', function () {
                // Check if winkelmandje.js is loaded and addToCart function exists
                if (typeof addToCart === 'function') {
                    addToCart(product);
                } else {
                    // Fallback if winkelmandje.js is not loaded
                    alert(
                        `Product '${
                            product.name
                        }' toegevoegd aan winkelmandje! Prijs: €${discountedPrice.toFixed(
                            2,
                        )}`,
                    );
                }
            });

            buttonContainer.appendChild(addButton);
            card.appendChild(buttonContainer);

            // Add the card to the container
            productsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error displaying discounted products:', error);
        dealsSection.innerHTML =
            '<h2 class="section-title text-center">Er is iets mis gegaan met het laden van aanbiedingen, herlaad de pagina en probeer opnieuw!</h2>';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    displayDiscountedProducts();

    // Update cart badge if winkelmandje.js is loaded
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
});
