import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	build: {
		// Let Astro automatically inline small CSS files
		inlineStylesheets: "auto",
		// Enable asset bundling optimizations
		assets: "auto",
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					// Let main.scss handle all imports
				},
			},
		},
		build: {
			// Optimize CSS for production
			cssCodeSplit: false, // Single CSS bundle for better performance
			// Better minification
			minify: "terser",
			rollupOptions: {
				output: {
					// Better asset naming for caching
					assetFileNames: (assetInfo) => {
						const info = assetInfo.name.split(".");
						const ext = info[info.length - 1];
						if (/css/i.test(ext)) {
							return `assets/css/[name]-[hash][extname]`;
						}
						return `assets/[name]-[hash][extname]`;
					},
				},
			},
		},
	},
});
