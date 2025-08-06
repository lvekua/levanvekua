#!/usr/bin/env node

import { PurgeCSS } from "purgecss";
import fs from "fs";
import path from "path";

async function cleanupCSS() {
	console.log("🧹 Starting CSS cleanup...\n");

	// First, build the project
	console.log("📦 Building project...");
	const { execSync } = await import("child_process");

	try {
		execSync("npm run build", { stdio: "inherit" });
		console.log("✅ Build completed\n");
	} catch (error) {
		console.error("❌ Build failed:", error.message);
		process.exit(1);
	}

	// Find CSS files in dist
	const distDir = "./dist/_astro";

	if (!fs.existsSync(distDir)) {
		console.error("❌ Distribution directory not found:", distDir);
		process.exit(1);
	}

	const cssFiles = fs
		.readdirSync(distDir)
		.filter((file) => file.endsWith(".css"));

	if (cssFiles.length === 0) {
		console.log("❌ No CSS files found in dist");
		process.exit(1);
	}

	console.log(`🎯 Found ${cssFiles.length} CSS file(s) to analyze`);

	// Run PurgeCSS
	for (const cssFile of cssFiles) {
		const cssPath = path.join(distDir, cssFile);
		const originalSize = fs.statSync(cssPath).size;

		console.log(
			`\n📊 Analyzing: ${cssFile} (${(originalSize / 1024).toFixed(2)}KB)`
		);

		try {
			const purgeCSSResults = await new PurgeCSS().purge({
				content: ["./dist/**/*.html", "./src/**/*.{astro,html,js,jsx,ts,tsx}"],
				css: [cssPath],
				safelist: [
					// Dynamic classes
					"dark-theme",
					"light-theme",
					"is-open",
					"is-visible",
					"loader--hidden",
					"gs_reveal",
					// Utility patterns
					/^has-.*-font-size$/,
					/^has-.*-color$/,
					/^block-.*$/,
					/^menu-.*$/,
					/^header-.*$/,
					// Interactive states
					/hover:/,
					/focus:/,
					/active:/,
					// Responsive
					/@media/,
				],
				keyframes: true,
				fontFace: true,
			});

			if (purgeCSSResults[0]) {
				const cleanedCSS = purgeCSSResults[0].css;
				const cleanedSize = Buffer.byteLength(cleanedCSS, "utf8");
				const savings = originalSize - cleanedSize;
				const percentage = ((savings / originalSize) * 100).toFixed(1);

				// Save cleaned version
				const cleanedPath = cssPath.replace(".css", ".cleaned.css");
				fs.writeFileSync(cleanedPath, cleanedCSS);

				console.log(`✅ Cleaned CSS saved to: ${path.basename(cleanedPath)}`);
				console.log(
					`📉 Size: ${(originalSize / 1024).toFixed(2)}KB → ${(
						cleanedSize / 1024
					).toFixed(2)}KB`
				);
				console.log(
					`💾 Saved: ${(savings / 1024).toFixed(2)}KB (${percentage}%)`
				);
			}
		} catch (error) {
			console.error(`❌ Error processing ${cssFile}:`, error.message);
		}
	}

	console.log("\n🎉 CSS cleanup completed!");
	console.log("\n💡 Next steps:");
	console.log("   • Review the .cleaned.css files");
	console.log("   • Test your site with cleaned CSS");
	console.log("   • Replace original files if satisfied");
}

cleanupCSS().catch(console.error);
