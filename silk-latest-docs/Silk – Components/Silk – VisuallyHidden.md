# Silk – VisuallyHidden

# Description

A component that visually hides elements and their content but keep them accessible to screen-readers. This is useful for example in combination with `<Sheet.Title>` or a `<Sheet.Description>`.

# Sub-components

## `<VisuallyHidden.Root>`

| Presence | Required |
| --- | --- |
| Composition | Anywhere |
| Underlying element | `<span>` |

**Description**

The Root sub-component wraps content to be made visually hidden.

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