# Silk – AutoFocusTarget

# Description

A component that gives focus priority to a specific element when the Silk-controlled auto-focus mechanism is executed.

# Sub-components

## `<AutoFocusTarget.Root>`

| Presence | Required |
| --- | --- |
| Composition | Anywhere |
| Underlying element | `<div>` |

**Description**

The Root sub-component underlying element will receive focus in priority when the Silk-controlled auto-focus mechanism is executed, if the timing matches its `timing` prop value.

If several `<AutoFocusTarget.Root>` are present on the page and match the required criteria to receive focus, the first focusable one (i.e. whose not `disabled`, not `inert`, not outside an inertOutside Sheet, etc) is the one which will receive focus.

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

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | `undefined` |

**Description**

Associates the AutoFocusTarget instance with the desired Sheet instance.

**Values description**

| `undefined` | Associates the AutoFocusTarget with all the Sheets present on page. |
| --- | --- |
| `SheetId` | Associates the AutoFocusTarget with the Sheet whose id is passed. |

### timing

| **Presence** | Required |
| --- | --- |
| **Type** | `"present" | "dismiss" | Array<"present" | "dismiss">` |

**Description**

Defines when the `<AutoFocusTarget.Root>` should be considered a target for the associated Sheet auto-focus mechanism.

**Values description**

| `"present"` | The `<AutoFocusTarget.Root>` will be considered a target when the associated Sheet gets presented. |
| --- | --- |
| `"dismiss"` | The `<AutoFocusTarget.Root>` will be considered a target when the associated Sheet gets dismissed. |