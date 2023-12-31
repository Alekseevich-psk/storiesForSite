export default function initFullScreen(wrapper: Element, elements: NodeListOf<Element>) {
    const btnCloseHTML = `<div class="stories-fs__btn-close"></div>`;
    wrapper.insertAdjacentHTML('afterbegin', btnCloseHTML);

    let fullScreenMode: boolean = false;

    const btnClose = wrapper.querySelector('.stories-fs__btn-close');
    const body = document.querySelector('body');
    
    elements.forEach((element, index) => {
        element.addEventListener('click', () => {

            wrapper.classList.add('fullscreen');
            body.classList.add('overflow');
            
            if (!fullScreenMode) {
                wrapper.dispatchEvent(new CustomEvent("changeFullScreenMode", {
                    detail: {
                        'fullScreen': true,
                        'activeIndex': index
                    },
                }));
                
                fullScreenMode = true;
            }
            
        })
    });
    
    const closeFullScreen = () => {
        wrapper.classList.remove('fullscreen');
        body.classList.remove('overflow');
        
        wrapper.dispatchEvent(new CustomEvent("changeFullScreenMode", {
            detail: {
                'fullScreen': false,
            },
        }));
        
        fullScreenMode = false;
    };

    btnClose.addEventListener('click', closeFullScreen);
    window.addEventListener("keydown", (event) => {
        if (event.key === 'Escape') closeFullScreen();
    });
}