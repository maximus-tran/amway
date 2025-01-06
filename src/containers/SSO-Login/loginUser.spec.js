import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut, loginPassword, loginEmail } from "../../common/constants.js";
import assert from "assert";

describe("SSO Login", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Login by Email", async () => {
        await driver.get(`${baseURL}/login?country=it`);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(loginEmail);
        await driver.findElement(By.id("loginform:password")).sendKeys(loginPassword);
        await driver
            .wait(until.elementLocated(By.className("fa-regular fa-eye-slash")), timeOut)
            .click();
        await driver.findElement(By.id("loginform:loginButton")).click();
        await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
        assert.ok((await driver.getTitle()) === "Dashboard", "Login Error!");
    });

    after(async () => await driver.quit());
});
