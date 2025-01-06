import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

const user = {
    email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
    username: "GENE FLUECK",
    password: "Amway@1234",
};

describe("Verify Profile", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Verify that ABO name is correctly displayed", async () => {
        await driver.get(`${baseURL}/dashboard?init=true`);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();

        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
            .click();

        let profile = await driver.findElement(By.className(" CourseHeader_topbtn__lNqjt"));
        assert.strictEqual(await profile.getText(), user.username, "Username does not match");
    });

    it("Verify ABO First name, Last Name in profile modal", async () => {
        const element = await checkElementExists(
            driver,
            "css",
            ".CourseHeader_content_child__LUX1f",
        );
        assert.equal(element, true, "First name, Last Name do not exist in profile modal!");
    });

    it("Verify that the user profile image displays a generic image", async () => {
        const element = await checkElementExists(driver, "xpath", `//img[@alt="profile icon"]`);
        assert.ok(element, "Not display a generic image avatar");
    });

    it("Verify Language select in the profile modal", async () => {
        const isDisplayedLangSelect = await checkElementExists(
            driver,
            "css",
            ".CourseHeader_options_container__IAqgM > .CourseHeader_content_child__LUX1f:nth-child(1)",
        );

        assert.ok(isDisplayedLangSelect, "Language select not displayed");
    });

    it("Verify Shopping button in the profile modal", async () => {
        const isDisplayedShopping = await checkElementExists(
            driver,
            "css",
            ".CourseHeader_content_child__LUX1f:nth-child(2)",
        );
        assert.ok(isDisplayedShopping, "Shopping button not displayed");
    });

    it("Verify Sign out button in the profile modal", async () => {
        const isDisplayedSignout = await checkElementExists(
            driver,
            "css",
            ".CourseHeader_content_child__LUX1f:nth-child(3)",
        );
        assert.ok(isDisplayedSignout, "Sign out button not displayed");
    });

    after(async () => await driver.quit());
});
