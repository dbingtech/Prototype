

class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
      this.innerHTML = `
      <header>
      
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