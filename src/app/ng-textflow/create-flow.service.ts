import { Injectable, Injector, ComponentFactoryResolver,
         ComponentFactory, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';
import { NodeComponent } from './node.component';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';

@Injectable()
export class CreateFlowService implements OnDestroy {
  private nodeList: NodeComponent[] = new Array<NodeComponent>();
  private nodeFactory: ComponentFactory<NodeComponent>;
  firstOnTop: boolean = true;

  // Subscriptions
  private finishedSubscription: Subscription; // For when the nodes are complete.
  private headingChangedSubscription: Subscription; // For when the heading is externally changed.
  private overFlowSubscriptions: Subscription[] = []; // During generation of nodes, fires when there are more nodes to generate.

  // Provide an array of nodes once the generation is complete.
  private nodesSubject: Subject<NodeComponent[]> = new BehaviorSubject<NodeComponent[]>(null);
  nodes: Observable<NodeComponent[]> = this.nodesSubject as Observable<NodeComponent[]>;


  constructor(private injector: Injector, private resolver: ComponentFactoryResolver) {
    this.nodeFactory = this.resolver.resolveComponentFactory(NodeComponent);
    
    // When all nodes are finished generating, do some housework.
    this.finishedSubscription =  NodeComponent.finished.subscribe(() => {
      this.nodeList.forEach(node =>  node.isVisible = true); // Make all visible once complete.

      // If headings are modified externally, then update sibling nodes to maintain consistent formating.
      this.headingChangedSubscription = NodeComponent.headingChanged.subscribe(() => {
        // Loop once to see if all are empty.
        let count = 0;
        this.nodeList.forEach(node => { 
          count = node.heading <= ' ' ? count + 1 : count - 1;
        });

        // Loop again to update the visibility of the headings.
        this.nodeList.forEach(node => {
          node.showHeading = count === this.nodeList.length ? false : true;
        });
      });

      // Make list of nodes available once all are complete.
      this.nodesSubject.next(this.nodeList);
      this.nodesSubject.complete();
    });
  } 

  // This will kick off a process that generates a node every time a generated node is too full and overflows with text.
  createFlow(textPassage: string, 
             location: ViewContainerRef, 
             style: any, 
             showPageNumbers: boolean, 
             isOverlaid: boolean) {

    let node: NodeComponent = this.createNode(textPassage, location, style, showPageNumbers, isOverlaid);
    
    // Create a new node if there is any overflow text from last node generated.
    // Last node will know when it is the last one, and will 
    this.overFlowSubscriptions.push(node.overflow.subscribe(overflowText => {
      if (overflowText) {
        this.createFlow(overflowText, location, style, showPageNumbers, isOverlaid);
      }
    }));
  }

  private createNode(content: string,
                     location?: ViewContainerRef, 
                     style?: any, showPageNumbers?: 
                     boolean, isOverlaid?: boolean): NodeComponent {
                       
    // Generate the node with the nodeFactory.
    let nodeRef: ComponentRef<NodeComponent>;
    if (location || location instanceof ViewContainerRef) {
      nodeRef = location.createComponent(this.nodeFactory, undefined, this.injector);
    } else {
      nodeRef = this.nodeFactory.create(this.injector);
    }
    
    // Update the node
    nodeRef.instance.isOverlaid = isOverlaid;
    nodeRef.instance.showPageNumber = showPageNumbers;
    nodeRef.instance.text = content;
    if (style) {
      nodeRef.instance.applyStyle(style);
    }
    
    // Add node to list of nodes and update its index value.
    this.nodeList.push(nodeRef.instance);
    nodeRef.instance.index = this.firstOnTop ? 100-this.nodeList.length : this.nodeList.length;

    return nodeRef.instance;
  }

  // Tidy up subscriptions.
  ngOnDestroy() {
    this.finishedSubscription.unsubscribe();
    this.headingChangedSubscription.unsubscribe();
    this.overFlowSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
