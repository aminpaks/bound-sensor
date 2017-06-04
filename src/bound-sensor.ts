import {
    Input,
    Output,
    NgModule,
    Directive,
    ElementRef,
    Inject,
    OnInit,
    OnDestroy,
} from '@angular/core';

@Directive({
    selector: '[boundSensor]',
})
export class BoundSensorDirective implements OnInit, OnDestroy {
    @Input() BoundSensor: string;
    private element: HTMLElement;
    private frame: HTMLIFrameElement;
    private timeout: NodeJS.Timer;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.BoundSensor) {
            const parent = this.element.parentElement;

            if (parent) {
                this.frame = document.createElement('iframe');
                const frameStyle = this.frame.style;

                frameStyle.width = '100%';
                frameStyle.height = '100%';
                frameStyle.border = 'none';
                frameStyle.zIndex = '-10000';
                frameStyle.position = 'absolute';
                frameStyle.visibility = 'hidden';

                parent.style.position = 'relative';
                parent.appendChild(this.frame);

                this.frame.contentWindow.addEventListener('resize', this.onResize.bind(this));
                this.onResize();
            }
        }
    }

    ngOnDestroy() {
        if (this.frame) {
            this.frame.removeEventListener('resize', this.onResize.bind(this));
            this.frame.remove();
            this.frame = undefined;
        }
    }

    onResize() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout(() => {
            const event = new CustomEvent(this.BoundSensor, {
                detail: {
                    width: this.frame.clientWidth,
                    height: this.frame.clientHeight,
                },
                bubbles: true,
                cancelable: true,
            });

            this.element.dispatchEvent(event);
            this.timeout = undefined;
        }, 100);
    }
}

@NgModule({
    declarations: [ BoundSensorDirective ],
    exports: [ BoundSensorDirective ],
})
export class BoundSensorModule {}
