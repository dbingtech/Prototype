// Load components
// Load header
        const headerEl = document.getElementById('header_B2B') || document.getElementById('header');
        const headerFile = document.getElementById('header_B2B') ? 'header_B2B.html' : 'header.html';
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
                if (user && user.signedIn && signInEl && !document.getElementById('header_B2B')) {
                    signInEl.innerHTML = '<img src="images/icons/user/Size=28, Color=White.svg" alt="" width="28" height="28">Sign In';
                    signInEl.href = '#';
                    signInEl.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('user');
                        window.location.reload();
                    });
                }

                // Search: spyglass (and Enter) go to the PLP for this header's version
                const plpPage = document.getElementById('header_B2B') ? 'plp_B2B.html' : 'plp.html';
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

                    // added = true shows the Figma "Added to Cart" state (just the new line item)
                    function openCartModal(added) {
                        const rect = cartBtn.getBoundingClientRect();
                        cartModal.style.top = rect.bottom + 8 + 'px';
                        cartModal.style.right = (window.innerWidth - rect.right) + 'px';
                        const empty = !cartItems.querySelector('.cart-line-item');
                        cartTitle.textContent = added ? 'Added to Cart' : 'Cart';
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
                    // item = { key, sku, brand, name, price, image, imageAlt }; key defaults to sku.
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
                        lines.forEach(function (li) {
                            const price = parseFloat(li.querySelector('.cart-line-item-price').textContent.replace(/[^0-9.]/g, ''));
                            if (!isNaN(price)) total += price * parseInt(li.dataset.qty, 10);
                        });
                        cartCount.textContent = lines.length;
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
                        openCartModal(true);
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
        
        // Load nav
        const navbarEl = document.getElementById('navbar_B2B') || document.getElementById('navbar');
        if (navbarEl) {
        const navbarFile = navbarEl.id === 'navbar_B2B' ? 'navbar_B2B.html' : 'navbar.html';
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

                ['products', 'services', 'knowledge'].forEach(function (section) {
                    document.getElementById(section + '-title').addEventListener('click', function () {
                        const items = document.getElementById(section + '-items');
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
        const heroEl = document.getElementById('hero_B2B') || document.getElementById('hero');
        const heroFile = document.getElementById('hero_B2B') ? 'hero_B2B.html' : 'hero.html';
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
            });
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
        // Load home categories
        fetch('new_home_categories.html')
            .then(response => response.text())
            .then(data => document.getElementById('new_home_categories').innerHTML = data);
        fetch('homepage_ads.html')
            .then(response => response.text())
            .then(data => document.getElementById('homepage_ads').innerHTML = data);

        // Load PDP card
        const pdpcardEl = document.getElementById('pdpcard');
        if (pdpcardEl) {
        fetch('pdpcard.html')
            .then(response => response.text())
            .then(data => {
                pdpcardEl.innerHTML = data;

                const favoriteBtn = document.getElementById('pdp_favorite');
                favoriteBtn.addEventListener('click', function () {
                    const on = this.getAttribute('aria-pressed') !== 'true';
                    this.setAttribute('aria-pressed', String(on));
                    this.setAttribute('aria-label', on ? 'Remove from favorites' : 'Add to favorites');
                });

                const copyStatus = pdpcardEl.querySelector('.pdp-card-copy-status');
                pdpcardEl.querySelectorAll('.pdp-card-copy').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        const value = this.dataset.copy;
                        navigator.clipboard.writeText(value)
                            .then(() => copyStatus.textContent = 'Copied ' + value)
                            .catch(() => copyStatus.textContent = 'Copy failed');
                    });
                });
            });
        } // end if (pdpcardEl)

        // Load PLP filter (plp-filter.html): facet accordions, Show More, unit toggle
        const plpFilterEl = document.getElementById('plp_filter');
        if (plpFilterEl) {
        fetch('plp-filter.html')
            .then(response => response.text())
            .then(data => {
                plpFilterEl.innerHTML = data;

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

                plpFilterEl.querySelectorAll('.plp-switch').forEach(function (sw) {
                    sw.addEventListener('click', function () {
                        const mm = this.getAttribute('aria-checked') !== 'true';
                        this.setAttribute('aria-checked', String(mm));
                        const labels = this.parentElement.querySelectorAll('.plp-unit-label');
                        labels[0].classList.toggle('is-active', !mm);
                        labels[1].classList.toggle('is-active', mm);
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

                function updatePillBar() {
                    if (pillBar) pillBar.hidden = pillList.children.length === 0;
                }

                function addPill(input) {
                    if (!pillList) return;
                    const facet = input.closest('.plp-facet');
                    const label = facet.dataset.pillLabel || facet.querySelector('.plp-facet-toggle').textContent.trim();
                    const value = input.nextElementSibling.textContent.replace(/\s*\([\d,]+\)\s*$/, '');
                    const pill = document.createElement('li');
                    pill.className = 'plp-pill';
                    pill.innerHTML = '<span></span><button type="button" class="plp-pill-remove">' +
                        '<img src="images/icons/plp/close_24.svg" alt="" width="24" height="24"></button>';
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
                });
            });
        } // end if (plpFilterEl)

        // Load PLP cards: data-card picks the version (plp-card.html / plp-card-B2B.html),
        // data-count sets how many copies; {{n}} in the card keeps ids unique
        const plpCardsEl = document.getElementById('plp_cards');
        if (plpCardsEl) {
        const cardCount = parseInt(plpCardsEl.dataset.count, 10) || 1;
        fetch(plpCardsEl.dataset.card || 'plp-card.html')
            .then(response => response.text())
            .then(data => {
                const cards = [];
                for (let n = 1; n <= cardCount; n++) {
                    cards.push(data.replace(/\{\{n\}\}/g, n));
                }
                plpCardsEl.outerHTML = cards.join('<hr class="plp-divider">');
            });
        } // end if (plpCardsEl)

        // PLP cards: favorites, copy (delegated, since cards load after this runs)
        const plpEl = document.getElementById('plp');
        if (plpEl) {
            const plpCopyStatus = plpEl.querySelector('.plp-copy-status');

            // Add To Cart -> quantity pill (trash at 1, minus above 1, typeable number, plus).
            // Each card gets its own cart line (the sample cards share one part number).
            function showQtyPill(card, addBtn) {
                if (!card.dataset.cartKey) {
                    card.dataset.cartKey = card.querySelector('.plp-card-ids dd').textContent.trim() + '#' +
                        card.getAttribute('aria-labelledby');
                }
                const name = card.querySelector('.plp-card-title').textContent.trim();
                const pill = document.createElement('div');
                pill.className = 'plp-qty';
                pill.setAttribute('role', 'group');
                pill.setAttribute('aria-label', 'Quantity of ' + name + ' in cart');
                pill.innerHTML =
                    '<button type="button" class="plp-qty-minus"><img alt="" width="24" height="24"></button>' +
                    '<input type="text" class="plp-qty-input" inputmode="numeric" aria-label="Quantity">' +
                    '<button type="button" class="plp-qty-plus" aria-label="Increase quantity">' +
                    '<img src="images/icons/plp/qty_plus_16.svg" alt="" width="16" height="16"></button>';
                addBtn.hidden = true;
                addBtn.after(pill);
                renderQtyPill(pill, 1);
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
                        imageAlt: image.alt
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


