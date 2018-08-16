import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateFlowService } from 'src/lib/ng-textflow/create-flow.service';
import { NodeComponent } from 'src/lib/ng-textflow/node.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div class="shift">
      <ng-textflow
        [nodeStyles]="nodeStyles"
        [content]="content"
        [firstOnTop]="true"
        [showPageNumbers]="true">
      </ng-textflow>
    </div>
  `,
  styles: [`
    .shift {
      padding: 25px;
      margin: 10px;
      float: left;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private content = `The pain is unbearable! Summoning up all your energy, you open your eyes - first one, then the other. They narrow to slits as they adjust themselves to the strain of trying to see once more, then relax as they make out familiar shapes in the dim light: a dirt floor, rocky walls ... Then the pain takes over. Your head rocks. Your eyes submit and close tightly in an agonized grimace. Instinctively you raise your hands to cup your face, and a low moan mingles with the rasping sound as your rough fingers rub the scaly skin above your eyes. After some time the pain begins to ease. You open your eyes once more and peer out from between your gnarled fingers. You seem to be at the dead end of a passageway. Your surroundings are barely visible, but a dull glow is coming from the northern extent of the passageway, which stretches before you. A sound is also coming from this direction - of irregular breathing. Something alive is up there! You heave your great bulky body to its feet. Along your back, the spines bristle. Swinging your heavy head slowly from side to side, your progress is decided: northwards is the only option open to you. Muscles strain and succeed in raising a lumbering foot, which thuds loudly down on the ground in front of you. You repeat the action, first with one foot, then the other. After four steps the motion has become automatic. You are moving more quickly and more quietly up the passage. When you reach the end, your eyes are drawn to a huddled shape lying on the ground in front of you. The small figure lies on its side, facing away from you. It is shrouded in a dirty brown cape tied around its neck and it lies in a puddle of thick red liquid. Its body rises and falls irregularly with each breath. Some unidentified feeling swells within you. Is it anger? Hate? Fear? Curiosity? Hunger? Or even sympathy? You bend down towards the little creature, uttering a meaningless grunt as you do so. The sound rouses the figure, which rolls slowly over to face you. The creature's dirty face is light skinned, though barely visible under the thick hair which shades its closed eyes and almost totally obscures its mouth. From its chin the hair rolls abundantly down its chest in a grey, unruly mass. Underneath the body, and now exposed by the creature's movement, is a sharp, shiny shaft and this catches your attention. As you stand there staring, the creature's eyes flick open! They focus on your bulky shape and a look of terror streaks across the creature's face. In spite of its pain, it fumbles for and grasps the shiny shaft, holding its pointed end out towards you and baring its teeth. The wounded Dwarf you have found is evidently in need of help.`;
  private nodeStyles = {
    // We must have a fixed size container to create a string of nodes.
    contentStyle: {
      'height': '9em',
      'width': '200px',
      'fontFamily': '"Vollkorn", "serif"',
      'fontSize': '11px',
      'wordSpacing': '2px',
      'textAlign': 'justify',
      'color': '#444',
      'lineHeight': '1.1em',
      'leftAlignLast': 'justified'
    },
    headingStyle: {
      'fontFamily': '"Vollkorn", "serif"',
      'padding-bottom': '2px',
      'font-size': '14px',
      'height': '25px'
    },
    numberStyle: {
      'font-size': '10px',
      'fontFamily': '"Vollkorn", "serif"',
    }
  }; 
  
  constructor( private flowService: CreateFlowService ) { }

  nodesSubscription: Subscription;

  ngOnInit() {
    this.nodesSubscription = this.flowService.nodes.subscribe((nodes: NodeComponent[]) => {
      if (nodes) {
        nodes.forEach(node => {
          node.pageNumberAtTop = false;
        });
        nodes[0].heading = 'Chapter One';
        setTimeout(() => { 
          nodes[0].heading = '';
          setTimeout(() => {
            nodes[0].heading = 'Once Upon A Time';
          }, 1000);
      }, 1000);
      }
    });
  }

  ngOnDestroy() {
    this.nodesSubscription.unsubscribe();
  }

}
