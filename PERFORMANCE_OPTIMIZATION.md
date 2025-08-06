# Fixing Render-Blocking CSS in Astro

## Problem

Google PageSpeed Insights is reporting render-blocking CSS that delays LCP (Largest Contentful Paint) by ~170ms.

## Solutions Implemented

### 1. Critical CSS Inlining ✅

- **File**: `src/styles/critical.scss`
- **Purpose**: Contains only above-the-fold styles
- **Result**: Eliminates render-blocking for critical content

### 2. Async CSS Loading ✅

- **Method**: Using `rel="preload"` with `onload` fallback
- **Files**: Non-critical styles loaded after page load
- **Result**: Prevents blocking of initial render

### 3. Astro Build Optimizations ✅

- **Config**: Updated `astro.config.mjs`
- **Features**:
  - CSS code splitting
  - Automatic inlining for small CSS
  - Manual chunks for better caching

### 4. Performance Monitoring ✅

- **File**: `src/scripts/performance-monitor.js`
- **Tracks**: LCP, FCP, CLS, FID metrics
- **Purpose**: Monitor improvement after changes

## Implementation Steps

### Step 1: Update Layout

```astro
---
// Only import critical CSS in Layout
import '../styles/critical.scss';
---

<!-- In <head> -->
<link rel="preload" href="/src/styles/main.scss" as="style" onload="this.onload=null;this.rel='stylesheet';" />
<noscript><link rel="stylesheet" href="/src/styles/main.scss" /></noscript>
```

### Step 2: Optimize Astro Config

```javascript
export default defineConfig({
	build: {
		inlineStylesheets: "auto",
	},
	vite: {
		build: {
			cssCodeSplit: true,
		},
	},
});
```

### Step 3: Test Performance

1. Run: `npm run build`
2. Serve: `npm run preview`
3. Test with PageSpeed Insights
4. Monitor Web Vitals in browser console

## Expected Results

### Before Optimization

- Render-blocking CSS: 170ms delay
- LCP affected by CSS loading
- Single large CSS bundle

### After Optimization

- Critical CSS inlined (no blocking)
- Non-critical CSS loads async
- Improved LCP by ~170ms
- Better caching with split CSS

## Additional Optimizations

### Resource Hints

```html
<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
<link rel="dns-prefetch" href="//www.googletagmanager.com" />

<!-- Preload critical images -->
<link rel="preload" href="/img/logo.svg" as="image" type="image/svg+xml" />
<link
	rel="preload"
	href="/img/lv-background.webp"
	as="image"
	type="image/webp"
/>
```

### Image Optimization for Cloudflare

When you move to Cloudflare Images:

```astro
<!-- Replace with Cloudflare URLs -->
<img
  src="https://imagedelivery.net/YOUR_ACCOUNT_HASH/logo/w=80,h=80,format=webp"
  alt="Logo"
  width="40"
  height="40"
  loading="eager"
/>
```

## Testing Commands

```bash
# Build optimized version
npm run build

# Preview built site
npm run preview

# Analyze bundle (if you have analyzer)
npm run build -- --analyze

# Test with Lighthouse CLI
npx lighthouse http://localhost:4321 --only-categories=performance
```

## Monitoring

The performance monitor script will log:

- LCP improvements
- CSS load times
- Overall page metrics
- Web Vitals scores

Check browser console after implementing changes to see the improvements.

## Next Steps for Cloudflare

Once you set up Cloudflare Images:

1. Upload images using the script we created
2. Replace image URLs in your components
3. Add Cloudflare-specific optimizations
4. Configure proper caching headers

This should significantly improve your PageSpeed Insights score and eliminate the render-blocking CSS warning.
