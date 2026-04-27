// Load components
// Load header
        fetch('header.html')
            .then(response => response.text())
            .then(data => document.getElementById('header').innerHTML = data);
        
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
            });
        // Load hero
        fetch('hero.html')
            .then(response => response.text())
            .then(data => document.getElementById('hero').innerHTML = data);
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


