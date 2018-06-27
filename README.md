
# NgTextflow
A small angular component to dynamically create a set of fixed size text nodes based on the input content text.  


## Usage
The component requires a styles object which should define a fixed size container. This style is applied to all of the dynamically create nodes. When the content text will not fit in the defined container, NgTextflow will dynamically create new nodes and contine to fill them with text until all the content is displayed. 

The image below shows an example of the generated nodes. The nodes on the left have simple inline styling with fixed width and height. The nodes on the right have the same content, but are styled to overlay on top of each other. This can be useful for page-flip applications.

<p align="center">
<img src="https://www.dropbox.com/s/l08nm2udv2q9en1/ng-textflow_nodes_2.png?raw=1" alt="text nodes example" align="center" width="600px"/>
</p>

The style object can be passed in, as below, to achieve the appearance of the nodes on the left.

```js
private  nodeStyles = {
	height:  '8em',
	width:  '200px',
	fontSize:  '11px',
	lineHeight:  '1.1em',
	margin:  '25px',
	fontFamily:  '"Vollkorn", "serif"',
	wordSpacing:  '3px',
	textAlign:  'justify',
	leftAlignLast:  'justified'
	color: '#444',
};
```

The following example shows the use of the component where style object and text content is passed in.
```html
<ng-textflow
	[nodeStyles]="nodeStyles"
	[content]="content">
</ng-textflow>
```
### Component Inputs
| input | required | type | note |
|--|--|--|--|
| nodeStyles | required | any | See example ```nodeStyles``` above. |
| content | required | string | ```content: string = "Lot's of text here.."```|
| firstOnTop | optional | boolean | Defines order of nodes by changing z-index of each  node as they are generated.

## How it works
A service is used to create the nodes. The service puts the text into a dummy node. The actual height of the dummy node in the DOM is compared with the height of the node. The node component estimates the amount to trim off, then fine tunes the number of words until the dummy node size matches the node size. An *overflow* Observable is pushed prompting the service to create the next node. The following animation is a slowed down debug version to show the process steps.

<p align="center">
<img src="https://www.dropbox.com/s/0u3946opqs9rjlc/NgTextflow-example.gif?raw=1" alt="gif example of process" align="center" width="350px"/>
</p>
