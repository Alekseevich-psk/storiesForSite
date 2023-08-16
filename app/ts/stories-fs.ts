import { offBtnArrowPrev, offBtnArrowNext, onBtnArrowPrev, onBtnArrowNext, getWidthElem } from './common/helpers';

import initControl from './common/init-control';
import initFullScreen from './common/init-fullscreen';
import initProgress from './common/init-progress';
import initSwipe from './common/init-swipe';
import lazyLoad from './common/init-lazy-load';

import animProgress from './common/anim-progress';
import widthSlides from './common/width-slides';
import initHeightParent from './common/height-parent';

import { Options } from './types/options';
import { Arrows } from './types/arrows';

class StoriesFs {

    private wrapperStoriesFsEl = '.stories-fs__wrapper';
    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private activeIndex: number = 0;
    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;
    private countActiveSlide: number = 0;
    private timerId: any = null;

    private parentStoriesFs: HTMLElement;
    private wrapperStoriesFs: Element;
    private trackStoriesFs: HTMLElement;
    private slidesStoriesFs: NodeListOf<Element>;
    private animFlagChangeSlide: any = null;
    private arrowsBtnEl: Arrows;
    private optionsSfs: Options;

    constructor(parent: string, options: Options) {
        this.initSfs(parent, options);
    }

    private initSfs(parent: string, options: Options) {
        this.parentStoriesFs = document.querySelector(parent) as HTMLElement;
        this.wrapperStoriesFs = this.parentStoriesFs.querySelector(this.wrapperStoriesFsEl) as Element;
        this.trackStoriesFs = this.wrapperStoriesFs.querySelector(this.trackStoriesFsEl) as HTMLElement;
        this.slidesStoriesFs = this.wrapperStoriesFs.querySelectorAll(this.slidesStoriesFsEl) as NodeListOf<Element>;

        if (this.parentStoriesFs === null) {
            console.error('Not found parent element');
            return false;
        }

        if (this.slidesStoriesFs.length <= 0) {
            console.error('Not found slides elements');
            return false;
        }

        this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        this.arrowsBtnEl = initControl(this.wrapperStoriesFs, options);
        this.optionsSfs = options;
        this.countActiveSlide = this.getCountSlidesInWrapWindow();

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs, options);
        initSwipe(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        initHeightParent(this.parentStoriesFs);
        lazyLoad(this.wrapperStoriesFs);

        offBtnArrowPrev(this.arrowsBtnEl);
        if (this.countActiveSlide >= this.slidesStoriesFs.length) offBtnArrowNext(this.arrowsBtnEl);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if ((event.detail.btn === 'prev') && !this.playAnimScroll) this.activeIndex--, this.prevSlide(this.activeIndex);
            if ((event.detail.btn === 'next') && !this.playAnimScroll) this.activeIndex++, this.nextSlide(this.activeIndex);
        });

        this.wrapperStoriesFs.addEventListener('changeItem', (event: CustomEvent) => {
            this.animFlagChangeSlide = event.detail.animFlagChangeSlide;
        });

        this.wrapperStoriesFs.addEventListener('animSlide', (event: CustomEvent) => {
            if (event.detail.activeSlide === this.activeIndex && this.fullScreenMode) this.activeIndex++, this.nextSlide(this.activeIndex);
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
        let speedAnimNextSlide: number = (this.optionsSfs.speedAnimNextSlide) ? this.optionsSfs.speedAnimNextSlide : 32;
        let start: number = this.countScrollWrapper;
        let end: number = start + distance;
        let direction: string = (start < end) ? 'next' : 'prev';
        let period: number = (start < end) ? Math.ceil((end - start) / speedAnimNextSlide) : Math.ceil((start - end) / speedAnimNextSlide);
        let hideLengthTrack: number = (this.slidesStoriesFs.length - this.countActiveSlide) * this.widthSlide;

        if (!flagAnim) end = this.widthSlide * activeIndex;
        if (end <= 0) offBtnArrowPrev(this.arrowsBtnEl), end = 0;
        if (end > 0) onBtnArrowPrev(this.arrowsBtnEl);
        if (end >= hideLengthTrack && hideLengthTrack > 0) end = hideLengthTrack;

        (activeIndex == this.slidesStoriesFs.length - 1 || end >= hideLengthTrack && hideLengthTrack > 0) ?
            offBtnArrowNext(this.arrowsBtnEl) : onBtnArrowNext(this.arrowsBtnEl);

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
            this.updateAnimationSlide();
        }

        if (this.fullScreenMode) {
            this.updateAnimationSlide();
            this.animFlagChangeSlide = animProgress(this.wrapperStoriesFs, this.slidesStoriesFs, activeIndex, this.optionsSfs);
        }

    }

    private updateAnimationSlide() {
        if (this.animFlagChangeSlide) {
            for (let index = 0; index < this.animFlagChangeSlide.interval.length; index++) {
                clearInterval(this.animFlagChangeSlide.interval[index]);
            }
        }
    }

    private getCountSlidesInWrapWindow() {
        return getWidthElem(this.wrapperStoriesFs) / this.widthSlide;
    }

}

export default StoriesFs;