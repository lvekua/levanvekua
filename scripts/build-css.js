#!/usr/bin/env node

/**
 * CSS Build Script
 *
 * This script compiles SCSS files into a single minified CSS file
 * and places it in the styles folder
 */

const fs = require("fs");
const path = require("path");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// Paths
const SCSS_DIR = path.join(__dirname, "../src/scss");
const STYLES_DIR = path.join(__dirname, "../src/styles");
const OUTPUT_FILE = path.join(STYLES_DIR, "styles.css");
const OUTPUT_MIN_FILE = path.join(STYLES_DIR, "styles.min.css");
const MAIN_SCSS = path.join(SCSS_DIR, "main.scss");

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

/**
 * Compile SCSS to CSS
 */
async function compileSCSS() {
	try {
		console.log("🔨 Compiling SCSS...");

		// Compile SCSS
		const result = sass.compile(MAIN_SCSS, {
			style: "expanded",
			sourceMap: true,
			loadPaths: [SCSS_DIR],
		});

		console.log("✅ SCSS compiled successfully");
		return result.css;
	} catch (error) {
		console.error("❌ SCSS compilation failed:", error.message);
		throw error;
	}
}

/**
 * Process CSS with PostCSS
 */
async function processCSS(css) {
	try {
		console.log("🔧 Processing CSS with PostCSS...");

		// Process with autoprefixer
		const expanded = await postcss([autoprefixer]).process(css, {
			from: undefined,
		});

		// Process with cssnano for minification
		const minified = await postcss([
			autoprefixer,
			cssnano({
				preset: [
					"default",
					{
						discardComments: { removeAll: true },
						normalizeWhitespace: true,
						mergeRules: true,
						mergeLonghand: true,
						minifySelectors: true,
					},
				],
			}),
		]).process(css, { from: undefined });

		console.log("✅ CSS processed successfully");
		return {
			expanded: expanded.css,
			minified: minified.css,
		};
	} catch (error) {
		console.error("❌ CSS processing failed:", error.message);
		throw error;
	}
}

/**
 * Write CSS files
 */
function writeCSS(css) {
	try {
		ensureDir(STYLES_DIR);

		// Write expanded CSS
		fs.writeFileSync(OUTPUT_FILE, css.expanded);
		console.log(`✅ Expanded CSS written to: ${OUTPUT_FILE}`);

		// Write minified CSS
		fs.writeFileSync(OUTPUT_MIN_FILE, css.minified);
		console.log(`✅ Minified CSS written to: ${OUTPUT_MIN_FILE}`);

		// Log file sizes
		const expandedSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
		const minifiedSize = (fs.statSync(OUTPUT_MIN_FILE).size / 1024).toFixed(2);
		const savings = (
			(1 - fs.statSync(OUTPUT_MIN_FILE).size / fs.statSync(OUTPUT_FILE).size) *
			100
		).toFixed(1);

		console.log(`📊 File sizes:`);
		console.log(`   Expanded: ${expandedSize} KB`);
		console.log(`   Minified: ${minifiedSize} KB`);
		console.log(`   Savings: ${savings}%`);
	} catch (error) {
		console.error("❌ Failed to write CSS files:", error.message);
		throw error;
	}
}

/**
 * Main build process
 */
async function build() {
	try {
		console.log("🚀 Starting CSS build process...\n");

		// Check if main SCSS file exists
		if (!fs.existsSync(MAIN_SCSS)) {
			throw new Error(`Main SCSS file not found: ${MAIN_SCSS}`);
		}

		// Compile SCSS
		const compiledCSS = await compileSCSS();

		// Process CSS
		const processedCSS = await processCSS(compiledCSS);

		// Write files
		writeCSS(processedCSS);

		console.log("\n✅ CSS build completed successfully!");
	} catch (error) {
		console.error("\n❌ CSS build failed:", error.message);
		process.exit(1);
	}
}

// Run the build
if (require.main === module) {
	build();
}

module.exports = { build, compileSCSS, processCSS, writeCSS };
