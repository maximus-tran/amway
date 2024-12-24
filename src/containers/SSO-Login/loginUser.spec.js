import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, baseUrlEsan, timeOut } from "../../common/baseURL.js";
import assert from "assert";

describe("SSO Login", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Login by Email or Phone", async () => {
        await driver.get(`${baseUrlEsan}/login?country=it`);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys("MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com");
        await driver.findElement(By.id("loginform:password")).sendKeys("Amway@1234");
        await driver.wait(until.elementLocated(By.className("fa-regular fa-eye-slash")), timeOut).click();
        await driver.findElement(By.id("loginform:loginButton")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
        assert.ok(await driver.getTitle(), "Dashboard", "Login Error!");
    });

    it("Login by ABO or Customer", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
            .click();
        //Sign out
        await driver.findElement(By.xpath('//div[@id="profileModal"]/div[2]/a[2]')).click();
        await driver.sleep(1000);
        await driver.navigate().to(`${baseURL}/login?country=it`);
        //Login in
        await driver.wait(until.elementLocated(By.css(".position-2-label")), timeOut).click();
        await driver
            .wait(until.elementLocated(By.name("username")), timeOut)
            .sendKeys("reyna.moon@hotmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.wait(until.elementLocated(By.className("input-eye-icon")), timeOut).click();
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
        let element = await driver.findElement(By.className("skipLink_skipLink__TFuAo"));
        let href = await element.getAttribute("href");
        let result = await href.includes("#mainContent")
        assert.ok(result, "Successfully!", "Login Error!");
    });

    after(async () => await driver.quit());
});
