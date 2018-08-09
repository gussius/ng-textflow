import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy, HostBinding } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { debounce } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-node',
  template: `
    <div class="mask" #maskTag>
      <div *ngIf="showPageNumbers && _pageNumberAtTop" [ngStyle]="numberStyle">
        {{pageNumber}}
      </div>  
      <div *ngIf="hasHeading" [ngStyle]="headingStyle">
        {{heading}}
      </div>
      <div #textref [ngStyle]="nodeStyle" class="content">
        {{text}}
        <div #dummy class="dummy" >{{ dummyText }}</div>
      </div>
      <div *ngIf="showPageNumbers && !_pageNumberAtTop" [ngStyle]="numberStyle">
        {{pageNumber}}
      </div>
    </div>
`,
  styles: [`
    .content {
      position: relative;
      text-align-last: justify;
      cursor: default;
    }
    .mask {
      display block;
      overflow: hidden;
    }
    :host {
      display: block;
      overflow: hidden;
      user-select: none;
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
  @ViewChild('maskTag') private mask: ElementRef;

  private _index: number;  
  private _heading: string = '';
  private _isVisible: boolean = false;
  private _pageNumberAtTop: boolean = false;
  private changes: MutationObserver;
  private padding: number;
  
  hasHeading: boolean = true;
  text: string;
  showPageNumbers: boolean;
  isOverlaid: boolean;
  pageNumber: number;

  // Get host properties to dynamically change.
  @HostBinding('style.position') private hostPosition = '';
  @HostBinding('style.visibility') private hostVisibility = 'hidden';

  // Dynamic styles.
  private numberStyle: any = {};
  private headingStyle: any = {};
  private nodeStyle: any = {};

  // More text to put into nodes, so overflow.
  private overflowSubject: Subject<string> = new Subject();
  overflow: Observable<string> = this.overflowSubject as Observable<string>;

  // Last node complete.
  private static finishedSubject: Subject<null> = new Subject();
  static finished: Observable<null> = NodeComponent.finishedSubject as Observable<null>;

  // Heading has changed.
  private static headingChangedSubject: Subject<null> = new Subject();
  static headingChanged: Observable<null> = NodeComponent.headingChangedSubject.pipe(debounce(() => interval(10)));

  // Inject services.
  constructor(private renderer: Renderer2, private elementRef: ElementRef) { };
  
  ngOnInit() {    
    // Some initialisation.
    this.dummyText = this.text;
    this.trimming = true;

    // We use the mutation observer to see when our dummy text change has happened.
    this.changes = new MutationObserver((mutations: MutationRecord[]) => this.manageState());
    this.changes.observe(this.dummyDivRef.nativeElement, { attributes: true, childList: true, characterData: true });

    // Kick off the state machine here, but with a delay for the first node,
    // since the initial loading of the component causes some delay in other initialisation. (I think).
    setTimeout(() => { // Wait till index is resolved.
      // We need to pause for the first node since the loading is lazy?
      if (this.index >= 99) {
        setTimeout(() => this.manageState(), 200); // TODO: find a event driven method here.
      } else {
        // The following nodes do not need this delay.
        this.manageState();
      }
    })
  }

  // Some getter/setter methods.
  private get dummyText(): string { return this.dummyDivRef.nativeElement.textContent; }
  private set dummyText(content: string) { this.dummyDivRef.nativeElement.textContent = content; }
  
  get isVisible(): boolean { return this._isVisible; }
  set isVisible(value: boolean) {
    this._isVisible = value;
    this.hostVisibility = 'visible';
  }

  get index(): number { return this._index; }
  set index(index: number) {
    this.pageNumber = 100 - index;
    setTimeout(() => {
      this._index = Math.abs(index);
      this.renderer.setStyle(this.textDivRef.nativeElement, 'z-index', index); 
    });
  }

  get width(): number { return parseInt(this.mask.nativeElement.style.width.replace(/\D/g, '')) }
  set width(width: number) { this.renderer.setStyle(this.mask.nativeElement, 'width', `${width}px`) }
  
  get heading(): string { return this._heading; }
  set heading(heading: string) { 
    this._heading = heading === '' ? this._heading = ' ' : this._heading = heading;
    NodeComponent.headingChangedSubject.next();
  }

  get pageNumberAtTop(): boolean { return this._pageNumberAtTop; }
  set pageNumberAtTop(value: boolean) {
    this._pageNumberAtTop = value;
    this.numberStyle['padding-bottom'] = this.pageNumberAtTop ? '0px' : `${this.padding}px`;
    this.numberStyle['padding-top'] = this.pageNumberAtTop ? `${this.padding}px` : '0px';
  }

  // Apply the style to the current node. Assumes the correct attributes are contained.
  applyStyle(style: any) {
    this.nodeStyle = this.convertStyleToPx(style.contentStyle);
    this.numberStyle = style.numberStyle;
    // Let's manipulate the padding style that was added to manage top or bottom placed numbering.
    if (this.numberStyle.padding > '') {
      this.padding = parseInt(this.numberStyle.padding.replace(/\D/g, ''));
    } else {
      this.padding = 16;
    }
    this.numberStyle['padding-left'] = `${parseInt(this.nodeStyle.width.replace(/\D/g, ''))/2}px`;
    this.headingStyle = style.headingStyle;
    this.headingStyle.width = this.nodeStyle.width;
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', style.width);
    this.nodeStyle.overflow = 'hidden';
    this.width = parseInt(this.nodeStyle.width.replace(/\D/g, ''));
    if (this.isOverlaid) {
      this.hostPosition = 'absolute';
    }
  }

  // Helper function to get em values into px values for simpler calculation later.
  convertStyleToPx(style: any): any {
    let tempStyle = style;
    // Get the fontSize of the style.
    let fontSizeSuffix: string = tempStyle['fontSize'].replace(/[\d\.]/g, '');
    let fontSize: number = parseFloat(tempStyle['fontSize'].replace(/[A-Za-z]/g,''));
    
    for (let key in tempStyle) {
      // Not we need to check each value only, for em, pt, px etc..
      if ((<string>tempStyle[key]).indexOf('em') > 0) {
        let suffix = tempStyle[key].replace(/[\d\.]/g, '');
        switch(suffix) {
          case 'em': {
            // Convert em value to px
            let value: number = parseFloat(tempStyle[key].replace(/[A-Za-z]/g,''));
            tempStyle[key] = `${Math.round(value*fontSize)}px`
          }
        }
      }
    }
    return tempStyle;
  }

  // Gets the lineHeight of the current node so we can do other trimming calculations.
  private parseLineHeight(): number {
    let lineHeight: string = this.textDivRef.nativeElement.style.lineHeight;
    return parseInt(lineHeight.replace(/\D/g, ''));
  }
  
  // Produces a set of data about the current dummy div compated to the content div.
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

  // ------------------------ Trim loop test. -----------------------
  //
  // This is a small state machine to process the trimming algorithm.
  //
  private adding: boolean = false;
  private finishing: boolean = false;
  private trimming: boolean = false;
  
  private count: number = 100;

  private manageState() {
    // Protect against infinite loop.
    if (this.count-- <= 0 ) {
      this.trimming = false;
      this.adding = false;
      this.finishing = false;
      console.log('ERROR - loop count > 100');
    }
    if (this.trimming) {
      this.trim();
    } else if (this.adding) {
      this.addword();
    } else if (this.finishing) {
      this.finish();
    }
  }

  private trim() {
    let comps = this.compareDivs();
    let wordsToRemove = Math.floor(comps.words/comps.lines) * (comps.diffLines + 1);
    if (wordsToRemove > 0) {
      this.dummyText = this.dummyText.split(' ').slice(0, comps.words - wordsToRemove).join(' ');
    } else {
      this.trimming = false;
      this.adding = true;
      this.addword();
    }
  }

  private addword() {
    let comps = this.compareDivs();
    if (comps.diffLines <= -1) {
      if (this.dummyText.length < this.text.length) {
        this.dummyText = this.dummyText + ' ' + this.text.split(' ')[comps.words];
      } else {
        // This is the last node.
        this.renderer.setStyle(this.textDivRef.nativeElement, 'textAlignLast', 'left');
        NodeComponent.finishedSubject.next();
      }
    } else {
      // Take off the last word again.
      this.dummyText = this.dummyText.split(' ').slice(0, comps.words - 1).join(' ');
      this.adding = false;
      this.finishing = true;        
    }
  }

  private finish() {
    let comps = this.compareDivs();
    let lastword: string[] = this.dummyText.split(' ');
    let overflowArray = this.text.split(' ');
    let overflow = overflowArray.slice(this.dummyText.split(' ').length).join(' ');
    this.text = this.dummyText;
    this.finishing = false;
    this.overflowSubject.next(overflow);
  }

}
