async function getProductData() {
    let data = localStorage.getItem('productData');

    if (data) {
        data = JSON.parse(data);
    } else {
        const APIurl = './products.json';
        try {
            const response = await fetch(APIurl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJSON = await response.json();
            data = responseJSON;
            localStorage.setItem('productData', JSON.stringify(responseJSON));
        } catch (error) {
            console.error('Error fetching product data:', error);
            alert('Error loading products: ' + error.message);
            data = [];
        }
    }

    return data;
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
    const discountAmount = originalPrice * (discountPercentage / 100);
    const discountedPrice = originalPrice - discountAmount;
    return Math.round(discountedPrice * 100) / 100;
}

function printProductData(data) {
    const productListElement = document.getElementById('productList');

    // Clear any existing products first
    productListElement.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        // Add unique ID for cart functionality
        if (!data[i].id) {
            data[i].id = i + 1;
        }

        // Create the main card container
        const divElement = document.createElement('div');
        divElement.classList.add('card', 'shadow-sm', 'd-flex', 'flex-column');
        divElement.style.width = '15rem';

        // Add discount badge if needed
        if (data[i].discount > 0) {
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
            discountBadge.innerText = `-${data[i].discount}%`;
            divElement.appendChild(discountBadge);
        }

        // Create placeholder for the image
        const imgPlaceholder = document.createElement('div');
        imgPlaceholder.classList.add(
            'product-image-placeholder',
            'bg-light',
            'd-flex',
            'align-items-center',
            'justify-content-center',
        );
        imgPlaceholder.style.height = '180px';

        function createImage(imageURL, altText) {
            const img = document.createElement('img');
            img.src = `images/${imageURL}`;
            img.alt = altText;
            img.classList.add('card-img-top');
            img.style.objectFit = 'cover';
            img.style.height = '180px';
            img.style.width = '100%';
            return img;
        }

        // Create image element
        const productImage = createImage(data[i].imageURL, data[i].name);

        // Voeg de image toe aan het imgPlaceholder element
        imgPlaceholder.appendChild(productImage);

        // Create card body for product details
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'flex-grow-1');

        // Product name from JSON
        const nameElement = document.createElement('h5');
        nameElement.classList.add('card-title', 'mb-2', 'fs-4');
        nameElement.innerText = data[i].name;
        cardBody.appendChild(nameElement);

        // Stock information from JSON
        const stockElement = document.createElement('p');
        stockElement.classList.add(
            'card-text',
            'text-success',
            'mb-2',
            'small',
        );
        stockElement.innerHTML = `<strong>Voorraad:</strong> ${data[i].stock}`;
        cardBody.appendChild(stockElement);

        // Size information from JSON
        const sizeElement = document.createElement('p');
        sizeElement.classList.add('card-text', 'mb-2', 'small');
        sizeElement.innerHTML = `<strong>Maat:</strong> ${data[i].size}`;
        cardBody.appendChild(sizeElement);

        // Price information from JSON
        const priceElement = document.createElement('p');
        priceElement.classList.add('card-text', 'mb-2', 'fw-bold');

        if (data[i].discount > 0) {
            // Calculate the discounted price
            const discountedPrice = calculateDiscountedPrice(
                data[i].prize,
                data[i].discount,
            );

            // Create the original price with a stripe through it
            const originalPriceSpan = document.createElement('span');
            originalPriceSpan.classList.add(
                'text-decoration-line-through',
                'text-secondary',
                'me-2',
            );
            originalPriceSpan.innerText = `€${data[i].prize.toFixed(2)}`;

            // Create the discounted price
            const discountedPriceSpan = document.createElement('span');
            discountedPriceSpan.classList.add('text-danger');
            discountedPriceSpan.innerText = `€${discountedPrice.toFixed(2)}`;

            // Assemble the price element
            priceElement.appendChild(originalPriceSpan);
            priceElement.appendChild(discountedPriceSpan);
        } else {
            // Regular price without discount
            priceElement.innerText = `€${data[i].prize.toFixed(2)}`;
        }

        cardBody.appendChild(priceElement);

        // Discount information if discount is more than 0
        if (data[i].discount > 0) {
            const discountElement = document.createElement('p');
            discountElement.classList.add(
                'card-text',
                'text-danger',
                'mb-2',
                'small',
            );
            discountElement.innerHTML = `<strong>Korting:</strong> ${data[i].discount}%`;
            cardBody.appendChild(discountElement);
        }

        // Create separate div for button that will be at the bottom
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('card-footer', 'border-top');

        // Add button
        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-success', 'w-100');
        addButton.innerText = 'Toevoegen';
        addButton.dataset.productId = data[i].id;

        // Add click handler to button - now uses the winkelmandje.js functionality
        addButton.addEventListener('click', function () {
            // Check if winkelmandje.js is loaded and addToCart function exists
            if (typeof addToCart === 'function') {
                addToCart(data[i]);
            } else {
                // Fallback if winkelmandje.js is not loaded
                const currentPrice =
                    data[i].discount > 0
                        ? calculateDiscountedPrice(
                              data[i].prize,
                              data[i].discount,
                          )
                        : data[i].prize;

                alert(
                    `Product '${
                        data[i].name
                    }' toegevoegd aan winkelmandje! Prijs: €${currentPrice.toFixed(
                        2,
                    )}`,
                );
            }
        });

        buttonContainer.appendChild(addButton);

        // Assemble the card
        divElement.appendChild(imgPlaceholder);
        divElement.appendChild(cardBody);
        divElement.appendChild(buttonContainer);

        // Add completed card to the product list
        productListElement.appendChild(divElement);
    }

    // Trigger an event to notify winkelmandje.js that products are loaded
    const event = new CustomEvent('productsLoaded');
    window.dispatchEvent(event);
}

// Load and display products
getProductData()
    .then((data) => {
        printProductData(data);
    })
    .catch((error) => {
        console.error('Failed to load products:', error);
    });

// Add script to load winkelmandje.js if it's not already loaded
function loadWinkelmandjeScript() {
    if (typeof addToCart !== 'function') {
        const script = document.createElement('script');
        script.src = 'scripts/winkelmandje.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

// Load the shopping cart script
document.addEventListener('DOMContentLoaded', loadWinkelmandjeScript);
