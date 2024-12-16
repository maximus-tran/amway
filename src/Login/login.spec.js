import { By, until } from "selenium-webdriver";
import { buildDriver, openMobileWebsite } from "../common/browserBuild.js";

describe("Check entry point", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
    });

    it("TC_ID_1 Entry point - access course page", async () => {
        await driver.get("https://www.qa.ana.academy-preprod.amway.com/login");
        await driver
            .wait(until.elementLocated(By.id("username")), 10000)
            .sendKeys("mirandaagueda080@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
    });

    // after(async () => await driver.quit());
});
