const API_URL = window.location.origin;

// ===================== STATE =====================
let cart = JSON.parse(localStorage.getItem('kortiko_cart')) || [];
let products = [];
let activeFilter = 'all';

// ===================== DOM REFS =====================
const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');

const aiToggle = document.getElementById('ai-toggle');
const aiDrawer = document.getElementById('ai-drawer');
const aiClose = document.getElementById('ai-close');
const aiMessages = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const overlay = document.getElementById('drawer-overlay');

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
    setupEventListeners();
    setupFilterPills();
});

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
    cartToggle?.addEventListener('click', (e) => { e.preventDefault(); openDrawer('cart'); });
    cartClose?.addEventListener('click', () => closeDrawers());
    aiToggle?.addEventListener('click', () => openDrawer('ai'));
    aiClose?.addEventListener('click', () => closeDrawers());
    overlay?.addEventListener('click', () => closeDrawers());
    aiSend?.addEventListener('click', sendMessage);
    aiInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function openDrawer(type) {
    closeDrawers();
    if (type === 'cart') cartDrawer?.classList.add('active');
    if (type === 'ai') aiDrawer?.classList.add('active');
    overlay?.classList.add('active');
}

function closeDrawers() {
    cartDrawer?.classList.remove('active');
    aiDrawer?.classList.remove('active');
    overlay?.classList.remove('active');
}

// ===================== FILTER PILLS =====================
function setupFilterPills() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            applyFilter();
        });
    });
}

function applyFilter() {
    let filtered = products;
    if (activeFilter === 'Food') filtered = products.filter(p => p.category === 'Food');
    else if (activeFilter === 'Grocery') filtered = products.filter(p => p.category === 'Grocery');
    else if (activeFilter === 'featured') filtered = products.filter(p => p.is_featured);
    renderProducts(filtered);
}

// ===================== FETCH & RENDER PRODUCTS =====================
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        if (productList) {
            productList.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 80px 0; color: var(--gray);">
                <p style="font-size: 1.1rem;">Unable to load products. Please ensure the backend is running.</p>
            </div>`;
        }
    }
}

function renderProducts(items) {
    if (!productList) return;
    if (items.length === 0) {
        productList.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:80px 0; color:var(--gray);">No items found in this category.</div>`;
        return;
    }

    const renderCard = (product) => {
        const isVeg = product.dietary_type === 'Veg';
        const vegIconColor = isVeg ? '#43a047' : '#e53935'; // Green for Veg, Red for Non-Veg
        const vegIcon = product.dietary_type ? 
            `<div style="display:inline-flex; align-items:center; justify-content:center; width:12px; height:12px; border:1px solid ${vegIconColor}; padding:1px; margin-left:8px; border-radius:2px;" title="${product.dietary_type}">
                <div style="width:6px; height:6px; background-color:${vegIconColor}; border-radius:50%;"></div>
            </div>` : '';

        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" style="margin: -15px -15px 15px -15px; border-radius: 8px 8px 0 0;">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy">
                ${product.is_featured ? '<div class="featured-badge">Featured</div>' : ''}
                <div class="add-to-cart-overlay">
                    <button class="btn btn-primary" style="width: 100%; font-size: 0.75rem;" onclick="addToCart(${product.id})">Add to Selections</button>
                </div>
            </div>
            <div class="product-info">
                <div class="flex justify-between align-center">
                    <div class="product-category" style="margin-bottom:0;">${product.category} | ${product.subcategory}</div>
                    ${vegIcon}
                </div>
                <h3 style="margin-top: 5px;">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="product-desc">${product.description}</div>
            </div>
        </div>
        `;
    };

    if (activeFilter === 'all') {
        const foodItems = items.filter(p => p.category === 'Food');
        const groceryItems = items.filter(p => p.category === 'Grocery');
        
        let html = '';
        if (foodItems.length > 0) {
            html += `<div style="grid-column: 1/-1; margin-bottom: 20px;"><h2 style="font-family:'Playfair Display',serif; font-size: 2.5rem; border-bottom: 2px solid var(--gold); padding-bottom: 10px; display: inline-block;">Gourmet Meals</h2></div>`;
            html += foodItems.map(renderCard).join('');
        }
        if (groceryItems.length > 0) {
            html += `<div style="grid-column: 1/-1; margin-top: 40px; margin-bottom: 20px;"><h2 style="font-family:'Playfair Display',serif; font-size: 2.5rem; border-bottom: 2px solid var(--gold); padding-bottom: 10px; display: inline-block;">Lifestyle Groceries</h2></div>`;
            html += groceryItems.map(renderCard).join('');
        }
        productList.innerHTML = html;
    } else {
        productList.innerHTML = items.map(renderCard).join('');
    }
}

// ===================== CART =====================
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openDrawer('cart');
    showToast(`${product.name} added to your selections`);
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

window.changeQty = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
};

function saveCart() { localStorage.setItem('kortiko_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCount) cartCount.textContent = count;

    if (cartItemsEl) {
        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Your selections are empty.</p>
                    <p style="font-size: 0.8rem; margin-top: 8px; color: var(--gray);">Start curating your order.</p>
                </div>`;
        } else {
            cartItemsEl.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.image_url}" alt="${item.name}">
                    </div>
                    <div style="flex: 1;">
                        <h4 style="font-size:0.95rem; margin-bottom:4px;">${item.name}</h4>
                        <div style="font-size: 0.8rem; color: var(--gray); margin-bottom: 10px;">₹${item.price.toLocaleString('en-IN')} each</div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button onclick="changeQty(${item.id}, -1)" style="width:28px; height:28px; border:1px solid #eee; background:transparent; cursor:pointer; border-radius:50%; font-size:1rem;">−</button>
                            <span style="font-weight:600;">${item.quantity}</span>
                            <button onclick="changeQty(${item.id}, 1)" style="width:28px; height:28px; border:1px solid #eee; background:transparent; cursor:pointer; border-radius:50%; font-size:1rem;">+</button>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700; margin-bottom:8px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <div style="cursor:pointer; font-size:0.8rem; color:var(--gray);" onclick="removeFromCart(${item.id})">Remove</div>
                    </div>
                </div>
            `).join('');
        }

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        if (cartTotalAmount) cartTotalAmount.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
}

// ===================== TOAST =====================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===================== AI CONCIERGE =====================
async function sendMessage() {
    const message = aiInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    aiInput.value = '';

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.id = 'typing-indicator';
    aiMessages.appendChild(typing);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        
        document.getElementById('typing-indicator')?.remove();
        appendMessage(data.response, 'bot');
        
        if (data.suggestions && data.suggestions.length > 0) {
            setTimeout(() => {
                appendMessage("Here are some items curated for you:", 'bot');
                renderSuggestions(data.suggestions);
            }, 600);
        }
    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        appendMessage("I'm sorry, the concierge service is temporarily unavailable. Please try again.", 'bot');
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg msg-${sender}`;
    msgDiv.textContent = text;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function renderSuggestions(suggestions) {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.style.cssText = 'display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; scroll-behavior:smooth;';
    
    suggestions.forEach(p => {
        const pDiv = document.createElement('div');
        pDiv.style.cssText = 'min-width:130px; background:var(--off-white); padding:12px; border-radius:8px; flex-shrink:0;';
        pDiv.innerHTML = `
            <img src="${p.image_url}" style="width:100%; height:80px; object-fit:cover; border-radius:4px; margin-bottom:8px;">
            <div style="font-size:0.75rem; font-weight:600; margin-bottom:4px; line-height:1.3;">${p.name}</div>
            <div style="font-size:0.7rem; color:var(--gold); font-weight:700; margin-bottom:8px;">₹${p.price.toLocaleString('en-IN')}</div>
            <button class="btn btn-primary" style="padding:6px; font-size:0.65rem; width:100%;" onclick="addToCart(${p.id})">Add</button>
        `;
        suggestionsDiv.appendChild(pDiv);
    });
    
    aiMessages.appendChild(suggestionsDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}
