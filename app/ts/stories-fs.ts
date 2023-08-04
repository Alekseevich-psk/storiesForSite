import { onBtnArrow, offBtnArrow, getWidthElem, animFade } from './common/helpers';

import widthSlides from './common/width-slides';
import initControl from './common/init-control';
import initFullScreen from './common/init-fullscreen';
import initProgress from './common/init-progress';
import animProgress from './common/anim-progress';

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

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs);
        this.getCountSlidesInWrapWindow();

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {

            if ((event.detail.btn === 'prev') && !this.playAnimScroll) {
                this.activeIndex--;
                this.prevSlide(this.activeIndex);
            }

            if ((event.detail.btn === 'next') && !this.playAnimScroll) {
                this.activeIndex++;
                this.nextSlide(this.activeIndex);
            }

        })

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.getCountSlidesInWrapWindow();

            this.fullScreenMode = event.detail.fullScreen;
            if (event.detail.activeIndex) this.activeIndex = event.detail.activeIndex;

            this.scrollTrack(this.widthSlide, false, this.activeIndex);
            animProgress(this.slidesStoriesFs, this.activeIndex);
        })

    }

    private prevSlide(activeIndex: number) {
        this.scrollTrack((-1 * this.widthSlide), true, activeIndex);
    }

    private nextSlide(activeIndex: number) {
        console.log('test');
        
        this.scrollTrack(this.widthSlide, true, activeIndex);
    }

    private scrollTrack(distance: number, flagAnim: boolean, activeIndex: number,) {
        
        let speed = 1;
        let start = this.countScrollWrapper;
        let end = this.countScrollWrapper + distance;
        let locTimer: any;
        
        console.log(this.timerId);
        
        if (!this.fullScreenMode && !flagAnim) {
            start = this.widthSlide * activeIndex;
            end = this.widthSlide * activeIndex;
            this.countScrollWrapper = end - distance;
            
            this.trackStoriesFs.style.transform = `translate(${(-1 * end) + 'px'}, 0)`;
        }
        
        if (this.playAnimScroll) return;

        if (!flagAnim) {
            start = this.widthSlide * activeIndex;
            end = this.widthSlide * activeIndex;
            this.countScrollWrapper = end - distance;
        }
        
        
        // console.log(activeIndex, start, end, (this.getLengthTrack() - this.countActiveSlide * this.widthSlide), this.countActiveSlide);
        
        if (end < 0) return this.countScrollWrapper = 0;
        if (end > (this.getLengthTrack() - this.countActiveSlide * this.widthSlide)) return;
        this.countScrollWrapper += distance;
        
        if (flagAnim ?? this.fullScreenMode) {
            this.playAnimScroll = true;
            this.timerId = setInterval(() => {
                this.trackStoriesFs.style.transform = `translate(${(-1 * start) + 'px'}, 0)`;
                (start <= end) ? start++ : start--;
                
                if (start == end) {
                    clearInterval(this.timerId);
                    this.playAnimScroll = false;
                    animProgress(this.slidesStoriesFs, activeIndex);
                }
                
            }, speed);
        } else {
            this.trackStoriesFs.style.transform = `translate(${(-1 * end) + 'px'}, 0)`;
        }
        console.log(this.timerId);
    }
    
    private getLengthTrack() {
        return this.slidesStoriesFs.length * this.widthSlide;
    }

    private getCountSlidesInWrapWindow() {
        return this.countActiveSlide = getWidthElem(this.wrapperStoriesFs) / this.widthSlide;
    }

}

export default storiesFs;