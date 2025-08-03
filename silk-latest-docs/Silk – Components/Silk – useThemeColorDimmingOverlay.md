# Silk – useThemeColorDimmingOverlay

# useThemeColorDimmingOverlay

**Description**

A hook which registers a theme color dimming overlay, possibly associated with an element. It returns an object containing two functions allowing to adjust the element opacity and the associated theme color dimming overlay alpha value at the same time.

`setDimmingOverlayOpacity` allows to set the overlay opacity. 

`animateDimmingOverlayOpacity` allows to animate the overlay opacity.

**Parameters**

| **Type** | **Description** |
| --- | --- |
| `{
   elementRef?: React.RefObject<HTMLElement>;
   dimmingColor: string;
  }` | - The `elementRef` key must contain the ref of the element used as theme color dimming overlay.

- The `dimmingColor` key must contain a color declaration in the RGB format (e.g. `"rgb(0, 0, 0)"`) which matches the background-color CSS property value of the element and will be used to dim the theme color.
 |

**Returned values**

| **Type** | **Description** |
| --- | --- |
| `{
   setDimmingOverlayOpacity: (
      opacity: number
   ) => void;
   animateDimmingOverlayOpacity: ({
      keyframes: [number, number];
      duration?: number;
      easing?: string;
    }) => void
 }` | - The `setDimmingOverlayOpacity` key contains a function allowing to set the opacity of both the element and the associated theme color dimming overlay.

- The `animateDimmingOverlayOpacity` key contains a function allowing to animate the opacity of both the element and the associated theme color dimming overlay.
   - The `keyframes` key represents the start and end values (between 0 and 1) for the opacity animation.
   - The `duration` key represents the duration of animation, expressed in milliseconds. The default value is `500`.
   - The `easing` key represents the easing function for the animation. Only supports cubic-bezier() functions. The default value is `"cubic-bezier(0.25, 1, 0.25, 1)"`.
 |

**Example**

```tsx
const { setDimmingOverlayOpacity, animateDimmingOverlayOpacity } =
  useThemeColorDimmingOverlay({
      elementRef: stackBackgroundRef,
      dimmingColor: "rgb(0, 0, 0)",
  });
  
setDimmingOverlayOpacity(0.5);
animateDimmingOverlayOpacity({ keyframes: [0, 0.5] });
```