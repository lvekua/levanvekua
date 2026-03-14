---
name: SEO Optimization Expert
description: Applies best practices, latest standards, and algorithms for maximum SEO performance.
---

# SEO Expert Skill

This skill provides the instructions and best practices required to optimize web applications for maximum Search Engine Optimization (SEO) performance. Apply these rules rigorously when creating or modifying web content.

## 1. Technical SEO & Performance (Core Web Vitals)
- **Speed & Loading (LCP - Largest Contentful Paint):**
  - Implement lazy loading (`loading="lazy"`) for images and iframes below the fold.
  - Preload critical assets like fonts and hero images using `<link rel="preload">`.
  - Use next-gen image formats (WebP, AVIF) and properly size using `<picture>` elements or `srcset`/`sizes` attributes.
- **Interactivity (INP - Interaction to Next Paint):**
  - Minimize main-thread blocking JavaScript.
  - Defer non-critical and third-party scripts.
- **Visual Stability (CLS - Cumulative Layout Shift):**
  - Always set explicit `width` and `height` attributes on images, SVGs, and video elements.
  - Pre-allocate space for dynamic content like ads or banners to prevent layouts from unexpectedly shifting during load.

## 2. On-Page SEO Foundations
- **Title Tags (`<title>`):**
  - Keep between 50-60 characters to prevent truncation in Search Engine Results Pages (SERPs).
  - Include target keywords near the beginning and ensure accurate description of page intent.
- **Meta Descriptions:**
  - Keep between 150-160 characters.
  - Write a compelling call-to-action (CTA) and include relevant keywords naturally.
- **URL Structure:**
  - Keep URLs short, descriptive, lower-case, and hypen-separated (`/like-this-example`).
  - Avoid unnecessary dynamic parameters.
- **Canonical Tags:**
  - Always specify a canonical URL (`<link rel="canonical" href="...">`) to consolidate indexing properties and prevent duplicate content issues.

## 3. Semantic HTML & Content Structure
- **Heading Tags (`<h1>` to `<h6>`):**
  - Ensure exactly ONE `<h1>` per page, clearly defining the main topic.
  - Use `<h2>`, `<h3>`, etc., hierarchically to visually and logically structure the content. Do not skip heading levels (e.g., jumping from `<h2>` immediately to `<h4>`).
- **Semantic Tags:**
  - Use proper HTML5 semantic tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` instead of generic `<div>` wrappers.
- **Content Quality (E-E-A-T):**
  - Write content that demonstrates Experience, Expertise, Authoritativeness, and Trustworthiness.
  - Incorporate relevant LSI (Latent Semantic Indexing) terms and contextually matching phrases rather than keyword stuffing.

## 4. Structured Data (Schema.org)
- Implement schema markup using valid JSON-LD format (`<script type="application/ld+json">`).
- Make sure to identify and include appropriate schema types for the page:
  - `Organization` or `LocalBusiness` for the homepage/contact page.
  - `Article` or `BlogPosting` for blog or news content.
  - `BreadcrumbList` for site navigation context.
  - `FAQPage` or `Product` to attempt capturing rich snippets in Google SERPs.

## 5. Crawlability & Indexability
- **Robots.txt & Sitemap:**
  - Ensure `robots.txt` does not block important rendering resources like JS/CSS files.
  - Implement an XML Sitemap and reference it in your `robots.txt`.
- **Internal Linking Strategy:**
  - Maintain a logical internal linking structure where no page is an "orphan."
  - Use descriptive, keyword-rich anchor text instead of generic text like "click here."

## 6. Social & Rich Sharing
- **Open Graph (OG) Tags (Facebook/LinkedIn):**
  - `<meta property="og:title" content="...">`
  - `<meta property="og:description" content="...">`
  - `<meta property="og:image" content="...">`
  - `<meta property="og:url" content="...">`
  - `<meta property="og:type" content="website">`
- **Twitter Cards:**
  - `<meta name="twitter:card" content="summary_large_image">`
  - Provide corresponding `twitter:title`, `twitter:description`, and `twitter:image`.

## 7. Mobile-First & Accessibility (A11y)
- **Responsive Design:** Ensure the site uses appropriate media queries and the viewport meta tag (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`). Search algorithms primarily evaluate mobile versions of pages.
- **Accessibility as an SEO Signal:**
  - Provide descriptive, accurate `alt` text for ALL functional and content-bearing images.
  - Ensure text elements meet minimum contrast ratio standards.
  - Provide ARIA labels when visual context is not inherently available to screen readers.

## Workflow Instructions
When tasked to optimize a project for SEO:
1. **Analyze:** Evaluate existing HTML files/components against the rules above.
2. **Plan Document:** Outline specific missing meta tags, missing semantic elements, and performance bottlenecks.
3. **Execute:** Inject required `<meta>` properties, `JSON-LD` schemas, and semantic structures, refactoring non-semantic tags and repairing header hierarchies.
4. **Verify:** Conclude by summarizing what was fixed, ensuring no syntax errors were introduced in the `<head>` or JSON-LD scripts.
