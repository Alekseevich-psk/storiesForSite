export default function initFullScreen(wrapper: Element, elements: NodeListOf<Element>) {
    const btnCloseHTML = `<div class="stories-fs__btn-close"></div>`;
    wrapper.insertAdjacentHTML('afterbegin', btnCloseHTML);

    const btnClose = wrapper.querySelector('.stories-fs__btn-close');
    const body = document.querySelector('body');

    btnClose.addEventListener('click', () => {
        wrapper.classList.remove('fullscreen');
        body.classList.remove('overflow');
    })

    elements.forEach((element) => {
        element.addEventListener('click', () => {
            wrapper.classList.add('fullscreen');
            body.classList.add('overflow');
        })
    });
}