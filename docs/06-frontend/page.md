---
sidebar_position: 1
---

# Adding a Page

## The internal/ui folder

Frontend pages are located in the `/internal/ui/pages` folder. Pages are written in [templ](https://templ.guide).

```
root
|--internal
|  |--ui
|     |--components     // shared components
|     |--pages          // frontend pages
|     |--index.templ    // the app's main template page
```

:::tip
The pages folder structure should mirror the structure of your website.
:::

:::tip
Keep handlers in the same folder as their and pages (close together).
:::

## Example

Lets continue the simple todo list app (mytodo) we started in backend. The design of mytodo frontend has a lists page showing all the todo lists and their items.

### Display todo lists

Lets start by creating a `/internal/ui/pages/lists` folder.

```
mytodo
|--internal
|  |--ui
|     |--pages
|        |--lists
```

Create a `/internal/ui/pages/lists/index.templ` file. The page will take a slice of todo lists and render them. The page also contains a component _List_ that takes a single list and renders that list.

```templ
package lists

import l "github.com/myorg/mytodo/internal/app/list"

templ IndexPage(lists []l.List) {
	<main class="flex w-full flex-col">
		for _, list := range lists {
			<h2 class="text-2xl font-extrabold">{ list.Name }</h2>
			<div class="flex flex-col gap-y-2">
				@List(list)
			</div>
		}
	</main>
}

templ List(list l.List) {
	<ul>
		for _, item := range list.Items {
			<li>{ item }</li>
		}
	</ul>
}
```

### Adding interactivity

Lets include a form and buttons to add todo lists and items.

For the index page lets add an input field and button to capture the name of a new todo list and it post to the `"/list"` end point.

```templ
templ IndexPage(lists []l.List) {
	<main class="flex w-full flex-col">
		for _, list := range lists {
			<h2 class="text-2xl font-extrabold">{ list.Name }</h2>
			<div class="flex flex-col gap-y-2">
				@List(list)
			</div>
		}
		<input id="todo-list-name" name="todo-list-name"/>
		<button
			type="submit"
			hx-post="/list"
			hx-include="#todo-list-name"
			hx-target="main"
		>
			Add List
		</button>
	</main>
}
```

:::info
The `hx-post="/list"` attribute uses htmx to make a POST request to the `"/list"` end point and include the `todo-list-name` input element.

The `hx-target="main"` will cause the response from this endpoint will replace the contents of the `main` element.
:::

:::tip
If you are using the Gofs VSCode extension, you can hover over `"/link"` and navigate to the `routes.go` entry or the handler.
:::

Lets wrap the _List_ component in a form that posts to the `"/list/{id}"` end point. Add an input field to capture the list item to add, a hidden field with the _list.ID_, and a submit button.

```templ
templ List(list l.List) {
	<form hx-post={ "/list/" + list.ID } hx-swap="outerHTML">
		<ul>
			for _, item := range list.Items {
				<li>{ item }</li>
			}
		</ul>
		<input name="todo-list-item"/>
		<input type="hidden" name="list-id" value={ list.ID }/>
		<button type="submit">
			Add Item
		</button>
	</form>
}
```

:::info
The `hx-post={ "/list/" + list.ID }` attribute uses htmx to make a POST request to the `"/list/{id}"` end point.

The response from this endpoint will swap the `form` element in its entirety.
:::

:::warning
When forming links, use one of the following methods:

- literals such as `"/link"`
- literals with operations such as `{ "/link/" + id }`
- format statement such as `{ fmt.Sprintf("/link/%s", id) }`

Mixing these methods is less readable and will generate a warning if you are using the Gofs VSCode extension.
:::
