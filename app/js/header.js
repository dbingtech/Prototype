

class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
      this.innerHTML = `
      <header>
        <section class="header-container">
          <p class="pre-header">
            <span class="mdi--map-marker"></span>
            <a href="store-locator.html">Find a Location</a>
            <div class="vertical-line"></div>
            <span class="ph--globe"></span>
            <a href="#">EN</a>
            <div class="vertical-line"></div>
            <span class="ic--baseline-phone"></span>
            <a href="tel:1-888-123-4567">1-888-12-4567</a>
            <a href="log-in_register.html">Register</a>
            <div class="vertical-line"></div>
            <a href="order-status.html">Request a Quote</a>
          </p>
        
        <!------------------------------------------2nd line-->
        <div class="flex-middle">
          <a href="index.html"><img id="logo" src="images/logos/Express_White.png" alt="BDIExpress logo" /></a>
          <!-----------------------------------------SearchBar -->
        <div class="search_bar">
          <div class="search-drop-down">
            <button onclick="searchButton()" type="button" title="search-dropdown" id="search-dropdown">
              <span class="gravity-ui--caret-down"></span>
            </button>
            <h1>NEW</h1>
            <div id="search-options">
              <button onclick="" title="search-down-option-1" id="search-down-option-1">Part #</button>
              <button onclick="" title="search-down-option-2" id="search-down-option-2">BDI Part #</button>
              <button onclick="" title="search-down-option-3" id="search-down-option-3">Description</button>
            </div>
          </div>
          <div class="search-vertical-line"></div>
          <div class="search-input-outer">
            <input
              class="search-input"
              type="text"
              placeholder="Search Products"
            />
            <span class="ic--outline-search"></span>
          </div>
        </div>
        <!---End SearchBar-->
        <div class="bottom-right">
          <div class="chat"><img id="chat-img" src="images/icons/header/chat_white_48.png" alt="chat bubble">
            <a href="#">Support</a>
          </div>
          
          <div class="sign-in">
          <img src="images/icons/header/user_white_48.png" alt="user icon" id="user" />
          <a href="#">Sign In</a>
          </div>

          <div class="quick-order">
          <img src="images/icons/header/quick_white_48.png" alt="user icon" id="quick" />
          <a href="#">Quick Order</a>
          </div>
          
          <div class="cart">
            <img id="shoppingcart" src="images/icons/header/Cart_White_48.png" alt="shopping cart" />
            <a href="cart.html">Cart</a>
          </div>
          
        </div>
    
      </section>
      </header>
      `;
  }
}
customElements.define('header-component', Header);

let template = document.getElementById('page-header');

template.innerHTML = `
<header>
</header>
`;

let templateContent = template.content;

document.body.appendChild(templateContent)