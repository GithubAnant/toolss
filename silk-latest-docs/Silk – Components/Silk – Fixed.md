# Silk – Fixed

# Description

A primitive component that handles positioning in relation to the viewport. It provides extra features compared to normal CSS `position: fixed`.

**Features**

- Traps scrolling occurring on the underlying elements, preventing page scrolling when used in combination with a Sheet component for example.
- Preserves the visual position of the underlying element when it is a descendant of `<Sheet.Outlet>` or `<SheetStack.Outlet>` underlying elements and those have their `transform` CSS property animated during a travel or stacking animation.
- Exposes `--x-collapsed-scrollbar-thickness` and `--y-collapsed-scrollbar-thickness` CSS custom properties when page scrolling is temporarily disabled, allowing to adjust the position of the underlying elements and descendant elements to avoid visual position changes caused by the removal of the page scrollbars.

**Notes**

- `<Sheet.View>` is internally wrapped inside of a Fixed component, so you can use it in the same way without having to wrap it yourself.

# Anatomy

## Basic

```jsx
import { Fixed } from "@silk-hq/sheet";

export default () => (
	<Fixed.Root>
		<Fixed.Content>
			...
		</Fixed.Content>
	</Fixed.Root>
);
```

## With `<Sheet.Outlet>`

```jsx
import { Sheet, Fixed } from "@silk-hq/sheet";

export default () => (
	<Sheet.Outlet>
		<Fixed.Root>
			<Fixed.Content>
				...
			</Fixed.Content>
		</Fixed.Root>
	</Sheet.Outlet>
);
```

# Sub-components

## `<Fixed.Root>`

| Presence | Required |
| --- | --- |
| Composition | Contains `<Fixed.Content>` |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps the `<Fixed.Content>` of the same Fixed instance, as it contains shared logic.

**Notes**

- If you are setting a value to the `bottom` CSS property without using the `top` property, and/or the `right` property without using the `left` CSS property, you have to declare the property used in the `--silk-fixed-side` value.
    - **Example**
        
        ```css
        .my-fixed-element {
        	bottom: 16px;
        	right: 16px;
        	--silk-fixed-side: bottom right;
        }
        ```
        
- Under the hood we use CSS transform styles to maintain the position of the element. If you need to apply CSS transform styles yourself, you should do it on a descendant element to avoid any conflict.

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

## `<Fixed.Content>`

| Presence | Required |
| --- | --- |
| Composition | Child of `<Fixed.Root>` |
| Underlying element | `<div>` |

**Description**

The Content sub-component represents the content of the Fixed component.

**Notes**

- Scrolling is trapped inside of the underlying element.

### asChild

See [asChild](Silk%20%E2%80%93%20Fixed.md) on `<Fixed.Root>`.