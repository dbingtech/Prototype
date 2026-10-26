// Load components
// Load header
        // The placeholder's id names the file to load (header_SS -> header_SS.html)
        const headerEl = document.querySelector('#header_SS, #header_punchout, #header_EMP, #header_B2B, #header_B2C, #header');
        if (headerEl) {
        const headerFile = headerEl.id + '.html';
        fetch(headerFile)
            .then(response => response.text())
            .then(data => {
                headerEl.innerHTML = data;

                const quickOrderBtn = document.getElementById('quick_order_btn');
                const qoDropdown = document.getElementById('qo-dropdown');

                function setQuickOrderOpen(open, returnFocus) {
                    qoDropdown.classList.toggle('active', open);
                    quickOrderBtn.setAttribute('aria-expanded', String(open));
                    if (!open && returnFocus) quickOrderBtn.focus();
                }

                quickOrderBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    setQuickOrderOpen(!qoDropdown.classList.contains('active'), false);
                });

                document.addEventListener('click', function () {
                    if (qoDropdown.classList.contains('active')) setQuickOrderOpen(false, false);
                });

                qoDropdown.addEventListener('click', function (e) {
                    e.stopPropagation();
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && qoDropdown.classList.contains('active')) {
                        setQuickOrderOpen(false, true);
                    }
                });

                const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>`;
                const minusSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>`;

                function updateMinusIcon(stepper) {
                    const n = parseInt(stepper.querySelector('.qo-qty-value').textContent);
                    const minusBtn = stepper.querySelector('.qo-qty-minus');
                    minusBtn.innerHTML = n <= 1 ? trashSvg : minusSvg;
                    minusBtn.classList.toggle('is-disabled', n <= 1);
                }

                document.querySelectorAll('.qo-qty-stepper').forEach(function (stepper) {
                    stepper.querySelector('.qo-qty-minus').addEventListener('click', function () {
                        const val = stepper.querySelector('.qo-qty-value');
                        const n = parseInt(val.textContent);
                        if (n > 1) val.textContent = n - 1;
                        updateMinusIcon(stepper);
                    });
                    stepper.querySelector('.qo-qty-plus').addEventListener('click', function () {
                        const val = stepper.querySelector('.qo-qty-value');
                        val.textContent = parseInt(val.textContent) + 1;
                        updateMinusIcon(stepper);
                    });
                    updateMinusIcon(stepper);
                });

                const user = JSON.parse(localStorage.getItem('user'));
                const signInEl = document.getElementById('sign_in');
                if (user && user.signedIn && signInEl && headerEl.id === 'header') {
                    signInEl.innerHTML = '<img src="images/icons/user/Size=28, Color=White.svg" alt="" width="28" height="28">Sign In';
                    signInEl.href = '#';
                    signInEl.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('user');
                        window.location.reload();
                    });
                }

                // Search: spyglass (and Enter) go to the PLP for this header's version
                // B2C uses the guest PLP; punchout and EMP use the B2B PLP until they get their own
                const plpPage = headerEl.id === 'header' || headerEl.id === 'header_B2C' ? 'plp.html'
                    : headerEl.id === 'header_SS' ? 'plp_SS.html' : 'plp_B2B.html';
                ['search_icon', 'sm-search-btn'].forEach(function (id) {
                    const btn = document.getElementById(id);
                    if (btn) btn.addEventListener('click', function () {
                        window.location.href = plpPage;
                    });
                });
                ['search_bar', 'sm-search-bar'].forEach(function (id) {
                    const input = document.getElementById(id);
                    if (input) input.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter') window.location.href = plpPage;
                    });
                });

                // My Account modal (B2B, signed-in only; otherwise the link goes to register.html)
                const accountOverlay = document.getElementById('account_modal_overlay');
                const accountBtn = document.getElementById('my_account');
                if (accountOverlay && accountBtn && user && user.signedIn) {
                    const accountModal = accountOverlay.querySelector('.account-modal');
                    accountBtn.setAttribute('role', 'button');
                    accountBtn.setAttribute('aria-haspopup', 'menu');
                    accountBtn.setAttribute('aria-expanded', 'false');
                    accountBtn.setAttribute('aria-controls', 'account_modal_overlay');

                    function closeAccountModal(returnFocus) {
                        if (!accountOverlay.classList.contains('active')) return;
                        accountOverlay.classList.remove('active');
                        accountBtn.setAttribute('aria-expanded', 'false');
                        if (returnFocus) accountBtn.focus();
                    }

                    accountBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (accountOverlay.classList.contains('active')) {
                            closeAccountModal(false);
                            return;
                        }
                        const rect = this.getBoundingClientRect();
                        accountModal.style.top = rect.bottom + 8 + 'px';
                        accountModal.style.right = (window.innerWidth - rect.right) + 'px';
                        accountOverlay.classList.add('active');
                        accountBtn.setAttribute('aria-expanded', 'true');
                        accountModal.querySelector('.account-modal-item').focus();
                    });
                    accountOverlay.addEventListener('click', function (e) {
                        if (!e.target.closest('.account-modal')) closeAccountModal(false);
                    });
                    document.addEventListener('keydown', function (e) {
                        if (e.key === 'Escape') closeAccountModal(true);
                    });
                    document.getElementById('account_modal_sign_out').addEventListener('click', function () {
                        localStorage.removeItem('user');
                        window.location.href = 'index.html';
                    });
                }

                // Country / Currency modal
                const ccOverlay = document.getElementById('cc-modal-overlay');
                if (ccOverlay) {
                    const ccModal = ccOverlay.querySelector('.cc-modal');
                    document.addEventListener('click', function (e) {
                        const cc = e.target.closest('#country_currency, .js-cc-modal');
                        if (cc) {
                            const rect = cc.getBoundingClientRect();
                            ccModal.style.top = rect.bottom + 8 + 'px';
                            ccModal.style.left = rect.left + 'px';
                            ccOverlay.classList.add('active');
                        }
                    });
                    ccOverlay.addEventListener('click', function (e) {
                        if (!e.target.closest('.cc-modal')) {
                            ccOverlay.classList.remove('active');
                        }
                    });
                    document.getElementById('cc-save').addEventListener('click', function () {
                        ccOverlay.classList.remove('active');
                    });
                    document.addEventListener('keydown', function (e) {
                        if (e.key === 'Escape') ccOverlay.classList.remove('active');
                    });
                }

                // Mini cart modal
                const cartOverlay = document.getElementById('cart_modal_overlay');
                if (cartOverlay) {
                    const cartModal = cartOverlay.querySelector('.cart-modal');
                    const cartBtn = document.getElementById('cart');
                    const cartClose = document.getElementById('cart_modal_close');
                    const cartTitle = document.getElementById('cart_modal_title');
                    const cartSummary = cartModal.querySelector('.cart-modal-summary');
                    const cartCount = document.getElementById('cart_modal_count');
                    const cartAdded = document.getElementById('cart_modal_added');
                    const cartItems = cartModal.querySelector('.cart-modal-items:not(#cart_modal_added)');
                    const cartTotal = document.getElementById('cart_modal_total');
                    const cartEmpty = cartModal.querySelector('.cart-modal-empty');
                    const lineTemplate = document.getElementById('cart_line_template').content;
                    const lineItemTemplate = lineTemplate.querySelector('.cart-line-item');
                    const dividerTemplate = lineTemplate.querySelector('.cart-divider');
                    let cartReturnFocus = cartBtn;

                    // Count badge: red circle on the cart icon's top right, hidden while the cart is empty.
                    // Wraps the icon so the badge sits on it rather than on the whole button.
                    const cartIcon = document.createElement('span');
                    cartIcon.className = 'cart-icon';
                    const cartBadge = document.createElement('span');
                    cartBadge.className = 'cart-badge';
                    cartBadge.setAttribute('aria-hidden', 'true');
                    cartBadge.hidden = true;
                    const cartSvg = cartBtn.querySelector('svg');
                    cartSvg.before(cartIcon);
                    cartIcon.append(cartSvg, cartBadge);

                    // added = true shows the Figma "Added to Cart" state (just the new line item);
                    // addedTitle replaces that heading (e.g. "Added to Requisition" on SmartSUPPLY)
                    function openCartModal(added, addedTitle) {
                        const rect = cartBtn.getBoundingClientRect();
                        cartModal.style.top = rect.bottom + 8 + 'px';
                        cartModal.style.right = (window.innerWidth - rect.right) + 'px';
                        const empty = !cartItems.querySelector('.cart-line-item');
                        cartTitle.textContent = added ? addedTitle || 'Added to Cart' : 'Cart';
                        cartSummary.hidden = added || empty;
                        cartItems.hidden = added || empty;
                        cartEmpty.hidden = added || !empty;
                        cartAdded.hidden = !added;
                        cartOverlay.classList.add('active');
                        cartBtn.setAttribute('aria-expanded', 'true');
                        cartClose.focus();
                    }

                    function closeCartModal() {
                        if (!cartOverlay.classList.contains('active')) return;
                        cartOverlay.classList.remove('active');
                        cartBtn.setAttribute('aria-expanded', 'false');
                        cartReturnFocus.focus();
                    }

                    cartBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        cartReturnFocus = cartBtn;
                        openCartModal(false);
                    });
                    cartOverlay.addEventListener('click', function (e) {
                        if (!e.target.closest('.cart-modal')) closeCartModal();
                    });
                    cartClose.addEventListener('click', closeCartModal);
                    document.addEventListener('keydown', function (e) {
                        if (e.key === 'Escape') closeCartModal();
                    });

                    // Mini cart API for Add To Cart buttons (e.g. PLP cards).
                    // item = { key, sku, brand, name, price, image, imageAlt, addedTitle }; key defaults to sku.
                    function findLine(key) {
                        return Array.from(cartItems.querySelectorAll('.cart-line-item'))
                            .find(function (li) { return li.dataset.key === key; });
                    }

                    function setLineQty(line, qty) {
                        line.dataset.qty = qty;
                        line.querySelector('.cart-line-item-qty').lastChild.textContent = ' ' + qty.toLocaleString('en-US');
                    }

                    // Count = number of lines; Total = sum of qty x unit price (lines without a numeric price are skipped)
                    function updateCartCount() {
                        const lines = cartItems.querySelectorAll('.cart-line-item');
                        let total = 0;
                        let units = 0;  // badge: total quantity across lines (99+ past two digits)
                        lines.forEach(function (li) {
                            const qty = parseInt(li.dataset.qty, 10);
                            const price = parseFloat(li.querySelector('.cart-line-item-price').textContent.replace(/[^0-9.]/g, ''));
                            if (!isNaN(price)) total += price * qty;
                            units += qty;
                        });
                        cartCount.textContent = lines.length;
                        cartBadge.textContent = units > 99 ? '99+' : units;
                        cartBadge.hidden = units === 0;
                        cartBtn.setAttribute('aria-label', units ? 'Cart, ' + units.toLocaleString('en-US') + (units === 1 ? ' item' : ' items') : 'Cart');
                        cartTotal.textContent = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    }

                    // Adds 1 (or bumps an existing line) and shows the "Added to Cart" view
                    window.addToMiniCart = function (item, trigger) {
                        const key = item.key || item.sku;
                        let line = findLine(key);
                        if (line) {
                            setLineQty(line, parseInt(line.dataset.qty, 10) + 1);
                        } else {
                            line = lineItemTemplate.cloneNode(true);
                            line.dataset.key = key;
                            const img = line.querySelector('.cart-line-item-img');
                            img.src = item.image;
                            img.alt = item.imageAlt || '';
                            line.querySelector('.cart-line-item-brand').textContent = item.brand;
                            line.querySelector('.cart-line-item-name').textContent = item.name;
                            line.querySelector('.cart-line-item-part').lastChild.textContent = ' ' + item.sku;
                            line.querySelector('.cart-line-item-price').textContent = item.price;
                            setLineQty(line, 1);
                            if (cartItems.firstElementChild) cartItems.prepend(dividerTemplate.cloneNode(true));
                            cartItems.prepend(line);
                        }
                        updateCartCount();
                        cartAdded.replaceChildren(line.cloneNode(true));
                        cartReturnFocus = trigger || cartBtn;
                        openCartModal(true, item.addedTitle);
                    };

                    // Sets a line's quantity without opening the cart; 0 removes the line
                    window.setMiniCartQty = function (key, qty) {
                        const line = findLine(key);
                        if (!line) return;
                        if (qty > 0) {
                            setLineQty(line, qty);
                        } else {
                            const next = line.nextElementSibling;
                            const prev = line.previousElementSibling;
                            if (next && next.classList.contains('cart-divider')) next.remove();
                            else if (prev && prev.classList.contains('cart-divider')) prev.remove();
                            line.remove();
                        }
                        updateCartCount();
                    };
                }

            });
        } // end if (headerEl)

        // Load nav
        const navbarEl = document.querySelector('#navbar_SS, #navbar_punchout, #navbar_EMP, #navbar_B2B, #navbar_B2C, #navbar');
        if (navbarEl) {
        const navbarFile = navbarEl.id + '.html';
        fetch(navbarFile)
            .then(response => response.text())
            .then(data => {
                navbarEl.innerHTML = data;

                const hamburger = document.getElementById('hamburger');
                const sideMenu = document.getElementById('sideMenu');
                const menuOverlay = document.getElementById('menuOverlay');
                const closeMenu = document.getElementById('closeMenu');

                function openMenu() {
                    sideMenu.classList.add('active');
                    menuOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }

                function closeMenuFunc() {
                    sideMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }

                hamburger.addEventListener('click', openMenu);
                closeMenu.addEventListener('click', closeMenuFunc);
                menuOverlay.addEventListener('click', closeMenuFunc);

                // Accordion sections (Products, Services, Knowledge, Material Control): the title toggles the list after it
                sideMenu.querySelectorAll('.menu-section-items').forEach(function (items) {
                    items.previousElementSibling.addEventListener('click', function () {
                        const isCollapsed = this.classList.contains('collapsed');
                        if (isCollapsed) {
                            items.style.maxHeight = '2000px';
                            this.classList.remove('collapsed');
                        } else {
                            items.style.maxHeight = '0';
                            this.classList.add('collapsed');
                        }
                    });
                });

                // SM hamburger also opens the side menu
                const smHamburger = document.getElementById('sm-hamburger');
                if (smHamburger) {
                    smHamburger.addEventListener('click', openMenu);
                }

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
                        closeMenuFunc();
                    }
                });

                const productScroll = document.getElementById('product-scroll');
                const productScrollLeft = document.getElementById('product-scroll-left');
                const productScrollRight = document.getElementById('product-scroll-right');
                if (productScroll && productScrollLeft && productScrollRight) {
                    const scrollAmount = 160;
                    productScrollLeft.addEventListener('click', function () {
                        productScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });
                    productScrollRight.addEventListener('click', function () {
                        productScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });

                    // Left chevron only once the links have scrolled left (none at the start).
                    // If it had focus when it hides, focus moves to the right chevron instead of being lost.
                    function updateScrollLeft() {
                        const atStart = productScroll.scrollLeft <= 1;
                        if (atStart && document.activeElement === productScrollLeft) productScrollRight.focus();
                        productScrollLeft.style.display = atStart ? 'none' : '';
                    }
                    productScroll.addEventListener('scroll', updateScrollLeft, { passive: true });
                    updateScrollLeft();
                }
            });
        } // end if (navbarEl)

        // Load footer
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer').innerHTML = data;
                document.getElementById('copyright').innerHTML = new Date().getFullYear();

                document.querySelectorAll('.footer-accordion-header').forEach(function (header) {
                    header.addEventListener('click', function () {
                        this.closest('.footer-accordion-group').classList.toggle('open');
                    });
                });
            });
        // Load hero
        const heroEl = document.querySelector('#hero_SS, #hero_punchout, #hero_EMP, #hero_B2B, #hero');
        if (heroEl) {
        const heroFile = heroEl.id + '.html';
        fetch(heroFile)
            .then(response => response.text())
            .then(data => {
                heroEl.innerHTML = data;

                const slides = document.querySelectorAll('.carousel-slide');
                const dots = document.querySelectorAll('.carousel-dot');
                let current = 0;
                let timer;

                function goTo(index) {
                    slides[current].classList.remove('active');
                    dots[current].classList.remove('active');
                    current = (index + slides.length) % slides.length;
                    slides[current].classList.add('active');
                    dots[current].classList.add('active');
                }

                function startTimer() {
                    timer = setInterval(() => goTo(current + 1), 4000);
                }

                dots.forEach((dot, i) => {
                    dot.addEventListener('click', () => {
                        clearInterval(timer);
                        goTo(i);
                        startTimer();
                    });
                });

                startTimer();

                // index.html only: after 1.5s, pop up the visually hidden h1's text.
                // Checked by filename because index_B2C.html also loads #hero.
                const page = window.location.pathname.split('/').pop();
                const hiddenH1 = heroEl.querySelector('.hidden-h1');
                if ((page === '' || page === 'index.html') && hiddenH1) {
                    setTimeout(function () {
                        const h1Overlay = document.createElement('div');
                        h1Overlay.id = 'h1_popup_overlay';
                        h1Overlay.innerHTML =
                            '<div class="h1-popup" role="dialog" aria-modal="true" aria-labelledby="h1_popup_label">' +
                                '<button type="button" class="h1-popup-close" aria-label="Close">&times;</button>' +
                                '<p class="h1-popup-label" id="h1_popup_label">Hidden H1 on this page for SEO:</p>' +
                                '<p class="h1-popup-text"></p>' +
                            '</div>';
                        // textContent so the h1 text is shown as-is, never parsed as HTML
                        h1Overlay.querySelector('.h1-popup-text').textContent = hiddenH1.textContent.trim();
                        document.body.appendChild(h1Overlay);

                        // Auto-close 5s after it opens
                        const h1AutoClose = setTimeout(closeH1Popup, 5000);

                        function closeH1Popup() {
                            clearTimeout(h1AutoClose);
                            h1Overlay.classList.remove('active');
                            document.removeEventListener('keydown', onH1PopupKey);
                        }
                        function onH1PopupKey(e) {
                            if (e.key === 'Escape') closeH1Popup();
                        }
                        h1Overlay.querySelector('.h1-popup-close').addEventListener('click', closeH1Popup);
                        h1Overlay.addEventListener('click', function (e) {
                            if (!e.target.closest('.h1-popup')) closeH1Popup();
                        });
                        document.addEventListener('keydown', onH1PopupKey);

                        // Next frame so the opacity transition runs
                        requestAnimationFrame(function () {
                            h1Overlay.classList.add('active');
                            h1Overlay.querySelector('.h1-popup-close').focus();
                        });
                    }, 1500);
                }
            });
        } // end if (heroEl)
        fetch('hero2.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('hero2').innerHTML = data;

                // Restart the video 10 seconds before it ends (skips the outro)
                const SKIP_END_SECONDS = 10;
                window.onYouTubeIframeAPIReady = function () {
                    const player = new YT.Player('hero2_video', {
                        events: {
                            onReady: function () {
                                setInterval(() => {
                                    const duration = player.getDuration();
                                    if (duration > SKIP_END_SECONDS && player.getCurrentTime() >= duration - SKIP_END_SECONDS) {
                                        player.seekTo(0, true);
                                    }
                                }, 250);
                            }
                        }
                    });
                };
                const ytApi = document.createElement('script');
                ytApi.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(ytApi);
            });
        fetch('trusted_brands.html')
            .then(response => response.text())
            .then(data => document.getElementById('trusted_brands').innerHTML = data);
        // Load Buy Again / Keep Shopping For (B2B and B2C homepages)
        const groupByEl = document.getElementById('group_by');
        if (groupByEl) {
        fetch('group_by.html')
            .then(response => response.text())
            .then(data => groupByEl.innerHTML = data);
        }
        // Load home categories
        fetch('new_home_categories.html')
            .then(response => response.text())
            .then(data => document.getElementById('new_home_categories').innerHTML = data);
        fetch('homepage_ads.html')
            .then(response => response.text())
            .then(data => document.getElementById('homepage_ads').innerHTML = data);

        // Quantity pill (PLP cards, PDP card): replaces Add To Cart once clicked.
        // Trash at 1, minus above 1, typeable number, plus. Styles in _plp.scss (.plp-qty).
        function buildQtyPill(name) {
            const pill = document.createElement('div');
            pill.className = 'plp-qty';
            pill.setAttribute('role', 'group');
            pill.setAttribute('aria-label', 'Quantity of ' + name + ' in cart');
            pill.innerHTML =
                '<button type="button" class="plp-qty-minus"><img alt="" width="24" height="24"></button>' +
                '<input type="text" class="plp-qty-input" inputmode="numeric" aria-label="Quantity">' +
                '<button type="button" class="plp-qty-plus" aria-label="Increase quantity">' +
                '<img src="images/icons/plp/qty_plus_16.svg" alt="" width="16" height="16"></button>';
            return pill;
        }

        function renderQtyPill(pill, qty) {
            pill.dataset.qty = qty;
            pill.querySelector('.plp-qty-input').value = qty;
            const minus = pill.querySelector('.plp-qty-minus');
            const img = minus.querySelector('img');
            if (qty <= 1) {
                img.src = 'images/icons/plp/qty_delete_24.svg';
                img.width = 24;
                img.height = 24;
                minus.setAttribute('aria-label', 'Remove from cart');
            } else {
                img.src = 'images/icons/plp/qty_minus_16.svg';
                img.width = 16;
                img.height = 16;
                minus.setAttribute('aria-label', 'Decrease quantity');
            }
        }

        // Load PDP card
        // The placeholder's id names the file to load (pdpcard_B2B -> pdpcard_B2B.html)
        const pdpcardEl = document.querySelector('#pdpcard_SS, #pdpcard_B2B, #pdpcard');
        if (pdpcardEl) {
        fetch(pdpcardEl.id + '.html')
            .then(response => response.text())
            .then(data => {
                pdpcardEl.innerHTML = data;

                // Compare: checking it takes the user down to Alternatives to pick items to compare with.
                // Focus stays on the checkbox; unchecking doesn't scroll.
                document.getElementById('pdp_compare').addEventListener('change', function () {
                    const alternatives = document.getElementById('pdp_alternatives');
                    if (!this.checked || !alternatives) return;
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    alternatives.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                });

                const favoriteBtn = document.getElementById('pdp_favorite');
                favoriteBtn.addEventListener('click', function () {
                    const on = this.getAttribute('aria-pressed') !== 'true';
                    this.setAttribute('aria-pressed', String(on));
                    this.setAttribute('aria-label', on ? 'Remove from favorites' : 'Add to favorites');
                });

                // Copy: confirmation pops up as a tooltip on that row, past the copy and Prop 65 icons, for 2 seconds.
                // Each tooltip stays in the page (empty = hidden) so screen readers announce it.
                pdpcardEl.querySelectorAll('.pdp-card-copy').forEach(function (btn) {
                    const tip = document.createElement('span');
                    tip.className = 'pdp-card-copy-tip';
                    tip.setAttribute('role', 'status');
                    btn.closest('dd').append(tip);
                    let tipTimer;

                    function showTip(text) {
                        clearTimeout(tipTimer);
                        tip.textContent = text;
                        tipTimer = setTimeout(function () { tip.textContent = ''; }, 2000);
                    }
                    btn.addEventListener('click', function () {
                        navigator.clipboard.writeText(this.dataset.copy)
                            .then(() => showTip('Copied'))
                            .catch(() => showTip('Copy failed'));
                    });
                });

                // Prop 65 on MD and smaller (no hover there): the first tap on the icon opens the warning instead of
                // the site; with it open, tapping the warning (or the icon, or Enter) follows the link.
                // Tapping anywhere else or Escape closes it.
                const p65 = pdpcardEl.querySelector('.pdp-card-p65');
                if (p65) {
                    const p65Stacked = window.matchMedia('(max-width: 991px)');  // MD, SM, XSM
                    p65.addEventListener('click', function (e) {
                        if (!p65Stacked.matches) return;
                        if (p65.classList.contains('is-open')) {
                            p65.classList.remove('is-open');
                            return;
                        }
                        e.preventDefault();
                        p65.classList.add('is-open');
                    });
                    document.addEventListener('click', function (e) {
                        if (!p65.contains(e.target)) p65.classList.remove('is-open');
                    });
                    document.addEventListener('keydown', function (e) {
                        if (e.key === 'Escape') p65.classList.remove('is-open');
                    });
                    p65Stacked.addEventListener('change', function () { p65.classList.remove('is-open'); });
                }

                // Share: copy the page URL and confirm in a message floated at the right end of the breadcrumbs row
                // (the empty space above the buy box), so nothing below moves.
                // The status element stays in the page (empty = hidden) so screen readers announce each message.
                const breadcrumbsEl = document.getElementById('breadcrumbs');
                const shareBtn = pdpcardEl.querySelector('.pdp-card-share');
                if (breadcrumbsEl && shareBtn) {
                    const shareMsg = document.createElement('p');
                    shareMsg.className = 'pdp-share-message';
                    shareMsg.setAttribute('role', 'status');
                    breadcrumbsEl.append(shareMsg);
                    let shareMsgTimer;

                    function showShareMessage(text, failed) {
                        clearTimeout(shareMsgTimer);
                        shareMsg.textContent = text;
                        shareMsg.classList.toggle('pdp-share-message--error', failed);
                        shareMsgTimer = setTimeout(function () { shareMsg.textContent = ''; }, 4000);
                    }
                    shareBtn.addEventListener('click', function () {
                        navigator.clipboard.writeText(window.location.href)
                            .then(() => showShareMessage('URL Copied', false))
                            .catch(() => showShareMessage('Couldn\'t copy the URL', true));
                    });
                }

                // B2B on MD and smaller: "In Stock" jumps down to the Availability summary under the stacked card
                // (smooth unless the user prefers reduced motion) and focuses it. It's only a link while that
                // layout shows; without an href it's plain text.
                const stockLink = pdpcardEl.querySelector('a.pdp-card-stock');
                const availabilityEl = document.getElementById('pdp_availability');
                if (stockLink && availabilityEl) {
                    const stackedLayout = window.matchMedia('(max-width: 991px)');  // MD, SM, XSM
                    function syncStockLink() {
                        if (stackedLayout.matches) stockLink.setAttribute('href', '#pdp_availability');
                        else stockLink.removeAttribute('href');
                    }
                    syncStockLink();
                    stackedLayout.addEventListener('change', syncStockLink);
                    stockLink.addEventListener('click', function (e) {
                        if (!stockLink.hasAttribute('href')) return;
                        e.preventDefault();
                        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        availabilityEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                        availabilityEl.querySelector('.pdp-availability-link').focus({ preventScroll: true });
                    });
                }

                // Image zoom: the product image opens a larger view in a native <dialog> (Escape closes, focus stays
                // inside and goes back to the image after). Clicking the large image zooms in 2x at that spot and the
                // mouse pans; clicking again zooms out. Enter/Space zoom on the center.
                const imageBtn = pdpcardEl.querySelector('.pdp-card-image-btn');
                if (imageBtn) {
                    const zoom = document.createElement('dialog');
                    zoom.className = 'pdp-zoom';
                    zoom.innerHTML =
                        '<button type="button" class="pdp-zoom-close" aria-label="Close">' +
                            '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>' +
                        '</button>' +
                        '<button type="button" class="pdp-zoom-toggle"><img class="pdp-zoom-image" alt=""></button>';
                    document.body.append(zoom);
                    const zoomToggle = zoom.querySelector('.pdp-zoom-toggle');
                    const zoomImage = zoom.querySelector('.pdp-zoom-image');

                    function setZoomed(on) {
                        zoomToggle.classList.toggle('is-zoomed', on);
                        zoomToggle.setAttribute('aria-pressed', String(on));
                        zoomToggle.setAttribute('aria-label', on ? 'Zoom out' : 'Zoom in');
                    }
                    function zoomAt(e) {
                        const r = zoomToggle.getBoundingClientRect();
                        zoomImage.style.transformOrigin =
                            ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
                    }

                    imageBtn.addEventListener('click', function () {
                        const image = imageBtn.querySelector('img');
                        zoomImage.src = image.currentSrc || image.src;
                        zoom.setAttribute('aria-label', image.alt);
                        zoomImage.style.transformOrigin = '';
                        setZoomed(false);
                        zoom.showModal();
                    });
                    zoomToggle.addEventListener('click', function (e) {
                        if (e.detail) zoomAt(e);  // mouse click: zoom on that spot (detail is 0 for Enter/Space)
                        else zoomImage.style.transformOrigin = '';
                        setZoomed(!zoomToggle.classList.contains('is-zoomed'));
                    });
                    zoomToggle.addEventListener('mousemove', function (e) {
                        if (zoomToggle.classList.contains('is-zoomed')) zoomAt(e);
                    });
                    zoom.querySelector('.pdp-zoom-close').addEventListener('click', function () { zoom.close(); });
                    // A click on the dimmed backdrop lands on the dialog itself; only close if it's outside the white box
                    zoom.addEventListener('click', function (e) {
                        if (e.target !== zoom) return;
                        const r = zoom.getBoundingClientRect();
                        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) zoom.close();
                    });
                }

                // Condensed card: pins to the top once the full card scrolls out of view (XXL only, see _pdpcard.scss).
                // Built from the loaded card so guest and B2B stay in sync; Add To Cart passes the click to the card's button.
                const card = pdpcardEl.querySelector('.pdp-card');
                const mini = document.createElement('div');
                mini.className = 'pdp-mini';
                mini.setAttribute('role', 'region');
                mini.setAttribute('aria-label', 'Product summary');
                mini.innerHTML =
                    '<div class="pdp-mini-inner">' +
                        '<img class="pdp-mini-image" alt="" width="88" height="88">' +
                        '<div class="pdp-mini-details">' +
                            '<div class="pdp-mini-top"><p class="pdp-mini-brand"></p></div>' +
                            '<a class="pdp-mini-title" href="#"></a>' +
                            '<p class="pdp-mini-name"></p>' +
                        '</div>' +
                        '<div class="pdp-mini-buy">' +
                            '<p class="pdp-mini-price"><span class="pdp-mini-amount"></span> <span class="pdp-mini-unit"></span></p>' +
                            '<button type="button" class="btn btn--primary pdp-mini-add">Add To Cart</button>' +
                        '</div>' +
                    '</div>';
                mini.querySelector('.pdp-mini-image').src = card.querySelector('.pdp-card-image').src;
                mini.querySelector('.pdp-mini-brand').textContent = card.querySelector('.pdp-card-brand').textContent;
                mini.querySelector('.pdp-mini-title').textContent = card.querySelector('.pdp-card-title').textContent;
                mini.querySelector('.pdp-mini-name').textContent = card.querySelector('.pdp-card-name').textContent;
                mini.querySelector('.pdp-mini-amount').textContent = card.querySelector('.pdp-card-amount').textContent;
                mini.querySelector('.pdp-mini-unit').textContent = card.querySelector('.pdp-card-unit').textContent;

                // Title goes back to the full card
                mini.querySelector('.pdp-mini-title').addEventListener('click', function (e) {
                    e.preventDefault();
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
                });
                const cardAdd = card.querySelector('.pdp-card-add.btn--primary');
                const miniAdd = mini.querySelector('.pdp-mini-add');
                if (cardAdd) miniAdd.textContent = cardAdd.textContent;  // e.g. "Add To Requisition" on SmartSUPPLY
                document.body.append(mini);

                // Add To Cart -> quantity pill, on the card and the condensed card at once so they stay in step
                // (guest and B2B; on B2B, Buy Now stays under the pill)
                if (cardAdd) {
                    const sku = card.querySelector('.pdp-card-id-value').textContent.trim();
                    const name = card.querySelector('.pdp-card-title').textContent.trim();
                    const image = card.querySelector('.pdp-card-image');
                    let pills = [];  // [card pill, condensed pill] while the item is in the cart

                    // qty 0 removes the item and brings back both Add To Cart buttons;
                    // focus goes to the button in whichever card was used
                    function setPdpQty(qty, inMini) {
                        if (window.setMiniCartQty) window.setMiniCartQty(sku, qty);
                        if (qty > 0) {
                            pills.forEach(function (pill) { renderQtyPill(pill, qty); });
                        } else {
                            pills.forEach(function (pill) { pill.remove(); });
                            pills = [];
                            cardAdd.hidden = false;
                            miniAdd.hidden = false;
                            (inMini ? miniAdd : cardAdd).focus();
                        }
                    }

                    // Pills at 1 and the "Added to Cart" modal; focus comes back to the full card's pill after.
                    // Ignored if the item is already in (e.g. a second click while scrolling up).
                    function addPdpToCart() {
                        if (pills.length) return;
                        pills = [cardAdd, miniAdd].map(function (btn) {
                            const pill = buildQtyPill(name);
                            btn.hidden = true;
                            btn.after(pill);
                            renderQtyPill(pill, 1);
                            return pill;
                        });
                        window.addToMiniCart({
                            sku: sku,
                            brand: card.querySelector('.pdp-card-brand').textContent.trim(),
                            name: name,
                            price: card.querySelector('.pdp-card-amount').textContent.replace(/\$\s+(?=\d)/, '$').trim() + ' ' +
                                card.querySelector('.pdp-card-unit').textContent.trim(),
                            image: image.getAttribute('src'),
                            imageAlt: image.alt,
                            addedTitle: cardAdd.dataset.addedTitle
                        }, pills[0].querySelector('.plp-qty-input'));
                    }

                    // Smooth unless the user prefers reduced motion (or the browser has no scrollend to wait on)
                    function scrollToTopThen(callback) {
                        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (window.scrollY === 0 || reduce || !('onscrollend' in window)) {
                            window.scrollTo(0, 0);
                            callback();
                            return;
                        }
                        window.addEventListener('scrollend', callback, { once: true });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }

                    [card, mini].forEach(function (scope) {
                        const inMini = scope === mini;
                        scope.addEventListener('click', function (e) {
                            const addBtn = e.target.closest('.pdp-card-add.btn--primary, .pdp-mini-add');
                            if (addBtn && window.addToMiniCart) {
                                e.stopPropagation();
                                // Condensed card: back up to the full card first, then add as if its button was clicked
                                // (the cart modal opens under the header's cart icon, which is only on screen at the top)
                                if (inMini) scrollToTopThen(addPdpToCart);
                                else addPdpToCart();
                                return;
                            }
                            const qtyBtn = e.target.closest('.plp-qty-minus, .plp-qty-plus');
                            if (qtyBtn) {
                                const step = qtyBtn.classList.contains('plp-qty-plus') ? 1 : -1;
                                setPdpQty(parseInt(qtyBtn.closest('.plp-qty').dataset.qty, 10) + step, inMini);
                            }
                        });
                        scope.addEventListener('keydown', function (e) {
                            if (e.key === 'Enter' && e.target.classList.contains('plp-qty-input')) e.target.blur();
                        });
                        scope.addEventListener('change', function (e) {
                            if (!e.target.classList.contains('plp-qty-input')) return;
                            const typed = e.target.value.trim();
                            if (!/^\d+$/.test(typed)) {
                                e.target.value = e.target.closest('.plp-qty').dataset.qty;  // not a whole number: put the old value back
                                return;
                            }
                            setPdpQty(parseInt(typed, 10), inMini);
                        });
                    });
                }

                // Visible only after the card has scrolled up past the top, not before it comes into view
                new IntersectionObserver(function (entries) {
                    const entry = entries[0];
                    mini.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
                }).observe(card);
            });
        } // end if (pdpcardEl)

        // PDP details (pdp.html, pdp_B2B.html, pdp_SS.html): attribute filters, compare, pagination
        const pdpDetailsEl = document.getElementById('pdp_details');
        if (pdpDetailsEl) {
            // pdp_B2B.html: the Availability summary goes to Inventory Details (smooth unless the user prefers
            // reduced motion), then focuses its heading so keyboard and screen reader users land there too
            const availabilityLink = pdpDetailsEl.querySelector('.pdp-availability-link');
            if (availabilityLink) {
                availabilityLink.addEventListener('click', function (e) {
                    const section = document.getElementById('pdp_inventory');
                    if (!section) return;
                    e.preventDefault();
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                    history.pushState(null, '', '#pdp_inventory');
                    const heading = section.querySelector('.pdp-section-title');
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({ preventScroll: true });
                });
            }

            // Specifications + Alternatives are shared by pdp.html and pdp_B2B.html;
            // data-sections picks another file (pdp_SS.html: pdp-sections-SS.html)
            const pdpSectionsEl = document.getElementById('pdp_sections');
            fetch(pdpSectionsEl.dataset.sections || 'pdp-sections.html')
                .then(response => response.text())
                .then(data => {
                    pdpSectionsEl.innerHTML = data;

                    // pdp_B2B.html: Inventory Details goes between Specifications and Alternatives
                    const inventoryEl = document.getElementById('pdp_inventory');
                    if (inventoryEl) document.getElementById('pdp_alternatives').before(inventoryEl);

                    // A deep link (e.g. pdp.html#pdp_alternatives) lands before its section exists; go there once it does
                    const hashTarget = location.hash && document.getElementById(location.hash.slice(1));
                    if (hashTarget) hashTarget.scrollIntoView();

                    // Select / De-select All mirrors the attribute boxes (some checked = indeterminate)
                    const altAll = document.getElementById('pdp_alt_all');
                    const altAttrs = Array.from(pdpDetailsEl.querySelectorAll('.pdp-alt-attr input'));
                    function checkedAttrCount() {
                        return altAttrs.filter(function (input) { return input.checked; }).length;
                    }
                    altAll.addEventListener('change', function () {
                        altAttrs.forEach(function (input) { input.checked = altAll.checked; });
                    });
                    altAttrs.forEach(function (input) {
                        input.addEventListener('change', function () {
                            const n = checkedAttrCount();
                            altAll.checked = n === altAttrs.length;
                            altAll.indeterminate = n > 0 && n < altAttrs.length;
                        });
                    });

                    // Prototype: there's no search behind these yet, so just confirm the action
                    const altStatus = document.getElementById('pdp_alt_status');
                    document.getElementById('pdp_alt_refresh').addEventListener('click', function () {
                        altStatus.textContent = 'Results refreshed using ' + checkedAttrCount() + ' of ' + altAttrs.length + ' attributes.';
                    });
                    // Compare Selected opens the compare page (static sample products for now) once an item is checked
                    const compareStatus = document.getElementById('pdp_compare_status');
                    document.getElementById('pdp_compare_selected').addEventListener('click', function () {
                        if (pdpDetailsEl.querySelector('.pdp-alt-table input:checked')) {
                            window.location.href = 'compare.html';
                            return;
                        }
                        compareStatus.textContent = 'Select at least one item to compare.';
                    });

                    // Pagination (visual only): current page and items per page
                    const pages = pdpDetailsEl.querySelectorAll('.pdp-page');
                    const prevPage = pdpDetailsEl.querySelector('.pdp-page-arrow[data-step="-1"]');
                    const nextPage = pdpDetailsEl.querySelector('.pdp-page-arrow[data-step="1"]');
                    let currentPage = 0;
                    function goToPage(i) {
                        pages[currentPage].removeAttribute('aria-current');
                        currentPage = i;
                        pages[currentPage].setAttribute('aria-current', 'page');
                        prevPage.disabled = i === 0;
                        nextPage.disabled = i === pages.length - 1;
                    }
                    pages.forEach(function (btn, i) {
                        btn.addEventListener('click', function () { goToPage(i); });
                    });
                    [prevPage, nextPage].forEach(function (btn) {
                        btn.addEventListener('click', function () { goToPage(currentPage + Number(this.dataset.step)); });
                    });
                    const perPageOpts = pdpDetailsEl.querySelectorAll('.pdp-per-page-opt');
                    perPageOpts.forEach(function (opt) {
                        opt.addEventListener('click', function () {
                            perPageOpts.forEach(function (o) { o.removeAttribute('aria-current'); });
                            this.setAttribute('aria-current', 'true');
                        });
                    });
                });
        } // end if (pdpDetailsEl)

        // Back to top: appears after one screen of scrolling; smooth unless the user prefers reduced motion
        const backToTop = document.getElementById('back_to_top');
        if (backToTop) {
            function updateBackToTop() {
                backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight);
            }
            window.addEventListener('scroll', updateBackToTop, { passive: true });
            updateBackToTop();

            backToTop.addEventListener('click', function () {
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
                // Keyboard users continue from the top of the page, not the end of it
                const first = headerEl && headerEl.querySelector('a[href], button');
                if (first) first.focus({ preventScroll: true });
            });
        } // end if (backToTop)

        // Compare page (compare.html): highlight attributes whose values differ; the × removes that product's column
        const compareTable = document.querySelector('.compare-table');
        if (compareTable) {
            const compareStatusEl = document.querySelector('.compare-status');

            function markCompareDiffs() {
                compareTable.querySelectorAll('.compare-attr').forEach(function (group) {
                    const values = Array.from(group.querySelectorAll('td'), function (td) { return td.textContent.trim(); });
                    group.classList.toggle('compare-attr--diff', new Set(values).size > 1);
                });
            }
            markCompareDiffs();

            compareTable.addEventListener('click', function (e) {
                const removeBtn = e.target.closest('.compare-remove');
                if (!removeBtn) return;
                const col = removeBtn.closest('th');
                const i = Array.from(col.parentElement.children).indexOf(col);
                const name = col.getAttribute('abbr');
                col.remove();
                compareTable.querySelectorAll('.compare-attr').forEach(function (group) {
                    group.rows[1].cells[i].remove();
                    group.rows[0].cells[0].colSpan -= 1;
                });
                markCompareDiffs();
                compareStatusEl.textContent = 'Removed ' + name + ' from compare.';

                // Keep keyboard focus nearby: the next column's ×, else the previous one, else the empty message
                const removeBtns = compareTable.querySelectorAll('.compare-remove');
                if (removeBtns.length) {
                    removeBtns[Math.min(i, removeBtns.length - 1)].focus();
                } else {
                    document.querySelector('.compare-table-scroll').hidden = true;
                    const empty = document.querySelector('.compare-empty');
                    empty.hidden = false;
                    empty.querySelector('a').focus();
                }
            });
        } // end if (compareTable)

        // Load PLP filter (plp-filter.html): facet accordions, Show More, unit toggle
        const plpFilterEl = document.getElementById('plp_filter');
        if (plpFilterEl) {
        fetch('plp-filter.html')
            .then(response => response.text())
            .then(data => {
                plpFilterEl.innerHTML = data;

                // Has Customer Part No. / Contracted: signed-in (B2B-style header) pages only
                if (!headerEl || headerEl.id === 'header') {
                    plpFilterEl.querySelectorAll('[data-b2b-only]').forEach(function (el) { el.remove(); });
                }

                plpFilterEl.querySelectorAll('.plp-facet-toggle').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        const open = this.getAttribute('aria-expanded') !== 'true';
                        this.setAttribute('aria-expanded', String(open));
                        document.getElementById(this.getAttribute('aria-controls')).hidden = !open;
                    });
                });

                plpFilterEl.querySelectorAll('.plp-show-more').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        const list = this.previousElementSibling;
                        const expanded = list.classList.toggle('is-expanded');
                        this.setAttribute('aria-expanded', String(expanded));
                        this.textContent = expanded ? 'Show Less' : 'Show More';
                    });
                });

                // Categories: clicking a category with subcategories drills into them. On the last
                // level (nothing below it) a click selects the category instead: it turns semibold and
                // the chevrons go away. Each category in the path gets a pill in the pill bar
                // (Category: Bearings, Category: Ball Bearings, ...); removing a pill goes back up to
                // the level it was picked from, and Reset Filters goes back to the top-level categories.
                let resetCategories = null;
                const SUBCATEGORIES = {
                    'Bearings': ['Ball Bearings (80,093)', 'Mounted Units & Inserts (188,511)', 'Plain Bearings (30,029)', 'Roller Bearings (105,380)'],
                    'Ball Bearings': ['Angular Contact Ball Bearings (10,692)', 'Miniature Precision Ball Bearings (123)', 'Precision Ball Bearings (19,932)',
                        'Self Aligning Ball Bearings (2,903)', 'Single Row Ball Bearings (34,142)', 'Thrust Ball Bearings (2,773)']
                };
                const categoryList = plpFilterEl.querySelector('.plp-category-list');
                if (categoryList) {
                    const categoriesFacet = categoryList.closest('.plp-facet');
                    const categoryTemplate = categoryList.querySelector('li');
                    const topCategories = Array.from(categoryList.children, function (li) { return li.cloneNode(true); });
                    const categoryShowMore = categoryList.nextElementSibling;
                    const hasShowMore = categoryShowMore && categoryShowMore.classList.contains('plp-show-more');
                    const categoryPath = [];   // e.g. ['Bearings', 'Ball Bearings']
                    let selectedCategory = null;   // last-level category picked on the current level

                    // Back to the top-level categories, Show More reset
                    function showTopCategories() {
                        categoryPath.length = 0;
                        selectedCategory = null;
                        categoryList.classList.remove('plp-category-list--leaf', 'is-expanded');
                        categoryList.replaceChildren(...topCategories.map(function (li) { return li.cloneNode(true); }));
                        categoryList.scrollTop = 0;
                        if (hasShowMore) {
                            categoryShowMore.hidden = false;
                            categoryShowMore.setAttribute('aria-expanded', 'false');
                            categoryShowMore.textContent = 'Show More';
                        }
                        renderCategoryPills();
                    }
                    resetCategories = showTopCategories;

                    function categoryName(label) {
                        return label.replace(/\s*\([\d,]+\)\s*$/, '');
                    }

                    function showSubcategories(name) {
                        const subs = SUBCATEGORIES[name];
                        selectedCategory = null;
                        categoryList.classList.remove('plp-category-list--leaf');
                        categoryList.replaceChildren(...subs.map(function (label) {
                            const li = categoryTemplate.cloneNode(true);
                            li.querySelector('span').textContent = label;
                            return li;
                        }));
                        // No Show More for subcategories: open the list far enough to show them all (up to 7)
                        categoryList.classList.toggle('is-expanded', subs.length > 5);
                        categoryList.scrollTop = 0;
                        if (hasShowMore) categoryShowMore.hidden = true;
                        renderCategoryPills();
                    }

                    // Category pills sit with the facet pills in the order they were applied: pills still on the
                    // category path stay where they are, ones that left it are removed, new levels go at the end
                    function renderCategoryPills() {
                        // A last-level category picked: nothing left to choose, so the Categories section hides
                        // until its pill is removed
                        categoriesFacet.hidden = !!selectedCategory;
                        if (!pillList) return;
                        const trail = selectedCategory ? categoryPath.concat(selectedCategory) : categoryPath;
                        pillList.querySelectorAll('.plp-pill--category').forEach(function (li) {
                            if (trail[li.dataset.level] !== li.dataset.category) li.remove();
                        });
                        trail.forEach(function (name, i) {
                            if (pillList.querySelector('.plp-pill--category[data-level="' + i + '"]')) return;
                            const pill = document.createElement('li');
                            pill.className = 'plp-pill plp-pill--category';
                            pill.dataset.level = i;
                            pill.dataset.category = name;
                            pill.innerHTML = '<span></span><button type="button" class="plp-pill-remove">' +
                                '<img src="images/icons/plp/close_24.svg" alt="" width="14" height="14"></button>';
                            pill.querySelector('span').textContent = 'Category: ' + name;
                            pill.querySelector('button').setAttribute('aria-label', 'Remove filter Category: ' + name);
                            pill.querySelector('button').addEventListener('click', function () {
                                if (i === categoryPath.length) {
                                    // The selected last-level category: unselect it, stay on its level
                                    selectedCategory = null;
                                    categoryList.classList.remove('plp-category-list--leaf');
                                    categoryList.querySelectorAll('.plp-category-link.is-selected').forEach(function (a) {
                                        a.classList.remove('is-selected');
                                    });
                                    renderCategoryPills();
                                } else if (i === 0) {
                                    showTopCategories();
                                } else {
                                    categoryPath.length = i;
                                    showSubcategories(categoryPath[i - 1]);
                                }
                            });
                            pillList.appendChild(pill);
                        });
                        updatePillBar();
                    }

                    categoryList.addEventListener('click', function (e) {
                        const link = e.target.closest('.plp-category-link');
                        if (!link) return;
                        const name = categoryName(link.querySelector('span').textContent);
                        if (SUBCATEGORIES[name]) {
                            e.preventDefault();
                            categoryPath.push(name);
                            showSubcategories(name);
                            return;
                        }
                        // Last level only: none of the categories shown here has subcategories
                        const level = categoryPath[categoryPath.length - 1];
                        if (!level || SUBCATEGORIES[level].some(function (label) { return SUBCATEGORIES[categoryName(label)]; })) return;
                        e.preventDefault();
                        selectedCategory = name;
                        categoryList.classList.add('plp-category-list--leaf');
                        categoryList.querySelectorAll('.plp-category-link').forEach(function (a) {
                            a.classList.toggle('is-selected', a === link);
                        });
                        renderCategoryPills();
                        // The link just clicked is now hidden: keyboard focus goes on to the next section
                        const nextToggle = categoriesFacet.nextElementSibling && categoriesFacet.nextElementSibling.querySelector('.plp-facet-toggle');
                        if (nextToggle) nextToggle.focus();
                    });
                }

                plpFilterEl.querySelectorAll('.plp-switch').forEach(function (sw) {
                    sw.addEventListener('click', function () {
                        const mm = this.getAttribute('aria-checked') !== 'true';
                        this.setAttribute('aria-checked', String(mm));
                        const labels = this.parentElement.querySelectorAll('.plp-unit-label');
                        labels[0].classList.toggle('is-active', !mm);
                        labels[1].classList.toggle('is-active', mm);

                        // Swap the facet's values (data-in / data-mm), and any pills already added for them
                        this.closest('.plp-facet').querySelectorAll('[data-mm]').forEach(function (span) {
                            span.textContent = mm ? span.dataset.mm : span.dataset.in;
                            const input = span.previousElementSibling;
                            if (!input || !input.pill) return;
                            const pillText = input.pill.querySelector('span');
                            const label = pillText.textContent.split(': ')[0];
                            const value = span.textContent.replace(/\s*\([\d,]+\)\s*$/, '');
                            pillText.textContent = label + ': ' + value;
                            input.pill.querySelector('button').setAttribute('aria-label', 'Remove filter ' + label + ': ' + value);
                        });
                    });
                });

                // Selected facets: move to the top of their list and add a pill under the
                // page title (#plp_pill_bar). Unchecking or removing the pill restores the order.
                const pillBar = document.getElementById('plp_pill_bar');
                const pillList = pillBar && pillBar.querySelector('.plp-pills');
                let selectCounter = 0;

                plpFilterEl.querySelectorAll('.plp-facet-list').forEach(function (list) {
                    Array.from(list.children).forEach(function (li, i) { li.dataset.order = i; });
                });

                function sortFacetList(list) {
                    const items = Array.from(list.children);
                    items.sort(function (a, b) {
                        const aSel = a.dataset.selected ? +a.dataset.selected : 0;
                        const bSel = b.dataset.selected ? +b.dataset.selected : 0;
                        if (aSel && bSel) return aSel - bSel;
                        if (aSel || bSel) return aSel ? -1 : 1;
                        return a.dataset.order - b.dataset.order;
                    });
                    items.forEach(function (li) { list.appendChild(li); });
                    list.scrollTop = 0;
                }

                // The bar keeps its space with no pills; only Reset Filters goes away
                function updatePillBar() {
                    if (pillBar) pillBar.classList.toggle('is-empty', pillList.children.length === 0);
                    updatePillScroll();
                }

                // Pill row overflowing (.is-scrollable): a mouse drag slides it sideways (touch already swipes).
                // A drag only starts past 5px, and the click that ends it is swallowed so it can't remove a pill.
                function updatePillScroll() {
                    if (pillList) pillList.classList.toggle('is-scrollable', pillList.scrollWidth > pillList.clientWidth);
                }
                if (pillList) {
                    let dragStartX = 0;
                    let dragStartScroll = 0;
                    let dragging = false;
                    let dragged = false;
                    new ResizeObserver(updatePillScroll).observe(pillList);

                    pillList.addEventListener('pointerdown', function (e) {
                        if (e.pointerType !== 'mouse' || e.button !== 0 || !pillList.classList.contains('is-scrollable')) return;
                        dragging = true;
                        dragged = false;
                        dragStartX = e.clientX;
                        dragStartScroll = pillList.scrollLeft;
                    });
                    pillList.addEventListener('pointermove', function (e) {
                        if (!dragging) return;
                        const dx = e.clientX - dragStartX;
                        if (!dragged) {
                            if (Math.abs(dx) < 5) return;
                            dragged = true;
                            pillList.setPointerCapture(e.pointerId);
                            pillList.classList.add('is-dragging');
                        }
                        pillList.scrollLeft = dragStartScroll - dx;
                    });
                    function endPillDrag() {
                        dragging = false;
                        pillList.classList.remove('is-dragging');
                    }
                    pillList.addEventListener('pointerup', endPillDrag);
                    pillList.addEventListener('pointercancel', endPillDrag);
                    pillList.addEventListener('click', function (e) {
                        if (!dragged) return;
                        e.stopPropagation();
                        e.preventDefault();
                        dragged = false;
                    }, true);
                }

                function addPill(input) {
                    if (!pillList) return;
                    const facet = input.closest('.plp-facet');
                    const label = facet.dataset.pillLabel || facet.querySelector('.plp-facet-toggle').textContent.trim();
                    const value = input.nextElementSibling.textContent.replace(/\s*\([\d,]+\)\s*$/, '');
                    const pill = document.createElement('li');
                    pill.className = 'plp-pill';
                    pill.innerHTML = '<span></span><button type="button" class="plp-pill-remove">' +
                        '<img src="images/icons/plp/close_24.svg" alt="" width="14" height="14"></button>';
                    pill.querySelector('span').textContent = label + ': ' + value;
                    pill.querySelector('button').setAttribute('aria-label', 'Remove filter ' + label + ': ' + value);
                    pill.querySelector('button').addEventListener('click', function () {
                        input.checked = false;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                    input.pill = pill;
                    pillList.appendChild(pill);
                }

                plpFilterEl.addEventListener('change', function (e) {
                    const input = e.target;
                    const li = input.closest('.plp-facet-list > li');
                    if (!li) return;
                    if (input.checked) {
                        li.dataset.selected = ++selectCounter;
                        addPill(input);
                    } else {
                        delete li.dataset.selected;
                        if (input.pill) { input.pill.remove(); input.pill = null; }
                    }
                    sortFacetList(li.parentElement);
                    updatePillBar();
                });

                const resetBtn = document.getElementById('plp_reset_filters');
                if (resetBtn) resetBtn.addEventListener('click', function () {
                    plpFilterEl.querySelectorAll('.plp-facet-list input:checked').forEach(function (input) {
                        input.checked = false;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                    if (resetCategories) resetCategories();
                });
            });
        } // end if (plpFilterEl)

        // PLP filter panel (LG and smaller): the "Filter" button opens the filter as a slide-in panel
        const plpFilterOpen = document.getElementById('plp_filter_open');
        if (plpFilterOpen && plpFilterEl) {
            const backdrop = document.getElementById('plp_filter_backdrop');

            function setFilterPanel(open) {
                plpFilterEl.classList.toggle('is-open', open);
                plpFilterOpen.setAttribute('aria-expanded', String(open));
                backdrop.hidden = !open;
                document.body.style.overflow = open ? 'hidden' : '';
                if (open) {
                    const closeBtn = plpFilterEl.querySelector('.plp-filter-close');
                    if (closeBtn) closeBtn.focus();
                } else {
                    plpFilterOpen.focus();
                }
            }

            plpFilterOpen.addEventListener('click', function () { setFilterPanel(true); });
            backdrop.addEventListener('click', function () { setFilterPanel(false); });
            plpFilterEl.addEventListener('click', function (e) {
                if (e.target.closest('.plp-filter-close')) setFilterPanel(false);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && plpFilterEl.classList.contains('is-open')) setFilterPanel(false);
            });
            // Back to desktop width: put the sidebar back
            window.matchMedia('(min-width: 1200px)').addEventListener('change', function (mq) {
                if (mq.matches && plpFilterEl.classList.contains('is-open')) {
                    plpFilterEl.classList.remove('is-open');
                    plpFilterOpen.setAttribute('aria-expanded', 'false');
                    backdrop.hidden = true;
                    document.body.style.overflow = '';
                }
            });
        } // end if (plpFilterOpen)

        // Load PLP cards: data-card picks the version (plp-card.html / plp-card-B2B.html),
        // data-count sets how many copies; {{n}} in the card keeps ids unique. data-alt-card
        // swaps another card in at the data-alt-at positions (plp_SS.html: crib items at 1,3).
        // The cards stay inside #plp_cards (.plp-card-grid), which lays them out 2-up at MD and SM.
        const plpCardsEl = document.getElementById('plp_cards');
        if (plpCardsEl) {
        const cardCount = parseInt(plpCardsEl.dataset.count, 10) || 1;
        const altAt = (plpCardsEl.dataset.altAt || '').split(',').map(Number);
        Promise.all([plpCardsEl.dataset.card || 'plp-card.html', plpCardsEl.dataset.altCard].map(function (file) {
            return file ? fetch(file).then(response => response.text()) : '';
        }))
            .then(([data, altData]) => {
                const cards = [];
                for (let n = 1; n <= cardCount; n++) {
                    cards.push((altData && altAt.includes(n) ? altData : data).replace(/\{\{n\}\}/g, n));
                }
                plpCardsEl.innerHTML = cards.join('<hr class="plp-divider">');
            });
        } // end if (plpCardsEl)

        // PLP cards: favorites, copy (delegated, since cards load after this runs)
        const plpEl = document.getElementById('plp');
        if (plpEl) {
            const plpCopyStatus = plpEl.querySelector('.plp-copy-status');

            // Add To Cart -> quantity pill (buildQtyPill / renderQtyPill, shared with the PDP card).
            // Each card gets its own cart line (the sample cards share one part number).
            function showQtyPill(card, addBtn) {
                if (!card.dataset.cartKey) {
                    card.dataset.cartKey = card.querySelector('.plp-card-ids dd').textContent.trim() + '#' +
                        card.getAttribute('aria-labelledby');
                }
                const pill = buildQtyPill(card.querySelector('.plp-card-title').textContent.trim());
                addBtn.hidden = true;
                addBtn.after(pill);
                renderQtyPill(pill, 1);
                return pill;
            }

            // qty 0 removes the item and brings back the Add To Cart button
            function setCardQty(pill, qty) {
                const card = pill.closest('.plp-card');
                if (window.setMiniCartQty) window.setMiniCartQty(card.dataset.cartKey, qty);
                if (qty > 0) {
                    renderQtyPill(pill, qty);
                } else {
                    const addBtn = card.querySelector('.plp-add-to-cart.btn--primary');
                    addBtn.hidden = false;
                    pill.remove();
                    addBtn.focus();
                }
            }

            plpEl.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && e.target.classList.contains('plp-qty-input')) e.target.blur();
            });
            plpEl.addEventListener('change', function (e) {
                if (!e.target.classList.contains('plp-qty-input')) return;
                const pill = e.target.closest('.plp-qty');
                const typed = e.target.value.trim();
                if (!/^\d+$/.test(typed)) {
                    e.target.value = pill.dataset.qty;  // not a whole number: put the old value back
                    return;
                }
                setCardQty(pill, parseInt(typed, 10));
            });
            plpEl.addEventListener('click', function (e) {
                const favoriteBtn = e.target.closest('.plp-card-favorite');
                if (favoriteBtn) {
                    const on = favoriteBtn.getAttribute('aria-pressed') !== 'true';
                    favoriteBtn.setAttribute('aria-pressed', String(on));
                    const item = favoriteBtn.dataset.item;
                    favoriteBtn.setAttribute('aria-label', on ? 'Remove ' + item + ' from favorites' : 'Add ' + item + ' to favorites');
                    return;
                }
                const addBtn = e.target.closest('.plp-add-to-cart.btn--primary');
                if (addBtn && window.addToMiniCart) {
                    e.stopPropagation();
                    const card = addBtn.closest('.plp-card');
                    const unit = card.querySelector('.plp-price-uom, .plp-price-unit');
                    const image = card.querySelector('.plp-card-image');
                    const pill = showQtyPill(card, addBtn);
                    window.addToMiniCart({
                        key: card.dataset.cartKey,
                        sku: card.querySelector('.plp-card-ids dd').textContent.trim(),
                        brand: card.querySelector('.plp-card-brand').textContent.trim(),
                        name: card.querySelector('.plp-card-title').textContent.trim(),
                        price: card.querySelector('.plp-price-amount').textContent.replace(/\$\s+(?=\d)/, '$').trim() +
                            ' / ' + unit.textContent.replace('/', '').trim(),
                        image: image.getAttribute('src'),
                        imageAlt: image.alt,
                        addedTitle: addBtn.dataset.addedTitle
                    }, pill.querySelector('.plp-qty-input'));
                    return;
                }

                const qtyBtn = e.target.closest('.plp-qty-minus, .plp-qty-plus');
                if (qtyBtn) {
                    const pill = qtyBtn.closest('.plp-qty');
                    const step = qtyBtn.classList.contains('plp-qty-plus') ? 1 : -1;
                    setCardQty(pill, parseInt(pill.dataset.qty, 10) + step);
                    return;
                }
                const copyBtn = e.target.closest('.plp-copy');
                if (copyBtn) {
                    const value = copyBtn.dataset.copy;
                    navigator.clipboard.writeText(value)
                        .then(() => plpCopyStatus.textContent = 'Copied ' + value)
                        .catch(() => plpCopyStatus.textContent = 'Copy failed');
                }
            });
        } // end if (plpEl)

        // Compare modal (compare-modal.html): checking a card's Compare box adds it to a bar
        // fixed to the bottom of the screen (image + Global SAP Number). Up to 10 items.
        const compareEl = document.getElementById('compare_modal');
        if (compareEl && plpEl) {
            const COMPARE_MAX = 10;
            const compareSelected = [];  // { key, input, image, imageAlt, sapNumber, href }
            let comparePanel = null;

            function compareInputs() {
                return plpEl.querySelectorAll('.plp-card-actions input[type="checkbox"]');
            }

            function renderCompare() {
                const full = compareSelected.length >= COMPARE_MAX;
                compareInputs().forEach(function (input) {
                    input.disabled = full && !input.checked;
                    input.closest('label').title = input.disabled ? 'You can compare up to ' + COMPARE_MAX + ' items' : '';
                });
                if (!comparePanel) return;

                const list = comparePanel.querySelector('.compare-items');
                const template = document.getElementById('compare_card_template').content.querySelector('.compare-card');
                list.replaceChildren();
                compareSelected.forEach(function (item) {
                    const card = template.cloneNode(true);
                    card.dataset.key = item.key;
                    const img = card.querySelector('.compare-card-img');
                    img.src = item.image;
                    img.alt = item.imageAlt;
                    const link = card.querySelector('.compare-card-link');
                    link.textContent = item.sapNumber;
                    link.href = item.href;
                    card.querySelector('.compare-card-remove').setAttribute('aria-label', 'Remove ' + item.sapNumber + ' from compare');
                    list.appendChild(card);
                });

                const n = compareSelected.length;
                comparePanel.querySelector('.compare-count-number').textContent = n;
                comparePanel.querySelector('.compare-count-label').textContent = n === 1 ? 'item selected' : 'items selected';
                comparePanel.querySelector('.compare-count-max').hidden = !full;
                comparePanel.hidden = n === 0;
                // keep the page's bottom content reachable above the fixed bar
                document.body.style.paddingBottom = n ? comparePanel.offsetHeight + 32 + 'px' : '';
                updateCompareScroll();
            }

            function updateCompareScroll() {
                const list = comparePanel.querySelector('.compare-items');
                comparePanel.querySelector('.compare-scroll--prev').hidden = list.scrollLeft <= 0;
                comparePanel.querySelector('.compare-scroll--next').hidden =
                    list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
            }

            plpEl.addEventListener('change', function (e) {
                const input = e.target;
                if (!input.matches('.plp-card-actions input[type="checkbox"]')) return;
                const card = input.closest('.plp-card');
                const key = card.getAttribute('aria-labelledby');
                const i = compareSelected.findIndex(function (item) { return item.key === key; });
                if (input.checked && i === -1) {
                    if (compareSelected.length >= COMPARE_MAX) {
                        input.checked = false;
                        return;
                    }
                    const image = card.querySelector('.plp-card-image');
                    const title = card.querySelector('.plp-card-title');
                    compareSelected.push({
                        key: key,
                        input: input,
                        image: image.getAttribute('src'),
                        imageAlt: image.alt,
                        sapNumber: title.textContent.trim(),
                        href: title.getAttribute('href')
                    });
                } else if (!input.checked && i !== -1) {
                    compareSelected.splice(i, 1);
                }
                renderCompare();
                if (input.checked && comparePanel) {
                    const list = comparePanel.querySelector('.compare-items');
                    list.scrollLeft = list.scrollWidth;  // show the newest item
                    updateCompareScroll();
                }
            });

            fetch('compare-modal.html')
                .then(response => response.text())
                .then(data => {
                    compareEl.innerHTML = data;
                    comparePanel = document.getElementById('compare_modal_panel');
                    const list = comparePanel.querySelector('.compare-items');
                    const toggle = comparePanel.querySelector('.compare-toggle');

                    toggle.addEventListener('click', function () {
                        const open = !comparePanel.classList.contains('is-open');
                        comparePanel.classList.toggle('is-open', open);
                        this.setAttribute('aria-expanded', String(open));
                        this.setAttribute('aria-label', open ? 'Hide compare items' : 'Show compare items');
                        document.getElementById('compare_items_area').hidden = !open;
                        renderCompare();
                    });

                    comparePanel.querySelector('.compare-scroll--prev').addEventListener('click', function () {
                        list.scrollBy({ left: -116, behavior: 'smooth' });
                    });
                    comparePanel.querySelector('.compare-scroll--next').addEventListener('click', function () {
                        list.scrollBy({ left: 116, behavior: 'smooth' });
                    });
                    list.addEventListener('scroll', updateCompareScroll);

                    // Remove (x) unchecks the card's Compare box, which updates the bar
                    list.addEventListener('click', function (e) {
                        const remove = e.target.closest('.compare-card-remove');
                        if (!remove) return;
                        const item = compareSelected.find(function (it) { return it.key === remove.closest('.compare-card').dataset.key; });
                        item.input.checked = false;
                        item.input.dispatchEvent(new Event('change', { bubbles: true }));
                    });

                    renderCompare();
                });
        } // end if (compareEl)

        // Availability modal (availability-modal.html): the info icon next to "Available" on a
        // PLP card, the PDP card (pdp.html) or a PDP Alternatives row opens the lead-time note under the icon.
        // Locate Sales Office shows the nearest offices. Closes on a click outside, Escape, or a second click on the icon.
        // On the PDP, #main holds both the card and the Alternatives table.
        const availScopeEl = plpEl || (pdpcardEl && document.getElementById('main'));
        if (availScopeEl) {
            let availModal = null;
            let availBtn = null;   // icon that opened the modal

            fetch('availability-modal.html')
                .then(response => response.text())
                .then(data => {
                    document.body.insertAdjacentHTML('beforeend', data);
                    availModal = document.getElementById('availability_modal');
                    document.getElementById('availability_modal_form').addEventListener('submit', function (e) {
                        e.preventDefault();
                        const offices = document.getElementById('availability_modal_offices');
                        offices.hidden = false;
                        offices.scrollTop = 0;
                        placeAvailModal();
                    });
                });

            // Under the icon, right edges lined up; kept on screen with a 16px margin
            function placeAvailModal() {
                const r = availBtn.getBoundingClientRect();
                const width = availModal.offsetWidth;
                const left = Math.max(16, Math.min(r.right - width, document.documentElement.clientWidth - width - 16));
                availModal.style.top = (r.bottom + window.scrollY + 4) + 'px';
                availModal.style.left = (left + window.scrollX) + 'px';
            }

            function closeAvailModal(returnFocus) {
                if (!availModal || availModal.hidden) return;
                availModal.hidden = true;
                availBtn.setAttribute('aria-expanded', 'false');
                if (returnFocus) availBtn.focus();
            }

            availScopeEl.addEventListener('click', function (e) {
                const btn = e.target.closest('.plp-stock-info-btn, .pdp-card-info-btn, .pdp-alt-info-btn');
                if (!btn || !availModal) return;
                e.stopPropagation();
                const reopen = availModal.hidden || btn !== availBtn;
                closeAvailModal(false);
                if (!reopen) return;
                availBtn = btn;
                document.getElementById('availability_modal_offices').hidden = true;
                availModal.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
                placeAvailModal();
                document.getElementById('availability_modal_zip').focus();
            });

            document.addEventListener('click', function (e) {
                if (availModal && !availModal.hidden && !e.target.closest('#availability_modal')) closeAvailModal(false);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeAvailModal(true);
            });
            // Resizing (including a scrollbar appearing when the office list opens) keeps it under the icon
            window.addEventListener('resize', function () {
                if (availModal && !availModal.hidden) placeAvailModal();
            });
        } // end if (availScopeEl)


// function focusSearchField (){
//     const searchfield = document.getElementsByClassName("search-field").focus();
// }

// ----------------Search Button drop-down show options


// document.getElementById("search-dropdown").addEventListener("click", searchButton);
    
// function searchButton(){    
//     if(document.getElementById("search-options").style.display == "none"){
//         document.getElementById("search-options").style.display = "block";    
//         document.getElementById("search-options").style.visibility = "visible";
//     } else {
//         document.getElementById("search-options").style.display = "none";
//         document.getElementById("search-options").style.visibility = "hidden";
//     }
// }


