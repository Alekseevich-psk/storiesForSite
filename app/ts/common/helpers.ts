export function offBtnArrow(btn: Element) {
    btn.classList.add('disabled');
}

export function onBtnArrow(btn: Element) {
    btn.classList.remove('disabled');
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