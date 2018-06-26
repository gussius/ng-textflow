# NgTextflow
A small angular component to dynamically create a set of fixed size text nodes based on the input content text.  


## Usage
The component requires a styles object which should define a fixed size container. This style is applied to all of the dynamically create nodes. When the content text will not fit in the defined container, NgTextflow will dynamically create new nodes and contine to fill them with text until all the content is displayed. 
```html
<ng-textflow
	[nodeStyles]="nodeStyles"
	[content]="content">
</ng-textflow>
```
### Component Inputs
| attribute | required | type | example |
|--|--|--|--|
| nodeStyles | required | any | ```nodeStyles: any = {height: '150px', width: '360px'}``` |
| content | required | string | ```content: string = "Lot's of text here.."```|
| firstOnTop | optional | boolean | defines order of nodes by changing z-index of each  node


