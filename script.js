
// ShopZone JavaScript

let products = [];
let cart = [];
let selectedCategory = "All";

// DOM Elements
const productContainer = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartOverlay = document.getElementById("cartOverlay");
const searchInput = document.getElementById("searchInput");
const noProducts = document.getElementById("noProducts");

// Format prices
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Fetch Products from JSON
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();
        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML =
            "<p>Unable to load products. Please run the project using Live Server.</p>";

        console.error(error);
    }
}

// Display Products
function displayProducts(items) {
    productContainer.innerHTML = "";

    noProducts.hidden = items.length !== 0;

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating";
        rating.textContent =
            "★".repeat(Math.floor(product.rating)) +
            "☆".repeat(5 - Math.floor(product.rating)) +
            " (" + product.rating + "/5)";

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, addButton);
        info.append(category, name, rating, bottom);
        card.append(imageBox, info);

        productContainer.appendChild(card);
    });
}

// Search Products
function searchProducts() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

document.getElementById("searchBtn").addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);

// Category Filtering
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelector(".category-btn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        searchProducts();
    });
});

// Add Product to Cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(p => p.id === productId);

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    alert("Product added to cart successfully!");
}

// Increase Quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease Quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity--;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove Product
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update Cart
function updateCart() {

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';
        return;
    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price * item.quantity);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.addEventListener("click", () => {
            decreaseQuantity(item.id);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () => {
            increaseQuantity(item.id);
        });

        controls.append(minus, quantity, plus);
        details.append(name, price, controls);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItem.append(image, details, remove);
        cartItems.appendChild(cartItem);
    });
}

// Open Cart
document.getElementById("cartBtn").addEventListener("click", () => {
    cartOverlay.classList.add("show");
});

// Close Cart
document.getElementById("closeCart").addEventListener("click", () => {
    cartOverlay.classList.remove("show");
});

// Close cart when clicking outside
cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("show");
    }
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "Thank you for shopping at ShopZone!\n" +
        "Your total amount is " + formatPrice(total) +
        "\nThis is a demo checkout."
    );

    cart = [];
    updateCart();
    cartOverlay.classList.remove("show");
});

// Mobile Navigation
document.getElementById("menuBtn").addEventListener("click", () => {
    document.querySelector(".navbar nav").classList.toggle("open");
});

// Close mobile menu after navigation
document.querySelectorAll(".navbar nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".navbar nav").classList.remove("open");
    });
});

// Newsletter
document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    alert("Thank you for subscribing to ShopZone!");

    event.target.reset();
});

// Load products when page starts
loadProducts();
