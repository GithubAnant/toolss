# Silk – Usage with Vite

Silk makes use of a CSS file that must be imported in your project along with the JavaScript file.

For Vite to import the CSS file, you must add Silk’s package to the `ssr.noExternal` option in the Vite config file of your project, named `vite.config.js`, like so:

```jsx
export default defineConfig({
  ssr: {
    noExternal: ["@silk-hq/components"],
  },
});
```