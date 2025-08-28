/**
 * Website Navigation and Scroll Effects
 * Handles mobile navigation, accessibility, scroll indicators, and dynamic sizing
 */

class WebsiteController {
	constructor() {
		this.elements = this.getElements();
		this.scrollThreshold = {
			goToTop: 100,
			stickyHeader: 750,
			scrollDown: 100,
		};

		this.init();
	}

	/**
	 * Cache DOM elements for better performance
	 */
	getElements() {
		return {
			nav: document.querySelector('.nav'),
			navList: document.querySelector('.nav ul'),
			menuToggle: document.querySelector('#menu-toggle'),
			menuItems: document.querySelectorAll('.menu-item'),
			goToTopButton: document.querySelector('.go-to-top'),
			progressBar: document.querySelector('.progress-bar'),
			header: document.querySelector('.header'),
			scrollDownIndicator: document.querySelector('.scroll-down'),
		};
	}

	/**
	 * Initialize all functionality
	 */
	init() {
		this.setupKeyboardNavigation();
		this.setupMobileNavigation();
		this.setupGoToTopButton();
		this.setupScrollEffects();
		this.setupDynamicHeaderHeight();
	}

	/**
	 * Handle keyboard navigation for accessibility
	 */
	setupKeyboardNavigation() {
		document.addEventListener('keydown', (event) => {
			const { nav } = this.elements;

			if (!nav || !nav.classList.contains('is-open')) return;
			if (event.keyCode !== 9) return; // Only handle Tab key

			const focusableElements = nav.querySelectorAll('input, a, button');
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			const activeElement = document.activeElement;
			const isShiftPressed = event.shiftKey;

			// Trap focus within navigation when open
			if (!isShiftPressed && activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			} else if (isShiftPressed && activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		});
	}

	/**
	 * Setup mobile navigation toggle functionality
	 */
	setupMobileNavigation() {
		const { nav, navList, menuToggle, menuItems } = this.elements;

		if (!nav || !menuToggle) return;

		// Initialize ARIA attributes
		navList?.setAttribute('aria-expanded', 'false');

		// Handle menu toggle button click
		menuToggle.addEventListener('click', () => {
			this.toggleNavigation();
		});

		// Close navigation when menu item is clicked (mobile)
		menuItems.forEach((item) => {
			item.addEventListener('click', () => {
				if (nav.classList.contains('is-open')) {
					this.closeNavigation();
				}
			});
		});
	}

	/**
	 * Toggle navigation open/closed state
	 */
	toggleNavigation() {
		const { nav, navList, menuToggle } = this.elements;
		const isOpen = nav.classList.contains('is-open');

		nav.classList.toggle('is-open');

		// Update ARIA attributes
		const newState = isOpen ? 'false' : 'true';
		menuToggle.setAttribute('aria-expanded', newState);
		navList?.setAttribute('aria-expanded', newState);
	}

	/**
	 * Close navigation
	 */
	closeNavigation() {
		const { nav, navList, menuToggle } = this.elements;

		nav.classList.remove('is-open');
		menuToggle.setAttribute('aria-expanded', 'false');
		navList?.setAttribute('aria-expanded', 'false');
	}

	/**
	 * Setup go-to-top button functionality
	 */
	setupGoToTopButton() {
		const { goToTopButton } = this.elements;

		if (!goToTopButton) return;

		goToTopButton.addEventListener('click', (event) => {
			event.preventDefault();
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		});
	}

	/**
	 * Setup all scroll-related effects
	 */
	setupScrollEffects() {
		let ticking = false;

		window.addEventListener('scroll', () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					this.handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		});
	}

	/**
	 * Handle all scroll events in one function for better performance
	 */
	handleScroll() {
		const scrollY = window.scrollY;

		this.updateProgressBar(scrollY);
		this.updateStickyHeader(scrollY);
		this.updateGoToTopButton(scrollY);
		this.updateScrollDownIndicator(scrollY);
	}

	/**
	 * Update scroll progress bar
	 */
	updateProgressBar(scrollY) {
		const { progressBar } = this.elements;

		if (!progressBar) return;

		const documentHeight = document.documentElement.scrollHeight;
		const windowHeight = document.documentElement.clientHeight;
		const totalScrollableHeight = documentHeight - windowHeight;
		const scrollPercentage = (scrollY / totalScrollableHeight) * 100;

		progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
	}

	/**
	 * Update sticky header effect
	 */
	updateStickyHeader(scrollY) {
		const { header } = this.elements;

		if (!header) return;

		if (scrollY > this.scrollThreshold.stickyHeader) {
			header.classList.add('header-blur');
		} else {
			header.classList.remove('header-blur');
		}
	}

	/**
	 * Update go-to-top button visibility
	 */
	updateGoToTopButton(scrollY) {
		const { goToTopButton } = this.elements;

		if (!goToTopButton) return;

		if (scrollY > this.scrollThreshold.goToTop) {
			goToTopButton.classList.add('is-visible');
		} else {
			goToTopButton.classList.remove('is-visible');
		}
	}

	/**
	 * Update scroll down indicator
	 */
	updateScrollDownIndicator(scrollY) {
		const { scrollDownIndicator } = this.elements;

		if (!scrollDownIndicator) return;

		if (scrollY > this.scrollThreshold.scrollDown) {
			scrollDownIndicator.classList.add('fade-out');
		} else {
			scrollDownIndicator.classList.remove('fade-out');
		}
	}

	/**
	 * Setup dynamic header height CSS variable
	 */
	setupDynamicHeaderHeight() {
		const { header } = this.elements;

		if (!header) return;

		// Set initial height
		this.updateHeaderHeight();

		// Update height on resize
		const resizeObserver = new ResizeObserver(() => {
			this.updateHeaderHeight();
		});

		resizeObserver.observe(header);
	}

	/**
	 * Update CSS custom property for header height
	 */
	updateHeaderHeight() {
		const { header } = this.elements;
		const headerHeight = header.offsetHeight;

		document.documentElement.style.setProperty(
			'--header-height',
			`${headerHeight}px`
		);
	}
}

// Initialize the website controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new WebsiteController();
});
