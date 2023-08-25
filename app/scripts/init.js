new StoriesFs(".second__stories-fs", {
    storiesMode: false,
    aspectRatioPreview: false,
    slidesPerView: {
        320: {
            count: 4,
        },
        960: {
            count: 5,
        },
        1280: {
            count: 5,
        },
    },
});


new StoriesFs(".main__stories-fs", {
    navigation: {
        elBtnPrev: ".main__btn--prev",
        elBtnNext: ".main__btn--next",
    },
    speedStory: 3000,
    autoPlayFullScreen: true,
    speedAnimNextSlide: 50,
    slidesPerView: {
        320: {
            count: 4,
        },
        960: {
            count: 5,
        },
        1280: {
            count: 5,
        },
    },
});