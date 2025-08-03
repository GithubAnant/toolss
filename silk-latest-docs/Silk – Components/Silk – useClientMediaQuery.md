# Silk – useClientMediaQuery

# useClientMediaQuery

**Description**

A hook returning a React state whose value is `true` when the CSS media query passed as parameter matches, `false` when it does not match. It gets updated if the value changes during the lifetime of the component where it is used.

It only works on the client (i.e. in the browser), and always returns `false` on the server.

**Parameters**

| **Type** | **Description** |
| --- | --- |
| `string` (CSS media query) | A required parameter defining the CSS media query whose matching result is desired. (e.g. `"(min-width: 500px)"`) |

**Examples**

```tsx
const largeViewport = useClientMediaQuery("(min-width: 500px)");
```