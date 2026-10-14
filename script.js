
const products = [
    {
        id: 1,
        name: "Chocolate Truffle Cake",
        category: "cakes",
        price: 650,
        description: "Rich chocolate layers with ganache.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Red Velvet Cake",
        category: "cakes",
        price: 600,
        description: "Classic, soft and elegant.",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Vanilla Cupcakes",
        category: "pastries",
        price: 250,
        description: "Soft cupcakes with creamy frosting.",
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Blueberry Cheesecake",
        category: "cakes",
        price: 550,
        description: "Creamy cheesecake with berries.",
        image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Butter Croissants",
        category: "pastries",
        price: 90,
        description: "Flaky, buttery and fresh.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Choco Chip Cookies",
        category: "cookies",
        price: 120,
        description: "Crunchy outside, soft inside.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Garlic Bread",
        category: "breads",
        price: 150,
        description: "Freshly baked with herbs.",
        image: "https://images.unsplash.com/photo-1619531040576-f9416740661b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Iced Coffee",
        category: "drinks",
        price: 120,
        description: "Chilled and refreshing.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
    }
];

let selectedCategory = "all";
let cart = [];
let favorites = [];

function renderProducts() {
    let search = document.getElementById("searchBox").value.toLowerCase();
    let sort = document.getElementById("sortBox").value;

    let filtered = products.filter(function(product) {
        return (selectedCategory === "all" ||
                product.category === selectedCategory) &&
               product.name.toLowerCase().includes(search);
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    let grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    document.getElementById("emptyMessage").classList.toggle(
        "d-none", filtered.length !== 0
    );

    filtered.forEach(function(product) {
        let isFavorite = favorites.includes(product.id);

        grid.innerHTML += `
            <div class="col-6 col-md-6 col-xl-3">
                <div class="product-card">
                    <div class="product-image-wrap">
                        <img src="${product.image}"
                             class="product-image"
                             alt="${product.name}"
                             loading="lazy">
                        <button class="favorite ${isFavorite ? "active" : ""}"
                            onclick="toggleFavorite(${product.id})"
                            aria-label="Toggle favourite">
                            ${isFavorite ? "♥" : "♡"}
                        </button>
                    </div>

                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center gap-2">
                            <span class="product-price">₹${product.price}</span>
                            <button class="add-button"
                                onclick="addToCart(${product.id})">
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterCakes(category, button) {
    selectedCategory = category;

    document.querySelectorAll(".category").forEach(function(item) {
        item.classList.remove("active");
    });

    button.classList.add("active");
    renderProducts();
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(function(item) {
            return item !== id;
        });
        showToast("Removed from favourites");
    } else {
        favorites.push(id);
        showToast("Added to favourites ♥");
    }

    renderProducts();
}

function addToCart(id) {
    let product = products.find(function(item) {
        return item.id === id;
    });

    let existing = cart.find(function(item) {
        return item.id === id;
    });

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    updateCart();
    showToast(product.name + " added to your cart!");
}

function changeQuantity(id, amount) {
    let item = cart.find(function(product) {
        return product.id === id;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(function(product) {
            return product.id !== id;
        });
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    updateCart();
}

function updateCart() {
    let count = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);

    let total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    document.getElementById("cartCount").innerText = count;
    document.getElementById("drawerCount").innerText = count;
    document.getElementById("cartTotal").innerText = "₹" + total;

    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <h2>♡</h2>
                <h5>Your cart is empty</h5>
                <p class="muted">Your next favourite treat is waiting!</p>
            </div>
        `;
    }

    cart.forEach(function(item) {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h6>${item.name}</h6>
                    <p>₹${item.price * item.quantity}</p>
                    <div class="quantity-control mt-2">
                        <button onclick="changeQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-button"
                    onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `;
    });
}

function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("show");
    document.getElementById("cartBackdrop").classList.toggle("show");
}

function showToast(message) {
    let toast = document.getElementById("toastMessage");

    toast.innerText = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2200);
}

function checkout() {
    if (cart.length === 0) {
        showToast("Please add a treat to your cart first.");
        return;
    }

    let message = "Hello! I would like to order:\n\n";

    cart.forEach(function(item) {
        message += item.name + " x " + item.quantity +
            " = ₹" + item.price * item.quantity + "\n";
    });

    let total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    message += "\nTotal: ₹" + total;
    message += "\n\nPlease confirm availability.";

    let orderUrl = "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(orderUrl, "_blank");
}

renderProducts();
updateCart();
