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

                document.querySelectorAll('.qo-qty-stepper').forEach(function (stepper) {
                    stepper.querySelector('.qo-qty-minus').addEventListener('click', function () {
                        const val = stepper.querySelector('.qo-qty-value');
                        const n = parseInt(val.textContent);
                        if (n > 1) val.textContent = n - 1;
                    });
                    stepper.querySelector('.qo-qty-plus').addEventListener('click', function () {
                        const val = stepper.querySelector('.qo-qty-value');
                        val.textContent = parseInt(val.textContent) + 1;
                    });
                });

                const user = JSON.parse(localStorage.getItem('user'));
                const signInEl = document.getElementById('sign_in');
                if (user && user.signedIn && signInEl) {
                    signInEl.innerHTML = '<img src="images/icons/user/Size=28, Color=White.svg" alt="My Account" width="28" height="28">My Account';
                    signInEl.href = '#';
                    signInEl.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('user');
                        window.location.reload();
                    });
                }
            });
        
        // Load nav
        fetch('nav.html')
            .then(response => response.text())
            .then(data => document.getElementById('nav').innerHTML = data);
        
            // Load nav
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar').innerHTML = data;

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

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
                        closeMenuFunc();
                    }
                });
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
        // Load home categories
        fetch('home_categories.html')
            .then(response => response.text())
            .then(data => document.getElementById('home_categories').innerHTML = data);

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


