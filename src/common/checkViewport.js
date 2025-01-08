import { timeOut } from "./constants.js";
import { By, until } from "selenium-webdriver";
import fs from "fs";
import path from "path";
const checkIsElementInRect = (rect, windowSize) => {
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowSize.height &&
        rect.right <= windowSize.width
    );
};
const checkIsElementInViewportXAxis = (rect, windowSize) => {
    return rect.left >= 0 && rect.right <= windowSize.width;
};

const checkIsElementInViewport = async (driver, element) => {
    try {
        const windowSize = await driver.manage().window().getSize();
        const rect = await driver.executeScript(function (item) {
            const rect = item.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
            };
        }, element);
        assert.equal(checkIsElementInRect(rect, windowSize), true, "Element is not in viewport");
    } catch (error) {
        assert.fail("Element not found");
    }
};

const checkElementExists = async (driver, type, className) => {
    try {
        const isDisplayed = await driver
            .wait(until.elementLocated(By[type](className)), timeOut)
            .isDisplayed();
        return isDisplayed;
    } catch (error) {
        return false;
    }
};

const checkChildElementExists = async (element, type, className) => {
    try {
        await element.findElement(By[type](className));
        return true;
    } catch (error) {
        return false;
    }
};

const handleScreenShot = async (driver, screenshotDir, screenshotFileName) => {
    const response = await driver.takeScreenshot();
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, screenshotFileName);
    fs.writeFileSync(screenshotPath, response, "base64");
};

export {
    checkIsElementInRect,
    checkIsElementInViewportXAxis,
    checkIsElementInViewport,
    checkElementExists,
    checkChildElementExists,
    handleScreenShot,
};
