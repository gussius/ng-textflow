import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <ng-textflow
        [nodeStyles]="nodeStyles"
        [content]="content"
        [firstOnTop] = "true">
      </ng-textflow>
    </div>
  `,
  styles: [`
    .flow-container {
      display: block;
      position: absolute;
      height: 375px;
      width: 680px;
      left: 100px;
      top: 250px;
      border: 1px dashed red;
      background-color: darkslategrey;
      overflow: hidden;
      line-height: 16px;
    }
  `]
})
export class AppComponent {
  // Some content to test the component.
  private content = `The pain is unbearable! Summoning up all your energy, you open your eyes - first one, then the other. They narrow to slits as they adjust themselves to the strain of trying to see once more, then relax as they make out familiar shapes in the dim light: a dirt floor, rocky walls ... Then the pain takes over. Your head rocks. Your eyes submit and close tightly in an agonized grimace. Instinctively you raise your hands to cup your face, and a low moan mingles with the rasping sound as your rough fingers rub the scaly skin above your eyes. After some time the pain begins to ease. You open your eyes once more and peer out from between your gnarled fingers. You seem to be at the dead end of a passageway. Your surroundings are barely visible. You sit down between the three Hobbits, licking your lips as you remember the tender taste of their flesh. Grabbing the nearest one, you sink your teeth ravenously into its meaty rump and let out a soft, low growl of contentment.`;
  private nodeStyles = {
    // We must have a fixed size container to create a string of nodes.
    height: 'calc(9 * 16px)',
    width: '330px',
    borderRadius: '3px',
    // Uncomment these to overlay all nodes on top of each other.
    // position: 'absolute',
    // left: '10px',
    // top: '20px',
    backgroundColor: 'rgba(250, 250, 250, 0.6)',
    margin: '20px',
    fontFamily: '"DroidSerif", "Times", serif',
    fontSize: '12px',
    wordSpacing: '3px',
    textAlign: 'justify',
    color: '#444',
    lineHeight: '16px',
    overflow: 'hidden',
    leftAlignLast: 'justified',
    visibility: 'hidden'
  };

  

}
