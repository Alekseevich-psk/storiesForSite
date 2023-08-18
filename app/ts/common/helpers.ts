import { Arrows } from "../types/arrows";

export function offBtnArrowPrev(arrow: Arrows) {
    if (arrow.userBtnPrev && !arrow.userBtnPrev.classList.contains('disabled')) arrow.userBtnPrev.classList.add('disabled');
    if (!arrow.defBtnPrev.classList.contains('disabled')) arrow.defBtnPrev.classList.add('disabled');
}

export function onBtnArrowPrev(arrow: Arrows) {
    if (arrow.userBtnPrev && arrow.userBtnPrev.classList.contains('disabled')) arrow.userBtnPrev.classList.remove('disabled');
    if (arrow.defBtnPrev.classList.contains('disabled')) arrow.defBtnPrev.classList.remove('disabled');
}

export function offBtnArrowNext(arrow: Arrows) {
    if (arrow.userBtnNext && !arrow.userBtnNext.classList.contains('disabled')) arrow.userBtnNext.classList.add('disabled');
    if (!arrow.defBtnNext.classList.contains('disabled')) arrow.defBtnNext.classList.add('disabled');
}

export function onBtnArrowNext(arrow: Arrows) {
    if (arrow.userBtnNext && arrow.userBtnNext.classList.contains('disabled')) arrow.userBtnNext.classList.remove('disabled');
    if (arrow.defBtnNext.classList.contains('disabled')) arrow.defBtnNext.classList.remove('disabled');
}

export function getWidthElem(elem: Element) {
    return elem.clientWidth;
}

export function animFade(elem: Element) {
    elem.classList.add('fade');
    setTimeout(() => {
        elem.classList.remove('fade');
    }, 400);
}

export function removeIntervals(timers: Array<number>) {
    if (timers !== null) {
        timers.forEach(el => {
            clearInterval(el);
        });
    }
}