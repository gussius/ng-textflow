import { 
  Injectable,
  Injector,
  ComponentFactoryResolver,
  ComponentFactory,
  ViewContainerRef,
  ComponentRef } from '@angular/core';
import { NodeComponent } from './node.component';

@Injectable({
  providedIn: 'root'
})
export class CreateFlowService {
  private nodeList: NodeComponent[] = new Array<NodeComponent>();
  private nodeFactory: ComponentFactory<NodeComponent>;
  firstOnTop: boolean = true;

  constructor(private injector: Injector, private resolver: ComponentFactoryResolver) {
    this.nodeFactory = this.resolver.resolveComponentFactory(NodeComponent);
  } 

  createFlow(textPassage: string, location: ViewContainerRef, style: any) {
    let node: NodeComponent = this.createNode(textPassage, location, style);
    node.overflow.subscribe(overflowText => {
      if (overflowText) {
        this.createFlow(overflowText, location, style);
      }
    })
  }

  private createNode(content: string, location?: ViewContainerRef, style?: any): NodeComponent {
    let nodeRef: ComponentRef<NodeComponent>;

    if (location || location instanceof ViewContainerRef) {
      nodeRef = location.createComponent(this.nodeFactory, undefined, this.injector);
    } else {
      nodeRef = this.nodeFactory.create(this.injector);
    }
    if (style) {
      nodeRef.instance.applyStyle(style);
    }

    // Add node to list of nodes and update its index value.
    this.nodeList.push(nodeRef.instance);
    nodeRef.instance.index = this.firstOnTop ? 100-this.nodeList.length : this.nodeList.length;
    nodeRef.instance.text = content;

    // Get back an observable to the overflow text.
    return nodeRef.instance;
  }
}
