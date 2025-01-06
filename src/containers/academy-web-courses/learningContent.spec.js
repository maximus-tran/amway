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

describe("Verify at dashboard observe the learning contents at all the sections", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Category section", async () => {
        //login
        await driver.get(baseURL);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();
        const isHasCategoriesList = await checkElementExists(
            driver,
            "className",
            "dashboard_section_heading_wrapper__hf2aj",
        );
        assert.ok(isHasCategoriesList, "Category section display failed!");
    });

    it("Verify Recommended section", async () => {
        const isHasRecommendedList = await checkElementExists(
            driver,
            "className",
            "dashboard_card_wrapper__05W_L",
        );
        assert.ok(isHasRecommendedList, "Recommended section display failed!");
    });

    it("Verify What's new section", async () => {
        const isHasWhatNew = await checkElementExists(
            driver,
            "className",
            "dashboard_quickstudy_wrapper__HeOMF",
        );
        assert.ok(isHasWhatNew, "What's new section display failed!");
    });

    it("Verify Learning Path section", async () => {
        const isHasLearningPath = await checkElementExists(driver, "id", "learning-path");
        assert.ok(isHasLearningPath, "Learning Path section display failed!");
    });

    it("Verify Learning Catalogue section", async () => {
        const isHasCatalogue = await checkElementExists(driver, "id", "learning-catalog");
        assert.ok(isHasCatalogue, "Learning Catalogue section display failed!");
    });

    after(async () => await driver.quit());
});
