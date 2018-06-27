import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-node',
  template: `
    <div #textref [ngStyle]="nodeStyle" class="content">
      {{text}}
      <div #dummy class="dummy" >{{ dummyText }}</div>
    </div>
`,
  styles: [`
    .content {
      position: relative;
      text-align-last: justify;
    }
    .dummy {
      position: absolute;
      background-color: rgba(155, 255, 155, 0.4);
      left: 0px;
      top: 0px;
      visibility: hidden;
    }
  `]
})
export class NodeComponent implements OnInit {
  @ViewChild('textref') private textDivRef: ElementRef;
  @ViewChild('dummy') private dummyDivRef: ElementRef;
  
  text: string;
  private changes: MutationObserver;

  private _index: number;  
  nodeStyle: any = {};
  isVisible: boolean = false;

  // FLAGS
  private trimming: boolean = false;
  private adding: boolean = false;
  private finishing: boolean = false;

  // Overflow Subject.
  private overflowSubject: Subject<string> = new Subject();
  overflow: Observable<string> = this.overflowSubject as Observable<string>;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { };
  
  ngOnInit() {
    this.dummyText = this.text;
    this.changes = new MutationObserver((mutations: MutationRecord[]) => this.manageState());
    this.changes.observe(this.dummyDivRef.nativeElement, { attributes: true, childList: true, characterData: true });

    // Wait 100ms for DOM to stabilise before testing elements.
    this.trimming = true;
    setTimeout(() => { // Wait till index is resolved.
      if (this.index >= 99) {
        setTimeout(() => this.manageState(), 200);
      } else {
        this.manageState()
      }
    })
  }

  get dummyText(): string {
    return this.dummyDivRef.nativeElement.textContent;
  }
  set dummyText(content: string) {
    this.dummyDivRef.nativeElement.textContent = content;
  }

  get dummyWordCount(): number {
    return this.dummyText.split(' ').length;
  }

  get index(): number {
    return this._index;
  }

  set index(index: number) {
    setTimeout(() => {
      this._index = Math.abs(index);
      this.renderer.setStyle(this.textDivRef.nativeElement, 'z-index', index); 
    });
  }

  
  applyStyle(style: any) {
    this.nodeStyle = style;
    this.nodeStyle.visibility = 'hidden';
    this.nodeStyle.overflow = 'hidden';
  }

  parseLineHeight(): number {
    let fontSize: string = this.textDivRef.nativeElement.style.fontSize;
    let fontSizeValue: number = parseInt(fontSize.slice(0, -2));
    let lineHeight: string = this.textDivRef.nativeElement.style.lineHeight;
    let suffix: string = lineHeight.slice(-2);
    let lineHeightValue: number = parseInt(lineHeight.slice(0, -2));
    
    switch(suffix) { 
      case "px":
        return lineHeightValue; 
        break; 
      case "em":
        return fontSizeValue; 
        break; 
      default:
        return lineHeightValue; 
        break;
    }
  }
  
  private compareDivs(): { 'lines': number, 'diffLines': number, 'words': number } {
    let lineHeight = this.parseLineHeight();
    let dummyLines = Math.floor(this.dummyDivRef.nativeElement.clientHeight / lineHeight);
    let contentLines = Math.floor(this.textDivRef.nativeElement.clientHeight / lineHeight);
    let dummyTextWordCount = this.dummyText.split(' ').length;

    return {
      'lines': dummyLines,
      'diffLines': dummyLines - contentLines,
      'words': dummyTextWordCount
    };
  }

  // ------------------ Trim loop test. ------------------
  private count: number = 100;

  private manageState() {
    // console.log('manageState()..');
    // Protect against infinite loop.
    if (this.count-- <= 0 ) {
      this.trimming = false;
      this.adding = false;
      this.finishing = false;
      console.log('ERROR - loop count > 100');
    }

    if (this.trimming) {
      // setTimeout(() => this.trim(), 1000);
      this.trim();
    } else if (this.adding) {
      // setTimeout(() => this.addword(), 1000);
      this.addword();
    } else if (this.finishing) {
      // setTimeout(() => this.finish(), 1000);
      this.finish();
    }
  }

  private trim() {
    // console.log('trimming words.');
    let comps = this.compareDivs();
    // console.log('trimming:', comps);
    let wordsToRemove = Math.floor(comps.words/comps.lines) * (comps.diffLines + 1);
    if (wordsToRemove > 0) {
      // console.log(`removing ${wordsToRemove} words.`); 
      this.dummyText = this.dummyText.split(' ').slice(0, comps.words - wordsToRemove).join(' ');
    } else {
      // console.log('finished trimming');
      this.trimming = false;
      this.adding = true;
      this.addword();
    }
  }

  private addword() {
    // console.log('appending text.');
    let comps = this.compareDivs();
    // console.log('appending:', comps);

    if (comps.diffLines <= -1) {
      if (this.dummyText.length < this.text.length) {
        this.dummyText = this.dummyText + ' ' + this.text.split(' ')[comps.words];
      } else {
        // This is the last node.
        this.renderer.setStyle(this.textDivRef.nativeElement, 'textAlignLast', 'left');
        this.nodeStyle.visibility = 'visible';

      }
    } else {
      // Take off the last word again.
      this.dummyText = this.dummyText.split(' ').slice(0, comps.words - 1).join(' ');
      this.adding = false;
      this.finishing = true;        
    }
  }
  

  private finish() {
    // console.log('Finishing up.');
    let comps = this.compareDivs();
  
    let lastword: string[] = this.dummyText.split(' ');
    // console.log('last word in dummy: ', lastword[lastword.length-1]);
    
    let overflowArray = this.text.split(' ');
    let overflow = overflowArray.slice(this.dummyText.split(' ').length).join(' ');

    this.text = this.dummyText;

    this.finishing = false;
    this.overflowSubject.next(overflow);
  }

  // ------------------------------------

}
