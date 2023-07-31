import { Options } from './types/options';
import widthSlides from './common/width-slides';
import initControl from './common/init-control';


class storiesFs {

    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;

    private wrapperStoriesFs: Element;
    private trackStoriesFs: HTMLElement;
    private slidesStoriesFs: NodeListOf<Element>;

    constructor(wrapper: string, options: Options) {
        this.initSfs(wrapper, options);
    }

    private initSfs(wrapper: string, options: Options) {
        this.wrapperStoriesFs = document.querySelector(wrapper) as Element;
        this.trackStoriesFs = this.wrapperStoriesFs.querySelector(this.trackStoriesFsEl) as HTMLElement;
        this.slidesStoriesFs = this.wrapperStoriesFs.querySelectorAll(this.slidesStoriesFsEl) as NodeListOf<Element>;

        if (this.wrapperStoriesFs === null) {
            console.error('Not found parent element');
            return false;
        }

        if (this.slidesStoriesFs.length <= 0) {
            console.error('Not found slides elements');
            return false;
        }

        this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        initControl(this.wrapperStoriesFs, options);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if ((event.detail.btn === 'prev')) this.prevSlide();
            if ((event.detail.btn === 'next')) this.nextSlide();
        })

    }

    private prevSlide() {
        if ((this.countScrollWrapper - this.widthSlide) < 0) return;
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'prev');
    }

    private nextSlide() {
        if ((this.countScrollWrapper + (this.widthSlide * 2)) > this.getWidthElem(this.wrapperStoriesFs)) return;
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'next');
    }

    private animationScroll(wrapper: HTMLElement, direction: string) {
        const period: number = 1;
        const speed: number = 5;

        let start: number = this.countScrollWrapper;
        this.playAnimScroll = true;

        (direction == 'next') ? this.countScrollWrapper += this.widthSlide : this.countScrollWrapper -= this.widthSlide;

        let timerId = setInterval(() => {
            wrapper.style.transform = `translate3d(${-1 * start + 'px'}, 0, 0)`;
            (direction == 'next') ? start += period : start -= period;

            if (start > this.countScrollWrapper && direction == 'next' || start < this.countScrollWrapper && direction == 'prev') {
                clearInterval(timerId);
                this.playAnimScroll = false;
            };

        }, speed);
    }

    private getWidthElem(elem: Element) {
        return elem.clientWidth;
    }

}

export default storiesFs;