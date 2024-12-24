import { By, until, Select } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";

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
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 600).click();
        // await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
    });

    it("Create an Amway ID", async () => {
        await driver.wait(until.elementLocated(By.className("primaryLink")), 8000).click();
        //Select
        const selectElement = await driver.findElement(By.className("selectorElement"));
        const select = new Select(selectElement);
        await select.selectByValue("AT");
        await driver
            .wait(until.elementLocated(By.name("username")), 1000)
            .sendKeys("kirtig8899@gmail.com");
        await driver
            .wait(until.elementLocated(By.id("pass1_password")), 1000)
            .sendKeys("amway@1234");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 1000).click();
        await driver
            .wait(until.elementLocated(By.id("pass2_password")), 1000)
            .sendKeys("amway@1234");
        await driver
            .wait(until.elementLocated(By.css(".input-eye-icon:nth-child(2)")), 1000)
            .click();
        await driver.findElement(By.xpath('//button[@type="submit"]')).click();
        await driver.wait(until.elementLocated(By.className("primaryLink")), 8000).click();
    });

    it("Forgot Password", async () => {
        await driver.wait(until.elementLocated(By.css(".TAC")), 800).click();
        await driver
            .wait(until.elementLocated(By.name("username")), 800)
            .sendKeys("kirtig8899@gmail.com");
        await driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 800).click();
    });

    it("Toggle-label", async () => {
        await driver.wait(until.elementLocated(By.className("primaryLink")), 8000).click();
        await driver.wait(until.elementLocated(By.css(".position-2-label")), 10000).click();
        await driver
            .wait(until.elementLocated(By.name("username")), 800)
            .sendKeys("kirtig8899@gmail.com");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 100000).click();
        await driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 800).click();
    });

    // after(async () => await driver.quit());
});
