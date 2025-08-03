# Silk – Sheet

# Description

A primitive component for building advanced swipeable modal and non-modal overlay components such as bottom sheets, drawers, sidebars, dialogs, pages, lightboxes, toasts and more.

Built with a compound component architecture, it exposes a set of sub-components that give you full control over structure, behavior, and styling.

# Anatomy

## Basic

```jsx
import { Sheet } from "@silk-hq/components";

export default () => (
	<Sheet.Root>
		<Sheet.Trigger />
		<Sheet.Portal>
			<Sheet.View>
				<Sheet.Backdrop />
				<Sheet.Content>
					<Sheet.BleedingBackground />
					<Sheet.Title />
					<Sheet.Description />
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
	</Sheet.Root>
);
```

## With a component id

```jsx
import { Sheet, createComponentId } from "@silk-hq/components";

const mySheetId = createComponentId();

export default () => {
	return (
		<Sheet.Root componentId={mySheetId}>
			<Sheet.Root>
				<Sheet.Trigger />
				<Sheet.Portal>
					<Sheet.View>
						<Sheet.Backdrop />
						<Sheet.Content>
							<Sheet.BleedingBackground />
							<Sheet.Title />
							<Sheet.Description />
							<Sheet.Trigger forComponent={mySheetId} />
						</Sheet.Content>
					</Sheet.View>
				</Sheet.Portal>
			</Sheet.Root>

			<Sheet.Trigger forComponent={mySheetId} />
			<Sheet.Portal>
				<Sheet.View forComponent={mySheetId}>
					<Sheet.Backdrop />
					<Sheet.Content>
						<Sheet.BleedingBackground />
						<Sheet.Title />
						<Sheet.Description />
					</Sheet.Content>
				</Sheet.View>
			</Sheet.Portal>
		</Sheet.Root>
	)
}
```

## With related components

```jsx
import { Sheet, Island, AutoFocusTarget } from "@silk-hq/components";

export default () => (
	<Sheet.Root>
		<Island.Root>
			<Island.Content />
		</Island.Root>
		
		<Sheet.Outlet />
		<Sheet.Trigger />
		
		<Sheet.Portal>
			<Sheet.View>
				<Sheet.Backdrop />
				<Sheet.Content>
					<Sheet.BleedingBackground />
					<Sheet.Handle />
					<Sheet.Trigger />
					<Sheet.Title />
					<Sheet.Description />
					<AutoFocusTarget.Root />
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
	</Sheet.Root>
);
```

## With SpecialWrapper

```jsx
import { Sheet } from "@silk-hq/components";

export default () => (
	<Sheet.Root>
		<Sheet.Trigger />
		<Sheet.Portal>
			<Sheet.View>
				<Sheet.Backdrop />
				<Sheet.Content>
					<Sheet.SpecialWrapper.Root>
						<Sheet.SpecialWrapper.Content>
							<Sheet.BleedingBackground />
							<Sheet.Title />
							<Sheet.Description />
						</Sheet.SpecialWrapper.Content>
					</Sheet.SpecialWrapper.Root>
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
	</Sheet.Root>
);
```

# Sub-components

## `<Sheet.Root>`

| Presence | Required |
| --- | --- |
| Composition | Contains all Sheet sub-components that belong to this Sheet instance, except for `<Sheet.Portal>` which can be positioned outside |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps all other Sheet sub-components that belong to the same Sheet instance (except for `<Sheet.Portal>` which can be used around it), as it contains logic that is shared with all of them.

**Notes**

- If you don’t want the underlying element to affect the layout, you can apply the CSS `display: contents` to it.

### license

| **Presence** | Required |
| --- | --- |
| **Type** | `"commercial" | "non-commercial"` |
| **Default** | `undefined` |

**Description**

Indicates under what license you are using the library.

**Values description**

| `"commercial"` | You declare using the library under the commercial license. |
| --- | --- |
| `"non-commercial"` | You declare using the library under the non-commercial license. |

**Notes**

- The purchase of a commercial license is needed for commercial use. More information [here](https://silkhq.com/access).

### asChild

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
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

### componentId

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | `undefined` |

**Description**

Defines the id of this Sheet. This id can then be passed to other Sheet sub-components `forComponent` prop to associate them with it.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetStackId | "closest"` |
| **Default** | `undefined` |

**Description**

Associates this Sheet instance with the desired SheetStack instance.

**Values description**

| `undefined` | This Sheet is not associated with any SheetStack. |
| --- | --- |
| `SheetStackId` | Associates this Sheet with the SheetStack whose id is passed. |
| `"closest"` | Associates this Sheet with the closest ancestor SheetStack. |

### sheetRole

| **Presence** | Optional |
| --- | --- |
| **Type** | `React.AriaRole` |
| **Default** | `undefined` |
| **Example values** | `"dialog"`, `"alertdialog"`, `"status"` |

**Description**

Defines the WAI-ARIA role attribute set on the `<Sheet.View>` underlying element.

This value is also used to define the presence of the `aria-haspopup` attribute on the `<Sheet.Trigger>` underlying element.

**Notes**

- If `sheetRole` is set to `"alertdialog"`, then on `<Sheet.View>`:
    - `swipeDismissal` computes to `false`;
    - `onClickOutside` computes to `{ dismiss: false, stopOverlayPropagation: true }`;
    - `onEscapeKeyDown` computes to `{ dismiss: false, stopOverlayPropagation: true }`.

### defaultPresented

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` |

**Description**

Defines whether the Sheet is initially presented or not.

**Notes**

- On page load, it is presented **after** hydration occurs when set to `true`.

### presented

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `undefined` |
| **Requirements** | When this prop is used, passing the state setter function to the `onPresentedChange` is also required. |

**Description**

Controls the presented state of the Sheet.

**Values description**

| `undefined` | The presented state is uncontrolled, the Sheet will only be presented and dismissed based on user interactions handled internally (e.g. press on a `<Sheet.Trigger>`). |
| --- | --- |
| `true` | Will cause the Sheet to be presented if it is not currently. |
| `false` | Will cause the Sheet to be dismissed if it is currently presented. |

**Notes**

- This is an alternative method to the `defaultPresented` prop.
- **!** Currently Sheet doesn’t support interruption during entering & exiting, and cannot be closed when it is not frontmost in a SheetStack (i.e. a sheet is stacked on top of it). Therefore, if `presented` is set to `false` during entering or when not frontmost in a SheetStack, or to `true` during exiting, nothing will happen, and onPresentedChange will be called with the current value of `presented` to avoid any mismatch between the controlled state and the internal one. **This limitation will be lifted in the future**.

### onPresentedChange

| **Presence** | Required if `presented` is used |
| --- | --- |
| **Type** | `(presented: boolean) => void` |
| **Default** | `undefined` |

**Description**

Setter for the state passed in the `presented` prop. It will be called with the `presented` state value as parameter when it is changed internally  (e.g. press on a `<Sheet.Trigger>` sub-component).

**Notes**

- This is an alternative method to the `defaultPresented` prop.

### defaultActiveDetent

| **Presence** | Optional |
| --- | --- |
| **Type** | `number` |
| **Default** | `undefined` |

**Description**

Defines the index of the detent the Sheet should initially rest on after it gets presented.

**Notes**

- Detents indexes are defined as follow:
    - when the Sheet is fully outside of the view, it rests on the detent with index `0`;
    - all declared intermediate detents indexes go from `1` to `n-1`;
    - when the Sheet is fully expanded inside of `<Sheet.View>`, it rests on the last detent, numbered `n` (e.g. index `1` if there is no intermediate detents; index `2` if there is one intermediate detent).
- If `defaultActiveDetent` is set to `undefined`, the initial detent the Sheet rests on is the detent with the index `1`.

- **Example**
    
    ```jsx
    <Sheet.Root defaultActiveDetent={2}>
    	...
    </Sheet.Root>
    ```
    

### activeDetent

| **Presence** | Optional |
| --- | --- |
| **Type** | `number` |
| **Default** | `undefined` |

**Description**

Controls the `activeDetent` underlying state of the Sheet.

**Values description**

| `undefined` | The `activeDetent` state is uncontrolled, it will only change based on user interactions handled internally (e.g. swipe, or press on a `<Sheet.Trigger>`). |
| --- | --- |
| `number` | The `activeDetent` state is controlled, and this value reflects the index of the detent the Sheet is resting on or traveling towards. |

**Notes**

- This is an alternative method to the `defaultActiveDetent` prop.
- **!** Currently it is not possible to step to a detent while stepping is already occurring. So if detent is changed during that state, nothing will occur, but there will be a mismatch between detent and the actual detent the sheet is resting on. So, before updating detent, you should check whether travelStatus ≠ “stepping”. **This limitation will be lifted in the future**.

### onActiveDetentChange

| **Presence** | Required if `activeDetent` is used |
| --- | --- |
| **Type** | `(activeDetent: number) => void` |
| **Default** | `undefined` |

**Description**

Setter for the state passed in the `activeDetent` prop. It will be called with the `activeDetent` state value as parameter when it is changed internally  (e.g. swipe, or press on a `<Sheet.Trigger>`).

**Notes**

- This is an alternative method to the `defaultActiveDetent` prop.

## `<Sheet.Trigger>`

| Presence | Optional |
| --- | --- |
| Composition | Descendant of `<Sheet.Root>` |
| Underlying element | `<button>` |

**Description**

A Trigger sub-component that allows to run specific actions related to the Sheet as a result of a press event.

- **Example**
    
    ```jsx
    const MyTrigger = () =>
    	<Sheet.Trigger
    		action={{ type: "step", direction: "down" }}
    		onPress={{ forceFocus: false }}
    	>
    		Step down
    	</Sheet.Trigger>
    }
    ```
    

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | The `SheetId` of the closest `<Sheet.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Sheet instance.

### action

| **Presence** | Optional |
| --- | --- |
| **Type** | `| "present"
| "dismiss"
| "step"
| {
    type: "step";
    direction?: "up" | "down";
    detent?: number;
}` |
| **Default** | `"present"` |

**Description**

Defines the action that will execute when the Trigger is pressed.

**Values description**

| `"present"` | The Sheet will be presented. |
| --- | --- |
| `"dismiss"` | The Sheet will be dismissed. |
| `"step"` | The Sheet will step to the next detent in the upward direction, and cycle after reaching the last detent. |
| `{
    type: "step";
    direction?: "up" | "down";
    detent?: number;
}` | The Sheet will step to a detent:
- if the `direction` key is used, it will step to the next detent in that direction and cycle after reaching the last detent;
- if the `detent` key is used, it will step to the detent matching that detent index. |

### onPress

| **Presence** | Optional |
| --- | --- |
| **Type** | `| {
    forceFocus?: boolean;
    runAction?: boolean;
  }
| ((customEvent: {
      changeDefault: (changedBehavior: {
         forceFocus?: boolean;
         runAction?: boolean;
      }) => void;
      nativeEvent: React.MouseEvent<HTMLElement, MouseEvent>;
  }) => void)}` |
| **Default** | `{ forceFocus: true, runAction: true }` |

**Description**

An event handler that runs when the Trigger is pressed (equivalent to clicked).

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ forceFocus: true }` | The underlying element will be focused on press in all browsers (by default Safari doesn’t do it, causing issues with focus management). This is the recommended setting. |
| --- | --- |
| `{ forceFocus: false }` | The underlying element will only receive focus on press in browsers where this is the default behavior (i.e. Safari will not do it). |
| `{ runAction: true }` | The Trigger action will be run. |
| `{ runAction: false }` | The Trigger action will not be run. |

- **Example**
    
    ```jsx
    <Scroll.Trigger onPress={{ forceFocus: false }}>
    	...
    </Scroll.Trigger>
    ```
    
    ```jsx
    <Scroll.Trigger
      onPress={(event) => event.changeDefault({ forceFocus: false })}
     >
    	...
    </Scroll.Trigger>
    ```
    

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.Outlet>`

| Presence | Optional |
| --- | --- |
| Composition | Child of the `<Sheet.Root>` |
| Underlying element | `<div>` |

**Description**

A sub-component that allows to declaratively define animations for the underlying element based on the travel and stacking progress of the associated Sheet.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | The `SheetId` of the closest `<Sheet.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Sheet instance.

### travelAnimation

| **Presence** | Optional |
| --- | --- |
| **Type** | `{
   [property: string]:
      | [string | number, string | number]
      | ({
           progress: number;
           tween: (start: string | number, end: string | number) => string;
        }) => string | number
      | string
      | null
      | undefined;
}`   |
| **Default** | `undefined` |

**Description**

Declaratively defines animations on any CSS property of the underlying element driven by the Sheet’s travel.

**Values description for each key**

| `[string | number, string | number]` | **Keyframes array syntax.** As the Sheet travels from its first detent (index 0) to its last detent, the underlying element will have its related CSS property animated from the first to the second value in the array, each value in-between being interpolated linearly. |
| --- | --- |
| `({
   progress: number;
   tween: (start: number | string, end: number | string) => string;
}) => string | number` | **Function syntax.** As the Sheet travels from its first detent (index 0) to its last detent, the underlying element will have its related CSS property animated based on the value returned by the function. The progress value goes from 0 to 1. |
| `string` | **String syntax.** As the Sheet travels, the underlying element will have its related CSS property set to the defined value. |
| `null | undefined` | The underlying element related CSS property will not be animated or set. |

**Notes**

- CSS properties must be written in camelcase form (e.g. `borderRadius`).
- All individual components of the `transform` CSS property can be used separately.
    - **List**
        
        ```tsx
        | "translate"
        | "translateX"
        | "translateY"
        | "translateZ"
        | "scale"
        | "scaleX"
        | "scaleY"
        | "scaleZ"
        | "rotate"
        | "rotateX"
        | "rotateY"
        | "rotateZ"
        | "skew"
        | "skewX"
        | "skewY"
        ```
        
- The keyframes array syntax is only supported with individual `transform` properties and `opacity`.
    - **List**
        
        Note that, apart from `opacity`, all of the following keys will be incorporated into a single `transform` declaration.
        
        ```tsx
        | "opacity"
        | "translate"
        | "translateX"
        | "translateY"
        | "translateZ"
        | "scale"
        | "scaleX"
        | "scaleY"
        | "scaleZ"
        | "rotate"
        | "rotateX"
        | "rotateY"
        | "rotateZ"
        | "skew"
        | "skewX"
        | "skewY"
        ```
        
- Three special CSS properties related to clipping are available:
    - `clipBoundary` accepts only one value: `"layout-viewport"`. This special CSS property clips the underlying element where the layout viewport is drawn. Therefore, if the element is overflowing the layout viewport, it will be cut off. You can then use apply a transformation to it like `scale` and reveal its clipping.
    - `clipBorderRadius` accepts the same value as the `borderRadius` CSS property. It defines a border radius for the clip area when used in combination with the `clipBoundary` ****special CSS property.
    - `clipTransformOrigin` accept the same value as the `transformOrigin` CSS property. It defines the origin for the CSS transform applied to the element when used in combination with the `clipBoundary` ****special CSS property.
- Updating `travelAnimation` won't immediately reflect visually. The new value will only apply on the next travel. This limitation will be lifted in the future.
- `travelAnimation` is short for "travel-driven animation".

- **Examples**
    
    ```jsx
    <Sheet.Outlet
    	travelAnimation={{
    		opacity: [0, 0.5],
    	}}
    />
    ```
    
    ```jsx
    <Sheet.Outlet
    	travelAnimation={{
    		opacity: ({ progress }) => progress * 0.5,
    	}}
    />
    ```
    
    ```jsx
    <Sheet.Outlet
    	travelAnimation={{
    		backgroundColor:
    			({ tween }) =>
    				`rgb(${tween(100, 0)}, ${tween(100, 0), ${tween(100, 0))`,
    	}}
    />
    ```
    

### stackingAnimation

| **Presence** | Optional |
| --- | --- |
| **Type** | `{
   [property: string]:
      | [string | number, string | number]
      | ({
           progress: number;
           tween: (start: number | string, end: number | string) => string;
        }) => string | number
      | string
      | null
      | undefined;
}`   |
| **Default** | `undefined` |

**Description**

Declaratively defines animations on any CSS property of the underlying element driven by the aggregated travel of Sheets stacked above the Sheet associated with this Outlet and belonging to the same SheetStack.

**Values description for each key**

| `[string | number, string | number]` | **Keyframes array syntax.** As Sheets travel and get stacked on top of the associated Sheet, the underlying element will have its related CSS property animated from the first to the second value in the array, each value in-between being interpolated linearly. |
| --- | --- |
| `({
   progress: number;
   tween: (start: number | string, end: number | string) => string;
}) => string | number` | **Function syntax.** As Sheets travel and get stacked on top of the associated Sheet, the underlying element will have its related CSS property animated based on the value returned by the function. The progress value goes from 0 to n (n being the number of Sheets stacked on top of the associated Sheet). |
| `string` | **String syntax.** As Sheets get stacked on top of the associated Sheet, the underlying element will have its related CSS property set to the defined value. |
| `null | undefined` | The underlying element related CSS property will not be animated or set. |

**Notes**

- CSS properties must be written in camelcase form (e.g. `borderRadius`).
- All individual components of the `transform` CSS property can be used separately.
    - **List**
        
        ```tsx
        | "translate"
        | "translateX"
        | "translateY"
        | "translateZ"
        | "scale"
        | "scaleX"
        | "scaleY"
        | "scaleZ"
        | "rotate"
        | "rotateX"
        | "rotateY"
        | "rotateZ"
        | "skew"
        | "skewX"
        | "skewY"
        ```
        
- The keyframes array syntax is only supported with individual `transform` properties and `opacity`.
    - **List**
        
        Note that, apart from `opacity`, all of the following keys will be incorporated into a single `transform` declaration.
        
        ```tsx
        | "opacity"
        | "translate"
        | "translateX"
        | "translateY"
        | "translateZ"
        | "scale"
        | "scaleX"
        | "scaleY"
        | "scaleZ"
        | "rotate"
        | "rotateX"
        | "rotateY"
        | "rotateZ"
        | "skew"
        | "skewX"
        | "skewY"
        ```
        
- Updating `stackingAnimation` won't immediately reflect visually. The new value will only apply on the next travel. This limitation will be lifted in the future.
- `stackingAnimation` is short for "stacking-driven animation".

- **Examples**
    
    ```jsx
    <Sheet.Outlet
    	stackingAnimation={{
    		translateX: ["0px", "100px"],
    	}}
    />
    ```
    
    ```jsx
    <Sheet.Outlet
    	stackingAnimation={{
    		translateX: ({ progress }) => progress * 100 + "px",
    	}}
    />
    ```
    
    ```jsx
    <Sheet.Outlet
    	stackingAnimation={{
    		backgroundColor:
    			({ tween }) =>
    				`rgb(${tween(10, 0)}, ${tween(10, 0), ${tween(10, 0))`,
    	}}
    />
    ```
    

## `<Sheet.Portal>`

| Presence | Optional |
| --- | --- |
| Composition | Anywhere |
| Underlying element | None |

**Description**

A sub-component that allows to render its child into any element, including the `document.body`. It is typically used to render the `<Sheet.Content>` in a high level element to make sure it appears above all other elements.

### container

| **Presence** | Optional |
| --- | --- |
| **Type** | `HTMLElement | null` |
| **Default** | `document.body` |

**Description**

Defines inside of which element the Portal’s child will be rendered.

## `<Sheet.View>`

| Presence | Required |
| --- | --- |
| Composition | Child of the `<Sheet.Root>` |
| Underlying element | `<div>` |

**Description**

The View sub-component underlying element is the view inside of which the `<Sheet.Content>` underlying element can travel.

It also holds the HTML `role` attribute for the Sheet.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | The `SheetId` of the closest `<Sheet.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Sheet instance.

### contentPlacement

| **Presence** | Optional |
| --- | --- |
| **Type** | `"top" | "bottom" | "left" | "right" | "center"` |
| **Default** | `"bottom"` if `tracks` is not set, otherwise it matches the value of the `tracks` prop. |

**Description**

Defines the placement of `<Sheet.Content>` inside of `<Sheet.View>` on the travel axis. On the cross axis, it is always centered.

### tracks

| **Presence** | Optional |
| --- | --- |
| **Type** | `| "top"
| "bottom"
| "left"
| "right"
| ["top", "bottom"]
| ["left", "right"]` |
| **Default** | `"bottom"` if `contentPlacement` is not set, otherwise it matches the value of the `contentPlacement`. |

**Description**

Defines the track(s) `<Sheet.Content>` can travel on, from its last detent (index `n`) to its origin detent (index `0`).

### detents

| **Presence** | Optional |
| --- | --- |
| **Type** | `string | Array<string>` where `string` is a CSS length which does not use the `%` unit. |
| **Default** | `undefined` |

**Description**

Defines one or several intermediate detents on which `<Sheet.Content>` can rest on the track between the origin detent (index `0`) and the last detent (index `n`).

### swipeTrap

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean | { x?: boolean; y?: boolean; }` |
| **Default** |  `{ x: true, y: false }` on Android in non-standalone mode, `true` otherwise. |

**Description**

Defines whether swipes on the specified axis or axes are trapped within `<Sheet.View>` or not. 

When not trapped, when swiping in a direction where further travel is not possible, the swipe will propagate to the closest ancestor Sheet, scroll container, or window (triggering swipe to go back in history in browsers that support it).

**Values description**

| `true` | Traps swipe both on both the x and y axis. |
| --- | --- |
| `{ x: true }` | Traps swipe on the x axis. |
| `{ y: true }` | Traps swipe on the y axis. |

**Notes**

- Always computes to `true` if `inertOutside` is set to `true`.
- On Android in non-standalone mode, `swipeTrap` on the y axis always computes to `false` not to prevent the browser UI from being revealed.
- If `swipeOvershoot` is set to `false`, `swipeTrap` on the travel axis always computes to `true`.
- Safari has a bug causing swipe to always be trapped when swiping over a vertically swipeable Sheet or Scroll which is inside of a horizontally swipeable Sheet or Scroll (and vice versa). We hope to see that issue resolved quickly.

### swipeOvershoot

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines the behavior when the user performs a swipe that would cause `<Sheet.Content>` to move further than its last detent (index `n`).

**Values description**

| `true` | Overshoot will occur, causing `<Sheet.Content>` to move further than the last detent, and snap back into place when released. |
| --- | --- |
| `false` | Overshoot will not occur, `<Sheet.Content>` will stop right away when being swiped past the last detent. |

**Notes**

- Overshoot only works in browsers that support elastic overscroll (i.e. Safari, and Firefox on macOS).

### swipeDismissal

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` if `sheetRole` is set to `"alertdialog"`, `true` otherwise. |

**Description**

Defines whether it is possible to swipe `<Sheet.Content>` out of the `<Sheet.View>` and cause the Sheet to be dismissed.

**Notes**

- Always computes to `false` if `sheetRole` is set to `"alertdialog"`.
- When set to `false` and `swipeOvershoot` is set to `true`, the Sheet remains swipeable but will snap back into place when a swipe occurs.

### swipe

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether swiping along the travel axis over `<Sheet.Content>` — or `<Sheet.Backdrop>` if swipeable — causes the Sheet to travel.

**Notes**

- The value can only be updated when the Sheet is resting on a detent, not while it is traveling.

### nativeEdgeSwipePrevention

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` |

**Description**

Defines whether a horizontal swipe from the left edge of the screen on iOS Safari triggers the browser’s “go back” navigation gesture.

**Notes**

- This mechanism relies on a `28px`-wide element positioned at the left edge of the screen. By default it appears above all elements inside `<Sheet.View>`, blocking interaction with anything underneath. If this causes issues, you can lift your elements above it by applying `position: relative` (or any non-static positioning) and a `z-index` value greater than `0`.
- This element will also capture click outside events, preventing dismissal if the user clicks on it, even if visually outside of `<View.Content>`.
- This mechanism is not foolproof — in rare cases, quick gestures may still slip through and trigger the browser’s back navigation.
    - For more reliable prevention in standalone mode on iOS, we recommend avoiding the addition of new history entries. Instead, replace the current entry. This way, Safari won’t allow swiping back, as there’s no previous page in the history.
- It is not based on a web standard, so there’s no guarantee it will continue to work in the future.

### enteringAnimationSettings

| **Presence** | Optional |
| --- | --- |
| **Type** | `| "gentle" | "smooth" | "snappy" | "brisk" | "bouncy" | "elastic"
 | {
   preset?: "gentle" | "smooth" | "snappy" | "brisk" | "bouncy" | "elastic";
   track?: Track;
   contentMove?: boolean;
   skip?: boolean;
}
| {
   easing: "spring";
   stiffness: number;
   damping: number;
   mass: number;
   initialVelocity?: number;
   precision?: number;
   delay?: number;
   track?: Track;
   contentMove?: boolean;
   skip?: boolean;
}
| {
   easing:
      | "ease"
      | "ease-in"
      | "ease-out"
      | "ease-in-out"
      | "linear";
   duration: number;
   delay?: number;
   track?: Track;
   contentMove?: boolean;
   skip?: boolean;
}` |
| **Default** | `{
   preset: "smooth",
   contentMove: true,
   skip: prefersReducedMotion, // computes to true if prefers reduced motion
}` |

**Description**

Defines the configuration for the programmatic entering travel animation.

**Values description**

| `"gentle" | { preset: "gentle" }` | Use the `"gentle"` preset. |
| --- | --- |
| `{ track: "top" }`  | For Sheet with two tracks defined, picks the track on which travel occurs (e.g. the `"top"` track here). |
| `{ contentMove: false }`  | The `<Sheet.Content>` underlying element will not be animated, instead it will be placed on its destination detent immediately. All other sub-components underlying elements are animated normally. |
| `{ skip: true }`  | The animation is skipped entirely and the Sheet doesn’t go through the corresponding state. |

**Notes**

- **Presets definitions**
    
    ```tsx
    presets: {
    	gentle: {
    	  easing: "spring",
        stiffness: 560,
        damping: 68,
        mass: 1.85,
      },
      smooth: {
    	  easing: "spring",
        stiffness: 580,
        damping: 60,
        mass: 1.35,
      },
      snappy: {
    	  easing: "spring",
        stiffness: 350,
        damping: 34,
        mass: 0.9,
      },
      brisk: {
    	  easing: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.65,
      },
      bouncy: {
    	  easing: "spring",
        stiffness: 240,
        damping: 19,
        mass: 0.7,
      },
      elastic: {
    	  easing: "spring",
        stiffness: 260,
        damping: 20,
        mass: 1,
      },
    }
    ```
    

### exitingAnimationSettings

**Description**

Defines the configuration for the programmatic exiting travel animation.

See [enteringAnimationSettings](Silk%20%E2%80%93%20Sheet.md).

### steppingAnimationSettings

**Description**

Defines the configuration for the programmatic stepping travel animation.

See [enteringAnimationSettings](Silk%20%E2%80%93%20Sheet.md).

**Notes:**

- The `track` and `contentMove` keys do not apply here.

### onTravelStatusChange

| **Presence** | Optional |
| --- | --- |
| **Type** | `("idleOutside" | "entering" | "idleInside" | "stepping" | "exiting") => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs when the travel status changes.

### onTravelRangeChange

| **Presence** | Optional |
| --- | --- |
| **Type** | `({ start: number; end: number; }) => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs when the travel range changes.

**Notes**

- A range is defined by a start detent and an end detent.
- The Sheet is considered to be within a range when the side of  `<Sheet.Content>` opposite to the dismiss direction is located between the start and end detent of that range.
- When the Sheet is resting on a specific detent, the start and end detent are equal to the index of that detent.
- The range does not reflect overshoot. Therefore, if the Sheet is overshooting after the detent with index `1`, its travel range will be `{ start: 1, end: 1 }`.

### onTravel

| **Presence** | Optional |
| --- | --- |
| **Type** | `({
   progress: number;
   range: { start: number; end: number };
   progressAtDetents: Array<number>;
}) => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs on every frame when travel occurs, whether it is caused by swipe or programmatically.

**Parameters description**

| `progress` | The progress value of the Sheet travel, going from `0` to `1`. It is `0` when the Sheet is fully out, and `1` when it is resting on the last detent. |
| --- | --- |
| `range` | The travel range the Sheet is currently within. |
| `progressAtDetents` | The equivalent progress value for each detent. It is useful to make calculations and apply effects only within specific ranges. |

### onTravelStart

| **Presence** | Optional |
| --- | --- |
| **Type** | `() => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs when the Sheet starts traveling, whether it is caused by swipe or programmatically.

**Notes**

It runs before the first `onTravel` event handler call.

### onTravelEnd

| **Presence** | Optional |
| --- | --- |
| **Type** | `() => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs after the Sheet finishes traveling, whether it is caused by swipe or programmatically.

**Notes**

It runs before the last `onTravel` event handler call.

### inertOutside

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether all interactions outside of  `<Sheet.View>` and all associated `<Island.Content>` should be prevented.

**Notes**

- In other words, this prop defines whether the Sheet is modal or not.
- It prevents `<body>` from being scrollable, as expected. As a result, scrollbars are removed, and a CSS padding is added to compensate for it. In order to adjust the position of elements using `fixed` positioning, please use the Fixed component. See [Silk – Fixed](Silk%20%E2%80%93%20Fixed.md).
- Use the Island component to wrap any element that you want the user to be able to interact with when this prop is set to `true`. See [Silk – Island](Silk%20%E2%80%93%20Island.md).
- Due to a Safari bug, when this prop is set to `false` and you are not using  `<Sheet.Backdrop>`, you need to use `<Sheet.SpecialWrapper.Root>` and `<Sheet.SpecialWrapper.Content>` inside of `<Sheet.Content>`, otherwise the Sheet will not be swipeable.

### onPresentAutoFocus

| **Presence** | Optional |
| --- | --- |
| **Type** | `| {
    focus?: boolean;
  }
| ((customEvent: {
      changeDefault: (changedBehavior: {
         focus?: boolean;
      }) => void;
      nativeEvent: null;
  }) => void)}` |
| **Default** | `{ focus: true }` |

**Description**

An event handler that runs when the auto-focus mechanism is executed when the Sheet gets presented, at the end of the entering animation if there is one.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ focus: true }` | Causes the first `<AutoFocusTarget>` underlying element if there is one, or the first focusable element within the `<Sheet.View>` to receive focus when the Sheet gets presented. |
| --- | --- |
| `{ focus: false }` | Prevents the auto-focus mechanism from focusing any element when the Sheet gets presented. |

- **Example**
    
    ```jsx
    <Sheet.View onPresentAutoFocus={{ focus: false }}>
    	...
    </Sheet.View>
    ```
    
    ```jsx
    <Sheet.View
      onPresentAutoFocus={(event) => event.changeDefault({ focus: false })}
     >
    	...
    </Sheet.View>
    ```
    

### onDismissAutoFocus

| **Presence** | Optional |
| --- | --- |
| **Type** | `| {
    focus?: boolean;
  }
| ((customEvent: {
      changeDefault: (changedBehavior: {
         focus?: boolean;
      }) => void;
      nativeEvent: null;
  }) => void)}` |
| **Default** | `{ focus: true }` |

**Description**

An event handler that runs when the auto-focus mechanism is executed when the Sheet gets dismissed, at the end of the exiting animation if there is one.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ focus: true }` | Causes the first `<AutoFocusTarget>` underlying element if there is one, or the first focusable element within the `<Sheet.View>` to receive focus when the Sheet gets dismissed. |
| --- | --- |
| `{ focus: false }` | Prevents the auto-focus mechanism from focusing any element when the Sheet gets dismissed. |

- **Example**
    
    ```jsx
    <Sheet.View onDismissAutoFocus={{ focus: false }}>
    	...
    </Sheet.View>
    ```
    
    ```jsx
    <Sheet.View
      onDismissAutoFocus={(event) => event.changeDefault({ focus: false })}
     >
    	...
    </Sheet.View>
    ```
    

### onClickOutside

| **Presence** | Optional |
| --- | --- |
| **Type** | `| {
    dismiss?: boolean;
    stopOverlayPropagation?: boolean;
  }
| ((customEvent: {
      changeDefault: (changedBehavior: {
         dismiss?: boolean;
         stopOverlayPropagation?: boolean;
      }) => void;
      nativeEvent: React.SyntheticEvent;
  }) => void)}` |
| **Default** | `{ dismiss: true, stopOverlayPropagation: true }` |

**Description**

An event handler that runs when a click occurs outside of `<Sheet.View>` and all associated `<Island.Content>`.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ dismiss: true }` | If  `sheetRole` is not set to `"alertdialog"`, then the Sheet will get dismissed when a click occurs outside. |
| --- | --- |
| `{ dismiss: false }` | Inverse of `true`. |
| `{ stopOverlayPropagation: true }` | The `clickoutside` custom event will not propagate to overlays (i.e. Sheets) that are presented below this one. Only this Sheet will deal with the event. |
| `{ stopOverlayPropagation: false }` | Inverse of `true`. |

**Notes**

- Click events performed on `<Sheet.Backdrop>` underlying element are considered as outside. `<Sheet.View>` underlying element is click-through, so click events performed directly over it are considered as outside.
- This prop always computes to `{ dismiss: false, stopOverlayPropagation: true }` if the `sheetRole` prop is set to `"alertdialog"`.
- `{ dismiss: false, stopOverlayPropagation: false }` is useful for example in combination with the `inertOutside` prop set to `false` in the case of a toast or sidebar component which may be presented on top of another Sheet. In that case you don’t want the toast or sidebar component to get dismissed when a click outside occurs, but may want the Sheet below to do so. Because the `clickoutside` custom event will be propagated to the Sheet below, it will get dismissed if its `onClickOutside` prop is set to `{ dismiss: true }`.

- **Example**
    
    ```jsx
    <Sheet.View onClickOutside={{ dismiss: false }}>
    	...
    </Sheet.View>
    ```
    
    ```jsx
    <Sheet.View
      onClickOutside={(event) => event.changeDefault({ dismiss: false })}
     >
    	...
    </Sheet.View>
    ```
    

### onEscapeKeyDown

| **Presence** | Optional |
| --- | --- |
| **Type** | `| {
    nativePreventDefault?: boolean;
    dismiss?: boolean;
    stopOverlayPropagation?: boolean;
  }
| ((customEvent: {
      changeDefault: (changedBehavior: {
         nativePreventDefault?: boolean;
         dismiss?: boolean;
         stopOverlayPropagation?: boolean;
      }) => void;
      nativeEvent: React.SyntheticEvent;
  }) => void)}` |
| **Default** | `{
   nativePreventDefault: true,
   dismiss: true,
   stopOverlayPropagation: true
}` |

**Description**

An event handler that runs when the escape key is pressed.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ nativePreventDefault: true }` | The user-agent default action run when the escape key is pressed is prevented. (Safari macOS default action is escaping full-screen mode.) |
| --- | --- |
| `{ nativePreventDefault: false }` | Inverse of `true`. |
| `{ dismiss: true }` | The Sheet will get dismissed when the escape key is pressed. |
| `{ dismiss: false }` | Inverse of `true`. |
| `{ stopOverlayPropagation: true }` | The keydown event will not propagate to overlays (i.e. Sheets) that are presented below this one. Only this Sheet will deal with this event. |
| `{ stopOverlayPropagation: false }` | Inverse of `true`. |

**Notes**

- Always computes to `{ dismiss: false, stopOverlayPropagation: true }` if  `sheetRole` is set to `"alertdialog"`.
- `{ dismiss: false, stopOverlayPropagation: false }` is useful for example in combination with the `inertOutside` prop set to `false` in the case of a toast or sidebar component which may be presented on top of another Sheet. In that case you don’t want the toast or sidebar component to get dismissed when the escape key is pressed, but may want the Sheet below to do so. Because the keydown event will be propagated to the Sheet below, it will get dismissed if its `onEscapeKeyDown` prop is set to `{ dismiss: true }`.

- **Example**
    
    ```jsx
    <Sheet.View onEscapeKeyDown={{ dismiss: false }}>
    	...
    </Sheet.View>
    ```
    
    ```jsx
    <Sheet.View
      onEscapeKeyDown={(event) => event.changeDefault({ dismiss: false })}
     >
    	...
    </Sheet.View>
    ```
    

### **onFocusInside**

| **Presence** | Optional |
| --- | --- |
| **Type** | `(customEvent: {
   nativeEvent: Event;
}) => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs when focus occurs inside of `<Sheet.View>`.

### **nativeFocusScrollPrevention**

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether the native browser scroll into view mechanism should be prevented or not when an element inside `<Sheet.View>` receives focus.

When an element receives focus on mobile, the browser shifts the viewport up or down to try and keep it in view. Unfortunately, this native mechanism doesn’t work well in most situations, so we let you prevent it and properly deal with the position of the focused element.

If the focused element ends up being covered by the on-screen keyboard, we recommend using the Scroll component so it gets scrolled into view automatically.

**Notes**

- The prevention doesn’t work when the inputs are inside of an `<iframe>` element.
- When the user clicks on text present in a text input, the caret will always be put back at its previous position when set to `true`.
- In iOS Safari, the prevention may not be effective with password inputs whose `autoComplete` html attribute is set to anything else than `"current-password"`. Therefore, we strongly recommend always using this value. Safari won’t suggest a new password directly, but the user can still get a suggested password by tapping the “Password” button in the suggestion bar and asking the password manager to provide a new password.
- Due to a Chrome Android bug, the prevention may not be effective when the focus is moved with the on-screen keyboard “next input” button.
- Due to a Chrome Android bug, for inputs causing the suggestion bar of the keyboard to be shown, a distance of at least 48px between the last text input and the bottom of the viewport is required to avoid a layout shift.

## `<Sheet.Backdrop>`

| Presence | Optional |
| --- | --- |
| Composition | Child of `<Sheet.View>` |
| Underlying element | `<div>` |

**Description**

The Backdrop sub-component prevents user interactions with the content below and can be used to dim it.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### swipeable

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether swiping over the Backdrop causes the Sheet to travel.

**Notes**

- When set to `false`, using the SpecialWrapper sub-component is required in Safari due to a bug.

### themeColorDimming

| **Presence** | Optional |
| --- | --- |
| **Type** | `false | "auto"`  |
| **Default** | `false` |

**Description**

Defines whether the `theme-color` of the page gets dimmed using the CSS `background-color` and `opacity` of `<Sheet.Backdrop>`, so the Backdrop and the OS status bar blend together.

**Values description**

| `"auto"` | Computes to `true` in WebKit-based browsers. When `true`, the `theme-color` gets dimmed. |
| --- | --- |
| `false` | The `theme-color` does not get dimmed. |

**Notes**

- The HTML `theme-color` meta-tag must be set, and its value declared using the hexadecimal format (e.g. `#ffffff`) or the RGB format (`rgb(<integer>, <integer>, <integer>)`).
- The `<Sheet.Backdrop>` underlying element CSS `background-color` value must not include the alpha channel.
- `<Sheet.Backdrop>` must have a `travelAnimation` declared for its `opacity`, and its value must either use the keyframes array syntax with `number`s as values (not `string`), or the function syntax and return a `number`.
- If you need to update the  `theme-color` while the Sheet is presented, you must use the [`updateThemeColor`](Silk%20%E2%80%93%20updateThemeColor.md) function so only the underlying color gets updated, preserving the dimming.

### travelAnimation

| **Default** | `({ progress }) => Math.min(progress * 0.33, 0.33)` |
| --- | --- |

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

**Notes**

- You can remove the default value by setting it to `{ opacity: null }`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.Content>`

| Presence | Required |
| --- | --- |
| Composition | Child of `<Sheet.View>` |
| Underlying element | `<div>` |

**Description**

The Content sub-component represents the panel which contains the content of the sheet and moves during travel.

**Notes**

- Its position is determined by the `contentPlacement` prop on `<Sheet.View>`. You cannot define its position in any other way.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.BleedingBackground>`

| Presence | Optional |
| --- | --- |
| Composition | Descendant of `<Sheet.Content>` |
| Underlying element | `div` |

**Description**

The BleedingBackground sub-component renders an element which is automatically sized and positioned to fully occupy the `<Sheet.Content>` and bleed out of it in the swipe dismissal direction so it looks like it is expanded during swipe overshoot.

The underlying element can be styled freely to customize its appearance.

**Notes**

- As a performance optimization, the underlying element is resized during entering and exiting animations. This can cause visual shifts when using gradient or images as background when their size is based on the size of the element. To avoid such shifts, prefer sizing based on absolute values (e.g. `px` or `svh`).

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.Handle>`

| Presence | Optional |
| --- | --- |
| Composition | Descendant of `<Sheet.Root>` |
| Underlying element | `button` |

**Description**

A Handle sub-component representing a "handle" signifier used to indicate to the user that swiping the sheet is possible.

Internally, it renders a `<Sheet.Trigger>` sub-component wrapping a `<VisuallyHidden>` component. Therefore, any textual content passed to it will only be accessible to screen-readers and visually hidden.

A `::before` pseudo-element is used to expand the interactive area of the underlying Trigger.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetId` |
| **Default** | The `SheetId` of the closest `<Sheet.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Sheet instance.

### action

| **Presence** | Optional |
| --- | --- |
| **Type** | `| "dismiss"
| "step"
| {
    type: "step";
    direction?: "up" | "down";
    detent?: number;
}` |
| **Default** | `"step"` |

**Description**

Defines the action that will execute when the Handle is pressed.

**Values description**

| `"dismiss"` | The Sheet will be dismissed. |
| --- | --- |
| `"step"` | The Sheet will step to the next detent in the upward direction, and cycle after reaching the last detent. |
| `{
    type: "step";
    direction?: "up" | "down";
    detent?: number;
}` | The Sheet will step to a detent:
- if the `direction` key is used, it will step to the next detent in that direction and cycle after reaching the last detent;
- if the `detent` key is used, it will step to the detent matching that detent index. |

### onPress

See [onPress](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Trigger>`.

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.Title>`

| Presence | Required if `sheetRole` is set to `dialog` or `alertdialog` |
| --- | --- |
| Composition | Descendant of `<Sheet.View>` |
| Underlying element | `h2` |

**Description**

A sub-component used to define a title for the Sheet.

The `aria-labelledby` HTML attribute is set automatically on `<Sheet.View>` underlying element.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.Description>`

| Presence | Required if `sheetRole` is set to `dialog` or `alertdialog` |
| --- | --- |
| Composition | Descendant of `<Sheet.View>` |
| Underlying element | `p` |

**Description**

A sub-component used to define a title for the Sheet.

The `aria-describedby` HTML attribute is set automatically on `<Sheet.View>` underlying element.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

### travelAnimation

See [travelAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

### stackingAnimation

See [stackingAnimation](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Outlet>`.

## `<Sheet.SpecialWrapper.Root>`

| Presence | Required when using the SpecialWrapper component |
| --- | --- |
| Composition | Child of `<Sheet.Content>` |
| Underlying element | `<div>` |

**Description**

This sub-component allows to workaround a bug that prevents swiping in Safari when both:

- the `inertOutside` prop on `<Sheet.View>` is set to `false`;
- the Backdrop sub-component is not present, or it is present but its `swipeable` prop is set to `false`.

**Notes**

- There is two limitations caused by the use this sub-component:
    - The underlying element makes use of the `overflow` CSS property with a value other than `visible`, causing any content overflowing its bound to be clipped.
    - When swiping over the underlying element in the cross axis of the Sheet, and then in the travel axis without initiating a new swipe, sheet travel will not occur.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.

## `<Sheet.SpecialWrapper.Content>`

| Presence | Required when using the SpecialWrapper component |
| --- | --- |
| Composition | Child of `<Sheet.SpecialWrapper.Root>` |
| Underlying element | `<div>` |

**Description**

The Content sub-component to be used in combination with `<Sheet.SpecialWrapper.Root>`.

### asChild

See [asChild](Silk%20%E2%80%93%20Sheet.md) on `<Sheet.Root>`.