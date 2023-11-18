async function wizard() {
    console.log(
        "%cRunning wizard!",
        "color: orange; font-size: 1.5em; font-weight: bold; background: black"
    );
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            console.log("<-DOMContentLoaded->");
            initObs();
        });
    } else if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        console.log("<-COMPLETE->");
        initObs();
    } else return;
}

function initObs() {
    console.log(
        "%cInitializing MutationObserver",
        "color: green; font-size: 1.5em; background: black",
        document.readyState
    );
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector("#primary-inner > #player");
    if (targetNode === null) {
        setTimeout(() => {
            initObs();
        }, 50);
        return;
    }
    targetNode.setAttribute("wizard", "true");
    const adContainer = targetNode.querySelector(".video-ads.ytp-ad-module");

    console.log("🚀 ~ file: content.js:19 ~ initObs ~ targetNode:", targetNode);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                if (adContainer?.childNodes.length > 0) {
                    console.log(
                        "%cAD DETECTED",
                        "color: red; font-size: 1.5em; background: black"
                    );

                    if (hasSkipLock(targetNode)) {
                        goToEnd();
                        skipAd();
                    } else if (hasSkipButton(targetNode)) {
                        skipAd();
                    } else {
                        goToEnd();
                    }
                }
                // console.log("A child node has been added or removed.");
            } else if (mutation.type === "attributes") {
                // console.log(
                //     `The ${mutation.attributeName} attribute was modified.`
                // );
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    function hasSkipLock(target) {
        console.log(
            "%cHas Skip Lock",
            "color: red; font-size: 1.5em; background: black"
        );
        return !target.querySelector(".ytp-ad-skip-button-slot");
    }
    function hasSkipButton(target) {
        return !!target.querySelector(".ytp-ad-skip-button-slot");
    }
    function goToEnd() {
        const video = document.querySelector(".video-stream");
        if (video) {
            video.currentTime = video.duration - 0.1;
            video.muted = true;
            if (video.paused) video.play();
        }
    }
    function skipAd() {
        const skipButtonWrapper = document.querySelector(
            ".ytp-ad-skip-button-slot"
        );

        console.log(
            "%cSkip Button Element:",
            "color: red; font-size: 1.5em; background: black",
            skipButtonWrapper
        );
        if (skipButtonWrapper) {
            skipButtonWrapper.querySelector("button").click();
        }
    }
}

wizard();
