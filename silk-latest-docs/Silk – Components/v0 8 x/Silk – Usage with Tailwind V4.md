# Silk – Usage with Tailwind V4

In Tailwind V4, Tailwind generated styles are wrapped inside of CSS `@layer {}`. As a consequence, unlayered styles—that is styled that are not themselves wrapped that way— take precedence over them.

This can cause issue with the few default styles that Silk uses as base styles, which can be easily identified by their shape: `property: var(--silk-defaults, value);`. They will override the styles that you try to set with Tailwind.

To get around this issue, you can make your Tailwind styles more important, by adding a `!` marker right after them, like so: `rounded-md!`. This is equivalent to the `!important` flag in CSS. These styles will then take precedence over Silk’s default styles.

**Note:**

We hope to find a way to workaround this issue within Silk or in collaboration with Tailwind in the future, removing the need for this workaround.