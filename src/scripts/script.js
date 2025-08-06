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
	const menuItems = document.querySelectorAll(".menu-item");

	if (!nav || !menuItems.length) {
		console.warn("Navigation elements not found");
		return;
	}

	menuItems.forEach(function (item) {
		item.addEventListener("click", function () {
			const menuToggle = document.querySelector(".menu-toggle");
			if (!menuToggle) return;

			if (nav.classList.contains("is-open")) {
				nav.classList.toggle("is-open");
				menuToggle.toggleAttribute("aria-expanded");
			}
		});
	});
}

// Safe DOM ready check
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", navigationToggle);
} else {
	navigationToggle();
}

// Page loader spinner
function loaderSpinner() {
	window.addEventListener("load", () => {
		const loader = document.getElementById("spinner");
		if (!loader) return;

		loader.classList.add("loader--hidden");
		loader.addEventListener("transitionend", function () {
			if (this.parentNode) {
				this.remove();
			}
		});
	});
}
loaderSpinner();

// Scroll Progress bar
function scrollIndicator() {
	const progressBar = document.querySelector(".progress-bar");
	if (!progressBar) return;

	let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	let scrollingHeight = document.documentElement.scrollHeight;
	let clientWindowHeight = document.documentElement.clientHeight;
	let totalHeight = scrollingHeight - clientWindowHeight;

	if (totalHeight <= 0) return;

	let scrolled = (winScroll / totalHeight) * 100;
	progressBar.style.width = Math.min(scrolled, 100) + "%";
}

// Navigation sticky when scrolling
function stickyNavigation() {
	const headerNavigation = document.querySelector(".header");
	if (!headerNavigation) return;

	const scrollTop =
		document.documentElement.scrollTop || document.body.scrollTop;

	if (scrollTop > 750) {
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
function initThemeToggle() {
	const themeToggle = document.querySelector("#theme-toggle");

	if (!themeToggle) {
		console.warn("Theme toggle button not found");
		return;
	}

	themeToggle.addEventListener("click", () => {
		document.body.classList.contains("light-theme")
			? enableDarkMode()
			: enableLightMode();
	});

	function enableDarkMode() {
		document.body.classList.remove("light-theme");
		document.body.classList.add("dark-theme");
		themeToggle.setAttribute("aria-label", "Switch to light theme");
		// Store preference
		try {
			localStorage.setItem("theme", "dark");
		} catch (e) {
			console.warn("Could not save theme preference:", e);
		}
	}

	function enableLightMode() {
		document.body.classList.remove("dark-theme");
		document.body.classList.add("light-theme");
		themeToggle.setAttribute("aria-label", "Switch to dark theme");
		// Store preference
		try {
			localStorage.setItem("theme", "light");
		} catch (e) {
			console.warn("Could not save theme preference:", e);
		}
	}

	function setThemePreference() {
		// Check for saved preference first
		try {
			const savedTheme = localStorage.getItem("theme");
			if (savedTheme === "dark") {
				enableDarkMode();
				return;
			} else if (savedTheme === "light") {
				enableLightMode();
				return;
			}
		} catch (e) {
			console.warn("Could not access localStorage:", e);
		}

		// Fall back to system preference
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			enableDarkMode();
			return;
		}
		enableLightMode();
	}

	// Set initial theme
	setThemePreference();
}

// Initialize theme toggle when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
	initThemeToggle();
}
