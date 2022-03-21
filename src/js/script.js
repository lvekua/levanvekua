!(function (e, t) {
  t.addEventListener("keydown", function (e) {
    const s = t.querySelector(".nav");
    if (!s || !s.classList.contains("is-open")) return;
    const r = [...s.querySelectorAll("input, a, button")],
      n = r[r.length - 1],
      a = r[0],
      i = t.activeElement,
      o = 9 === e.keyCode,
      c = e.shiftKey;
    !c && o && n === i && (e.preventDefault(), a.focus()),
      c && o && a === i && (e.preventDefault(), n.focus());
  }),
    (function () {
      const e = t.querySelector(".nav");
      if (!e) return;
      const s = e.querySelector("ul"),
        r = t.querySelector("#menu-toggle");
      s.setAttribute("aria-expanded", "false"),
        r.addEventListener("click", () => {
          e.classList.contains("is-open")
            ? (r.setAttribute("aria-expanded", "false"),
              s.setAttribute("aria-expanded", "false"))
            : (r.setAttribute("aria-expanded", "true"),
              s.setAttribute("aria-expanded", "true")),
            e.classList.toggle("is-open");
        });
    })(),
    (function () {
      const s = t.querySelector(".go-to-top");
      s &&
        (e.addEventListener("scroll", () => {
          e.scrollY > 100
            ? s.classList.add("is-visible")
            : s.classList.remove("is-visible");
        }),
        s.addEventListener("click", (t) => {
          t.preventDefault(),
            e.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }));
    })();
})(window, document);

function navigationToggle(){
  const nav = document.querySelector("nav");
  const menuItem = document.querySelectorAll(".menu-item");

  menuItem.forEach(function(item){
    item.addEventListener("click", function(){
      const menuToggle = document.querySelector(".menu-toggle");
      if(nav.classList.contains("is-open")){
        nav.classList.toggle("is-open");
        menuToggle.toggleAttribute("aria-expanded");  
      }
    })
  });
};
navigationToggle();

function loaderSpinner(){
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader--hidden");
    loader.addEventListener("transitionend", () => {
      document.body.removeChild(loader);
    });
  });
}
loaderSpinner();

function scrollIndicator() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let scrollHeight = document.documentElement.scrollHeight;
  let clientHeight = document.documentElement.clientHeight
  let height = scrollHeight - clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.querySelector(".progress-bar").style.width = scrolled + "%";
};

function navigationScroll() {
  const headerNavigation = document.querySelector(".header-inner");
  if ( document.documentElement.scrollTop > 750 || document.body.scrollTop > 750 ) {
      headerNavigation.classList.add("header-inner-color");
    } else{
      headerNavigation.classList.remove("header-inner-color");
    }
  };
  
  window.onscroll = function() {
    scrollIndicator();
    navigationScroll();
  };