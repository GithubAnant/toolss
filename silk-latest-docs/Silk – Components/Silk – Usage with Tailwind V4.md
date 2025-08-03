# Silk – Usage with Tailwind V4

In Tailwind V4, Tailwind generated styles are wrapped inside of CSS `@layer {}`. As a consequence, unlayered styles—that is styled that are not themselves wrapped that way— take precedence over them.

To avoid any conflict with Silk’s default styles, you must follow the “Import the styles in a project using CSS layers” on the [Getting Started](Silk%20%E2%80%93%20Getting%20started.md) page.