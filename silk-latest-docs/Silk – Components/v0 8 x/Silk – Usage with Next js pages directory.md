# Silk – Usage with Next.js /pages directory

Silk makes use of a CSS file that must be imported in your project along with the JavaScript file.

When using the /pages directory, Next.js does not allow the import of CSS files from within `.node_module`. To workaround that limitation, you must add the Silk’s package to the `transpilePackages` option in your `next.config.js` file, like so:

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@silk-hq/components'],
}

module.exports = nextConfig
```

**Note:** You may need to delete the `package-lock.js` file and the `.node_module` and `.next` directories for it to work; they will be regenerated automatically.