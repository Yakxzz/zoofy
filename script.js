// Store Configuration (for display only, no affiliate links)
const STORE_CONFIG = {
    flipkart: {
        name: 'Flipkart',
        baseUrl: 'https://www.flipkart.com'
    },
    amazon: {
        name: 'Amazon',
        baseUrl: 'https://www.amazon.in'
    },
    myntra: {
        name: 'Myntra',
        baseUrl: 'https://www.myntra.com'
    }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentSort = 'default';
let currentCategory = 'all';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: 'Women Appluque Art Silk Anarkali Kurti with attached Dupatta',
        category: 'women',
        price: 438,
        image: 'https://i.ibb.co/604BL98C/aiease-1771149430500-1.jpg',
        images: ['https://i.ibb.co/604BL98C/aiease-1771149430500-1.jpg'],
        description: 'This beautiful Gown is made of high quality rayon fabric and moti work.\n\nThis Gown can be used as wedding dress or party dress.\n\nThis Gown has been specially designed keeping in mind the latest trends of fashion.\n\nThis Gown can be worn as an ethnic dress or casual wear.\n\nA Gown is a traditional Indian garment which is most commonly worn by women, especially in India.\n\nYou can choose different color according to your own taste.\n\nProduct Features:\n1. High Quality Material: 100% Rayon + Moti Work\n2. Soft and Comfortable Fabric\n3. Easy To Wear And Wash\n4. Colorful And Fashionable Design\n5. Customized Size Available\n6. Best Price Guarantee',
        buyUrl: 'https://fktr.in/JtJiimQ',
        store: 'flipkart'
    },
    {
        id: 2,
        name: 'Floral Summer Dress',
        category: 'women',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
        description: 'Beautiful floral dress for summer occasions.\n\nPerfect for casual outings and parties.\n\nMade with premium quality fabric.\n\nComfortable and stylish design.',
        buyUrl: 'https://www.flipkart.com/floral-dress',
        store: 'flipkart'
    },
    {
        id: 3,
        name: 'Kids Cartoon T-Shirt',
        category: 'kids',
        price: 499,
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'],
        description: 'Fun cartoon t-shirt for kids.\n\nSoft and comfortable fabric.\n\nVarious cartoon designs available.\n\nPerfect for daily wear.',
        buyUrl: 'https://www.flipkart.com/kids-tshirt',
        store: 'flipkart'
    },
    {
        id: 4,
        name: 'Leather Handbag',
        category: 'others',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        description: 'Premium leather handbag.\n\nDurable and stylish design.\n\nMultiple compartments for organization.\n\nPerfect for office and casual use.',
        buyUrl: 'https://www.flipkart.com/leather-handbag',
        store: 'flipkart'
    },
    {
        id: 5,
        name: 'Slim Fit Jeans',
        category: 'men',
        price: 999,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
        description: 'Comfortable slim fit jeans.\n\nPremium denim fabric.\n\nPerfect fit and style.\n\nAvailable in multiple sizes.',
        buyUrl: 'https://www.flipkart.com/slim-jeans',
        store: 'flipkart'
    },
    {
        id: 6,
        name: 'Elegant Blouse',
        category: 'women',
        price: 899,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'],
        description: 'Elegant blouse for formal occasions.\n\nPremium fabric with intricate designs.\n\nPerfect for weddings and parties.\n\nComfortable and stylish.',
        buyUrl: 'https://www.flipkart.com/blouse',
        store: 'flipkart'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    products = [...sampleProducts];
    renderProducts(products);
    updateCartCount();
    setupEventListeners();
    loadProductsFromStorage();
});

// Event Listeners
function setupEventListeners() {
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterProducts(currentCategory);
        });
    });

    // Sort toggle
    document.getElementById('sortToggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('sortDropdown');
        dropdown.classList.toggle('show');
        e.currentTarget.classList.toggle('active');
    });

    // Sort options
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', (e) => {
            currentSort = e.target.dataset.sort;
            document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById('sortDropdown').classList.remove('show');
            document.getElementById('sortToggle').classList.remove('active');
            sortProducts(currentSort);
        });
    });

    // Close sort dropdown on outside click
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('sortDropdown');
        const toggle = document.getElementById('sortToggle');
        if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
            dropdown.classList.remove('show');
            toggle.classList.remove('active');
        }
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchClear.style.display = query ? 'block' : 'none';
        searchProducts(query);
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filterProducts(currentCategory);
    });

    // Cart button
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', toggleCart);

    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            handleNavigation(page, e.currentTarget);
        });
    });

    // Info modal close
    const infoModal = document.getElementById('infoModal');
    infoModal.querySelector('.close-modal').addEventListener('click', () => {
        infoModal.classList.remove('show');
    });

    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.remove('show');
        }
    });
}

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <p style="font-family: 'Inter', sans-serif;">No products found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="openProductPage(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/707070?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    let filtered = [...products];
    
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (currentSort !== 'default') {
        filtered = sortProductsArray(filtered, currentSort);
    }
    
    renderProducts(filtered);
}

// Sort Products
function sortProducts(sortType) {
    currentSort = sortType;
    const category = currentCategory;
    let filtered = category === 'all' ? [...products] : products.filter(p => p.category === category);
    
    filtered = sortProductsArray(filtered, sortType);
    renderProducts(filtered);
}

function sortProductsArray(arr, sortType) {
    const sorted = [...arr];
    
    switch(sortType) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        default:
            return sorted;
    }
}

// Search Products
function searchProducts(query) {
    let filtered = currentCategory === 'all' ? [...products] : products.filter(p => p.category === currentCategory);
    
    if (query) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
    
    if (currentSort !== 'default') {
        filtered = sortProductsArray(filtered, currentSort);
    }
    
    renderProducts(filtered);
}

// Product Page (Full Screen)
function openProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productPage = document.getElementById('productPage');
    const content = document.getElementById('productPageContent');
    
    const storeName = STORE_CONFIG[product.store]?.name || 'Store';
    
    content.innerHTML = `
        <img src="${product.images[0] || product.image}" alt="${product.name}" class="product-page-image"
             onerror="this.src='https://via.placeholder.com/400x400/1a1a1a/707070?text=No+Image'">
        <h1 class="product-page-title">${product.name}</h1>
        <div class="product-page-price">₹${product.price.toLocaleString()}</div>
        <div class="store-badge">
            <i class="fas fa-store"></i> ${storeName}
        </div>
        <div class="product-description">
            <h3>Description</h3>
            <p>${product.description}</p>
        </div>
        <div class="product-page-actions">
            <button class="btn btn-secondary" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-primary" onclick="buyNow(${product.id})">
                <i class="fas fa-shopping-bag"></i> Buy Now
            </button>
        </div>
    `;
    
    productPage.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProductPage() {
    const productPage = document.getElementById('productPage');
    productPage.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Removed from cart');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/707070?text=Image'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString()} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('navCartCount').textContent = count;
}

// Buy Now Function
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Open buy URL in new tab (no affiliate links, just direct link)
    if (product.buyUrl) {
        window.open(product.buyUrl, '_blank');
    } else {
        showNotification('Buy link not available');
    }
}

// Navigation
function handleNavigation(page, element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    element.classList.add('active');
    
    switch(page) {
        case 'home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'cart':
            toggleCart();
            break;
        case 'info':
            document.getElementById('infoModal').classList.add('show');
            break;
    }
}

// Storage Functions
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromStorage() {
    const saved = localStorage.getItem('products');
    if (saved) {
        try {
            const savedProducts = JSON.parse(saved);
            if (savedProducts.length > 0) {
                products = savedProducts;
                renderProducts(products);
            }
        } catch (e) {
            console.error('Error loading products:', e);
        }
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 1rem;
        background: var(--accent-primary);
        color: var(--bg-primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
