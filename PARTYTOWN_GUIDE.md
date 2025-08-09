# Partytown Integration for Third-Party Scripts

## Overview
Partytown is now integrated into your Astro project to eliminate render-blocking from third-party scripts. It runs third-party scripts in a web worker, keeping the main thread free for your application.

## Currently Configured

### Google Tag Manager
✅ **Already set up** in `src/layouts/Layout.astro`:
```html
<!-- Google Tag Manager -->
<script type="text/partytown">
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-WLB3LWS');
</script>
```

### Forwarded Events
The following events are configured in `astro.config.mjs` to work with Partytown:
- `dataLayer.push` (Google Analytics/GTM)
- `gtag` (Google Analytics 4)
- `ga` (Universal Analytics)
- `fbq` (Facebook Pixel)
- `_hsq.push` (HubSpot)
- `hj` (Hotjar)
- `_linkedin_partner_id` (LinkedIn)

## Adding More Third-Party Scripts

### Google Analytics 4 (GA4)
```html
<!-- Add to Layout.astro head section -->
<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Facebook Pixel
```html
<!-- Add to Layout.astro head section -->
<script type="text/partytown">
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### HubSpot Tracking
```html
<!-- Add to Layout.astro head section -->
<script type="text/partytown" id="hs-script-loader" async defer src="//js.hs-scripts.com/YOUR_HUB_ID.js"></script>
```

### Hotjar
```html
<!-- Add to Layout.astro head section -->
<script type="text/partytown">
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

### LinkedIn Insight Tag
```html
<!-- Add to Layout.astro head section -->
<script type="text/partytown">
  _linkedin_partner_id = "YOUR_PARTNER_ID";
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/partytown" src="https://snap.licdn.com/li.lms-analytics/insight.min.js"></script>
```

## Important Notes

### What to Use Partytown For:
✅ Analytics scripts (GA, GTM, Adobe Analytics)
✅ Marketing pixels (Facebook, LinkedIn, Twitter)
✅ A/B testing tools (Optimizely, VWO)
✅ Customer support widgets (Intercom, Zendesk)
✅ Heatmap tools (Hotjar, Crazy Egg)

### What NOT to Use Partytown For:
❌ First-party JavaScript that directly manipulates the DOM
❌ Scripts that need to run immediately for critical functionality
❌ Scripts that other scripts depend on immediately
❌ Payment processing scripts (for security reasons)

### Testing
1. Build your site: `npm run build`
2. Check that `/~partytown/` folder exists in `dist/`
3. Test in browser developer tools:
   - Scripts should load in web worker
   - No render-blocking warnings in Lighthouse
   - Third-party functionality still works

### Performance Benefits
- ⚡ Eliminates render-blocking from third-party scripts
- 🚀 Faster Time to Interactive (TTI)
- 📊 Better Core Web Vitals scores
- 🎯 Main thread stays free for user interactions

### Troubleshooting
If a third-party script doesn't work with Partytown:
1. Check browser console for errors
2. Add the script's required events to the `forward` array in `astro.config.mjs`
3. For complex scripts, consider loading them normally but asynchronously
4. Some scripts may need specific Partytown configuration options

## Configuration Location
- Main config: `astro.config.mjs`
- Third-party scripts: `src/layouts/Layout.astro`
- Partytown files: Auto-generated in `dist/~partytown/`
