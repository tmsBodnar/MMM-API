import { ViewChild, ElementRef, Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject, Subscription, Observable, BehaviorSubject} from 'rxjs';
import { debounceTime, switchMap, tap, filter } from 'rxjs/operators';

export enum MOUSE_EVENT {
  ENTER = 'ENTER',
  LEAVE = 'LEAVE'
}

@Directive({
  selector: '[mouseEnterLeaveDebounce]'
})
export class MouseEnterLeaveDebounceDirective implements OnInit, OnDestroy {
  @Input() mouseEnterDebounceTime: number = 50;
  @Input() mouseLeaveDebounceTime: number = 100;
  @Input() forceBlockEventEmitter: boolean = false;

  @Output() debounceMouseEnter: EventEmitter<MOUSE_EVENT> = new EventEmitter();
  @Output() debounceMouseLeave:  EventEmitter<MOUSE_EVENT> = new EventEmitter();

  private mouseEvent = new Subject<MOUSE_EVENT>();

  private subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    this.subscriptions.push(
      this.mouseEvent.pipe(
        filter(() => !this.forceBlockEventEmitter),
        switchMap((event: MOUSE_EVENT) => {
          if (event === MOUSE_EVENT.ENTER) {
            return new BehaviorSubject<MOUSE_EVENT>(MOUSE_EVENT.ENTER).pipe(
              debounceTime(this.mouseEnterDebounceTime),
              tap((e: MOUSE_EVENT) => this.debounceMouseEnter.emit(e))
            )
          } else {
            return new BehaviorSubject<MOUSE_EVENT>(MOUSE_EVENT.LEAVE).pipe(
              debounceTime(this.mouseLeaveDebounceTime),
              tap((e: MOUSE_EVENT) => this.debounceMouseLeave.emit(e))
            )
          }
        })
      ).subscribe(),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  @HostListener('mouseenter', ['$event'])
  public enterEvent(event:any): void {
    this.mouseEvent.next(MOUSE_EVENT.ENTER);
  }

  @HostListener('mouseleave', ['$event'])
  public leaveEvent(event: any): void {    
    this.mouseEvent.next(MOUSE_EVENT.LEAVE);
  }
}
