// Load components
// Load header
        fetch('header.html')
            .then(response => response.text())
            .then(data => document.getElementById('header').innerHTML = data);
        
        // Load nav
        fetch('nav.html')
            .then(response => response.text())
            .then(data => document.getElementById('nav').innerHTML = data);
        
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


