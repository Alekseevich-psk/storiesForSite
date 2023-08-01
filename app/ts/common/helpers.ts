export function offBtnArrow(btn: Element) {
    btn.classList.add('disabled');
}

export function onBtnArrow(btn: Element) {
    btn.classList.remove('disabled');
}

export function getWidthElem(elem: Element) {
    return elem.clientWidth;
}