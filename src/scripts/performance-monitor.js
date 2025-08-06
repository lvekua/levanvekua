/**
 * Performance Monitoring Script
 *
 * This script tracks Web Vitals and other performance metrics
 * to help monitor the impact of optimizations
 */

// Web Vitals monitoring
function measureWebVitals() {
	// Largest Contentful Paint (LCP)
	new PerformanceObserver((entryList) => {
		const entries = entryList.getEntries();
		const lastEntry = entries[entries.length - 1];
		console.log("LCP:", lastEntry.startTime);

		// Send to analytics (replace with your analytics)
		if (typeof gtag !== "undefined") {
			gtag("event", "web_vitals", {
				"metric_name": "LCP",
				"metric_value": Math.round(lastEntry.startTime),
				"metric_rating":
					lastEntry.startTime < 2500
						? "good"
						: lastEntry.startTime < 4000
						? "needs-improvement"
						: "poor",
			});
		}
	}).observe({ entryTypes: ["largest-contentful-paint"] });

	// First Contentful Paint (FCP)
	new PerformanceObserver((entryList) => {
		const entries = entryList.getEntries();
		entries.forEach((entry) => {
			if (entry.name === "first-contentful-paint") {
				console.log("FCP:", entry.startTime);

				if (typeof gtag !== "undefined") {
					gtag("event", "web_vitals", {
						"metric_name": "FCP",
						"metric_value": Math.round(entry.startTime),
						"metric_rating":
							entry.startTime < 1800
								? "good"
								: entry.startTime < 3000
								? "needs-improvement"
								: "poor",
					});
				}
			}
		});
	}).observe({ entryTypes: ["paint"] });

	// Cumulative Layout Shift (CLS)
	let clsValue = 0;
	new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntries()) {
			if (!entry.hadRecentInput) {
				clsValue += entry.value;
			}
		}
		console.log("CLS:", clsValue);

		if (typeof gtag !== "undefined") {
			gtag("event", "web_vitals", {
				"metric_name": "CLS",
				"metric_value": Math.round(clsValue * 1000),
				"metric_rating":
					clsValue < 0.1
						? "good"
						: clsValue < 0.25
						? "needs-improvement"
						: "poor",
			});
		}
	}).observe({ entryTypes: ["layout-shift"] });

	// First Input Delay (FID) / Interaction to Next Paint (INP)
	new PerformanceObserver((entryList) => {
		const entries = entryList.getEntries();
		entries.forEach((entry) => {
			console.log("FID:", entry.processingStart - entry.startTime);

			if (typeof gtag !== "undefined") {
				const fidValue = entry.processingStart - entry.startTime;
				gtag("event", "web_vitals", {
					"metric_name": "FID",
					"metric_value": Math.round(fidValue),
					"metric_rating":
						fidValue < 100
							? "good"
							: fidValue < 300
							? "needs-improvement"
							: "poor",
				});
			}
		});
	}).observe({ entryTypes: ["first-input"] });
}

// Resource loading timing
function measureResourceLoading() {
	window.addEventListener("load", () => {
		const navigationTiming = performance.getEntriesByType("navigation")[0];
		const resourceTimings = performance.getEntriesByType("resource");

		// Log key timing metrics
		console.log("Performance Metrics:", {
			"DNS Lookup":
				navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
			"TCP Connection":
				navigationTiming.connectEnd - navigationTiming.connectStart,
			"Request": navigationTiming.responseStart - navigationTiming.requestStart,
			"Response": navigationTiming.responseEnd - navigationTiming.responseStart,
			"DOM Processing":
				navigationTiming.domContentLoadedEventStart -
				navigationTiming.responseEnd,
			"Load Event":
				navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
			"Total Page Load":
				navigationTiming.loadEventEnd - navigationTiming.navigationStart,
		});

		// Find CSS files and their load times
		const cssFiles = resourceTimings.filter(
			(resource) =>
				resource.name.includes(".css") || resource.name.includes("astro")
		);

		cssFiles.forEach((css) => {
			console.log(`CSS Load Time for ${css.name}:`, css.duration);
		});
	});
}

// Initialize monitoring
if (typeof window !== "undefined") {
	// Only run in browser environment
	measureWebVitals();
	measureResourceLoading();
}

export { measureWebVitals, measureResourceLoading };
