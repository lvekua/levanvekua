# Header Component Usage

The `Header.astro` component is a reusable header that can be used across different pages in your Astro site.

## Basic Usage

```astro
---
import Header from '../components/Header.astro';
---

<Header />
```

## Props

| Prop              | Type                                   | Default                      | Description                                 |
| ----------------- | -------------------------------------- | ---------------------------- | ------------------------------------------- |
| `navItems`        | `Array<{href: string, label: string}>` | Default nav items            | Array of navigation items                   |
| `currentPage`     | `string`                               | `"/"`                        | Current page URL for aria-current attribute |
| `showProgressBar` | `boolean`                              | `true`                       | Whether to show the progress bar            |
| `siteTitle`       | `string`                               | `"Levan Vekua"`              | Site title displayed in branding            |
| `siteDescription` | `string`                               | `"Web Designer / Developer"` | Site description                            |

## Examples

### Default Header (for homepage)

```astro
<Header />
```

### Custom Navigation Items

```astro
---
const customNav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];
---

<Header navItems={customNav} currentPage="/portfolio" />
```

### Without Progress Bar

```astro
<Header showProgressBar={false} />
```

### Custom Site Info

```astro
<Header
  siteTitle="Custom Site"
  siteDescription="Custom Description"
/>
```

## Features

- Responsive design with mobile menu toggle
- Theme toggle button for dark/light mode
- Progress bar (optional)
- Screen reader friendly
- Proper ARIA attributes
- Flexible navigation items
- SEO-friendly markup

## Dependencies

The component relies on:

- Existing CSS classes in your stylesheets
- JavaScript for menu toggle and theme switching functionality
- SVG icons for logo and theme toggle
