import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { scrollToCss } from "../../common/scrollTo.js";
import { checkElementExists } from "../../common/checkViewport.js";

const user = {
    email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
    username: "GENE FLUECK",
    password: "Amway@1234",
};

describe("Verify footer", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Scroll down till bottom section and observe the footer section", async () => {
        await driver.get(baseURL);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();

        await driver.navigate().to(`${baseURL}/dashboard?init=true`);

        await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
        await scrollToCss(driver, ".commonfooter_desc_container__Jlkrk");
        //Row 1
        const isDisplayedInformation = await checkElementExists(driver, "css", "p[aria-label]");
        assert.ok(isDisplayedInformation, "The Disclaimer is not displayed");

        //Row 2
        const isDisplayedCopyright = await checkElementExists(driver, "css", "div[aria-label]");
        assert.ok(isDisplayedCopyright, "The copy right is not displayed");

        //Row 3
        const isPrivacyDisplayed = await checkElementExists(
            driver,
            "className",
            "commonfooter_privacy_policy__pkljo",
        );
        assert.ok(isPrivacyDisplayed, "Privacy Policy | Terms & Conditions is not displayed");
        if (isPrivacyDisplayed) {
            const privacy = await driver.wait(
                until.elementLocated(By.className("commonfooter_privacy_policy__pkljo")),
                timeOut,
            );
            const link = await privacy.findElements(By.css("a[href]"));
            assert.ok(
                (await link[0].getAttribute("href")).includes("privacy-policy"),
                "Privacy Policy is not displayed",
            );
            assert.ok(
                (await link[1].getAttribute("href")).includes("terms-of-use"),
                "Terms & Conditions is not displayed",
            );
        }
    });

    after(async () => await driver.quit());
});
