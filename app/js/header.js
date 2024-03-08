let template = document.getElementById('page-header');

template.innerHTML = `
<header>
<!-------------------------------------------wrapper for flex-->
<div class="guest_header">
  <img id="logo" src="images/BDIExpress_wLogoBLUE.fw.png" alt="BDIExpress logo" />

  <!--------------------------------------search bar-->
  <div class="search_bar">
    <div class="drop-down">
      Search All<img id="caret-down" src="images/Caret_48px.svg" alt="downward caret"/>
    </div>
    <div class="vertical_line"></div>
    <div>
      <input
        class="search-field"
        type="text"
        placeholder="Search all BDI"
      />
      <img id="search" src="images/search.svg" alt="search icon"/>
    </div>
  </div>
  <!---------------------------------------region-->
  <div><img id="usa" src="images/USA.svg" alt="United States Flag"/></div>
  <div>
    <img
      src="images/location.png"
      alt="svg of location icon"
      id="location"
    />Branch Location
  </div>
  <!-----------------------------------------User-->
  <div>
    <img src="images/user.png" alt="user icon" id="user" />
    Sign in or Register
  </div>
  <div><img id="shoppingcart" src="images/shoppingcart.png" alt="shopping cart" /></div>
</div>
</header>
`;

let templateContent = template.content;

document.body.appendChild(templateContent)