new StoriesFs(".main__stories-fs", {
    navigation: {
        elBtnPrev: ".main__btn--prev",
        elBtnNext: ".main__btn--next",
    },
    speedStory: 6000,
    autoPlayFullScreen: true,
    speedAnimNextSlide: 50,
    // aspectRatioPreview: false,
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

// new StoriesFs(".second__stories-fs", {
//     storiesMode: false,
//     // aspectRatioPreview: true,
//     aspectRatioPreview: false,
//     slidesPerView: {
//         320: {
//             count: 4,
//         },
//         960: {
//             count: 5,
//         },
//         1280: {
//             count: 5,
//         },
//     },
// });
