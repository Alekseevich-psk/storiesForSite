import { Options } from '../types/options';

export default function defOptions() {
    const obj: Options = {
        aspectRatioPreview: true,
        autoPlayFullScreen: false,
        speedStory: 3000,
        speedAnimNextSlide: 32,
        navigation: {
            elBtnPrev: null,
            elBtnNext: null,
        }
    }

    return obj;
}