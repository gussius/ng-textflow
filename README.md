

# NgTextflow
A small angular component to dynamically create a set of fixed size text nodes based on the input content text.  

## Installation
```bash
$ npm install --save ng-textflow
```
Then we import the module.
```ts
import { NgTextflowModule } from 'ng-textflow';
```
and we can use NodeComponent and CreateFlowService in our code.
```ts
import { NodeComponent, CreateFlowService } from 'ng-textflow';
```

## Usage
The component requires a styles object which should define a fixed size container. This style is applied to all of the dynamically create nodes. When the content text will not fit in the defined container, NgTextflow will dynamically create new nodes and continue to fill them with text until all the content is displayed. 

The image below shows an example of the generated nodes. The nodes on the left have simple inline styling with fixed width and height. The nodes on the right have the same content, but are overlay on top of each other using the `[isOverlaid]` input. This can be useful for page-flip applications.

<p align="center">
	<img src="https://drive.google.com/uc?export=download&id=1FdTWKkIPX5hKJIzciesJrhBgcPbKaywK" alt="text nodes example" align="center" width="600px"/>
</p>

The style object can be passed in, as below, to achieve the appearance of the nodes on the left. The style object must have the three elements, `contentStyle`, `headingStyle`, and `numberStyle`.

```js
private  nodeStyles  = {
	contentStyle: {
		'height':  '9em',
		'width':  '200px',
		'fontFamily':  '"Vollkorn", "serif"',
		'fontSize':  '11px',
		'wordSpacing':  '2px',
		'textAlign':  'justify',
		'color':  '#444',
		'lineHeight':  '1.1em',
		'leftAlignLast':  'justified'
	},
	headingStyle: {
		'fontFamily':  '"Vollkorn", "serif"',
		'padding-bottom':  '2px',
		'font-size':  '14px',
		'height':  '25px'
	},
	numberStyle: {
		'font-size':  '10px',
		'fontFamily':  '"Vollkorn", "serif"',
	}
};
```

The following example shows the use of the component where style object and text content is passed in.
```html
<ng-textflow
	[nodeStyles]="nodeStyles"
	[content]="content"
	[firstOnTop]="true"
	[showPageNumbers]="true"
	[isOverlaid]="true">
</ng-textflow>
```
### Component Inputs
| input | required | type | note |
|--|--|--|--|
| nodeStyles | required | any | See example ```nodeStyles``` above. |
| content | required | string | ```content: string = "Lot's of text here.."```|
| firstOnTop | optional | boolean | Defines order of nodes by changing z-index of each  node as they are generated.
| showPageNumbers | optional | boolean | Displays the page number below or above the content area. `NodeComponent.pageNumberAtTop` is exposed to change the positioning of the number. |
| isOverlaid | optional | boolean | Changes the css positioning of the nodes so that they overlap over each other. |

## NodeComponent members
These members are for each generated node. An array of these can be retrieved from the `CreateFlowService.nodes:  Observable<NodeComponent[]>`.

### methods
`applyStyle(style:  any)`
Used in CreateFlowService to update the styles when generating a new node.

### properties
`heading: string`
The actual text of the heading for a specific node. When the headings for all nodes are empty, then the heading is hidden to preserve formating.

`index`
The unique identifier for each node, also serves as the z-index value for when nodes are overlaid.

`isOverlaid`
If true then all the nodes are overlaid on top of each other.

`isVisible`
Hides or shows the particular node.

`overflow: Observable<string>`
The overflow text is streamed here when there is too much text for the last node, here is where the next node generation is initiated.

`pageNumber: number`
The value of the page number displayed below or above the node.

`pageNumberAtTop: boolean`
Defines where the page number is displayed in the node.

`showHeading: boolean`
Defines the visibility of the heading of a particular node.

`showPageNumber: boolean`
Defines the visibility of the page numbers for a particular node.

`text: string`
The actual text content of the node.

`width: number`
The width of the masking element of the node. When this width is changed then the node content, headings, and numbers, are obscured from the left to the right.


## How it works
A service is used to create the nodes. The service puts the text into a dummy node. The actual height of the dummy node in the DOM is compared with the height of the node. The node component estimates the amount to trim off, then fine tunes the number of words until the dummy node size matches the node size. An *overflow* Observable is pushed prompting the service to create the next node. The following animation is a slowed down debug version to show the process steps.

<p align="center">
	<img src="https://drive.google.com/uc?export=download&id=1-d_EtT6OvzL1wImKDLXdi9uy7tNJ6Cjq" alt="gif example of process" align="center" width="300px"/>
</p>
