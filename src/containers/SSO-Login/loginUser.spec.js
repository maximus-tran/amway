import { By, until, Select } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";

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
    });

    it("Login by ABO or Customer", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), 20000)
            .click();
        //Sign out
        await driver.findElement(By.xpath('//div[@id="profileModal"]/div[2]/a[2]')).click();
        await driver.navigate().to("https://account-amerreg-qa2.amwayglobal.com/en-us/?jansKey=b0ccfa7d-7e9d-4862-aec1-050f2deef3e4&exp_at=1735023976");
        //Login in
        await driver.wait(until.elementLocated(By.css(".position-2-label")), 30000).click();
        await driver
            .wait(until.elementLocated(By.name("username")), 800)
            .sendKeys("reyna.moon@hotmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), 800).click();
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), 20000);
    });

    // after(async () => await driver.quit());
});
