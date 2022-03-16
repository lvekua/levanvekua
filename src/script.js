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
loaderSpinner()

function scrollIndicatorFunction() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
  document.documentElement.scrollHeight -
  document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
};

function navigationScroll() {
  const headerNavigation = document.querySelector(".header-inner");
  if ( document.documentElement.scrollTop > 750 || document.body.scrollTop > 750 ) {
      headerNavigation.classList.add("header-inner-color");
    } else{
      headerNavigation.classList.remove("header-inner-color");
    }
  };
  
  window.onscroll = function () {
    scrollIndicatorFunction();
    navigationScroll();
  };

  // Gsap scroll-triger
  // function animateFrom(elem, direction) {
  //   direction = direction || 1;
  //   let x = 0,
  //     y = direction * 100;
  //   if (elem.classList.contains("gs_reveal_fromLeft")) {
  //     x = -100;
  //     y = 0;
  //   } else if (elem.classList.contains("gs_reveal_fromRight")) {
  //     x = 100;
  //     y = 0;
  //   } else if (elem.classList.contains("gs_reveal_fromBottom")) {
  //     x = 0;
  //     y = 100;
  //   } else if (elem.classList.contains("gs_reveal_fromTop")) {
  //     x = 0;
  //     y = -100;
  //   }
  //   elem.style.transform = "translate(" + x + "px, " + y + "px)";
  //   elem.style.opacity = "0";
  //   gsap.fromTo(
  //     elem,
  //     { x: x, y: y, autoAlpha: 0 },
  //     {
  //       duration: 2.25,
  //       x: 0,
  //       y: 0,
  //       autoAlpha: 1,
  //       ease: "expo",
  //       overwrite: "auto",
  //     }
  //   );
  // }

  // function hide(elem) {
  //   gsap.set(elem, { autoAlpha: 0 });
  // }

  // document.addEventListener("DOMContentLoaded", function () {
  //   gsap.registerPlugin(ScrollTrigger);

  //   gsap.utils.toArray(".gs_reveal").forEach(function (elem) {
  //     hide(elem); // assure that the element is hidden when scrolled into view

  //     ScrollTrigger.create({
  //       trigger: elem,
  //       onEnter: function () {
  //         animateFrom(elem);
  //       },
  //       onEnterBack: function () {
  //         animateFrom(elem, -1);
  //       },
  //       onLeave: function () {
  //         hide(elem);
  //       }, // assure that the element is hidden when scrolled into view
  //     });
  //   });
  // });
