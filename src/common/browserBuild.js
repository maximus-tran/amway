import { Builder, Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

const buildDriver = async (browser = "chrome") => {
    let driver;
    switch (browser.toLowerCase()) {
        case "chrome":
            driver = await new Builder().forBrowser(Browser.CHROME).build();
            break;

        case "firefox":
            driver = await new Builder().forBrowser(Browser.FIREFOX).build();
            break;

        case "edge":
            driver = await new Builder().forBrowser(Browser.EDGE).build();
            break;
        default:
            throw new Error(`Unsupported browser: ${browser}`);
    }
    return driver;
};

const mobileEmulation = {
    deviceName: "Galaxy S5", // Simulate iPhone X, can be replaced with other devices like 'Nexus 5', 'Galaxy S5', etc.
};

const openMobileWebsite = async () => {
    let driver;
    const chromeOptions = new Options();
    chromeOptions.setMobileEmulation(mobileEmulation); // Set mobile emulation for Chrome
    driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
    return driver;
};

export { buildDriver, openMobileWebsite };
