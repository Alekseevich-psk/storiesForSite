import { Options } from '../types/options';

type tObj = {
    count: number
}

type objectParentWidth = {
    window: Number,
    wrapper: Number,
}

export default function widthSlides(wrapper: Element, slides: NodeList, options: Options, fullScreen = false) {
    let optionWidth: object = options.slidesPerView;
    let parentWidth: objectParentWidth = getWidthParentElements(wrapper);
    let widthSlide: number;
    
    if (fullScreen) {
        setWidthItems(0);
        return Number(parentWidth.window);
    }
    
    if (optionWidth == null) {
        optionWidth = {
            320: {
                count: 4
            },
            960: {
                count: 6
            },
            1280: {
                count: 8
            }
        }
    }
    
    init();

    window.addEventListener('resize', () => {
        init();
    })

    function init() {
        getWidthParentElements(wrapper);
        setWidthItems(getCountSlides());
    }

    function setWidthItems(count: number) {
        slides.forEach(element => {
            let elem = element as HTMLElement;
            widthSlide = (count === 0) ? Number(parentWidth.wrapper) : Number(parentWidth.wrapper) / count;
            elem.style.flexBasis = widthSlide + 'px';
        });
    }

    function getWidthParentElements(wrapper: Element) {
        return {
            window: window.innerWidth,
            wrapper: wrapper.clientWidth,
        };
    }

    function getCountSlides() {
        let res: tObj;

        (Object.keys(optionWidth) as (keyof typeof optionWidth)[]).forEach((key, index) => {
            if (key <= Number(parentWidth.window)) {
                res = optionWidth[key] as tObj;
            }
        });

        return res.count;
    }


    return widthSlide;
}