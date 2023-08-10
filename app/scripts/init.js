new storiesFs(".main__stories-fs", {
    // navigation: {
    //     elBtnPrev: ".main__btn--prev",
    //     elBtnNext: ".main__btn--next",
    // },
    speedStory: 3000,
    speedAnimNextSlide: 20,
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
