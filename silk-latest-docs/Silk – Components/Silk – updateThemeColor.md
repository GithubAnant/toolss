# Silk – updateThemeColor

# updateThemeColor (v0.9.10)

**Description**

A function that updates the `theme-color` of the page by setting the `content` attribute on the HTML `theme-color` meta-tag.

If a `<Sheet.Backdrop>` with `themeColorDimming="auto"` is presented when the update is made, only the underlying `theme-color` will be updated, preserving the dimming.

**Parameters**

| **Type** | **Description** |
| --- | --- |
| `string` (color expressed in the `rgb()`, `rgba()`, or hexadecimal format) | Required. The color the `theme-color` will be set to. |

**Example**

```tsx
updateThemeColor("#000000");
```