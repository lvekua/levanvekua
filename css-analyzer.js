#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSS class usage analyzer
function analyzeCSSUsage() {
	const srcDir = "./src";
	const stylesDir = "./src/styles";

	// Read all CSS/SCSS files
	const cssFiles = ["main.scss", "layout.scss", "style.scss", "theme.scss"];
	const allClasses = new Set();
	const usedClasses = new Set();

	// Extract CSS classes from stylesheets
	cssFiles.forEach((file) => {
		const filePath = path.join(stylesDir, file);
		if (fs.existsSync(filePath)) {
			const content = fs.readFileSync(filePath, "utf8");

			// Simple regex to find CSS classes (not perfect but good enough)
			const classMatches = content.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
			if (classMatches) {
				classMatches.forEach((match) => {
					const className = match.substring(1); // Remove the dot
					allClasses.add(className);
				});
			}
		}
	});

	// Check usage in Astro/HTML files
	function checkDirectory(dir) {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				checkDirectory(filePath);
			} else if (file.endsWith(".astro") || file.endsWith(".html")) {
				const content = fs.readFileSync(filePath, "utf8");

				// Check each CSS class
				allClasses.forEach((className) => {
					if (content.includes(className)) {
						usedClasses.add(className);
					}
				});
			}
		});
	}

	checkDirectory(srcDir);

	// Find unused classes
	const unusedClasses = [...allClasses].filter((cls) => !usedClasses.has(cls));

	console.log("=== CSS USAGE ANALYSIS ===\n");
	console.log(`Total CSS classes found: ${allClasses.size}`);
	console.log(`Used CSS classes: ${usedClasses.size}`);
	console.log(`Potentially unused classes: ${unusedClasses.length}\n`);

	if (unusedClasses.length > 0) {
		console.log("Potentially unused classes:");
		unusedClasses.sort().forEach((cls) => {
			console.log(`  .${cls}`);
		});
	}

	console.log(
		"\nNote: This is a basic analysis. Some classes might be used dynamically via JavaScript."
	);
}

try {
	analyzeCSSUsage();
} catch (error) {
	console.error("Error analyzing CSS:", error.message);
}
