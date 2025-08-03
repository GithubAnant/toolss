# Silk – Scroll

# Description

A primitive component for building advanced scrolling experiences. It provides extra features compared to normal scroll containers, as well as performance optimizations when used inside or around a Sheet component.

We recommend using the Scroll component for all scrolling across your app.

# Anatomy

```jsx
import { Scroll } from "@silk-hq/sheet";

export default () => (
	<Scroll.Root>
		<Scroll.View>
			<Scroll.Content>
				...
			</Scroll.Content>
		</Scroll.View>
		
		<Scroll.Trigger />
	</Scroll.Root>
);
```

# Sub-components

## `<Scroll.Root>`

| Presence | Required |
| --- | --- |
| Composition | Contain all other Scroll sub-components |
| Underlying element | `<div>` |

**Description**

The Root sub-component wraps all other Scroll sub-components of the same Scroll instance, as it contains logic shared among all.

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
| **Type** | `ScrollId` |
| **Default** | `undefined` |

**Description**

Defines the id of the Scroll component instance. This id can then be passed to other Scroll sub-components `forComponent` prop to associate them with it.

### componentRef

| **Presence** | Optional |
| --- | --- |
| **Type** | `React.RefObject<ScrollRef>`
where
`ScrollRef = {
   getProgress: () => number;
   getDistance: () => number;
   getAvailableDistance: () => number;
   scrollTo: (options: ScrollToOptions) => void;
   scrollBy: (options: ScrollByOptions) => void;
}` 
where
`ScrollToOptions = ScrollByOptions = {
   progress?: number;
   distance?: number;
   animationSettings?: { skip: "default" | "auto" | boolean };
}` |
| **Default** | `undefined` |

**Description**

Associates a `React.RefObject` to `<Scroll.Root>`  which can then be used to control the Scroll component imperatively by calling the methods stored in it.

**Methods description**

| `getProgress` | Returns the scroll progress from `0` to `1`. When  `<Scroll.Content>` start edge is aligned with  `<Scroll.View>` start edge, scroll progress is `0`. When they are aligned on their end edge, scroll progress is `1`. |
| --- | --- |
| `getDistance` | Returns the distance in pixels traveled by `<Scroll.Content>` from its start position. |
| `getAvailableDistance` | Returns the distance in pixels that  `<Scroll.Content>` can travel in total, from its start position to its end position. |
| `scrollTo` | Make  `<Scroll.Content>` travel so it ends up at the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs; if it computes to `true` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, and computes to `false` otherwise. |
| `scrollBy` | Make the `<Scroll.Content>` travel by the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs; if it computes to `true` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, and computes to `false` otherwise. |

## `<Scroll.Trigger>`

| Presence | Required |
| --- | --- |
| Composition | Descendant of `<Scroll.Root>` |
| Underlying element | `<button>` |

**Description**

A Trigger sub-component that allows to run specific actions related to the Scroll instance as a result of a press event.

### asChild

See [asChild](Silk%20%E2%80%93%20Scroll.md) on `<Scroll.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `ScrollId` |
| **Default** | The `ScrollId` of the closest `<Scroll.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Scroll instance.

### action

| **Presence** | Optional |
| --- | --- |
| **Type** | `{
   type: "scroll-to" | "scroll-by";
   progress?: number;
   distance?: number;
   animationSettings?: { skip: "default" | "auto" | boolean };
}` |
| **Default** | `undefined` |

**Description**

Defines the action that will execute when the Trigger is pressed.

**Values description**

| `"scroll-to"` | Make  `<Scroll.Content>` travel so it ends up at the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs, if it computes to `false` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, it computes to `false` otherwise. |
| --- | --- |
| `"scroll-by"` | Make  `<Scroll.Content>` travel by the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs, if it computes to `false` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, and computes to `false` otherwise. |

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
| `{ forceFocus: false }` | Inverse of `true`. |
| `{ runAction: true }` | The Trigger action will be run. |
| `{ runAction: false }` | Inverse of `true`. |

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
    

## `<Scroll.View>`

| Presence | Required |
| --- | --- |
| Composition | Descendant of `<Scroll.Root>` |
| Underlying element | `<div>` |

**Description**

The View sub-component is the area inside of which the `<Scroll.Content>` can travel.

**Notes**

- Elements put directly inside of this sub-component will not move along the content as scroll occurs.
- If you are using this component inside of nested CSS grid or flex containers, you may need to add `min-width: 0px` and/or `min-height: 0px` on these containers’ children to prevent `<Scroll.View>` being sized based on `<Scroll.Content>` size on the scroll axis, thus causing visible overflow instead of a scrollable overflow.

### asChild

See [asChild](Silk%20%E2%80%93%20Scroll.md) on `<Scroll.Root>`.

### forComponent

| **Presence** | Optional |
| --- | --- |
| **Type** | `ScrollId` |
| **Default** | The `ScrollId` of the closest `<Scroll.Root>` ancestor. |

**Description**

Associates this sub-component with the desired Scroll instance.

### axis

| **Presence** | Optional |
| --- | --- |
| **Type** | `"x" | "y"` |
| **Default** | `"y"` |

**Description**

Defines the axis on which `<Scroll.Content>` can travel.

### pageScroll

| **Presence** | Required if `nativePageScrollReplacement` is set to `true` or `"auto"`. |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `false` |

**Description**

Defines whether this Scroll component is considered as a page.

When set to `true`, this Scroll can be used to control page scrolling (no matter whether it is native or replaced). Therefore, you can use a  `<Scroll.Trigger>`, or imperative methods to get scroll informations or cause scrolling. You can therefore use the exact same API to control any scroll container and page scrolling.

**Values description**

| `false` | The underlying element acts a scroll container. |
| --- | --- |
| `true` | Page scrolling can be controlled through this Scroll component instance.

- If  `nativePageScrollReplacement` computes to `false`, the  `<Scroll.View>` underlying element does not act as a scroll container, instead it acts as a simple element.

- If  `nativePageScrollReplacement` computes to `true`, the `<Scroll.View>` underlying element acts as a scroll container replacing native page scrolling. |

### nativePageScrollReplacement

| **Presence** | Optional |
| --- | --- |
| **Type** | `"auto" | boolean` |
| **Default** | `false` |
| **Requirements** | • `pageScroll` must be set to `true` to use this prop with a value of `true` or `"auto"`.
• With SSG or SSR, when set to `true` or `"auto"`, `suppressHydrationWarning` must be set on `<html>`. |

**Description**

Defines whether native page scrolling (a.k.a. “body scrolling”) is being replaced by the Scroll component scroll container.

**Values description**

| `true` | Native page scrolling is replaced by the Scroll component scroll container. |
| --- | --- |
| `false` | Inverse of `true`. |
| `"auto"` | Computes to `false` in of mobile browsers (i.e. Android, iOS iPadOS), except in standalone mode; computes to `true` everywhere else. |

**Notes**

- When set or computing to `true`:
    - **Benefits**
        - Enables the use of `nativeFocusScrollPrevention`.
        - Improves animation performance when animating `<Scroll.View>` underlying element or surrounding elements.
        - Swiping over elements whose `fixed` CSS positioning doesn’t propagate to the `<body>` and therefore doesn’t cause the page to scroll.
    - **Limitations**
        - Native scroll into view for text fragments (e.g. URL such as `#:~:text=example`) does not work.
        - Native scroll into view for anchors (e.g. `#anchor-id` matching the `id` HTML attribute of an element) does not work.
        - On iOS, tapping on the status bar to scroll top does not work. This limitation will be lifted in the future.
        - Native pull-down to refresh does not work.
        - Scroll gesture overshoot (a.k.a. overscrolling) doesn’t work in Chromium-based browsers.
        - When setting this prop to `true`, it prevents mobile browser interfaces from expanding/collapsing as the user scrolls the page inside of mobile browsers. This is why we recommend using the `"auto"` value instead, as it will compute to `false` in this case.
- The [`useNativePageScrollReplaced`](Silk%20%E2%80%93%20usePageScrollData.md) hook returns a `boolean` indicating whether native page scroll is currently replaced.

### **safeArea**

| **Presence** | Optional |
| --- | --- |
| **Type** | `"none" | "layout-viewport" | "visual-viewport"` |
| **Default** | `"visual-viewport"` |

**Description**

Defines the area of the viewport that is considered safe for `<Scroll.Content>` to travel within. If `<Scroll.View>` overflows this area, then the available scroll distance is increased so that `<Scroll.Content>` can travel as much as required for it to be fully accessible to the user.

For example, if  `<Scroll.View>` fills the entire layout viewport, then when the on-screen keyboard appears and the visual viewport shrinks, the bottom part of the `<Scroll.View>` underlying HTML will be hidden behind the on-screen keyboard, and the `<Scroll.Content>` will not be fully accessible to the user. By setting this prop to `"visual-viewport"`, the scrolling distance gets expanded so `<Scroll.Content>` can travel as much as needed to be entirely visible above the on-screen keyboard.

**Values description**

| `"none"` | No safe area is defined. |
| --- | --- |
| `"layout-viewport"` | The safe area is defined by the bounds of the layout viewport (i.e. the browser window excluding the browser interface). |
| `"visual-viewport"` | The safe area is defined by the bounds of the visual viewport (i.e. the browser window excluding the browser interface and the on-screen keyboard). |

### scrollGestureTrap

| **Presence** | Optional |
| --- | --- |
| **Type** | `| boolean
| {
   x?: boolean;
   y?: boolean;
  }
| {
   xStart?: boolean;
   xEnd?: boolean;
   yStart?: boolean;
   yEnd?: boolean;
}` |
| **Default** | `false` |

**Description**

Defines whether scroll gestures performed in a direction where further scrolling cannot occur (because the edge has been reached) should be trapped inside of `<Scroll.View>`, or propagate to ancestor scroll containers or Sheets, causing swipe.

**Notes**

- When trapping is enabled, native overscroll actions are prevented. For example, if trapping is enabled on `yStart`, pull to refresh in mobile browsers is prevented; if it is enabled on `xStart`, swipe to go back in history in desktop browsers is prevented.
- If `scrollGestureOvershoot` is set to `false`, then `scrollGestureTrap` always computes to `true`.
- Due to an unresolved Safari bug, trapping is always enabled when swiping over a vertical Scroll component wrapped in an horizontally swipeable Sheet itself wrapped in a vertically swipeable Sheet component. We hope to see that bug resolved quickly.

### scrollGestureOvershoot

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines the visual behavior of `<Scroll.Content>` when the user performs a scroll gesture in a direction where scrolling cannot occur (because the edge has been reached).

**Values description**

| `true` | Overshooting occurs. |
| --- | --- |
| `false` | Inverse of `true`. |

**Notes**

- Only iOS/iPadOS browsers and Safari and Firefox on macOS support overshooting.
- If `scrollGestureOvershoot` is set to `false`, then `scrollGestureTrap` always computes to `true`.

### scrollGesture

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `"auto"` |

**Description**

Defines whether scrolling occurs as a result of user scroll gestures (`mousewheel` events, `touchmove` events, direction keys, start/end keys, dragging the scrollbar, etc.).

**Values description**

| `"auto"` | Scrolling occurs as a result of user scroll gestures if `<Scroll.Content>` overflows `<Scroll.View>`. |
| --- | --- |
| `false` | Scrolling does not occur as a result of user scroll gestures. |

### onScroll

| **Presence** | Optional |
| --- | --- |
| **Type** | `({
   progress: number;
   distance: number;
   availableDistance: number;
   nativeEvent: React.UIEvent<HTMLDivElement>;
}) => void` |
| **Default** | `undefined` |

**Description**

An event handler that runs asynchronously on every frame when scrolling occurs, whether it is caused by a scroll gesture or programmatically.

**Parameters description**

| `progress` | The scroll progress from `0` to `1`. When  `<Scroll.Content>` start edge is aligned with  `<Scroll.View>` start edge, scroll progress is `0`. When they are aligned on their end edge, scroll progress is `1`. |
| --- | --- |
| `distance` | The distance in pixels traveled by `<Scroll.Content>` from its start position. |
| `availableDistance` | The distance in pixels that  `<Scroll.Content>` can travel in total, from its start position to its end position. |
| `nativeEvent` | The underlying native scroll event. |

### onScrollStart

| **Presence** | Optional |
| --- | --- |
| **Type** | `| { dismissKeyboard: boolean }
| ((customEvent: ScrollStartCustomEvent) ⇒ void`
where
`ScrollStartCustomEvent = {
   changeDefault: (changedBehavior: {
      dismissKeyboard: boolean;
   }) => void;
   dismissKeyboard: boolean;
   nativeEvent: null;
  }` |
| **Default** | `{ dismissKeyboard: false }` |

**Description**

An event handler that runs when scrolling starts, whether it is initiated by a scroll gesture or programmatically.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ dismissKeyboard: true }` | Causes the on-screen keyboard to be dismissed if it is presented when the event is fired. |
| --- | --- |
| `{ dismissKeyboard: false }` | Inverse of `{ dismissKeyboard: true }`. |

- **Example**
    
    ```jsx
    <Scroll.View onFocusInside={{ dismissKeyboard: true }}>
    	...
    </Scroll.View>
    ```
    
    ```jsx
    <Sheet.View
      onFocusInside={(event) => event.changeDefault({ dismissKeyboard: true })}
     >
    	...
    </Sheet.View>
    ```
    

### onScrollEnd

| **Presence** | Optional |
| --- | --- |
| **Type** | `(({ nativeEvent: Event; }) ⇒ void` |
| **Default** | `undefined` |

**Description**

An event handler that runs when scrolling ends, whether it was initiated by a scroll gesture or programmatically.

### **nativeFocusScrollPrevention**

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether the native scroll into view mechanism should be prevented or not when a `<Scroll.View>` descendant element receives focus.

When an element receives focus on mobile, the browser shifts the viewport up or down to try and keep it in view. Unfortunately, this native mechanism doesn’t work well in most situations, so we let you prevent the default behavior to properly deal with the position of the focused element. We recommend using the `onFocusInside` to do so.

**Notes**

- The prevention doesn’t work when the inputs are inside of an `<iframe>` element.
- The prevention doesn’t work when `pageScroll` is set to `true` and `nativePageScrollReplacement` is set or computes to `false`.
- When the user clicks on text present in a text input, the caret will always be put back at its previous position when set to `true`.
- In iOS Safari, the prevention may not be effective with password inputs whose `autoComplete` html attribute is set to anything else than `"current-password"`. Therefore, we strongly recommend always using this value. Safari won’t suggest a new password directly, but the user can still get a suggested password by tapping the “Password” button in the suggestion bar and asking the password manager to provide a new password.
- Due to a Chrome Android bug, the prevention may not be effective when the focus is moved with the on-screen keyboard “next input” button.
- Due to a Chrome Android bug, for inputs causing the suggestion bar of the keyboard to be shown, a distance of at least 48px between the last text input and the bottom of the viewport is required to avoid a layout shift.

### **onFocusInside**

| **Presence** | Optional |
| --- | --- |
| **Type** | `| { scrollIntoView: boolean; }
| ((customEvent: ScrollViewFocusInsideCustomEvent) => void);`
where
`ScrollViewFocusInsideCustomEvent = {
   changeDefault: (changedBehavior: { scrollIntoView: boolean }) => void;
   scrollIntoView: boolean;
   nativeEvent: Event;
}` |
| **Default** | `{ scrollIntoView: true }` |

**Description**

An event handler that runs when a `<Scroll.View>` descendant element receives focus.

The underlying custom event has a default behavior that can be changed either by calling its `changeDefault` method with an option object as parameter, or by directly passing the option object to the prop.

**Values description**

| `{ scrollIntoView: true }` | The element receiving focus is scrolled into view so it is fully visible. |
| --- | --- |
| `{ scrollIntoView: false }` | Inverse of `{ scrollIntoView: true }`. |

**Notes**

- The `scrollIntoView` option is a reliable alternative to the native scroll into view on focus mechanism that can disabled with `nativeFocusScrollPrevention`.
- The `scrollIntoView` option takes the `safeArea` into account.

- **Example**
    
    ```jsx
    <Scroll.View onFocusInside={{ scrollIntoView: false }}>
    	...
    </Scroll.View>
    ```
    
    ```jsx
    <Sheet.View
      onFocusInside={(event) => event.changeDefault({ scrollIntoView: false })}
     >
    	...
    </Sheet.View>
    ```
    

### scrollAnimationSettings

| **Presence** | no |
| --- | --- |
| **Type** | `{ skip: "auto" | boolean }` |
| **Default** | `{ skip: "auto" }` |

**Description**

Defines the animation settings for programmatic scrolling (i.e. scroll caused by `<Scroll.Trigger>` or an imperative call).

**Values description**

| `{ skip: "auto" }` | Programmatic scrolling is animated only if the user does not prefer “reduced motion”. |
| --- | --- |
| `{ skip: false }`  | Programmatic scrolling is animated. |
| `{ skip: true }`  | Inverse of `{ skip: false }`. |

### scrollAnchoring

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether the scroll position should be adjusted to prevent sudden changes when a layout shift occurs inside of  `<Scroll.Content>`.

**Notes**

- Uses the [`overflow-anchor` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor) under the hood.
- Not yet supported in Safari.

### scrollSnapType

| **Presence** | Optional |
| --- | --- |
| **Type** | `"none" | "proximity" | "mandatory"` |
| **Default** | `"none"` |

**Description**

Defines the value for the [`scroll-snap-type` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type).

### scrollPadding

| **Presence** | Optional |
| --- | --- |
| **Type** | `"auto" | string` (CSS length) |
| **Default** | `"auto"` |

**Description**

Defines the value for the [`scroll-padding`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding) [CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type).

### scrollTimelineName

| **Presence** | Optional |
| --- | --- |
| **Type** | `"none" | string` (prefixed with "--") |
| **Default** | `"none"` |

**Description**

Defines the value for the [`scroll-timeline-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline-name) [CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type).

### nativeScrollbar

| **Presence** | Optional |
| --- | --- |
| **Type** | `boolean` |
| **Default** | `true` |

**Description**

Defines whether the native scrollbar should be displayed or not.

## `<Scroll.Content>`

| Presence | Required |
| --- | --- |
| Composition | Descendant of `<Scroll.View>` |
| Underlying element | `<div>` |

**Description**

The Content sub-component represents the content that moves as scroll occurs.

### asChild

See [asChild](Silk%20%E2%80%93%20Scroll.md) on `<Scroll.Root>`.

# Imperative handling

You can manipulate imperatively the Scroll component by passing a React ref to the `<Scroll.Root>` sub-component `componentRef` prop and then calling the methods stored on it.

### getProgress

| **Type** | `() => number` |
| --- | --- |

**Description**

Returns the scroll progress from `0` to `1`. When  `<Scroll.Content>` start edge is aligned with  `<Scroll.View>` start edge, scroll progress is `0`. When they are aligned on their end edge, scroll progress is `1`.

### getDistance

| **Type** | `() => number` |
| --- | --- |

**Description**

Returns the distance in pixels traveled by `<Scroll.Content>` from its start position.

### getAvailableDistance

| **Type** | `() => number` |
| --- | --- |

**Description**

Returns the distance in pixels that  `<Scroll.Content>` can travel in total, from its start position to its end position.

### scrollTo

| **Type** | `scrollTo: (options: ScrollToOptions) => void` 
where
`ScrollToOptions = {
   progress?: number;
   distance?: number;
   animationSettings?: { skip: "default" | "auto" | boolean };
}` |
| --- | --- |

**Description**

Make  `<Scroll.Content>` travel so it ends up at the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs; if it computes to `true` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, and computes to `false` otherwise.

### scrollBy

| **Type** | `scrollTo: (options: ScrollByOptions) => void` 
where
`ScrollByOptions = {
   progress?: number;
   distance?: number;
   animationSettings?: { skip: "default" | "auto" | boolean };
}` |
| --- | --- |

**Description**

Make  `<Scroll.Content>` travel by the defined `progress` or `distance`.

If the `animationSettings` `skip` key value computes to `false`, then animation occurs; if it computes to `true` the animation is skipped. `"default"` computes to the value provided in the `scrollAnimationSettings` prop on `<Scroll.View>`. `"auto"` computes to `true` when the user has prefers-reduced-motion enabled, and computes to `false` otherwise.