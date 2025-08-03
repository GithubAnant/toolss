# Silk – Island

# Description

A component, positioned outside any `<Sheet.View>`, that allows its descendants elements to be interactive when a Sheet inert-outside mechanism is applied.

When a `<Sheet.View>` sub-component has its `inertOutside` prop set to `true`, only descendant DOM elements of its underlying element can be interacted with. This component allows to make its descendant elements interactive as well. As such, it creates “islands of interactivity” outside of the Sheet.

For example, this is useful to keep a navigation bar accessible even though a Sheet is presented.

# Anatomy

```jsx
import { Sheet, Island } from "@silk-hq/sheet";

export default () => (
	<Island.Root>
		<Island.Content>
			{* Interactive content *}
		</Island.Content>
	</Island.Root>

	<Sheet.Root>
		<Sheet.Trigger />
		<Sheet.Portal>
			<Sheet.View inertOutside={true}>
				<Sheet.Backdrop />
				<Sheet.Content>
					{* Interactive content *}
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
	</Sheet.Root>
);
```

# Sub-components

## `<Island.Root>`

| Presence | Required |
| --- | --- |
| Composition | Contains `<Island.Content>` |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps and shares logic with `<Island.Content>`.

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
| **Type** | `SheetId | SheetStackId | Array<SheetId | SheetStackId>` |
| **Default** | `undefined` |

**Description**

Associates the Island instance with the desired Sheet instance(s).

**Values description**

| `undefined` | Associates the Island with all the Sheets present on page. |
| --- | --- |
| `| SheetId
| SheetStackId
| Array<SheetId | SheetStackId>` | Associates the Island with the Sheet(s) and/or SheetStack(s) matching the component ids provided. |

### disabled

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` |

**Description**

Defines whether the Island is disabled. If it is, it will have no effect.

### contentGetter

| **Presence** | Required if `<Island.Content>` is not used |
| --- | --- |
| **Type** | `(() => HTMLElement | Element | null | undefined) | string` |
| **Default** | `undefined` |

**Description**

Defines the content of the Island with either a CSS selector or a function that returns an element instead of using  `<Island.Content>`.

**Values description**

| `(() => HTMLElement | Element | null | undefined)` | A function that returns an element. |
| --- | --- |
| `string` (CSS selector) | A `string` containing a CSS selector matching at least one element. If several element match the CSS selector, the first one is used. |

**Notes**

- This prop is useful when you are not able to wrap the element inside of `<Island.Content>`. One possible reason is that it is created outside of React (e.g. a chat plugin’s bubble).
- When using this prop, scroll is not trapped inside of the Island instance, so it is up to the element to implement some scroll trapping mechanism.

## `<Island.Content>`

| Presence | Required if `contentGetter` is not used on `<Island.Root>` |
| --- | --- |
| Composition | Child of `<Island.Root>` |
| Underlying element | `<div>` |

**Description**

The Content sub-component allows its descendant elements to remain interactive when associated Sheets are presented and their `inertOutside` props are set to `true`.

**Notes**

- Swipe and scroll gestures are trapped inside of the underlying element.

### asChild

See [asChild](Silk%20%E2%80%93%20Island.md) on `<Island.Root>`.