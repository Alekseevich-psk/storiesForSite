import { Options } from '../types/options';

export default function swipe(wrapper: Element, slides: NodeListOf<Element>, options: Options) {
    if (options.swipeOnSlide === false) return;

    const minDistance = 50;
    let xTouchStart: number = null;
    let xTouchEnd: number = null;

    wrapper.addEventListener('touchstart', function (e: TouchEvent) {
        xTouchStart = e.targetTouches[0].clientX;
        console.log('swipe');
    })

    wrapper.addEventListener('touchend', (e: TouchEvent) => {
        xTouchEnd = e.changedTouches[0].clientX;
        changeSwipe(xTouchStart, xTouchEnd);
    })

    wrapper.addEventListener('mousedown', function (e: MouseEvent) {
        xTouchStart = e.clientX;
    })

    // wrapper.addEventListener('mouseup', function (e: MouseEvent) {
    //     xTouchEnd = e.clientX;
    //     changeSwipe(xTouchStart, xTouchEnd);
    // })

    slides.forEach(slide => {
        slide.addEventListener('touchstart', function (e: TouchEvent) {
            xTouchStart = e.targetTouches[0].clientX;
            console.log('swipe');
        })

        slide.addEventListener('touchend', (e: TouchEvent) => {
            xTouchEnd = e.changedTouches[0].clientX;
            changeSwipe(xTouchStart, xTouchEnd);
        })

        slide.addEventListener('mousedown', function (e: MouseEvent) {
            xTouchStart = e.clientX;
        })

        slide.addEventListener('mouseup', function (e: MouseEvent) {
            xTouchEnd = e.clientX;
            changeSwipe(xTouchStart, xTouchEnd);
        })

    });

    function changeSwipe(xStart: number, xEnd: number) {
        if ((Math.abs(xStart - xEnd)) <= minDistance) return;
        wrapper.dispatchEvent(new CustomEvent("changeSlide", {
            detail: { btn: xStart < xEnd ? "prev" : "next" }
        }));
    }
}