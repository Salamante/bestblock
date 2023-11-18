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
    if (!window.MutationObserver) {
        alert(
            "This extension requires MutationObserver. Please update your browser."
        );
        return;
    }
    console.log(
        "%cInitializing MutationObserver",
        "color: green; font-size: 1.5em; background: black",
        document.readyState
    );
    // Select the node that will be observed for mutations
    const targetNode = document.body;
    if (targetNode === null) {
        setTimeout(() => {
            initObs();
        }, 50);
        return;
    }
    targetNode.setAttribute("wizard", "true");
    const adContainer = document.body.querySelector(".video-ads.ytp-ad-module");

    console.log(
        "🚀🚀🚀🚀🚀🚀content.js:44 adContainer?.childNodes.length > 0:",
        adContainer?.childNodes.length > 0
    );
    if (adContainer?.childNodes.length > 0) {
        console.log(
            "%cAD DETECTED",
            "color: red; font-size: 1.5em; background: black"
        );

        if (hasSkipLock(document.body)) {
            goToEnd();
            skipAd();
        } else if (hasSkipButton(document.body)) {
            skipAd();
        } else {
            goToEnd();
        }
    }

    console.log("🚀 ~ file: content.js:19 ~ initObs ~ targetNode:", targetNode);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                console.log(
                    "🚀🚀🚀🚀🚀🚀content.js:44 adContainer?.childNodes.length > 0:",
                    adContainer?.childNodes.length > 0
                );
                if (adContainer?.childNodes.length > 0) {
                    console.log(
                        "%cAD DETECTED",
                        "color: red; font-size: 1.5em; background: black"
                    );

                    if (hasSkipLock(document.body)) {
                        goToEnd();
                        skipAd();
                    } else if (hasSkipButton(document.body)) {
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
