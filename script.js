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
                image: 'linear-gradient(45deg, #2c3e50, #34495e)',
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
                image: 'linear-gradient(45deg, #e74c3c, #c0392b)'
            },
            {
                id: 3,
                name: 'Oslo Bukser',
                nameEn: 'Oslo Pants',
                description: 'Moderne og stilige bukser',
                descriptionEn: 'Modern and stylish pants',
                price: 799,
                category: 'pants',
                image: 'linear-gradient(45deg, #3498db, #2980b9)'
            },
            {
                id: 4,
                name: 'Trondheim Hoodie',
                nameEn: 'Trondheim Hoodie',
                description: 'Casual og komfortabel',
                descriptionEn: 'Casual and comfortable',
                price: 699,
                category: 'sweaters',
                image: 'linear-gradient(45deg, #9b59b6, #8e44ad)',
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
                image: 'linear-gradient(45deg, #f39c12, #e67e22)'
            },
            {
                id: 6,
                name: 'Lofoten Genser',
                nameEn: 'Lofoten Sweater',
                description: 'Inspirert av Lofoten',
                descriptionEn: 'Inspired by Lofoten',
                price: 1099,
                category: 'sweaters',
                image: 'linear-gradient(45deg, #27ae60, #229954)'
            }
        ];

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            setupLanguage();
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
            featuredContainer.innerHTML = products.slice(0, 3).map(createProductCard).join('');
            
            // Load all products
            allContainer.innerHTML = products.map(createProductCard).join('');
        }

        // Create product card HTML
        function createProductCard(product) {
            const name = isEnglish ? product.nameEn : product.name;
            const description = isEnglish ? product.descriptionEn : product.description;
            const badge = product.badge ? (isEnglish ? product.badgeEn : product.badge) : '';
            
            return `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image" style="background: ${product.image}">
                        ${badge ? `<div class="product-badge">${badge}</div>` : ''}
                        ${name}
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
                            <div class="cart-item-image">${name.slice(0, 3)}</div>
                            <div class="cart-item-info">
                                <h4>${name}</h4>
                                <div>Antall: ${item.quantity}</div>
                                <div class="cart-item-price">${item.price * item.quantity} NOK</div>
                            </div>
                            <button onclick="removeFromCart(${item.id})" style="margin-left: auto; background: #e74c3c; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">×</button>
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

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = isEnglish ? 'Sending...' : 'Sender...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = isEnglish ? 'Message Sent!' : 'Melding Sendt!';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    this.reset();
                }, 2000);
            }, 1000);
        });