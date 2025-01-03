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

export { checkIsElementInRect, checkIsElementInViewportXAxis, checkIsElementInViewport };
