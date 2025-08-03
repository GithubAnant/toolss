# Silk Bottom Sheet Implementation Research

## Overview
Silk is a UI component library that provides advanced swipeable modal and non-modal overlays, including bottom sheets. The library requires a commercial license for commercial use.

## Key Components

### 1. Sheet Component Structure
The Sheet component uses a compound component architecture with these main sub-components:
- `Sheet.Root` - Container for all Sheet components
- `Sheet.Trigger` - Button to open/close the sheet
- `Sheet.Portal` - Renders content in a portal (usually document.body)
- `Sheet.View` - The view container for the sheet
- `Sheet.Backdrop` - Dimmed background overlay
- `Sheet.Content` - The actual content container
- `Sheet.BleedingBackground` - Background that extends during swipe
- `Sheet.Handle` - Visual handle for dragging

### 2. Installation
```bash
pnpm install @silk-hq/components
```

### 3. Import Styles
Import the required styles in the main CSS or JS file:
```css
@import "@silk-hq/components/unlayered-styles";
```
or
```js
import "@silk-hq/components/unlayered-styles";
```

### 4. Basic Implementation Pattern
From the examples, a typical bottom sheet structure:

```tsx
<Sheet.Root license="commercial">
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.View nativeEdgeSwipePrevention={true}>
      <Sheet.Backdrop themeColorDimming="auto" />
      <Sheet.Content>
        <Sheet.BleedingBackground />
        <Sheet.Handle />
        {/* Content goes here */}
      </Sheet.Content>
    </Sheet.View>
  </Sheet.Portal>
</Sheet.Root>
```

## Key Props and Features

### Sheet.Root
- `license`: Required prop, must be "commercial" or "non-commercial"
- `defaultPresented`: Boolean to control initial state
- `presented`/`onPresentedChange`: For controlled state

### Sheet.View
- `nativeEdgeSwipePrevention`: Prevents iOS swipe-back gesture
- `contentPlacement`: "top", "bottom", "left", "right", "center" (default: "bottom")
- `swipeDismissal`: Boolean to enable swipe-to-dismiss
- `inertOutside`: Boolean to make it modal (default: true)
- `enteringAnimationSettings`: Animation presets like "gentle", "smooth", "snappy", "bouncy"

### Sheet.Backdrop
- `themeColorDimming`: "auto" or false - dims the theme-color meta tag
- Has default opacity animation based on travel progress

### Sheet.Content
- Position determined by `contentPlacement` on View
- Can have `travelAnimation` and `stackingAnimation` props

## Styling Notes from Examples

### BottomSheet.css Key Styles:
```css
.BottomSheet-view {
  z-index: 1;
  height: calc(var(--silk-100-lvh-dvh-pct) + 60px); /* Extra height for iOS Safari */
}

.BottomSheet-content {
  box-sizing: border-box;
  height: auto;
  min-height: 100px;
}

.BottomSheet-bleedingBackground {
  border-radius: 24px;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.BottomSheet-handle {
  width: 50px;
  height: 6px;
  border-radius: 9999px;
  background-color: rgb(209, 213, 219);
  cursor: pointer;
}
```

## Implementation Plan for iconly Project

### For Learn More Button:
1. Create a bottom sheet showing project information
2. Include description, features, technical details
3. Add links to documentation/GitHub

### For Donate Button:
1. Create a bottom sheet with donation options
2. Include payment methods or links
3. Add thank you message

### Key Considerations:
1. Must install @silk-hq/components package
2. Import styles in main entry point
3. Use "commercial" license prop
4. Match the 300px width constraint for mobile UI
5. Implement smooth animations and proper backdrop
6. Handle safe area insets for mobile devices

## Animation Properties
Silk supports various animation presets:
- "gentle": Smooth and subtle
- "smooth": Default, balanced
- "snappy": Quick and responsive
- "brisk": Fast with minimal bounce
- "bouncy": Playful with bounce effect
- "elastic": Spring-like motion

## Travel and Stacking Animations
Can animate any CSS property based on sheet travel progress:
- Keyframe array syntax: `[startValue, endValue]`
- Function syntax: `({ progress }) => value`
- Progress goes from 0 (closed) to 1 (fully open)