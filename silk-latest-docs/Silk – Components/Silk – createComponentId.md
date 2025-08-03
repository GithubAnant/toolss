# Silk – createComponentId

# Description

A function that returns a `ComponentId` which identifies a component instance when passed to its Root sub-component `componentId` prop. It can then be passed to the `forComponent` prop of other sub-components to associates them to the same component instance.

This allows to disambiguate the association of a sub-component that is the descendant of several nested Root sub-components.

**Notes**

- `componentId` must always be passed to the Root sub-component of the component instance that is to be identified.
- Only sub-components or components positioned inside of the Root sub-component bearing the `componentId` in the virtual DOM can be linked to it.
- To avoid any HMR issue `createComponentId` must always be called outside of component functions or classes, inside of a file dedicated to component ids and/or React contexts.
- createComponentId is short for “create component instance id”.

**Example**

```tsx
const loginSheetId = createComponentId();
```

```tsx
<Sheet.Root componentId={loginSheetId}>
	...
	<Sheet.Root>
		...
		<Sheet.Trigger forComponent={loginSheetId} />
		...
	</Sheet.Root>
	...
</Sheet.Root>
```