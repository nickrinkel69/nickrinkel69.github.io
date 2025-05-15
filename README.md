# Greenflag Webshop

Een eenvoudige online kledingwinkel gebouwd met vanilla JavaScript.

## Belangrijkste functies

-   **Productweergave**: laat alle details over de producten zien zoals prijs, maat en voorraad
-   **Aanbiedingen**: een sectie voor producten met korting
-   **Winkelmandje**: Producten toevoegen/verwijderen, hoeveelheden aanpassen, kortingen bekijken
-   **Admin Paneel**: Producten toevoegen/verwijderen en winkelmandje resetten

## Bestanden

-   `admin.js`: Beheerdersfunctionaliteit
-   `index.js`: Homepage/aanbiedingen
-   `products.js`: Productpagina
-   `winkelmandje.js`: Winkelmandje functionaliteit
-   `products.json`: Initiële productdatabase

## Technische details

-   Data wordt opgeslagen in `localStorage` (productData en cart)
-   Producten worden initieel geladen uit products.json
-   Kortingen worden berekend met `calculateDiscountedPrice()`
-   Voorraad wordt bijgehouden wanneer producten worden toegevoegd

## Aan de slag

1. Open `index.html` in een webbrowser
2. Navigeer naar andere pagina's via het menu:
    - `products.html` voor alle producten
    - `winkelmandje.html` voor het winkelmandje
    - `admin.html` voor beheerderfunctionaliteit
