# Silk – Migrating from v0.8.x to v0.9.x

In v0.8.x, Silk’s low-lever styles where imported directly in the JS within the package. Starting with version 0.9.0, Silk requires you to import the styles yourself. This makes it much more flexible and compatible with a wider variety of build tools.

When migrating from v0.8.x to v0.9.x, you will need to import the styles in your project. Here is how you can do it.

For convenience and flexibility, these styles are available in two versions: unlayered and layered. The layered version wraps Silk’s default styles into a CSS `@layer {}`.

## Basic

In a project that doesn’t make use of CSS layers, it is best to use the unlayered version. You can import it in two ways:

### Import into a CSS file

You can import the styles directly into your global CSS file.

```css
/* ./global.css */

@import "@silk-hq/components/unlayered-styles";
```

### Import into a JavaScript file

You can also import the styles in a JavaScript or TypeScript file at the root of your project.

```jsx
// ./index.js

import "@silk-hq/components/unlayered-styles";
```

## In a project using CSS layers (e.g. Tailwind V4)

In a project that makes use of CSS layers (e.g. using Tailwind V4), you can use both the unlayered and the layered version. In any case, Silk’s layer declaration must occur before that of your normal styles. You can import it in two ways:

### Import into a CSS file

- You can import the unlayered styles into a layer directly into your global CSS, before your normal styles.

```css
/* ./global.css */

@import "@silk-hq/components/unlayered-styles" layer(silk);
/* @import "tailwindcss"; */
```

- Or you can import the layered styles directly into your global CSS, before your normal styles. This is useful for framework that have issues with CSS layered imports (e.g. Next.js).

```css
/* ./global.css */

@import "@silk-hq/components/unlayered-styles" layer(silk);
/* @import "tailwindcss"; */
```

### Import into a JavaScript file

You can also import the layered styles in a JavaScript or TypeScript file at the root of your project, before importing any normal styles.

```jsx
/* ./index.js */

import "@silk-hq/components/layered-styles";
```