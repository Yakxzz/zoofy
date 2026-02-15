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

// Product Categories for Search (Reduced for better UI)
const PRODUCT_CATEGORIES = [
    'Saree', 'Shirt', 'Kurti', 'Dress', 'Jeans', 'T-Shirt'
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentSort = 'default';
let currentCategory = 'all';
let currentProductImageIndex = 0;
let currentSearchQuery = '';

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
        ],
        description: 'This beautiful Gown is made of high quality rayon fabric and moti work.\n\nThis Gown can be used as wedding dress or party dress.\n\nThis Gown has been specially designed keeping in mind the latest trends of fashion.\n\nThis Gown can be worn as an ethnic dress or casual wear.\n\nA Gown is a traditional Indian garment which is most commonly worn by women, especially in India.\n\nYou can choose different color according to your own taste.\n\nProduct Features:\n1. High Quality Material: 100% Rayon + Moti Work\n2. Soft and Comfortable Fabric\n3. Easy To Wear And Wash\n4. Colorful And Fashionable Design\n5. Customized Size Available\n6. Best Price Guarantee',
        buyUrl: 'https://fktr.in/JtJiimQ',
        store: 'flipkart'
    },
    {
        id: 2,
        name: 'Men Regular Fit Solid Button Down Collar Casual Shirt',
        category: 'men',
        productCategory: 'Shirt',
        price: 500,
        image: 'https://i.pinimg.com/736x/21/00/10/21001079de6dbd5b6809b3f2b40717bf.jpg',
        description: 'Latest Designer Shirt Fabric Is Cotton Blend And Soft Fabric, Shirt Design Formal And Casual To Daily Wear, Shirt Ocassion Is Casual Wear, Partywear, Evening Wear All Day Are Wear',
        buyUrl: 'https://fktr.in/XfEuUpb',
        store: 'flipkart'
    }
];

// Fullscreen Functions
function requestFullscreen() {
    const elem = document.documentElement;
    
    // Try standard fullscreen API first
    if (elem.requestFullscreen) {
        elem.requestFullscreen({ navigationUI: 'hide' }).catch(err => {
            console.log('Fullscreen request failed:', err);
            // Try alternative methods
            tryAlternativeFullscreen();
        });
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.webkitRequestFullScreen) { // Older Safari
        elem.webkitRequestFullScreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else {
        tryAlternativeFullscreen();
    }
}

function tryAlternativeFullscreen() {
    // For mobile browsers, try to hide URL bar
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Scroll to hide address bar
        window.scrollTo(0, 1);
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        
        // Set viewport height to full screen
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) { // Older Safari
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.webkitCurrentFullScreenElement ||
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

// Force fullscreen on any user interaction
function forceFullscreenOnInteraction() {
    const events = ['click', 'touchstart', 'keydown', 'mousedown'];
    let interactionCount = 0;
    const maxInteractions = 5;
    
    const handler = (e) => {
        if (!isFullscreen() && interactionCount < maxInteractions) {
            requestFullscreen();
            interactionCount++;
        }
    };
    
    events.forEach(event => {
        document.addEventListener(event, handler, { passive: true });
    });
    
    // Add fullscreen trigger to all buttons
    const addFullscreenToButtons = () => {
        const allButtons = document.querySelectorAll('button, .btn, .filter-btn, .nav-item, .product-card, .search-category-btn, .sort-option, .cart-item');
        allButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!isFullscreen()) {
                    requestFullscreen();
                }
            }, { passive: true, once: false });
        });
    };
    
    // Add to existing buttons
    addFullscreenToButtons();
    
    // Also observe for dynamically added buttons
    const observer = new MutationObserver(() => {
        addFullscreenToButtons();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    products = [...sampleProducts];
    // Don't render products immediately - wait for splash screen
    updateCartCount();
    setupEventListeners();
    loadProductsFromStorage();
    setupSearchFullscreen();
    
    // Request fullscreen immediately on splash screen - trigger on page load
    const splash = document.getElementById('splashScreen');
    if (splash) {
        // Make entire splash screen trigger fullscreen on any interaction
        const triggerFullscreen = () => {
            if (!isFullscreen()) {
                requestFullscreen();
            }
        };
        
        splash.addEventListener('click', triggerFullscreen, { once: false });
        splash.addEventListener('touchstart', triggerFullscreen, { once: false });
        
        // Also make splash content clickable
        const splashContent = splash.querySelector('.splash-content');
        if (splashContent) {
            splashContent.addEventListener('click', triggerFullscreen, { once: false });
            splashContent.addEventListener('touchstart', triggerFullscreen, { once: false });
        }
        
        // Try to request fullscreen automatically multiple times
        setTimeout(() => requestFullscreen(), 50);
        setTimeout(() => requestFullscreen(), 200);
        setTimeout(() => requestFullscreen(), 500);
        setTimeout(() => requestFullscreen(), 1000);
    }
    
    // Set up mobile viewport height
    setMobileViewportHeight();
    
    hideSplashScreen();
    
    // Force fullscreen on any user interaction
    forceFullscreenOnInteraction();
    
    // Aggressive fullscreen for Chrome - try multiple times
    let fullscreenAttempts = 0;
    const maxAttempts = 5;
    const tryFullscreen = setInterval(() => {
        if (!isFullscreen() && fullscreenAttempts < maxAttempts) {
            requestFullscreen();
            fullscreenAttempts++;
        } else if (isFullscreen() || fullscreenAttempts >= maxAttempts) {
            clearInterval(tryFullscreen);
        }
    }, 1000);
});

// Set mobile viewport height to account for browser UI
function setMobileViewportHeight() {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
}

// Listen for fullscreen changes - re-enter if exited
function setupFullscreenListeners() {
    const reEnterFullscreen = () => {
        if (!isFullscreen()) {
            setTimeout(() => {
                if (!isFullscreen()) {
                    requestFullscreen();
                }
            }, 500);
        }
    };
    
    document.addEventListener('fullscreenchange', reEnterFullscreen);
    document.addEventListener('webkitfullscreenchange', reEnterFullscreen);
    document.addEventListener('mozfullscreenchange', reEnterFullscreen);
    document.addEventListener('MSFullscreenChange', reEnterFullscreen);
}

// Setup fullscreen listeners
setupFullscreenListeners();

// Hide Splash Screen
function hideSplashScreen() {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                splash.style.display = 'none';
                // Render products with animation after splash
                renderProducts(products);
                // Ensure fullscreen is active after splash
                if (!isFullscreen()) {
                    requestFullscreen();
                }
            }, 500);
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
    
    // Update main search clear button visibility on page load
    updateMainSearchUI();

    // Search fullscreen input
    const searchInputFullscreen = document.getElementById('searchInputFullscreen');
    const searchClearFullscreen = document.getElementById('searchClearFullscreen');
    
    searchInputFullscreen.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        searchClearFullscreen.style.display = query ? 'block' : 'none';
        // Don't auto-search on every keystroke - only on Enter
    });
    
    searchInputFullscreen.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                performSearch(query.toLowerCase());
            } else {
                // If empty, clear search
                clearMainSearch();
            }
        }
    });

    searchClearFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInputFullscreen.value = '';
        searchClearFullscreen.style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
        // Clear search and show all products
        clearMainSearch();
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
    const searchInputFullscreen = document.getElementById('searchInputFullscreen');
    const searchClearFullscreen = document.getElementById('searchClearFullscreen');
    
    // Preserve current search query when reopening
    if (currentSearchQuery) {
        searchInputFullscreen.value = currentSearchQuery;
        searchClearFullscreen.style.display = 'block';
    } else {
        searchInputFullscreen.value = '';
        searchClearFullscreen.style.display = 'none';
    }
    
    // Reset animation
    searchFullscreen.style.opacity = '0';
    searchFullscreen.style.transform = 'translateY(100%)';
    searchFullscreen.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        searchFullscreen.style.opacity = '1';
        searchFullscreen.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        searchInputFullscreen.focus();
        // Move cursor to end of text
        searchInputFullscreen.setSelectionRange(searchInputFullscreen.value.length, searchInputFullscreen.value.length);
    }, 300);
}

function closeSearchFullscreen(keepQuery = false) {
    const searchFullscreen = document.getElementById('searchFullscreen');
    
    // Animate out
    searchFullscreen.style.opacity = '0';
    searchFullscreen.style.transform = 'translateY(100%)';
    
    setTimeout(() => {
        searchFullscreen.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        if (!keepQuery) {
            document.getElementById('searchInputFullscreen').value = '';
            document.getElementById('searchClearFullscreen').style.display = 'none';
            document.getElementById('searchResults').innerHTML = '';
        }
    }, 400);
}

function searchByCategory(category) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const query = category.toLowerCase();
    currentSearchQuery = category;
    
    // Filter products by category and show in main UI
    let filtered = products.filter(p => 
        p.productCategory.toLowerCase() === query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase() === query
    );
    
    // Apply category filter if active
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Apply sort if active
    if (currentSort !== 'default') {
        filtered = sortProductsArray(filtered, currentSort);
    }
    
    // Close search and show results (keep query)
    closeSearchFullscreen(true);
    
    // Render filtered products in main UI
    renderProducts(filtered);
    
    // Update search input UI
    updateMainSearchUI();
    
    // Scroll to top to show results
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

function performSearch(query) {
    if (!query || query.trim() === '') {
        // If query is empty, show all products
        clearMainSearch();
        return;
    }

    const searchQuery = query.trim().toLowerCase();
    currentSearchQuery = query.trim();
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.productCategory.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );

    // Close search and show results in main UI (keep query)
    closeSearchFullscreen(true);
    
    // Apply category filter if active
    let finalFiltered = filtered;
    if (currentCategory !== 'all') {
        finalFiltered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Apply sort if active
    if (currentSort !== 'default') {
        finalFiltered = sortProductsArray(finalFiltered, currentSort);
    }
    
    // Render filtered products
    renderProducts(finalFiltered);
    
    // Update search input and clear button
    updateMainSearchUI();
    
    // Scroll to top to show results
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// Clear main search - accessible globally
function clearMainSearch() {
    currentSearchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchInputFullscreen').value = '';
    document.getElementById('searchClearMain').style.display = 'none';
    document.getElementById('searchClearFullscreen').style.display = 'none';
    
    // Show all products with current category and sort filters
    filterProducts(currentCategory);
}

function updateMainSearchUI() {
    const searchInput = document.getElementById('searchInput');
    const searchClearMain = document.getElementById('searchClearMain');
    
    if (currentSearchQuery) {
        searchInput.value = currentSearchQuery;
        searchClearMain.style.display = 'block';
    } else {
        searchInput.value = '';
        searchClearMain.style.display = 'none';
    }
}

// Render Products with Animation
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary); animation: fadeIn 0.5s ease;">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <p style="font-family: 'Inter', sans-serif;">No products found</p>
            </div>
        `;
        return;
    }

    // Clear grid first
    grid.innerHTML = '';
    
    // Add products with staggered animation
    productsToRender.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.onclick = () => openProductPage(product.id);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/707070?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Filter Products
function filterProducts(category) {
    currentCategory = category;
    let filtered = [...products];
    
    // Apply category filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Apply search filter if active
    if (currentSearchQuery) {
        const searchQuery = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.productCategory.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
        );
    }
    
    // Apply sort
    if (currentSort !== 'default') {
        filtered = sortProductsArray(filtered, currentSort);
    }
    
    renderProducts(filtered);
}

// Sort Products
function sortProducts(sortType) {
    currentSort = sortType;
    let filtered = [...products];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Apply search filter if active
    if (currentSearchQuery) {
        const searchQuery = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.productCategory.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
        );
    }
    
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
        <div class="product-page-info">
            <h1 class="product-page-title">${product.name}</h1>
            <div class="product-page-price">₹${product.price.toLocaleString()}</div>
            <div class="store-badge">
                <i class="fas fa-store"></i> ${storeName}
            </div>
            <div class="product-description">
                <h3>Description</h3>
                <p class="description-preview" id="productDescription">${product.description}</p>
                <span class="toggle-description" onclick="toggleDescription()" id="toggleDesc">Show More</span>
            </div>
        </div>
        <div class="product-page-actions-flipkart">
            <button class="btn-flipkart btn-add-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn-flipkart btn-buy-now" onclick="buyNow(${product.id})">
                <i class="fas fa-bolt"></i> Buy Now
            </button>
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
    // Animate out
    productPage.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => {
        productPage.classList.remove('show');
        productPage.style.animation = '';
        document.body.style.overflow = 'auto';
    }, 400);
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
    const isOpening = !sidebar.classList.contains('open');
    
    sidebar.classList.toggle('open');
    
    if (isOpening) {
        // Add overlay for cart
        let overlay = document.getElementById('cartOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cartOverlay';
            overlay.onclick = toggleCart;
            document.body.appendChild(overlay);
        }
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        renderCart();
    } else {
        // Remove overlay
        const overlay = document.getElementById('cartOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart" style="animation: fadeIn 0.5s ease;">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        animatePriceCount(0, cartTotal);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Clear cart items first
    cartItems.innerHTML = '';
    
    // Add cart items with staggered animation
    cart.forEach((item, index) => {
        const shortName = item.name.length > 50 ? item.name.substring(0, 50) + '...' : item.name;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.animationDelay = `${index * 0.1}s`;
        cartItem.onclick = () => {
            openProductPage(item.id);
            toggleCart();
        };
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/707070?text=Image'">
            <div class="cart-item-info">
                <div class="cart-item-name">${shortName}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
            </div>
            <button class="remove-item" onclick="event.stopPropagation(); removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Animate price counting
    animatePriceCount(total, cartTotal);
}

// Animate price counting
function animatePriceCount(targetAmount, element) {
    const currentText = element.textContent.replace(/[^0-9]/g, '');
    const currentAmount = parseInt(currentText) || 0;
    const difference = targetAmount - currentAmount;
    
    if (difference === 0) {
        element.textContent = targetAmount.toLocaleString();
        return;
    }
    
    const duration = Math.min(1000, Math.max(300, Math.abs(difference) * 2)); // Max 1s, min 300ms
    const steps = 30;
    const stepAmount = difference / steps;
    const stepDuration = duration / steps;
    let current = currentAmount;
    let step = 0;
    
    element.classList.add('counting');
    
    const counter = setInterval(() => {
        step++;
        current += stepAmount;
        
        if (step >= steps || (difference > 0 && current >= targetAmount) || (difference < 0 && current <= targetAmount)) {
            current = targetAmount;
            clearInterval(counter);
            element.classList.remove('counting');
        }
        
        element.textContent = Math.round(current).toLocaleString();
    }, stepDuration);
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
