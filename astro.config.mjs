import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
	integrations: [
		partytown({
			// Add common third-party script forwarding events
			config: {
				forward: [
					"dataLayer.push",
					"gtag",
					"ga",
					"fbq",
					"_hsq.push",
					"hj",
					"_linkedin_partner_id",
				],
				// Debug mode to help identify issues
				debug: false,
				// Fallback timeout for problematic scripts
				fallbackTimeout: 3000,
			},
		}),
		// Critters integration as an Astro integration
		{
			name: "critters-integration",
			hooks: {
				"astro:build:done": async ({ dir }) => {
					const { default: Critters } = await import("critters");
					const { readFile, writeFile } = await import("fs/promises");
					const { join } = await import("path");

					const critters = new Critters({
						// Set the path for CSS resolution
						path: dir.pathname,
						publicPath: "/",

						// Critical CSS extraction settings
						width: 1200, // Viewport width for critical CSS
						height: 900, // Viewport height for critical CSS

						// Font optimization
						fonts: true, // Handle web fonts
						preload: "swap", // Add font-display: swap
						inlineFonts: false, // Keep font files external for caching

						// CSS optimization
						pruneSource: false, // Keep original files for fallback
						external: true, // Keep non-critical CSS external
						inlineImages: false, // Don't inline images (keep them cacheable)

						// Logging
						logLevel: "info", // Show optimization details

						// Performance settings
						compress: true, // Compress critical CSS
						keyframes: "critical", // Only include critical keyframes

						// Prevent errors from breaking build
						allowRules: [/^(background|border|color|font|margin|padding|text)/],
					});

					try {
						const htmlPath = join(dir.pathname, "index.html");
						console.log(`[critters] Processing ${htmlPath}...`);

						const html = await readFile(htmlPath, "utf8");
						const optimized = await critters.process(html);
						await writeFile(htmlPath, optimized);

						console.log(`[critters] ✓ Optimized index.html with critical CSS`);
					} catch (error) {
						console.warn(`[critters] Warning:`, error.message);
					}
				},
			},
		},
	],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "/src/styles/theme.scss";`,
				},
			},
		},
	},
	build: {
		inlineStylesheets: "never", // Let Critters handle CSS inlining
	},
});
