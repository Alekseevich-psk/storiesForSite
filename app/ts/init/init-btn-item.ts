import { Options } from '../types/options';

export default function initBtnItem(wrapper: Element, options: Options) {
    if(!options.storiesMode) return;
    
    const buttons: string = `<div class="stories-fs__btn-item stories-fs__btn-item--prev"></div>
    <div class="stories-fs__btn-item stories-fs__btn-item--next"></div>`

    wrapper.insertAdjacentHTML('afterbegin', buttons);

    const btnItemPrev: Element = wrapper.querySelector('.stories-fs__btn-item--prev');
    const btnItemNext: Element = wrapper.querySelector('.stories-fs__btn-item--next');

    function initEventChangeItem(motion: string) {
        wrapper.dispatchEvent(new CustomEvent("changeItemSlide", {
            detail: { btn: (motion === 'prev') ? 'prev' : 'next' }
        }));
    }

    btnItemPrev.addEventListener('click', () => {
        initEventChangeItem('prev');
    });

    btnItemNext.addEventListener('click', () => {
        initEventChangeItem('next');
    });

}