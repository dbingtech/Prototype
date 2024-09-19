
function focusSearchField (){
    const searchfield = document.getElementsByClassName("search-field").focus();
}

const copyrightSpan = document.getElementById('copyright');
const newDate = new Date();
let thisYear = newDate.getFullYear();
copyrightSpan.innerHTML = thisYear;
console.log(copyrightSpan);

// ----------------Search Button drop-down show options


document.getElementById("search-dropdown").addEventListener("click", searchButton);
    
function searchButton(){    
    if(document.getElementById("search-options").style.display == "none"){
        document.getElementById("search-options").style.display = "block";    
        document.getElementById("search-options").style.visibility = "visible";
    } else {
        document.getElementById("search-options").style.display = "none";
        document.getElementById("search-options").style.visibility = "hidden";
    }
}