import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";

describe("KAN-1: SSO Login", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Login by Email or Phone", async () => {
        await driver.get(`${baseURL}/login?country=it`);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys("MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com");
        await driver.findElement(By.id("loginform:password")).sendKeys("Amway@1234");
        await driver.wait(until.elementLocated(By.className("fa-regular fa-eye-slash")), timeOut).click();
        await driver.findElement(By.id("loginform:loginButton")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
        assert.ok(await driver.getTitle(), "Dashboard", "Login Error!");

        const cookies = await driver.manage().getCookies();
        console.log("Cookies saved successfully!", cookies);
    });

    after(async () => await driver.quit());
});
