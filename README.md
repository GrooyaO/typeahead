# About
This project aims to present simple reusable typeahead component in React.js.

## Setting up
To run the project locally clone it, then install node_modules by running **npm install**, and then run **npm start** to start the project.
To view already working example go to this [website](https://typeahead-2r4shlgaq-grooyao.vercel.app)

#### Component Props
Name | Type | Default | Description
-----|------|---------|------------
delay | number | `300` | Delay, in milliseconds, before search is executed.
isLoading `required` | boolean | false | Value that presents if async operation is in progress.
onSearch `required` | function | | Callback to perform when the search is executed. You handle you async logic here.
placeholder | string | '' | Placeholder for input.
renderListItem | React.JSX.Element |  | Children to pass in order to render suggestion list you get from yor API.
