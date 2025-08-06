#!/usr/bin/env node

/**
 * Cloudflare Images Upload Script
 *
 * This script uploads your local images to Cloudflare Images
 * Run: node scripts/upload-to-cloudflare.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Update these values
const CLOUDFLARE_CONFIG = {
	accountId: "YOUR_CLOUDFLARE_ACCOUNT_ID", // Get from Cloudflare dashboard
	apiToken: "YOUR_CLOUDFLARE_API_TOKEN", // Create in Cloudflare dashboard > My Profile > API Tokens
	customDomain: "YOUR_CUSTOM_DOMAIN", // Optional: your custom domain for images
};

const IMAGE_DIRECTORY = path.join(__dirname, "../public/img");

// Supported image formats
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

/**
 * Upload a single image to Cloudflare Images
 */
async function uploadImage(filePath, fileName) {
	try {
		const form = new FormData();
		form.append("file", fs.createReadStream(filePath));
		form.append("id", fileName.replace(/\.[^/.]+$/, "")); // Remove extension for ID

		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/images/v1`,
			{
				method: "POST",
				headers: {
					"Authorization": `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
					...form.getHeaders(),
				},
				body: form,
			}
		);

		const result = await response.json();

		if (result.success) {
			console.log(`✅ Uploaded: ${fileName}`);
			console.log(`   URL: ${result.result.variants[0]}`);
			return {
				success: true,
				fileName,
				url: result.result.variants[0],
				id: result.result.id,
			};
		} else {
			console.error(`❌ Failed to upload ${fileName}:`, result.errors);
			return { success: false, fileName, error: result.errors };
		}
	} catch (error) {
		console.error(`❌ Error uploading ${fileName}:`, error.message);
		return { success: false, fileName, error: error.message };
	}
}

/**
 * Recursively find all images in directory
 */
function findImages(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			findImages(filePath, fileList);
		} else if (SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())) {
			fileList.push({
				fullPath: filePath,
				relativePath: path.relative(IMAGE_DIRECTORY, filePath),
				fileName: file,
			});
		}
	});

	return fileList;
}

/**
 * Generate URL mapping for easy replacement
 */
function generateUrlMapping(results) {
	const mapping = {};

	results.forEach((result) => {
		if (result.success) {
			const relativePath = `/img/${result.fileName}`;
			mapping[relativePath] = result.url;
		}
	});

	return mapping;
}

/**
 * Main execution
 */
async function main() {
	// Validate configuration
	if (
		CLOUDFLARE_CONFIG.accountId === "YOUR_CLOUDFLARE_ACCOUNT_ID" ||
		CLOUDFLARE_CONFIG.apiToken === "YOUR_CLOUDFLARE_API_TOKEN"
	) {
		console.error(
			"❌ Please update the CLOUDFLARE_CONFIG in this script with your actual values"
		);
		console.log("\n📋 Setup Instructions:");
		console.log("1. Get Account ID: Cloudflare Dashboard > Right sidebar");
		console.log(
			"2. Create API Token: Cloudflare Dashboard > My Profile > API Tokens > Create Token"
		);
		console.log('   - Use "Custom token" template');
		console.log("   - Permissions: Account:Cloudflare Images:Edit");
		console.log("   - Account Resources: Include > Your account");
		process.exit(1);
	}

	console.log("🚀 Starting Cloudflare Images upload...\n");

	// Find all images
	const images = findImages(IMAGE_DIRECTORY);
	console.log(`📁 Found ${images.length} images to upload\n`);

	if (images.length === 0) {
		console.log("No images found in", IMAGE_DIRECTORY);
		return;
	}

	// Upload images
	const results = [];
	for (const image of images) {
		console.log(`⬆️  Uploading: ${image.relativePath}`);
		const result = await uploadImage(image.fullPath, image.fileName);
		results.push(result);

		// Small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Generate summary
	const successful = results.filter((r) => r.success);
	const failed = results.filter((r) => !r.success);

	console.log("\n📊 Upload Summary:");
	console.log(`✅ Successful: ${successful.length}`);
	console.log(`❌ Failed: ${failed.length}`);

	if (failed.length > 0) {
		console.log("\n❌ Failed uploads:");
		failed.forEach((f) => console.log(`   - ${f.fileName}: ${f.error}`));
	}

	// Generate URL mapping
	if (successful.length > 0) {
		const urlMapping = generateUrlMapping(successful);

		// Save mapping to file
		const mappingFile = path.join(__dirname, "cloudflare-url-mapping.json");
		fs.writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2));

		console.log(`\n📄 URL mapping saved to: ${mappingFile}`);
		console.log("\n🔄 Next steps:");
		console.log(
			"1. Update your Astro components to use the new Cloudflare URLs"
		);
		console.log("2. Consider creating a helper function for URL generation");
		console.log("3. Test your site with the new image URLs");
	}
}

// Run the script
if (require.main === module) {
	main().catch(console.error);
}

module.exports = { uploadImage, findImages, generateUrlMapping };
