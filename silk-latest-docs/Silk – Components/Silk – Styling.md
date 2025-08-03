# Silk – Styling

# Normal Styling

Silk components underlying elements can be styled using any method you wish.

You can pass a `className`, `style` or any other attribute to all sub-components with underlying elements to assign CSS styles to them.

# Default styles

Some components underlying elements come with very basic default styles. They are likely to match your needs and provide a useful base at the beginning of the development. They can be fully overridden.

- Defaults styles are identifiable by their declaration: they make use of the `--silk-defaults` custom property (e.g. `background-color: var(--silk-defaults, #fafafa);`).
- Defaults styles can be individually overridden with a selector of any specificity.
- To remove all defaults styles for one element, set `--silk-defaults: silk-reset;` on this element.

# Required styles

Most components underlying elements have required styles, already set for you. Those are necessary for the proper functioning of the components. They must not be overridden in any case.

- Required styles are identifiable by their declaration: they use the `!important` marker.
- Sometimes, a `--NOTE` is also present to provide further informations on specific CSS properties.

# Custom properties

## `--silk-100-lvh-dvh-pct`

**Description**

In iOS SFSafariViewController (i.e. iOS standard in-app browser) the CSS `vh` and `lvh` units wrongly reflect the same size as the `svh` unit. See [https://bugs.webkit.org/show_bug.cgi?id=255708](https://bugs.webkit.org/show_bug.cgi?id=255708).

As a consequence, when using either of these units, we end up with a size which is shorter than expected. In particular, it is often desirable to set the `height` CSS property of `<Scroll.View />` underlying element to `100lvh` or `calc(100lvh + 60px)` so that `<Scroll.Content />` underlying element overflows the layout viewport, and does not resize when the user expands or collapses manually iOS Safari's UI. It is also useful so it appears below iOS Safari's semi-transparent UI.

To address this issue, we expose globally the `--silk-100-lvh-dvh-pct` CSS custom property, which provides the best compromise to work around the iOS SFSafariViewController bug.

Normally, this CSS custom property returns `100lvh` (or `100vh` if the `lvh` unit is not supported). However, if `100lvh` happens to be smaller than `100dvh` (or `100%` if `dvh` is not supported), which can only happen when the bug is present, it falls back to `100dvh` (or `100%` if `dvh` is not supported).

That way, in a normal situation we get the desired `100lvh` value, and if the bug is present, we get `100dvh`, which fills the viewport and is subject to resize, but will not cause the view to be improperly sized to `100svh` as it would without this fallback, due to the bug.

**Underlying value**

```scss
:root {
    --silk-100-lvh-dvh-pct: max(100%, 100vh);
}
@supports (width: 1dvh) {
    :root {
        --silk-100-lvh-dvh-pct: max(100dvh, 100lvh);
    }
}
```

**Example**

```css
.MySheet_view {
	height: var(--silk-100-lvh-dvh-pct);
}
```