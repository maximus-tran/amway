import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import assert from "assert";

describe("SSO Login", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Login by Email or Phone", async () => {
        await driver.get("https://www.qa.ana.academy-preprod.amway.com/login");
        await driver
            .wait(until.elementLocated(By.id("username")), 15000)
            .sendKeys("mirandaagueda080@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 600).click();
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), 20000);
        assert.ok(await driver.getTitle(), "Dashboard", "Login Error!");
    });

    it("Login by ABO or Customer", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), 30000)
            .click();
        //Sign out
        await driver.findElement(By.xpath('//div[@id="profileModal"]/div[2]/a[2]')).click();
        await driver.sleep(1000);
        await driver.navigate().to("https://www.qa.ana.academy-preprod.amway.com/login");
        //Login in
        await driver.wait(until.elementLocated(By.css(".position-2-label")), 30000).click();
        await driver
            .wait(until.elementLocated(By.name("username")), 800)
            .sendKeys("reyna.moon@hotmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 800).click();
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), 20000);
        let element = await driver.findElement(By.className("skipLink_skipLink__TFuAo"));
        assert.ok(await element.getAttribute("href"), "https://www.qa.ana.academy-preprod.amway.com/dashboard?init=true#mainContent", "Login Error!");
    });

    // after(async () => await driver.quit());
});
