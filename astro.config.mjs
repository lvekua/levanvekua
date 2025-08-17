import { defineConfig } from "astro/config";
import purgecss from "astro-purgecss";

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Only apply Critters in production builds
		...(isDevelopment
			? []
			: [
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
									allowRules: [
										/^(background|border|color|font|margin|padding|text)/,
									],
								});

								try {
									const htmlPath = join(dir.pathname, "index.html");
									console.log(`[critters] Processing ${htmlPath}...`);

									const html = await readFile(htmlPath, "utf8");
									const optimized = await critters.process(html);
									await writeFile(htmlPath, optimized);

									console.log(
										`[critters] ✓ Optimized index.html with critical CSS`
									);
								} catch (error) {
									console.warn(`[critters] Warning:`, error.message);
								}
							},
						},
					},
			  ]),
		// Only apply PurgeCSS in production builds (must be last)
		...(isDevelopment
			? []
			: [
					purgecss({
						content: [
							"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
							"./public/**/*.js",
						],
						// Enable source maps for PurgeCSS
						sourceMap: true,
						safelist: {
							// Keep these classes even if not found
							standard: [
								// Dynamic classes that might not be detected
								"is-open",
								"is-visible",
								"gridder-active",
								"gallery-overlay-open",
								"loader",
								"header-sticky",
								// Scroll animation classes
								/^reveal/,
								// Theme classes
								/^has-.*-color$/,
								/^has-.*-font-size$/,
								/^has-text-align/,
								// Astro specific classes
								/^astro-/,
							],
							deep: [
								// Keep nested styles for these selectors
								/data-theme/,
								/\[data-/,
								// Keep hover and focus states
								/:hover/,
								/:focus/,
								/:active/,
								// Keep media query styles
								/@media/,
							],
							greedy: [
								// Keep all styles matching these patterns
								/^wp-/,
								/^block-/,
								/^blocks-/,
								/^btn/,
								/^menu/,
								/^nav/,
								/^footer/,
								/^header/,
								/^main/,
								/^section/,
								/^container/,
								/^gridder/,
								/^folio/,
							],
						},
						// Extract keyframes
						keyframes: true,
						// Extract font-face declarations
						fontFace: true,
						// Remove unused variables
						variables: true,
					}),
			  ]),
	],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					// Enable source maps for SCSS in development
					sourceMap: isDevelopment,
					// Ensure accurate source maps in development
					sourceMapIncludeSources: isDevelopment,
				},
			},
			// Enable CSS source maps for better debugging in development
			devSourcemap: isDevelopment,
		},
		// Enable source maps only in development
		build: {
			sourcemap: isDevelopment,
			// Preserve source maps even after minification in development
			minify: isDevelopment ? false : "esbuild",
		},
	},
	build: {
		inlineStylesheets: "never", // Let Critters handle CSS inlining
	},
});
