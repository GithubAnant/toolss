# Silk – ExternalOverlay

# Description

The ExternalOverlay component communicates to the presented Sheets that an overlay component out of Silk’s control is present.

The external overlay can either be included inside of the inert-outside mechanism of the Sheets, or cause the mechanism to be disabled to avoid any potential conflict.

# Sub-components

## `<ExternalOverlay.Root>`

| Presence | Required |
| --- | --- |
| Composition | Anywhere |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps an external overlay component and allows it to either be included in associated Sheets inert-outside mechanism, or have them disable their mechanism to avoid conflicts with its own.

**Notes**

- It should be mounted or have its `disabled` prop set to `false` at the same time as the wrapped overlay component gets mounted, or its own inert-outside mechanism gets set up.

### asChild

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean | undefined` |
| **Default** | `undefined` |

**Description**

Defines whether the sub-component underlying element is the default one or the one passed as child of the sub-component.

**Values description**

| `true` | The underlying element rendered is the child. |
| --- | --- |
| `false | undefined` | The underlying element rendered is the default one. |

**Notes**

- If the child is a React component rendering an element:
    - it must accept props and spread all received props onto the rendered element;
    - in React < 19, it must use `React.forwardRef()` and pass the received ref to the rendered element.
- See [Silk – Composition](Silk%20%E2%80%93%20Composition.md) for more information.

### disabled

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` |

**Description**

Defines whether the ExternalOverlay is disabled. If it is, it will have no effect.

### selfManagedInertOutside

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Indicates whether the component used inside the ExternalOverlay sets up its own inert-outside mechanism (i.e. it prevents interaction with elements outside of its bounds). If `true`, the Sheet(s) present on the page will disable their own inert-outside mechanism to avoid any conflict.

**Notes**

- We run the change in a React layout effect when `<ExternalOverlay.Root>` gets mounted, or the value of the `disabled` prop changes. If the wrapped component sets up/cleans up it own mechanism in a React layout effect as well, there may be a conflict. It should be performed in a normal effect instead.

### contentGetter

| **Presence** | Required if the `children` prop is not used |
| --- | --- |
| **Type** | `(() => HTMLElement | Element | null | undefined) | string` |

**Description**

Defines the content of the ExternalOverlay with either a CSS selector or a function that returns an element instead of using the `children` prop.

**Values description**

| `(() => HTMLElement | Element | null | undefined)` | A function that returns an element. |
| --- | --- |
| `string` (CSS selector) | A `string` containing a CSS selector matching at least one element. If several element match the CSS selector, the first one is used. |

**Notes**

- This prop is useful when you are not able to wrap the element inside of `<ExternalOverlay.Root>`. One possible reason is that it is created outside of React (e.g. a chat plugin’s bubble).