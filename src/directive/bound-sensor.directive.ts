import {
    Input,
    Output,
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
    @Input() boundSensor: string;
    private element: HTMLElement;
    private frame: HTMLIFrameElement;
    private timeout: number;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.boundSensor) {
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
            this.frame.parentElement.style.position = '';
            this.frame.contentWindow.removeEventListener('resize', this.onResize.bind(this));
            this.frame.remove();
            this.frame = undefined;
        }
    }

    onResize() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = window.setTimeout(() => {
            const event = new CustomEvent(this.boundSensor, {
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
