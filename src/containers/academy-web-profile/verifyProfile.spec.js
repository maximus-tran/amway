import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import { detectAll } from "tinyld";
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

    it("Verify Select English language", async () => {
        await driver
            .wait(
                until.elementLocated(
                    By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]'),
                ),
                timeOut,
            )
            .click();
        await driver
            .wait(
                until.elementLocated(By.css(".CourseHeader_option_title__qilMd:nth-child(1)")),
                timeOut,
            )
            .click();
        const englishBanner = await driver.wait(
            until.elementLocated(By.id("mainContent")),
            timeOut,
        );
        const textContent = await englishBanner.getText();
        const detectedLanguages = detectAll(textContent).map((x) => x.lang);
        const isMatch = detectedLanguages.includes("en");
        assert.ok(isMatch, `Text of banner (${textContent}) is not matching to selected language`);
    });

    it("Verify Select Chinese language", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
            .click();
        await driver
            .wait(
                until.elementLocated(
                    By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]'),
                ),
                timeOut,
            )
            .click();
        await driver
            .wait(
                until.elementLocated(By.xpath("//div[@id='profileModal']/div/button[2]")),
                timeOut,
            )
            .click();
        const chineseBanner = await driver.wait(
            until.elementLocated(By.id("mainContent")),
            timeOut,
        );
        const textContent = await chineseBanner.getText();
        const detectedLanguages = detectAll(textContent).map((x) => x.lang);
        const isMatch = detectedLanguages.includes("zh");
        assert.ok(isMatch, `Text of banner (${textContent}) is not matching to selected language`);
    });

    it("Verify Select Italian language", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
            .click();
        await driver
            .wait(
                until.elementLocated(
                    By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]'),
                ),
                timeOut,
            )
            .click();
        await driver
            .wait(
                until.elementLocated(By.xpath("//div[@id='profileModal']/div/button[3]")),
                timeOut,
            )
            .click();
        const italianBanner = await driver.wait(
            until.elementLocated(By.id("mainContent")),
            timeOut,
        );
        const textContent = await italianBanner.getText();
        const detectedLanguages = detectAll(textContent).map((x) => x.lang);
        const isMatch = detectedLanguages.includes("it");
        assert.ok(isMatch, `Text of banner (${textContent}) is not matching to selected language`);
    });

    it("Verify it should open up e-Commerce website at a another tab", async () => {
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
            .click();
        const originalWindow = await driver.getWindowHandle();
        await driver
            .wait(until.elementLocated(By.xpath('//a[@aria-label="Pagina web Amway"]')), timeOut)
            .click();
        const windows = await driver.getAllWindowHandles();
        windows.forEach(async (handle) => {
            if (handle !== originalWindow) {
                await driver.switchTo().window(handle);
            }
        });
        const cartIcon = await checkElementExists(driver, "css", ".header__shopping_cart");
        assert.ok(
            cartIcon,
            "Cart icon is not displayed in e-Commerce website (Navigate to incorrect e-Commerce website)",
        );
        const button = await checkElementExists(
            driver,
            "className",
            "button__button    button__full_width ",
        );

        assert.ok(
            button,
            "Button of hero banner not displayed in e-Commerce website (Navigate to incorrect e-Commerce website)",
        );
    });

    after(async () => await driver.quit());
});
