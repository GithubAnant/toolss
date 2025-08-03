# Silk – Implementing a controlled sheet

Silk’s components are designed to be used declaratively first, ensuring ease of use and automatic accessibility handling. If you want your Sheet component to react to button clicks, we recommend you do it with the `<Sheet.Trigger>` sub-component.

Sometimes you do need to control your sheet programmatically though, like when responding to an async operation, a URL change, or simply a different event than the `<Sheet.Trigger>` `press` event. For such scenarios, Silk allows you to use a Sheet as a controlled component.

A Sheet has two pairs of props allowing you to control internal state: the `presented` and `onPresentedChange` props, and the `activeDetent` and `onActiveDetentChange` props.

## The `presented` and `onPresentedChange` props

This pair of props allows you to present and dismiss a Sheet programmatically.

When setting  `presented` to `true`, it will present the sheet, when setting it to `false`, it will dismiss it. You also need to pass a function allowing to update the value to `onPresentedChange`,  so it can be updated by the component itself as a result of a user interactions—like dismissing the Sheet with a swipe, or pressing the escape key.

```jsx
import { useState } from "react";
import { Sheet } from "@silk-hq/components";

export default function ControlledSheet() {
  const [presented, setPresented] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPresented(true);
    }, 3000); // Presents the Sheet after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Sheet.Root presented={presented} onPresentedChange={setPresented}>
      <Sheet.Portal>
        <Sheet.View>
          <Sheet.Backdrop />
          <Sheet.Content>
            <Sheet.Title>Controlled Sheet</Sheet.Title>
            <Sheet.Description>This Sheet is controlled by state.</Sheet.Description>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}
```

These props come with some limitations at the moment. Read more about the `presented` and `onPresentedChange` props on the [Sheet documentation page](Silk%20%E2%80%93%20Sheet.md).

## The `activeDetent` and `onActiveDetent` props

This pair of props allows you to set the index of the detent the Sheet rests on programmatically.

Detent are numbered from `0` to `n`, where `0` is the index of the detent the Sheet is resting on when it is fully outside of the view, and `n` the index of the detent the Sheet is resting on when it is fully expanded inside of the view. When you add one intermediary detent to your sheet using the [`detents`](Silk%20%E2%80%93%20Sheet.md) prop on the `<Sheet.View>` sub-component, this detent has the index `1`, and the last detent the index `2`.

When setting the value of `activeDetent` to the index of a detent, the Sheet will step to that detent, and rest on it. You also need to pass a function allowing to update the value to `onActiveDetent`, so it can be updated by the component itself as a result of a user interaction—like a swipe, or using a `<Sheet.Trigger>`.

```jsx
import { useState } from "react";
import { Sheet } from "@silk-hq/components";

export default function ControlledDetentSheet() {
  const [activeDetent, setActiveDetent] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveDetent(2);
    }, 3000); // Steps to the last detent after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Sheet.Root activeDetent={activeDetent} onActiveDetentChange={setActiveDetent}>
      <Sheet.Portal>
        <Sheet.View detents="60lvh">
          <Sheet.Backdrop />
          <Sheet.Content>
            <Sheet.Title>Controlled Detent Sheet</Sheet.Title>
            <Sheet.Description>This sheet active detent is controlled by state.</Sheet.Description>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}
```

These props come with some limitations at the moment. Read more about the `activeDetent` and `onActiveDetentChange` props on the [Sheet documentation page](Silk%20%E2%80%93%20Sheet.md).