import { By } from "selenium-webdriver";

const scrollToCss = async (driver, css) => {
    await driver.executeScript("window.scrollTo(0, 0);");
    const scrollTo = await driver.findElement(By.css(css));

    await driver.actions().scroll(0, 0, 0, 750, scrollTo).perform();
};

const scrollToXpath = async (driver, xpath) => {
    await driver.executeScript("window.scrollTo(0, 0);");
    const scrollTo = await driver.findElement(By.xpath(xpath));

    await driver.actions().scroll(0, 0, 0, 700, scrollTo).perform();
};

const scrollToElement = async (driver, element) => {
    await driver.executeScript("arguments[0].scrollIntoView(true);", element);
};

// const scrollToElement = async (driver, element) => {
//     await driver.executeScript("window.scrollTo(0, 0);");
//     await driver.actions().scroll(0, 0, 0, 400, element).perform();
// };

export { scrollToCss, scrollToXpath, scrollToElement };
