chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(
        "🚀 ~ file: background.js:6 ~ chrome.tabs.onUpdated.addListener ~ changeInfo.status:",
        changeInfo.status
    );
    if (
        changeInfo.status === "complete" &&
        /^https:\/\/www\.youtube\.com\/watch\?/.test(tab.url)
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./js/content.js"],
        });
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case "install":
            console.info("EXTENSION INSTALLED");
            break;
        case "update":
            console.info("EXTENSION UPDATED");
            break;
        case "chrome_update":
        case "shared_module_update":
        default:
            console.info("BROWSER UPDATED");
            break;
    }

    chrome.tabs.query({}, (tabs) => {
        tabs.filter((tab) =>
            tab.url.startsWith("https://www.youtube.com/")
        ).forEach(({ id }) => {
            chrome.tabs.reload(id);
        });
    });
});
