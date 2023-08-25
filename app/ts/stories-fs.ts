import { offBtnArrowPrev, offBtnArrowNext, onBtnArrowPrev, onBtnArrowNext, getWidthElem, removeIntervals, truncated } from './common/helpers';
import defOptions from './setting/default-value';

import initControl from './init/init-control';
import initBtnItem from './init/init-btn-item';
import initFullScreen from './init/init-fullscreen';
import initProgress from './init/init-progress';
import initSwipe from './init/init-swipe';
import initLazyLoad from './init/init-lazy-load';

import playStory from './story/play-story';
import offSlide from './story/off-slide';
import itemStories from './story/item-stories';

import widthSlides from './common/width-slides';
import initHeightParent from './common/height-parent';

import { Options } from './types/options';
import { paramPlayStory } from './types/param-play-story';
import { Arrows } from './types/arrows';

class StoriesFs {

    private wrapperStoriesFsEl = '.stories-fs__wrapper';
    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private activeIndexSlide: number = 0;
    private activeIndexStory: number = 0;
    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;
    private countFirstActiveSlides: number = 0;
    private countLastActiveSlides: number = 0;

    private timerId: any = null;
    private storyTimersId: any = null;

    private paramPlayStory: paramPlayStory;

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
        this.countFirstActiveSlides = this.getCountSlidesInWrapWindow();
        this.countLastActiveSlides = this.slidesStoriesFs.length - this.getCountSlidesInWrapWindow();
        this.initOffButton();

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs, options);
        initBtnItem(this.wrapperStoriesFs, options);
        initSwipe(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        initHeightParent(this.parentStoriesFs);
        initLazyLoad(this.wrapperStoriesFs);
        itemStories(this.wrapperStoriesFs, this.slidesStoriesFs);

        this.paramPlayStory = {
            wrapperStoriesFs: this.wrapperStoriesFs,
            slidesStoriesFs: this.slidesStoriesFs,
            optionsSfs: this.optionsSfs,
            activeIndex: this.activeIndexSlide,
            activeIndexStory: this.activeIndexStory
        }

        this.wrapperStoriesFs.addEventListener('holdEvent', (event: CustomEvent) => {
            (event.detail.holdEvent) ? removeIntervals(this.storyTimersId) : this.playStory();
        });

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if (this.playAnimScroll) return;
            this.activeIndexStory = 0;

            if (event.detail.btn === 'prev') {
                this.prevSlide();
            }

            if (event.detail.btn === 'next') {
                this.nextSlide();
            }
        });

        this.wrapperStoriesFs.addEventListener('changeItem', (event: CustomEvent) => {
            this.storyTimersId = event.detail.intervals;
            this.activeIndexStory = event.detail.index;
        });

        this.wrapperStoriesFs.addEventListener('clickItem', (event: CustomEvent) => {
            if (!this.fullScreenMode || this.playAnimScroll) return;

            this.activeIndexSlide = event.detail.activeIndex;
            this.activeIndexStory = event.detail.activeItem;

            this.playStory();
        });

        this.wrapperStoriesFs.addEventListener('clickBtnChangeItem', (event: CustomEvent) => {
            if (!this.fullScreenMode || this.playAnimScroll) return;
            removeIntervals(this.storyTimersId);

            (event.detail.btn === 'next') ? this.activeIndexStory++ : this.activeIndexStory--;

            if (this.activeIndexStory < 0) {
                this.activeIndexStory = 0;
                return this.prevSlide();
            }

            if (this.activeIndexSlide === this.slidesStoriesFs.length - 1) {
                const stories = this.slidesStoriesFs[this.activeIndexSlide].querySelectorAll('.stories-fs__inner');

                if (this.activeIndexStory >= stories.length) {
                    // bug
                    const btnClose = this.wrapperStoriesFs.querySelector('.stories-fs__btn-close') as HTMLElement;
                    btnClose.click();
                    return this.activeIndexStory = stories.length;
                }
            }

            this.playStory();
        });

        this.wrapperStoriesFs.addEventListener('endAnimationSlide', (event: CustomEvent) => {
            this.storyTimersId = event.detail.intervals;
            this.activeIndexStory = 0;

            if (this.activeIndexSlide < (this.slidesStoriesFs.length - 1)) this.updateStory();
            if (event.detail.activeSlide === this.activeIndexSlide && this.fullScreenMode) this.nextSlide();
        });

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
            if (event.detail.activeIndex) this.activeIndexSlide = event.detail.activeIndex;

            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.countFirstActiveSlides = this.getCountSlidesInWrapWindow();
            this.countLastActiveSlides = this.slidesStoriesFs.length - this.countFirstActiveSlides;
            this.countScrollWrapper = 0;
            this.fullScreenMode = event.detail.fullScreen;

            this.scrollTrackOnActiveSlide(this.activeIndexSlide);
        });

    }

    private prevSlide() {
        this.scrollTrack(this.activeIndexSlide - 1);
    }

    private nextSlide() {
        this.scrollTrack(this.activeIndexSlide + 1);
    }

    private scrollTrack(newActiveIndexSlide: number,) {
        if (this.playAnimScroll) return;
        if (newActiveIndexSlide < 0 || newActiveIndexSlide > this.slidesStoriesFs.length - 1) return;
        this.updateStory();

        let speedAnimNextSlide: number = this.optionsSfs.speedAnimNextSlide;
        let direction: string;

        let start: number = null;
        let end: number = null;
        let period: number = null;
        let hidePartTrack: number = null;

        if (newActiveIndexSlide > this.activeIndexSlide) {
            this.activeIndexSlide++;
            direction = 'next';
        } else {
            this.activeIndexSlide--;
            direction = 'prev';
        }

        if (!this.fullScreenMode) {
            if (newActiveIndexSlide >= this.countLastActiveSlides && direction === 'next') {
                this.activeIndexSlide = this.slidesStoriesFs.length - 1;
            }

            if ((newActiveIndexSlide - this.countLastActiveSlides) <= 0 && direction === 'prev') {
                this.activeIndexSlide = 0;
            }
        }

        start = this.countScrollWrapper;
        end = this.countScrollWrapper = (direction === 'next') ? (start + this.widthSlide) : (start - this.widthSlide);
        period = (start < end) ? Math.ceil((end - start) / speedAnimNextSlide) : Math.ceil((start - end) / speedAnimNextSlide);
        hidePartTrack = (this.slidesStoriesFs.length - this.countFirstActiveSlides) * this.widthSlide;

        (truncated(end, 0) <= 0) ? offBtnArrowPrev(this.arrowsBtnEl) : onBtnArrowPrev(this.arrowsBtnEl);
        (truncated(end, 0) >= truncated(hidePartTrack, 0)) ? offBtnArrowNext(this.arrowsBtnEl) : onBtnArrowNext(this.arrowsBtnEl);

        if (truncated(end, 0) <= truncated(hidePartTrack, 0)) this.scrollTrackAnimation(start, end, period, direction);
        if (this.fullScreenMode) this.playStory();
    }

    private scrollTrackOnActiveSlide(activeIndexSlide: number) {
        let distance = this.widthSlide * activeIndexSlide;

        if (activeIndexSlide <= this.countFirstActiveSlides - 1) distance = 0;
        if (activeIndexSlide > this.countLastActiveSlides) distance = this.widthSlide * this.countLastActiveSlides;

        (activeIndexSlide === 0) ? offBtnArrowPrev(this.arrowsBtnEl) : onBtnArrowPrev(this.arrowsBtnEl);
        (activeIndexSlide === this.slidesStoriesFs.length - 1) ? offBtnArrowNext(this.arrowsBtnEl) : onBtnArrowNext(this.arrowsBtnEl);

        this.trackStoriesFs.style.transform = `translate(${(-1 * distance) + 'px'}, 0)`;
        this.countScrollWrapper = distance;

        (this.fullScreenMode) ? this.playStory() : this.updateStory();
    }

    private scrollTrackAnimation(start: number, end: number, period: number, direction: string) {
        this.playAnimScroll = true;
        this.timerId = setInterval(() => {
            this.trackStoriesFs.style.transform = `translate(${(-1 * start) + 'px'}, 0)`;
            (direction == 'next') ? (start = start + period) : (start = start - period);

            if (direction === 'next' && start >= end || direction === 'prev' && start <= end) {
                this.trackStoriesFs.style.transform = `translate(${(-1 * end) + 'px'}, 0)`;
                clearInterval(this.timerId);
                this.playAnimScroll = false;
            }
        }, 1);
    }

    private playStory() {
        this.updateStory();
        this.updateIndex();
        playStory(this.paramPlayStory);
    }

    private updateStory() {
        offSlide(this.slidesStoriesFs, this.activeIndexSlide, this.activeIndexStory, this.storyTimersId);
    }

    private updateIndex() {
        this.paramPlayStory.activeIndex = this.activeIndexSlide;
        this.paramPlayStory.activeIndexStory = this.activeIndexStory;
    }

    private getCountSlidesInWrapWindow() {
        return getWidthElem(this.wrapperStoriesFs) / this.widthSlide;
    }

    private initOffButton() {
        offBtnArrowPrev(this.arrowsBtnEl);
        if (this.countFirstActiveSlides >= this.slidesStoriesFs.length) offBtnArrowNext(this.arrowsBtnEl);
    }

}

export default StoriesFs;