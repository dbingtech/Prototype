// Load components
// Load header
        const headerEl = document.getElementById('header_B2B') || document.getElementById('header');
        const headerFile = document.getElementById('header_B2B') ? 'header_B2B.html' : 'header.html';
        fetch(headerFile)
            .then(response => response.text())
            .then(data => {
                headerEl.innerHTML = data;

                const quickOrder = document.getElementById('quick_order');
                const qoDropdown = document.getElementById('qo-dropdown');

                quickOrder.addEventListener('click', function (e) {
                    e.stopPropagation();
                    qoDropdown.classList.toggle('active');
                });

                document.addEventListener('click', function () {
                    qoDropdown.classList.remove('active');
                });

                qoDropdown.addEventListener('click', function (e) {
                    e.stopPropagation();
                });

                const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>`;
                const minusSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>`;

                function updateMinusIcon(stepper) {
                    const n = parseInt(stepper.querySelector('.qo-qty-value').textContent);
                    stepper.querySelector('.qo-qty-minus').innerHTML = n <= 1 ? trashSvg : minusSvg;
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
                    signInEl.innerHTML = '<img src="images/icons/user/Size=28, Color=White.svg" alt="Sign In" width="28" height="28">Sign In';
                    signInEl.href = '#';
                    signInEl.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('user');
                        window.location.reload();
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
            });
        
        // Load nav
        fetch('nav.html')
            .then(response => response.text())
            .then(data => document.getElementById('nav').innerHTML = data);
        
            // Load nav
        const navbarEl = document.getElementById('navbar_B2B') || document.getElementById('navbar');
        const navbarFile = document.getElementById('navbar_B2B') ? 'navbar_B2B.html' : 'navbar.html';
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

                const navQuotes = document.getElementById('nav-quotes');
                if (navQuotes && !document.getElementById('header_B2B')) {
                    navQuotes.style.display = 'none';
                }
            });
        
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
            .then(data => document.getElementById('hero2').innerHTML = data);
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


