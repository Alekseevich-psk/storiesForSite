import { offBtnArrowPrev, offBtnArrowNext, onBtnArrowPrev, onBtnArrowNext, getWidthElem, removeIntervals } from './common/helpers';
import defOptions from './setting/default-value';

import initControl from './init/init-control';
import initBtnItem from './init/init-btn-item';
import initFullScreen from './init/init-fullscreen';
import initProgress from './init/init-progress';
import initSwipe from './init/init-swipe';
import initLazyLoad from './init/init-lazy-load';

import playStory from './story/play-story';
import offSlide from './story/off-slide';

import widthSlides from './common/width-slides';
import initHeightParent from './common/height-parent';

import { Options } from './types/options';
import { Arrows } from './types/arrows';

class StoriesFs {

    private wrapperStoriesFsEl = '.stories-fs__wrapper';
    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private activeIndex: number = 0;
    private activeIndexStory: number = 0;
    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;
    private countActiveSlide: number = 0;

    private timerId: any = null;
    private storyTimersId: any = null;

    private parentStoriesFs: HTMLElement;
    private wrapperStoriesFs: Element;
    private trackStoriesFs: HTMLElement;
    private slidesStoriesFs: NodeListOf<Element>;
    private arrowsBtnEl: Arrows;
    private optionsSfs: Options;

    constructor(parent: string, options: Options) {
        this.optionsSfs = Object.assign(defOptions(), options);
        this.initSfs(parent, this.optionsSfs);
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

        if (options.aspectRatioPreview) {
            this.trackStoriesFs.classList.add('aspect-ratio');
        }

        this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        this.arrowsBtnEl = initControl(this.wrapperStoriesFs, options);
        this.optionsSfs = options;
        this.countActiveSlide = this.getCountSlidesInWrapWindow();

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs, options);
        initBtnItem(this.wrapperStoriesFs, options);
        initSwipe(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        initHeightParent(this.parentStoriesFs);
        initLazyLoad(this.wrapperStoriesFs);

        offBtnArrowPrev(this.arrowsBtnEl);
        if (this.countActiveSlide >= this.slidesStoriesFs.length) offBtnArrowNext(this.arrowsBtnEl);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if (this.playAnimScroll) return;
            this.updateStory();
            if ((event.detail.btn === 'prev') && !this.playAnimScroll) this.activeIndex--, this.prevSlide(this.activeIndex);
            if ((event.detail.btn === 'next') && !this.playAnimScroll) this.activeIndex++, this.nextSlide(this.activeIndex);
        });

        this.wrapperStoriesFs.addEventListener('changeItem', (event: CustomEvent) => {
            console.log(this.activeIndexStory, this.activeIndex);
            
            this.storyTimersId = event.detail.intervals;
            this.activeIndexStory = event.detail.index;
        });

        this.wrapperStoriesFs.addEventListener('clickBtnChangeItem', (event: CustomEvent) => {
            if (!this.fullScreenMode || this.playAnimScroll) return;
            removeIntervals(this.storyTimersId);

            (event.detail.btn === 'next') ? this.activeIndexStory++ : this.activeIndexStory--;

            if (this.activeIndexStory < 0) {
                this.updateStory();
                this.activeIndexStory = 0;
                this.activeIndex--;
                return this.scrollTrack((-1 * this.widthSlide), true, this.activeIndex);
            }

            if (this.activeIndex === this.slidesStoriesFs.length - 1) {
                const countStory = this.slidesStoriesFs[this.activeIndex].querySelectorAll('.stories-fs__inner').length;

                if (this.activeIndexStory >= countStory) {
                    // bug
                    const btnClose = this.wrapperStoriesFs.querySelector('.stories-fs__btn-close') as HTMLElement;
                    btnClose.click();
                    return this.activeIndexStory = countStory;
                }
            }

            this.updateStory();
            playStory(this.wrapperStoriesFs, this.slidesStoriesFs, this.activeIndex, this.optionsSfs, this.activeIndexStory);
        });

        this.wrapperStoriesFs.addEventListener('endAnimationSlide', (event: CustomEvent) => {
            this.storyTimersId = event.detail.intervals;
            if (this.activeIndex < (this.slidesStoriesFs.length - 1)) this.updateStory();
            if (event.detail.activeSlide === this.activeIndex && this.fullScreenMode) this.activeIndex++, this.nextSlide(this.activeIndex);
        });

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
            if (event.detail.activeIndex) this.activeIndex = event.detail.activeIndex;

            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.countActiveSlide = this.getCountSlidesInWrapWindow();
            this.fullScreenMode = event.detail.fullScreen;

            if (!this.fullScreenMode) this.updateStory();
            this.scrollTrack(this.widthSlide, false, this.activeIndex);
        });

    }

    private updateStory() {
        offSlide(this.slidesStoriesFs, this.activeIndex, this.activeIndexStory, this.storyTimersId);
    }

    private prevSlide(activeIndex: number) {
        this.scrollTrack((-1 * this.widthSlide), true, activeIndex);
    }

    private closeFullScreen() {
        this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, this.optionsSfs, false);
        this.countActiveSlide = this.getCountSlidesInWrapWindow();
        this.fullScreenMode = false;

        this.updateStory();
        this.scrollTrack(this.widthSlide, false, this.activeIndex);

        this.wrapperStoriesFs.classList.remove('fullscreen');
        document.querySelector('body').classList.remove('overflow');
    }

    private nextSlide(activeIndex: number) {
        this.scrollTrack(this.widthSlide, true, activeIndex);
    }

    private scrollTrack(distance: number, flagAnim: boolean, activeIndex: number,) {

        if (this.playAnimScroll) return;
        if (activeIndex > this.slidesStoriesFs.length - 1) return this.activeIndex = this.slidesStoriesFs.length - 1;
        if (activeIndex < 0) return this.activeIndex = 0;

        let speedTimer: number = 1;
        let speedAnimNextSlide: number = this.optionsSfs.speedAnimNextSlide;
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
        }

        if (this.fullScreenMode) {
            playStory(this.wrapperStoriesFs, this.slidesStoriesFs, activeIndex, this.optionsSfs);
        }

    }

    private getCountSlidesInWrapWindow() {
        return getWidthElem(this.wrapperStoriesFs) / this.widthSlide;
    }

}

export default StoriesFs;