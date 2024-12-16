const scrollToCss = async (driver, css) => {
    await driver.executeScript("window.scrollTo(0, 0);");
    const scrollTo = await driver.findElement(By.css(css));

    await driver.actions().scroll(0, 0, 0, 400, scrollTo).perform();
};

const scrollToElement = async (driver, element) => {
    await driver.executeScript("window.scrollTo(0, 0);");
    await driver.actions().scroll(0, 0, 0, 400, element).perform();
};

export { scrollToCss, scrollToElement };
