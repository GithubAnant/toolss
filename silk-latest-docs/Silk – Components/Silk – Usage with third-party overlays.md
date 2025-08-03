# Silk – Usage with third-party overlays

Third-party “overlay” components are components that are displayed over the current content, and can implement modality features, such as making all elements outside of their bounds non-interactive.

The Sheet component is designed to work seamlessly with such third-party components. However, depending on how they are implemented, you may have to take some steps to ensure compatibility, especially when the `inertOutside` prop of the `<Sheet.View>` is set to `true`.

# Automatic detection

In most cases, a third-party overlay will work automatically with the Sheet component. In particular, if:

- it is rendered directly inside of the `<Sheet.View>` underlying element; or
- it is appended to the `<body>` element using a React portal; or
- it is rendered inside the `<html>` element.

In these cases, the third-party overlay underlying elements will be considered as part of the frontmost presented Sheet.

# Wrap in `<ExternalOverlay.Root>`

If the third-party overlay renders in other parts of the DOM, or if its modality mechanism is not automatically compatible with the Sheet’s own, you will need to use the `ExternalOverlay` component to ensure compatibility.

## Basic usage

If the third-party overlay is not automatically compatible with the Sheet component, you can wrap it inside of a `<ExternalOverlay.Root>` to signal its presence and make it part of the frontmost presented Sheet.

```tsx
import { Menu } from "third-party-lib";
import { ExternalOverlay } from "@silk-hq/components";

const MyMenu = () => (
	<Menu.Root>
	   <Menu.Portal>
	      <ExternalOverlay.Root asChild>
	         <Menu.Content>
	            ...
	         </Menu.Content>
	      </ExternalOverlay.Root>
	   </Menu.Portal>
	</Menu.Root>
);
```

## Using the `contentGetter` prop

If the third-party overlay is out of reach and you cannot wrap it inside of an `<ExternalOverlay.Root>`, you can use the `contentGetter` prop.

This prop accepts either a CSS selector that will be used to get the first matched element, or a function that returns one element.

### With a CSS selector

```tsx
import { Sheet, ExternalOverlay } from "@silk-hq/components";

const BottomSheet = () => (
	<Sheet.Root>
		<Sheet.Trigger>Open</Sheet.Trigger>
		<Sheet.Portal>
			<Sheet.View>
				<Sheet.Backdrop />
				<Sheet.Content>
					...
					<ExternalOverlay.Root contentGetter=".chat-plugin" />
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
  </Sheet.Root>
);
```

### With a function

```jsx
import { Sheet, ExternalOverlay } from "@silk-hq/components";

const BottomSheet = ({ chatPluginRef }) => (
	<Sheet.Root>
		<Sheet.Trigger>Open</Sheet.Trigger>
		<Sheet.Portal>
			<Sheet.View>
				<Sheet.Backdrop />
				<Sheet.Content>
					...
					<ExternalOverlay.Root contentGetter={() => chatPluginRef.current} />
				</Sheet.Content>
			</Sheet.View>
		</Sheet.Portal>
  </Sheet.Root>
);
```

## Using the `selfManagedInertOutside` prop

Some third-party overlay modality features may conflict with that of the Sheet component.

To avoid any risk of conflict, you can set the `selfManagedInertOutside` to `true` on `<ExternalOverlay.Root>`. This will indicate to the frontmost Sheet that the external overlay has its own inert outside mechanism. As a consequence, the Sheet will disable its own mechanism as soon as `<ExternalOverlay.Root>` child gets rendered.

```tsx
import { Menu } from "third-party-lib";
import { ExternalOverlay } from "@silk-hq/components";

const MyMenu = () => (
	<Menu.Root>
	   <Menu.Portal>
	      <ExternalOverlay.Root selfManagedInertOutside={true} asChild>
	         <Menu.Content>
	            ...
	         </Menu.Content>
	      </ExternalOverlay.Root>
	   </Menu.Portal>
	</Menu.Root>
);
```

## Using the `disabled`  prop for more control

If the external overlay underlying elements are always rendered in the DOM, then the `ExternalOverlay` will always be active and its content considered as part of any presented Sheet.

To avoid this, you can use set the `disabled` prop to `false` when the external overlay is hidden.

```tsx
import { Menu } from "third-party-lib";
import { ExternalOverlay } from "@silk-hq/components";

const MyMenu = () => (
	const [open, setOpen] = useState(false);

	<Menu.Root open={open} onOpenChange={setOpen}>
	   <Menu.Portal>
	      <ExternalOverlay.Root
		      selfManagedInertOutside={true}
		      disabled={!open}
		      asChild
		     >
	         <Menu.Content forceMount={true}>
	            ...
	         </Menu.Content>
	      </ExternalOverlay.Root>
	   </Menu.Portal>
	</Menu.Root>
);
```