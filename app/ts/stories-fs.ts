import { onBtnArrow, offBtnArrow, getWidthElem, animFade } from './common/helpers';

import widthSlides from './common/width-slides';
import initControl from './common/init-control';
import initFullScreen from './common/innit-fullscreen';
import createProgress from './common/create-progress';

import { Options } from './types/options';
import { Arrows } from './types/arrows';


class storiesFs {

    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;

    private wrapperStoriesFs: Element;
    private trackStoriesFs: HTMLElement;
    private slidesStoriesFs: NodeListOf<Element>;

    private arrowsBtnEl: Arrows;

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
        this.arrowsBtnEl = initControl(this.wrapperStoriesFs, options);

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        createProgress(this.slidesStoriesFs, options);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if ((event.detail.btn === 'prev')) this.prevSlide();
            if ((event.detail.btn === 'next')) this.nextSlide();
        })

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.onSelectSlideFullScreen(this.trackStoriesFs, event.detail.activeIndex);
            this.fullScreenMode = event.detail.fullScreen;
            animFade(this.wrapperStoriesFs);
        })

    }

    private prevSlide() {
        if ((this.countScrollWrapper - this.widthSlide) < 0) return;
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'prev');
    }

    private nextSlide() {

        console.log(this.countScrollWrapper, (this.widthSlide * 2));
        // if ((this.countScrollWrapper + (this.widthSlide * 2)) > getWidthElem(this.wrapperStoriesFs)) return; 
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'next');
    }

    private animationScroll(wrapper: HTMLElement, direction: string) {
        const speed: number = 1;
        let period: number = 14;

        if (this.fullScreenMode) period = 10;

        let start: number = this.countScrollWrapper;
        this.playAnimScroll = true;

        (direction == 'next') ? this.countScrollWrapper += this.widthSlide : this.countScrollWrapper -= this.widthSlide;

        let timerId = setInterval(() => {
            wrapper.style.transform = `translate3d(${-1 * start + 'px'}, 0, 0)`;
            (direction == 'next') ? start += period : start -= period;
            if (start > this.countScrollWrapper && direction == 'next' || start < this.countScrollWrapper && direction == 'prev') {
                wrapper.style.transform = `translate3d(${-1 * (start - (start - this.countScrollWrapper)) + 'px'}, 0, 0)`;
                clearInterval(timerId);
                this.playAnimScroll = false;
            };
        }, speed);

        // disabled btnArrowsDef
        (this.countScrollWrapper > 0) ? onBtnArrow(this.arrowsBtnEl.defBtnPrev) : offBtnArrow(this.arrowsBtnEl.defBtnPrev);
        (this.countScrollWrapper + this.widthSlide) < getWidthElem(this.wrapperStoriesFs) ? onBtnArrow(this.arrowsBtnEl.defBtnNext) : offBtnArrow(this.arrowsBtnEl.defBtnNext);
    }

    private onSelectSlideFullScreen(wrapper: HTMLElement, index: number) {
        const distance: number = (index === 0) ? 0 : this.widthSlide * index;
        wrapper.style.transform = `translate3d(${-1 * distance + 'px'}, 0, 0)`;
    }

}

export default storiesFs;