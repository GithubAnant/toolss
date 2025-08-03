# Silk – animate

# animate

**Description**

A function that runs a WAAPI animation on the specified element and persists its final styles as inline styles on the element at the end of the animation.

**Parameters**

| **Type** | **Description** |
| --- | --- |
| `HTMLElement | null` | Required. The element whose CSS properties are to be animated. |
| `{
   [keys: string]:
      [string | number, string | number]
}` | Required. An object whose keys are the CSS properties to be animated and their values the keyframes (the initial one and the final one) to be used for the animation of their respective values. (e.g. `{ opacity: [0, 1] }`). |
| `{
   duration?: number;
   easing?: string;
}` | Optional. The options for the animation. The `duration` is expressed in millisecond. The `easing` must be a CSS easing function (e.g. `"ease"`).

The default values are `{ duration: 500, easing: "cubic-bezier(0.25, 1, 0.25, 1)" }`. |

**Example**

```tsx
animate(
  elementRef.current,
  { opacity: [0, 1] },
  {
    duration: 600,
    easing: "cubic-bezier(0, 0, 0.58, 1)",
  }
);
```