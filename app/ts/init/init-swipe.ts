import { Options } from '../types/options';

export default function swipe(wrapper: Element, slides: NodeListOf<Element>, options: Options) {
    if (options.swipeOnSlide === false) return;

    const minDistance = 30;
    let xTouchStart: number = null;
    let xTouchEnd: number = null;
    let timerId: any = null;
    let holdEventFlag: boolean = false;
    let speedTimer: number = 1000;

    wrapper.addEventListener('touchstart', function (e: TouchEvent) {
        xTouchStart = e.targetTouches[0].clientX;
        createTimer();
    })

    wrapper.addEventListener('touchend', (e: TouchEvent) => {
        xTouchEnd = e.changedTouches[0].clientX;
        changeSwipe(xTouchStart, xTouchEnd);
        removeTimer();
    })

    wrapper.addEventListener('mousedown', function (e: MouseEvent) {
        xTouchStart = e.clientX;
        createTimer();
    })

    wrapper.addEventListener('mouseup', function (e: MouseEvent) {
        xTouchEnd = e.clientX;
        changeSwipe(xTouchStart, xTouchEnd);
        removeTimer();
    })

    function createTimer() {
        timerId = setTimeout(() => {
            onHoldEvent(true);
            holdEventFlag = true;
        }, speedTimer);

    }

    function removeTimer() {
        clearTimeout(timerId);
        
        if(holdEventFlag) {
            onHoldEvent(false);
            holdEventFlag = false;
        }
        
    }

    function onHoldEvent(value: boolean) {
        wrapper.dispatchEvent(new CustomEvent("holdEvent", {
            detail: { holdEvent: (value) ? true : false }
        }));
    }

    function changeSwipe(xStart: number, xEnd: number) {
        if ((Math.abs(xStart - xEnd)) <= minDistance) return;
        wrapper.dispatchEvent(new CustomEvent("changeSlide", {
            detail: { btn: xStart < xEnd ? "prev" : "next" }
        }));
    }
}