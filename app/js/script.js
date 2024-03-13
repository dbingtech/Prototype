
function focusSearchField (){
    const searchfield = document.getElementsByClassName("search-field").focus();
}

const copyrightSpan = document.getElementById('copyright');
const newDate = new Date();
let thisYear = newDate.getFullYear();
copyrightSpan.innerHTML = thisYear;
console.log(copyrightSpan);