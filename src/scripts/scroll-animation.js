(function () {
	const els = document.querySelectorAll(".reveal");
	if (!els.length) return;

	if (!("IntersectionObserver" in window)) {
		els.forEach((el) => el.classList.add("is-visible"));
		return;
	}

	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				const el = entry.target;
				const repeat = el.dataset.revealRepeat === "true";
				if (entry.isIntersecting) {
					el.classList.add("is-visible");
					if (!repeat) obs.unobserve(el);
				} else if (repeat) {
					el.classList.remove("is-visible");
				}
			});
		},
		{
			threshold: 0.2,
			rootMargin: "0px 0px -10% 0px",
		}
	);

	els.forEach((el) => io.observe(el));
})();
