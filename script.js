// ---------- Products ----------
const products = [
    { id: 1, name: "Headphones", price: 1500, category: "electronics", image: "images/p1.jpg" },
    { id: 2, name: "Power Bank", price: 1000, category: "electronics", image: "images/p2.jpg" },
    { id: 3, name: "T-Shirt", price: 500, category: "clothing", image: "images/p3.jpg" },
    { id: 4, name: "Jeans", price: 1300, category: "clothing", image: "images/p4.jpg" },
    { id: 5, name: "Harry Potter Book", price: 600, category: "books", image: "images/p5.jpg" },
    { id: 6, name: "Notebook", price: 100, category: "books", image: "images/p6.jpg" }
];

// Cart: each item looks like { id: 1, quantity: 2 }
let cart = [];
let discountPercent = 0;   // becomes 10 when SAVE10 is applied

// ---------- Elements from the page ----------
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");


// ---------- 1. Filtering and sorting ----------
function showProducts() {
    let list = products;

    // filter by category
    if (categoryFilter.value !== "all") {
        list = list.filter(function (p) {
            return p.category === categoryFilter.value;
        });
    }

    // sort by price (we sort a copy so the original array stays the same)
    list = [...list];
    if (sortSelect.value === "low") {
        list.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (sortSelect.value === "high") {
        list.sort(function (a, b) {
            return b.price - a.price;
        });
    }

    // show the products
    productList.innerHTML = "";

    list.forEach(function (p) {
        const card = document.createElement("div");
        card.className = "product";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="info">
                <h3>${p.name}</h3>
                <p class="category">${p.category}</p>
                <p class="price">₹${p.price}</p>
            </div>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.addEventListener("click", function () {
            addToCart(p.id);
        });

        card.querySelector(".info").appendChild(btn);
        productList.appendChild(card);
    });
}


// ---------- 2. Add and remove cart items ----------
function addToCart(id) {
    // if the product is already in the cart, just increase its quantity
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + 1;
            showCart();
            return;
        }
    }

    // otherwise add it as a new item
    cart.push({ id: id, quantity: 1 });
    showCart();
}

function removeFromCart(id) {
    // keep everything except the item we are removing
    cart = cart.filter(function (item) {
        return item.id !== id;
    });
    showCart();
}


// ---------- 3. Quantity and price calculation ----------
function changeQuantity(id, change) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + change;

            // quantity reached 0, so take the item out
            if (cart[i].quantity === 0) {
                removeFromCart(id);
                return;
            }
        }
    }
    showCart();
}

function showCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='empty'>Your cart is empty.</p>";
    }

    let subtotal = 0;

    cart.forEach(function (item) {
        const product = products.find(function (p) {
            return p.id === item.id;
        });

        const itemTotal = product.price * item.quantity;
        subtotal = subtotal + itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <p><b>${product.name}</b></p>
            <p class="calc">₹${product.price} x ${item.quantity} = ₹${itemTotal}</p>
        `;

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.addEventListener("click", function () {
            changeQuantity(item.id, -1);
        });

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", function () {
            changeQuantity(item.id, 1);
        });

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "remove";
        remove.addEventListener("click", function () {
            removeFromCart(item.id);
        });

        div.appendChild(minus);
        div.appendChild(plus);
        div.appendChild(remove);
        cartItems.appendChild(div);
    });

    const discount = subtotal * discountPercent / 100;

    document.getElementById("subtotal").textContent = "₹" + subtotal;
    document.getElementById("discount").textContent = "- ₹" + discount;
    document.getElementById("total").textContent = "₹" + (subtotal - discount);
}


// ---------- 4. Discount coupon ----------
function applyCoupon() {
    if (couponInput.value === "SAVE10") {
        discountPercent = 10;
        couponMessage.style.color = "green";
        couponMessage.textContent = "SAVE10 applied: 10% off";
    } else {
        discountPercent = 0;
        couponMessage.style.color = "";
        couponMessage.textContent = "Invalid coupon code";
    }
    showCart();
}


// ---------- 4. Checkout ----------
function placeOrder() {
    const name = document.getElementById("custName").value;
    const address = document.getElementById("custAddress").value;

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    if (name === "" || address === "") {
        alert("Please enter your name and address.");
        return;
    }

    alert("Thank you, " + name + "! Your order of " + document.getElementById("total").textContent + " is placed.");

    // clear everything for the next order
    cart = [];
    discountPercent = 0;
    couponInput.value = "";
    couponMessage.textContent = "";
    document.getElementById("custName").value = "";
    document.getElementById("custAddress").value = "";
    showCart();
}


// ---------- Events ----------
categoryFilter.addEventListener("change", showProducts);
sortSelect.addEventListener("change", showProducts);
document.getElementById("applyCoupon").addEventListener("click", applyCoupon);
document.getElementById("placeOrder").addEventListener("click", placeOrder);

// run once when the page opens
showProducts();
showCart();
