// Setup variables
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
		// Add attribute to nav when its opened or closed
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

		// Go to top button
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

// Navigation toggler for mobile
function navigationToggle() {
	const nav = document.querySelector("nav");
	const menuItem = document.querySelectorAll(".menu-item");

	menuItem.forEach(function (item) {
		item.addEventListener("click", function () {
			const menuToggle = document.querySelector(".menu-toggle");
			if (nav.classList.contains("is-open")) {
				nav.classList.toggle("is-open");
				menuToggle.toggleAttribute("aria-expanded");
			}
		});
	});
}
navigationToggle();

// Page loader spinner 
function loaderSpinner() {
	window.addEventListener("load", () => {
		const loader = document.getElementById("spinner");
		loader.classList.add("loader--hidden");
		loader.addEventListener("transitionend", function(){
			document.body.removeChild(loader);
		});
	});
}
loaderSpinner();

// Scroll Progress bar
function scrollIndicator() {
	let winScroll =
		document.body.scrollTop || document.documentElement.scrollTop;
	let scrollingHeight = document.documentElement.scrollHeight;
	let clientWindowHeight = document.documentElement.clientHeight;
	let totalHeight = scrollingHeight - clientWindowHeight;
	let scrolled = (winScroll / totalHeight) * 100;
	document.querySelector(".progress-bar").style.width = scrolled + "%";
}

// Navigation sticky when scrolling
function stickyNavigation() {
	const headerNavigation = document.querySelector(".header-inner");
	if (
		document.documentElement.scrollTop > 750 ||
		document.body.scrollTop > 750
	) {
		headerNavigation.classList.add("header-inner-color");
	} else {
		headerNavigation.classList.remove("header-inner-color");
	}
}

window.onscroll = function () {
	scrollIndicator();
	stickyNavigation();
};

// Light/Dark Theme Toggle
const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", () => {
	document.body.classList.contains("light-theme")
		? enableDarkMode()
		: enableLightMode();
});

function enableDarkMode() {
	document.body.classList.remove("light-theme");
	document.body.classList.add("dark-theme");
	themeToggle.setAttribute("aria-label", "Switch to light theme");
	birdEffect.setOptions({
		backgroundColor: 0x4a5568,
	});
}

function enableLightMode() {
	document.body.classList.remove("dark-theme");
	document.body.classList.add("light-theme");
	themeToggle.setAttribute("aria-label", "Switch to dark theme");
	birdEffect.setOptions({
		backgroundColor: 0xeff1f5,
	});
}

function setThemePreference() {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		enableDarkMode();
		return;
	}
	enableLightMode();
}

document.onload = setThemePreference();
