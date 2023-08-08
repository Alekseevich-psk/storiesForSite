import { Options } from '../types/options';
import { Arrows } from '../types/arrows';

export default function initControl(wrapper: Element, options: Options) {

    const controlElements: string = `    
        <div class="stories-fs__arrows">
            <div class="stories-fs__arrow stories-fs__arrow--prev"></div>
            <div class="stories-fs__arrow stories-fs__arrow--next"></div>
        </div>`;

    let arrows: Arrows = {};

    wrapper.insertAdjacentHTML('afterbegin', controlElements);
    const arrowsWrapper = wrapper.querySelector('.stories-fs__arrows');

    if (options.navigation?.elBtnPrev && options.navigation?.elBtnNext) {
        let elemPrev = document.querySelector(options.navigation.elBtnPrev);
        let elemNext = document.querySelector(options.navigation.elBtnNext);

        if (elemPrev) {
            arrows.userBtnPrev = elemPrev;
            elemPrev.addEventListener('click', () => createEventChangeSlide('prev'));
        }

        if (elemNext) {
            arrows.userBtnNext = elemNext;
            elemNext.addEventListener('click', () => createEventChangeSlide('next'));
        }

        arrowsWrapper.classList.add('hide-arrows');
    }

    let elemPrevDef = wrapper.querySelector('.stories-fs__arrow--prev');
    let elemNextDef = wrapper.querySelector('.stories-fs__arrow--next');

    if (elemPrevDef) {
        arrows.defBtnPrev = elemPrevDef;
        elemPrevDef.addEventListener('click', () => createEventChangeSlide('prev'));
    }

    if (elemNextDef) {
        arrows.defBtnNext = elemNextDef;
        elemNextDef.addEventListener('click', () => createEventChangeSlide('next'));
    }

    function createEventChangeSlide(motion: string) {
        wrapper.dispatchEvent(new CustomEvent("changeSlide", {
            detail: { btn: (motion === 'prev') ? 'prev' : 'next' }
        }));
    }

    return arrows;
}