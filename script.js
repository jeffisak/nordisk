// Global variables
let isEnglish = false;
let currentPage = 'home';
let cart = [];
let currentFilter = 'all';

// Sample products data
const products = [
    {
        id: 1,
        name: 'Ulljakke Bergen',
        nameEn: 'Bergen Wool Jacket',
        description: 'Varm og komfortabel ulljakke',
        descriptionEn: 'Warm and comfortable wool jacket',
        price: 1299,
        category: 'jackets',
        image: 'images/products/bergen-wool-jacket.jpg',
        badge: 'Ny',
        badgeEn: 'New'
    },
    {
        id: 2,
        name: 'Nordisk Genser',
        nameEn: 'Nordic Sweater',
        description: 'Klassisk nordisk design',
        descriptionEn: 'Classic Nordic design',
        price: 899,
        category: 'sweaters',
        image: 'images/products/nordic-sweater.jpg'
    },
    {
        id: 3,
        name: 'Oslo Bukser',
        nameEn: 'Oslo Pants',
        description: 'Moderne og stilige bukser',
        descriptionEn: 'Modern and stylish pants',
        price: 799,
        category: 'pants',
        image: 'images/products/oslo-pants.jpg'
    },
    {
        id: 4,
        name: 'Trondheim Hoodie',
        nameEn: 'Trondheim Hoodie',
        description: 'Casual og komfortabel',
        descriptionEn: 'Casual and comfortable',
        price: 699,
        category: 'sweaters',
        image: 'images/products/trondheim-hoodie.jpg',
        badge: 'Populær',
        badgeEn: 'Popular'
    },
    {
        id: 5,
        name: 'Stavanger Jakke',
        nameEn: 'Stavanger Jacket',
        description: 'Vanntett og pustende',
        descriptionEn: 'Waterproof and breathable',
        price: 1599,
        category: 'jackets',
        image: 'images/products/stavanger-jacket.jpg'
    },
    {
        id: 6,
        name: 'Lofoten Genser',
        nameEn: 'Lofoten Sweater',
        description: 'Inspirert av Lofoten',
        descriptionEn: 'Inspired by Lofoten',
        price: 1099,
        category: 'sweaters',
        image: 'images/products/lofoten-sweater.jpg'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupLanguage();
    setupContactForm();
});

// Page navigation
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    document.getElementById(page + 'Page').classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[onclick="showPage('${page}')"]`).classList.add('active');
    
    currentPage = page;
}

// Load products
function loadProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const allContainer = document.getElementById('allProducts');
    
    // Load featured products (first 3)
    if (featuredContainer) {
        featuredContainer.innerHTML = products.slice(0, 3).map(createProductCard).join('');
    }
    
    // Load all products
    if (allContainer) {
        allContainer.innerHTML = products.map(createProductCard).join('');
    }
}

// Create product card HTML
function createProductCard(product) {
    const name = isEnglish ? product.nameEn : product.name;
    const description = isEnglish ? product.descriptionEn : product.description;
    const badge = product.badge ? (isEnglish ? product.badgeEn : product.badge) : '';
    
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${name}">
                ${badge ? `<div class="product-badge">${badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="product-price">
                    <span class="price">${product.price} NOK</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" data-en="Add to Cart">Legg i kurv</button>
            </div>
        </div>
    `;
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    const productCards = document.querySelectorAll('#allProducts .product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Shopping cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showSuccessMessage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCart();
    }
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice + ' NOK';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart" data-en="Your cart is empty">Handlekurven din er tom</div>`;
    } else {
        cartItems.innerHTML = cart.map(item => {
            const name = isEnglish ? item.nameEn : item.name;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${name}</h4>
                        <div class="cart-item-quantity">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <div class="cart-item-price">${item.price * item.quantity} NOK</div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">&times;</button>
                </div>
            `;
        }).join('');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function checkout() {
    if (cart.length === 0) return;
    
    const orderDetails = {
        items: cart.map(item => ({
            name: isEnglish ? item.nameEn : item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    // Here you would typically send the order to your backend
    console.log('Order details:', orderDetails);
    
    alert(isEnglish ? 'Thank you for your order!' : 'Takk for din bestilling!');
    cart = [];
    updateCart();
    toggleCart();
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

// Language toggle
function toggleLanguage() {
    isEnglish = !isEnglish;
    
    // Update language button
    const langButton = document.querySelector('.lang-toggle');
    langButton.textContent = isEnglish ? 'NO' : 'EN';
    
    // Update all text elements
    document.querySelectorAll('[data-en]').forEach(el => {
        if (!el.dataset.original) {
            el.dataset.original = el.textContent;
        }
        el.textContent = isEnglish ? el.dataset.en : el.dataset.original;
    });
    
    // Update placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        if (!el.dataset.originalPlaceholder) {
            el.dataset.originalPlaceholder = el.placeholder;
        }
        el.placeholder = isEnglish ? el.dataset.enPlaceholder : el.dataset.originalPlaceholder;
    });
    
    // Reload products with new language
    loadProducts();
    updateCart();
}

function setupLanguage() {
    // Store original text
    document.querySelectorAll('[data-en]').forEach(el => {
        el.dataset.original = el.textContent;
    });
    
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        el.dataset.originalPlaceholder = el.placeholder;
    });
}

// Contact form setup and handling
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('.submit-btn');
        const originalText = btn.textContent;
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        btn.textContent = isEnglish ? 'Sending...' : 'Sender...';
        btn.disabled = true;
        
        try {
            // Send to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            btn.textContent = isEnglish ? 'Message Sent!' : 'Melding Sendt!';
            this.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            btn.textContent = isEnglish ? 'Error! Try Again' : 'Feil! Prøv igjen';
        } finally {
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }
    });
}