# Silk – Composition

Silk components are made up of several sub-components, most of which render one or several underlying elements. Silk allows to easily substitute those underlying elements with your own elements or React components.

## asChild

The `asChild` prop is available on all sub-components rendering an underlying elements. 

When it is present (i.e. set to `true`) the sub-component expects exactly one child (with any number of descendants). It can be either an element, or a React component rendering one element, and will be used in lieu of the default underlying element.

When in use, the element normally rendered by the sub-component will not be rendered. Instead, the element received as child will be used, and it will automatically receive the HTML attributes required for the proper functioning of the Silk sub-component.

### Usage with an element

When used with an element, all you need to do is set the `asChild` prop on the Silk sub-component, and pass the element as child of this sub-component.

```tsx
<Sheet.Trigger asChild>
	<a href="/my-page">Open the sheet</a>
</Sheet.Trigger>
```

### Usage with a React component

When used with a React component, the process is similar, but it requires an additional step. First, you need the React component to accept props and spread them onto the underlying element.

```tsx
// MyButton.tsx

const MyButton = (props) => <button {...props} />;
```

- **Usage with React 18 or earlier**
    
    If you’re using React 18 or earlier, the React component must also accept a ref that you also have to pass to the underlying element, as well as use forwardRef so your component properly forwards the ref.
    
    ```tsx
    // MyButton.tsx
    
    const MyButton = React.forwardRef((props, forwardedRef) =>
    	<button ref={forwardedRef} {...props} />
    );
    ```
    
    **Note:** Read more about React.forwardRef in [React’s documentation](https://react.dev/reference/react/forwardRef).
    

Then, you can to set the `asChild` prop on the Silk sub-component, and pass the React component as child of this sub-component.

```tsx
// Usage

<Sheet.Trigger asChild>
	<MyButton>Open the sheet</MyButton>
</Sheet.Trigger>
```

### Nested asChild

It is possible to nest several Silk sub-components using `asChild`, as long as it ends up containing a single element that will receive the props and refs of all the nested sub-components.

```tsx
// Sheet.Content, Scroll.Root and Scroll.View will only render one element

...
	<Sheet.Content asChild>
		<Scroll.Root asChild>
			<Scroll.View>
				<Scroll.Content>
					...
				</Scroll.Content>
			</Scroll.View>
		</Scroll.Root>
	</Sheet.Content>
...
```

## Acknowledgment

Silk `asChild` prop is similar to [Radix’s](https://www.radix-ui.com/primitives/docs/guides/composition) and uses most of the same code. We thank the Radix team for introducing this pattern to the React ecosystem.