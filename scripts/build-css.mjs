#!/usr/bin/env node

/**
 * CSS Build Script
 * Compiles SCSS files and minifies them into a single CSS file
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rootDir = path.resolve(__dirname, "..");
const scssDir = path.join(rootDir, "src", "scss");
const outputDir = path.join(rootDir, "src", "styles");
const inputFile = path.join(scssDir, "main.scss");
const outputFile = path.join(outputDir, "styles.css.min");

console.log("🎨 Building CSS...");

try {
	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Compile SCSS
	console.log("📦 Compiling SCSS...");
	const result = sass.compile(inputFile, {
		style: "expanded",
		sourceMap: false,
		loadPaths: [scssDir],
	});

	// Process with PostCSS
	console.log("🔧 Processing with PostCSS...");
	const processed = await postcss([
		autoprefixer({
			grid: "autoplace",
			flexbox: "no-2009",
		}),
		cssnano({
			preset: [
				"default",
				{
					discardComments: { removeAll: true },
					normalizeWhitespace: true,
					mergeLonghand: true,
					mergeRules: true,
				},
			],
		}),
	]).process(result.css, { from: undefined });

	// Write output
	fs.writeFileSync(outputFile, processed.css);

	// Calculate file sizes
	const originalSize = Buffer.byteLength(result.css, "utf8");
	const minifiedSize = Buffer.byteLength(processed.css, "utf8");
	const savings = (
		((originalSize - minifiedSize) / originalSize) *
		100
	).toFixed(1);

	console.log("✅ CSS build complete!");
	console.log(`📏 Original size: ${(originalSize / 1024).toFixed(1)}KB`);
	console.log(`📦 Minified size: ${(minifiedSize / 1024).toFixed(1)}KB`);
	console.log(`💾 Savings: ${savings}%`);
	console.log(`📄 Output: ${outputFile}`);
} catch (error) {
	console.error("❌ CSS build failed:", error.message);
	process.exit(1);
}
