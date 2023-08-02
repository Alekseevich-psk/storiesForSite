export default function initFullScreen(wrapper: Element, elements: NodeListOf<Element>) {
    const btnCloseHTML = `<div class="stories-fs__btn-close"></div>`;
    wrapper.insertAdjacentHTML('afterbegin', btnCloseHTML);

    const btnClose = wrapper.querySelector('.stories-fs__btn-close');
    const body = document.querySelector('body');

    btnClose.addEventListener('click', () => {
        wrapper.classList.remove('fullscreen');
        body.classList.remove('overflow');

        wrapper.dispatchEvent(new CustomEvent("changeFullScreenMode", {
            detail: {
                'fullScreen': false,
                'activeIndex': 0
            },
        }));
    })

    elements.forEach((element, index) => {
        element.addEventListener('click', () => {
            wrapper.classList.add('fullscreen');
            body.classList.add('overflow');

            wrapper.dispatchEvent(new CustomEvent("changeFullScreenMode", {
                detail: {
                    'fullScreen': true,
                    'activeIndex': index
                },
            }));
        })
    });
}