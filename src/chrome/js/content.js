async function wizard() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            initObs();
        });
    } else if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        initObs();
    } else return;
}

function initObs() {
    const targetNode = document.body;
    if (targetNode === null) {
        setTimeout(() => {
            initObs();
        }, 50);
        return;
    }
    targetNode.setAttribute("wizard", "true");
    const adContainer = document.body.querySelector(".video-ads.ytp-ad-module");

    mainSkipController();

    if (!window.MutationObserver) {
        alert(
            "This extension will not run operate optimally on your browser version. Please update your browser."
        );

        if (!targetNode.hasAttribute("no-obs")) {
            const timeout = setTimeout(() => {
                initObs();
            }, 50);
            targetNode.setAttribute("no-obs", "true");
        }
        return;
    }

    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                mainSkipController();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function hasSkipLock(target) {
        return !target.querySelector(".ytp-ad-skip-button-slot");
    }
    function hasSkipButton(target) {
        return !!target.querySelector(".ytp-ad-skip-button-slot");
    }
    function goToEnd() {
        const video = document.body.querySelector(".video-stream");
        if (video) {
            video.currentTime = video.duration - 0.1;
            video.muted = true;
            if (video.paused) video.play();
        }
    }
    function skipAd() {
        const skipButtonWrapper = document.body.querySelector(
            ".ytp-ad-skip-button-slot"
        );

        if (skipButtonWrapper) {
            skipButtonWrapper.querySelector("button").click();
        }
    }
    function mainSkipController() {
        if (adContainer?.childElementCount > 0) {
            if (hasSkipLock(document.body)) {
                goToEnd();
                skipAd();
            } else if (hasSkipButton(document.body)) {
                skipAd();
            } else {
                goToEnd();
            }
        }
    }
}

wizard();
