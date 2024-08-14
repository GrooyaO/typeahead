# About
Simple reusable typeahead component in React.js.

## Setting up
To run the project locally clone it, then install node_modules by running **npm install**, and then run **npm start** to start the project.

#### Component Props
Name | Type | Default | Description
-----|------|---------|------------
delay | number | `300` | Delay, in milliseconds, before search is executed.
isLoading `required` | boolean | false | Value that presents if async operation is in progress.
onSearch `required` | function | | Callback to perform when the search is executed. You handle you async logic here.
placeholder | string | '' | Placeholder for input.
renderListItem `required` | React.JSX.Element |  | A function that takes an option and returns a React node that represents the option in the suggestion list.
labelKey       `required` | string            | '' | A string used for filtering of selected options.    
onSelectItem              | function          |    | Do something once you select option from typeahead component.
onDeleteItem              | function          |    | Do something once you delete option from typeahead component.
mulitple                  | boolean           |  false | Boolean that opens possibility to select mulitple options from typeahead component.

### Improvements to be made
- Make component support multiple data types.
- Improve accessibility an responsivness.
- Make it more modular, not just async.
- Change caching approach and add caching to be optional.
- Add error handling.
- Split state to its respecive components.
- If it gets more complex introduce context for prop delegation.
- Add more tests. Create tests for all components.
