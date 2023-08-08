import { onBtnArrow, offBtnArrow, getWidthElem, animFade } from './common/helpers';

import widthSlides from './common/width-slides';
import initControl from './common/init-control';
import initFullScreen from './common/init-fullscreen';
import initProgress from './common/init-progress';
import animProgress from './common/anim-progress';
import swipe from './common/swipe';

import { Options } from './types/options';
import { Arrows } from './types/arrows';

class storiesFs {

    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private activeIndex: number = 0;
    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;
    private countActiveSlide: number = 0;
    private timerId: any = null;

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
        this.countActiveSlide = this.getCountSlidesInWrapWindow();

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs);
        swipe(this.wrapperStoriesFs, this.slidesStoriesFs, options);

        offBtnArrow(this.arrowsBtnEl.defBtnPrev);
        if (this.countActiveSlide >= this.slidesStoriesFs.length) offBtnArrow(this.arrowsBtnEl.defBtnNext);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if ((event.detail.btn === 'prev') && !this.playAnimScroll) this.activeIndex--, this.prevSlide(this.activeIndex);
            if ((event.detail.btn === 'next') && !this.playAnimScroll) this.activeIndex++, this.nextSlide(this.activeIndex);
        });

        this.wrapperStoriesFs.addEventListener('animSlide', (event: CustomEvent) => {
            this.activeIndex++, this.nextSlide(this.activeIndex);
        });

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
            if (event.detail.activeIndex) this.activeIndex = event.detail.activeIndex;

            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.countActiveSlide = this.getCountSlidesInWrapWindow();

            this.fullScreenMode = event.detail.fullScreen;
            this.scrollTrack(this.widthSlide, false, this.activeIndex);
        });

    }

    private prevSlide(activeIndex: number) {
        this.scrollTrack((-1 * this.widthSlide), true, activeIndex);
    }

    private nextSlide(activeIndex: number) {
        this.scrollTrack(this.widthSlide, true, activeIndex);
    }

    private scrollTrack(distance: number, flagAnim: boolean, activeIndex: number,) {

        if (this.playAnimScroll) return;
        if (activeIndex > this.slidesStoriesFs.length - 1) return this.activeIndex = this.slidesStoriesFs.length - 1;
        if (activeIndex < 0) return this.activeIndex = 0;

        let speedTimer: number = 1;
        let speedScroll: number = 32; // low value = high speed scroll
        let start: number = this.countScrollWrapper;
        let end: number = start + distance;
        let direction: string = (start < end) ? 'next' : 'prev';
        let period: number = (start < end) ? Math.ceil((end - start) / speedScroll) : Math.ceil((start - end) / speedScroll);
        let hideLengthTrack: number = (this.slidesStoriesFs.length - this.countActiveSlide) * this.widthSlide;

        if (this.fullScreenMode && !flagAnim) end = this.widthSlide * activeIndex;
        if (!this.fullScreenMode && !flagAnim) end = (this.widthSlide * activeIndex) - hideLengthTrack;

        if (end <= 0) {
            offBtnArrow(this.arrowsBtnEl.defBtnPrev);
            end = 0;
        } else {
            onBtnArrow(this.arrowsBtnEl.defBtnPrev);
        }

        if (hideLengthTrack <= 0) {
            offBtnArrow(this.arrowsBtnEl.defBtnNext);
            offBtnArrow(this.arrowsBtnEl.defBtnPrev);
            end = 0;
        } else {
            onBtnArrow(this.arrowsBtnEl.defBtnNext);
        }

        if (end >= hideLengthTrack && hideLengthTrack > 0) {
            offBtnArrow(this.arrowsBtnEl.defBtnNext);
            end = hideLengthTrack;
        }

        this.countScrollWrapper = end;

        if (flagAnim ?? this.fullScreenMode) {
            this.playAnimScroll = true;
            this.timerId = setInterval(() => {

                this.trackStoriesFs.style.transform = `translate(${(-1 * start) + 'px'}, 0)`;
                (direction == 'next') ? start = start + period : start = start - period;

                if (direction === 'next' && start >= end || direction === 'prev' && start <= end) {
                    this.trackStoriesFs.style.transform = `translate(${(-1 * end) + 'px'}, 0)`;
                    clearInterval(this.timerId);
                    this.playAnimScroll = false;
                }

            }, speedTimer);
        } else {
            this.trackStoriesFs.style.transform = `translate(${(-1 * end) + 'px'}, 0)`;
        }

        if (this.fullScreenMode) animProgress(this.wrapperStoriesFs, this.slidesStoriesFs, activeIndex);

    }

    private getCountSlidesInWrapWindow() {
        return getWidthElem(this.wrapperStoriesFs) / this.widthSlide;
    }

}

export default storiesFs;