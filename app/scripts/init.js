new storiesFs(".main__stories-fs", {
    navigation: {
        elBtnPrev: ".main__btn--prev",
        elBtnNext: ".main__btn--next",
    },
    speedStory: 3000,
    slidesPerView: {
        320: {
            count: 4,
        },
        960: {
            count: 6,
        },
        1280: {
            count: 6,
        },
    },
});
