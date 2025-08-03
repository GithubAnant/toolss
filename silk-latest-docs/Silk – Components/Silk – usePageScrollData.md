# Silk – usePageScrollData

# Description

A hook which returns an object with two keys: `{ pageScrollContainer, nativePageScrollReplaced }`. On page load, both values are `undefined`. After hydration, if native page scroll is currently replaced by a scroll container as a result of the action of the [`nativePageScrollReplacement` prop on `<Scroll.View>`](Silk%20%E2%80%93%20Scroll.md), `nativePageScrollReplaced` is `true` and `pageScrollContainer` contains the element used as page scroll container instead. Otherwise, `nativePageScrollReplaced` is `false` and `pageScrollContainer` contains `document.body`

This is useful to adapt the logic, styling or animations of certain components and elements in one case or the other.

# Usage

**Example**

```tsx
import { Sheet, usePageScrollData } from "@silk-hq/components";

const MySheetOutlet = () => {
	const { nativePageScrollReplaced } = usePageScrollData();
	
	return (
		<Sheet.Outlet
			travelAnimation={
				nativePageScrollReplaced
					? {
		          borderRadius: ["0px", "20px"],
              transformOrigin: "50% 0",
	          }
          : {
	            clipBoundary: "layout-viewport",
	            clipBorderRadius: ["0px", "20px"],
	            clipTransformOrigin: "50% 0",
		        }
			}
		/>
	)
}
```

```tsx
import { Sheet, usePageScrollData } from "@silk-hq/components";
import { useScroll } from "framer-motion";

const MyComponent = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { pageScrollContainer, nativePageScrollReplaced } = usePageScrollData();

	const { scrollYProgress } = useScroll({
		container: nativePageScrollReplaced ? { current: pageScrollContainer } : undefined,
	  target: ref,
	  offset: ["start end", "end end"],
	});
}
```