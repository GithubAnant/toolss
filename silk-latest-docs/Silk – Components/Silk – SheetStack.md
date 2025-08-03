# Silk – SheetStack

# Description

A component that groups together several Sheets and enable the definition of stacking-driven animations (i.e. animations based on the travel of Sheets stacked on top of each other).

**Notes**

- The Sheets can be either siblings or nested.

**Current limitation**

- Sheets which are part of a SheetStack can only be dismissed when they are frontmost (i.e. at the top of the stack). This limitation will be lifted in the future.

# Anatomy

## Sibling sheets

```jsx
import { Sheet } from "@silk-hq/components";

export default () => (
	<SheetStack.Root>
		<SheetStack.Outlet />
	
		<Sheet.Root>
			<Sheet.Trigger />
			<Sheet.Portal>
				<Sheet.View>
					<Sheet.Backdrop />
					<Sheet.Content>
						<Sheet.Title />
						<Sheet.Description />
					</Sheet.Content>
				</Sheet.View>
			</Sheet.Portal>
		</Sheet.Root>
		
		<Sheet.Root>
			<Sheet.Trigger />
			<Sheet.Portal>
				<Sheet.View>
					<Sheet.Backdrop />
					<Sheet.Content>
						<Sheet.Title />
						<Sheet.Description />
					</Sheet.Content>
				</Sheet.View>
			</Sheet.Portal>
		</Sheet.Root>
	</SheetStack.Root>
);
```

## Nested sheets

```jsx
import { Sheet } from "@silk-hq/components";

export default () => (
	<SheetStack.Root>
		<SheetStack.Outlet />
	
		<Sheet.Root>
			<Sheet.Trigger />
			<Sheet.Portal>
				<Sheet.View>
					<Sheet.Backdrop />
					<Sheet.Content>
						<Sheet.Title />
						<Sheet.Description />
						
						{/* Nested sheet */}
						<Sheet.Root>
							<Sheet.Trigger />
							<Sheet.Portal>
								<Sheet.View>
									<Sheet.Backdrop />
									<Sheet.Content>
										<Sheet.Title />
										<Sheet.Description />
									</Sheet.Content>
								</Sheet.View>
							</Sheet.Portal>
						</Sheet.Root>
						
					</Sheet.Content>
				</Sheet.View>
			</Sheet.Portal>
		</Sheet.Root>
);
```

# Sub-components

## `<SheetStack.Root>`

| Presence | Required |
| --- | --- |
| Composition | - Contains all SheetStack sub-components
- Contains all associated `<Sheet.Root>` |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps all other sub-components of the same SheetStack instance as well as the associated Sheet instances’ `<Sheet.Root>` sub-components.

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

### componentId

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetStackId` |
| **Default** | `undefined` |

**Description**

Defines the id of this SheetStack. This id can then be passed to `<Sheet.Root>`, or `<Island.Root>` `forComponent` prop to associate them with this SheetStack.

## `<SheetStack.Outlet>`

| Presence | Optional |
| --- | --- |
| Composition | Child of `<SheetStack.Root>` |
| Underlying element | `<div>` |

**Description**

A sub-component that allows to declaratively define animations for the underlying element based on the stacking progress of the associated SheetStack.

### asChild

See [asChild](Silk%20%E2%80%93%20SheetStack.md) on `<SheetStack.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `SheetStackId | "closest"` |
| **Default** | The `SheetStackId` of the closest `<SheetStack.Root>` ancestor |

**Description**

Associates this sub-component with the desired SheetStack instance.

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

Declaratively defines animations on any CSS property of the underlying element driven by the aggregated travel of Sheets stacked above the first Sheet belonging to the associated SheetStack.

**Values description for each key**

| `[string | number, string | number]` | **Keyframes array syntax.** As Sheets travel and get stacked on top of the first Sheet added to the SheetStack, the underlying element will have its related CSS property animated from the first to the second value in the array, each value in-between being interpolated linearly. |
| --- | --- |
| `({
   progress: number;
   tween: (start: number | string, end: number | string) => string;
}) => string | number` | **Function syntax.** As Sheets travel and get stacked on top of the first Sheet added to the SheetStack, the underlying element will have its related CSS property animated based on the value returned by the function. The progress value goes from 0 to n (n being the number of Sheets stacked on top of the associated Sheet). |
| `string` | **String syntax.** As Sheets get stacked on top of the first Sheet added to the SheetStack, the underlying element will have its related CSS property set to the defined value. |
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
    <SheetStack.Outlet
    	stackingAnimation={{
    		translateX: ["0px", "100px"],
    	}}
    />
    ```
    
    ```jsx
    <SheetStack.Outlet
    	stackingAnimation={{
    		translateX: ({ progress }) => progress * 100 + "px",
    	}}
    />
    ```
    
    ```jsx
    <SheetStack.Outlet
    	stackingAnimation={{
    		backgroundColor:
    			({ tween }) =>
    				`rgb(${tween(10, 0)}, ${tween(10, 0), ${tween(10, 0))`,
    	}}
    />
    ```