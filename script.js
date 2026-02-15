// Store Configuration
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

// Product Categories for Search
const PRODUCT_CATEGORIES = [
    'Saree', 'Shirt', 'Kurti', 'Dress', 'Jeans', 'T-Shirt', 'Blouse', 
    'Handbag', 'Shoes', 'Jacket', 'Sweater', 'Trouser', 'Skirt', 
    'Top', 'Leggings', 'Suit', 'Lehenga', 'Gown', 'Palazzo', 'Crop Top'
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentSort = 'default';
let currentCategory = 'all';
let currentProductImageIndex = 0;

// Sample Products Data with categories
const sampleProducts = [
    {
        id: 1,
        name: 'Women Appluque Art Silk Anarkali Kurti with attached Dupatta',
        category: 'women',
        productCategory: 'Kurti',
        price: 438,
        image: 'https://i.ibb.co/604BL98C/aiease-1771149430500-1.jpg',
        images: [
            'https://i.ibb.co/604BL98C/aiease-1771149430500-1.jpg',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
        ],
        description: 'This beautiful Gown is made of high quality rayon fabric and moti work.\n\nThis Gown can be used as wedding dress or party dress.\n\nThis Gown has been specially designed keeping in mind the latest trends of fashion.\n\nThis Gown can be worn as an ethnic dress or casual wear.\n\nA Gown is a traditional Indian garment which is most commonly worn by women, especially in India.\n\nYou can choose different color according to your own taste.\n\nProduct Features:\n1. High Quality Material: 100% Rayon + Moti Work\n2. Soft and Comfortable Fabric\n3. Easy To Wear And Wash\n4. Colorful And Fashionable Design\n5. Customized Size Available\n6. Best Price Guarantee',
        buyUrl: 'https://fktr.in/JtJiimQ',
        store: 'flipkart'
    },
    {
        id: 2,
        name: 'Floral Summer Dress',
        category: 'women',
        productCategory: 'Dress',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
        ],
        description: 'Beautiful floral dress for summer occasions.\n\nPerfect for casual outings and parties.\n\nMade with premium quality fabric.\n\nComfortable and stylish design.',
        buyUrl: 'https://www.flipkart.com/floral-dress',
        store: 'flipkart'
    },
    {
        id: 3,
        name: 'Kids Cartoon T-Shirt',
        category: 'kids',
        productCategory: 'T-Shirt',
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
        productCategory: 'Handbag',
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
        productCategory: 'Jeans',
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
        productCategory: 'Blouse',
        price: 899,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'],
        description: 'Elegant blouse for formal occasions.\n\nPremium fabric with intricate designs.\n\nPerfect for weddings and parties.\n\nComfortable and stylish.',
        buyUrl: 'https://www.flipkart.com/blouse',
        store: 'flipkart'
    }
];

// Fullscreen Functions
function requestFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
        });
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    products = [...sampleProducts];
    renderProducts(products);
    updateCartCount();
    setupEventListeners();
    loadProductsFromStorage();
    setupSearchFullscreen();
    hideSplashScreen();
});

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (!isFullscreen()) {
        // If user exits fullscreen, try to re-enter after a short delay
        setTimeout(() => {
            if (!isFullscreen()) {
                requestFullscreen();
            }
        }, 1000);
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (!isFullscreen()) {
        setTimeout(() => {
            if (!isFullscreen()) {
                requestFullscreen();
            }
        }, 1000);
    }
});

document.addEventListener('mozfullscreenchange', () => {
    if (!isFullscreen()) {
        setTimeout(() => {
            if (!isFullscreen()) {
                requestFullscreen();
            }
        }, 1000);
    }
});

document.addEventListener('MSFullscreenChange', () => {
    if (!isFullscreen()) {
        setTimeout(() => {
            if (!isFullscreen()) {
                requestFullscreen();
            }
        }, 1000);
    }
});

// Hide Splash Screen
function hideSplashScreen() {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.display = 'none';
            // Request fullscreen after splash screen disappears
            requestFullscreen();
        }
    }, 2500);
}

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

    // Search input click
    document.getElementById('searchInput').addEventListener('click', () => {
        openSearchFullscreen();
    });

    // Search fullscreen input
    const searchInputFullscreen = document.getElementById('searchInputFullscreen');
    const searchClearFullscreen = document.getElementById('searchClearFullscreen');
    
    searchInputFullscreen.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchClearFullscreen.style.display = query ? 'block' : 'none';
        performSearch(query);
    });

    searchClearFullscreen.addEventListener('click', () => {
        searchInputFullscreen.value = '';
        searchClearFullscreen.style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
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
        // Remove active state from info button
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.page === 'home') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.remove('show');
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.dataset.page === 'home') {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}

// Setup Search Fullscreen
function setupSearchFullscreen() {
    const categoriesContainer = document.getElementById('searchCategories');
    categoriesContainer.innerHTML = PRODUCT_CATEGORIES.map(category => `
        <button class="search-category-btn" onclick="searchByCategory('${category}')">
            ${category}
        </button>
    `).join('');
}

function openSearchFullscreen() {
    const searchFullscreen = document.getElementById('searchFullscreen');
    searchFullscreen.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('searchInputFullscreen').focus();
    }, 300);
}

function closeSearchFullscreen() {
    const searchFullscreen = document.getElementById('searchFullscreen');
    searchFullscreen.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('searchInputFullscreen').value = '';
    document.getElementById('searchClearFullscreen').style.display = 'none';
    document.getElementById('searchResults').innerHTML = '';
}

function searchByCategory(category) {
    const query = category.toLowerCase();
    document.getElementById('searchInputFullscreen').value = category;
    performSearch(query);
}

function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.productCategory.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products found</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = filtered.map(product => `
        <div class="search-result-item" onclick="openProductPage(${product.id}); closeSearchFullscreen();">
            <img src="${product.image}" alt="${product.name}" class="search-result-image"
                 onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/707070?text=Image'">
            <div class="search-result-info">
                <div class="search-result-name">${product.name}</div>
                <div class="search-result-price">₹${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
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

// Product Page (Full Screen)
function openProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productPage = document.getElementById('productPage');
    const content = document.getElementById('productPageContent');
    
    currentProductImageIndex = 0;
    const storeName = STORE_CONFIG[product.store]?.name || 'Store';
    const mainImage = product.images[currentProductImageIndex] || product.image;
    
    content.innerHTML = `
        <div class="product-page-image-container">
            <img src="${mainImage}" alt="${product.name}" class="product-page-image" id="mainProductImage"
                 onerror="this.src='https://via.placeholder.com/400x400/1a1a1a/707070?text=No+Image'">
            ${product.images.length > 1 ? `
                <div class="product-images-gallery">
                    ${product.images.map((img, idx) => `
                        <img src="${img}" alt="Image ${idx + 1}" class="gallery-image ${idx === 0 ? 'active' : ''}" 
                             onclick="changeProductImage(${idx})"
                             onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/707070?text=Img'">
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <h1 class="product-page-title">${product.name}</h1>
        <div class="product-page-price">₹${product.price.toLocaleString()}</div>
        <div class="store-badge">
            <i class="fas fa-store"></i> ${storeName}
        </div>
        <div class="product-page-actions">
            <button class="btn btn-secondary" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-primary" onclick="buyNow(${product.id})">
                <i class="fas fa-shopping-bag"></i> Buy Now
            </button>
        </div>
        <div class="product-description">
            <h3>Description</h3>
            <p class="description-preview" id="productDescription">${product.description}</p>
            <span class="toggle-description" onclick="toggleDescription()" id="toggleDesc">Show More</span>
        </div>
    `;
    
    productPage.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function changeProductImage(index) {
    const product = products.find(p => {
        const page = document.getElementById('productPage');
        const title = page.querySelector('.product-page-title');
        return title && title.textContent.includes(p.name);
    });
    
    if (!product) return;
    
    currentProductImageIndex = index;
    document.getElementById('mainProductImage').src = product.images[index] || product.image;
    
    document.querySelectorAll('.gallery-image').forEach((img, idx) => {
        if (idx === index) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
}

function toggleDescription() {
    const desc = document.getElementById('productDescription');
    const toggle = document.getElementById('toggleDesc');
    
    if (desc.classList.contains('description-preview')) {
        desc.classList.remove('description-preview');
        desc.classList.add('description-full');
        toggle.textContent = 'Show Less';
    } else {
        desc.classList.remove('description-full');
        desc.classList.add('description-preview');
        toggle.textContent = 'Show More';
    }
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

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        showNotification('Product already in cart');
        return;
    }
    
    cart.push({
        ...product,
        quantity: 1
    });
    
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
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toLocaleString();
    
    cartItems.innerHTML = cart.map(item => {
        const shortName = item.name.length > 50 ? item.name.substring(0, 50) + '...' : item.name;
        return `
            <div class="cart-item" onclick="openProductPage(${item.id}); toggleCart();">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                     onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/707070?text=Image'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${shortName}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                </div>
                <button class="remove-item" onclick="event.stopPropagation(); removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updateCartCount() {
    const count = cart.length;
    document.getElementById('cartCount').textContent = count;
}

// Buy Now Function
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

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

// Notification (Apple-style)
function showNotification(message) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="notification-text">${message}</div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}
