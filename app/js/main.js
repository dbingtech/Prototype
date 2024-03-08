let templateMain = document.getElementById('main');

templateMain.innerHTML = `
<main>
      <section>
        <img
          src="images/Renold-scrolling-02.20.png"
          alt="scrolling carousel"
          class="scrolling"
        />
        <div>Sign In Or Register</div>
      </section>
      <section>
        <div>Categories</div>
        <div>Right Side Ads</div>
      </section>
    </main>
`;

let templateContent = templateMain.content;

document.body.appendChild(templateContent)