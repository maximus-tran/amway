import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";

describe("Academy web_Learning Path_Certificate_Favourite", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Learning Path drawer should be open and user should be able to view the Certificate UI", async () => {
        await driver.get(`${baseURL}/dashboard?init=true`);
        const user = {
            email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
            password: "Amway@1234",
            username: "GENE FLUECK",
        };
        //Login
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();
        await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut);

        // Navigate to Learning Paths tab
        const navigateTab = await driver.findElement(
            By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[3]"),
        );
        await navigateTab.click();
        await driver.wait(
            until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")),
            timeOut,
        );
        assert.ok(
            (await driver.getTitle()) === "Learning Path",
            "Navigation to Learning Paths failed",
        );

        const learningPathsList = await driver.findElements(
            By.css(".tabDetails_cardwrapper_children__x4NMP"),
        );
        const loopCount = learningPathsList.length;

        for (let item = 0; item < loopCount; item++) {
            const updatedList = await driver.findElements(
                By.css(".tabDetails_cardwrapper_children__x4NMP"),
            );
            // Select Learning path is not completed with badge icon
            const isHasBadgeIcon = await updatedList[item]
                .findElement(By.className("card_certificate__1Ncvc"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);
            if (isHasBadgeIcon) {
                await updatedList[item].click();
                // Check Learning Path drawer is displayed
                const isDisplayedBannerSection = await checkElementExists(
                    driver,
                    "className",
                    "lpbannersection_container__IygsL",
                );
                assert.ok(isDisplayedBannerSection, "Banner section is not displayed");
                const isDisplayedDetails = await checkElementExists(
                    driver,
                    "className",
                    "learningpathdetails_detailswrapper__5MPWs",
                );
                assert.ok(isDisplayedDetails, "Learning Path details is not displayed");
                // Check Certificate UI is displayed
                const isDisplayedCertificate = await checkElementExists(
                    driver,
                    "className",
                    "awardModal_awardContainer__VZjWa awardModal_notAwardCompleted__Px30q",
                );
                assert.ok(isDisplayedCertificate, "Certificate UI is not displayed");
                // Back to learning path tab
                await driver
                    .wait(
                        until.elementLocated(
                            By.className(
                                "button_button_wrapper__XaMM9 button_rounded__7_4oM button_seconday_btn__KmHyZ",
                            ),
                        ),
                        timeOut,
                    )
                    .click();
                break;
            }
        }
    });

    it("Favourite icon should be displayed as filled in white and course under should play successfully", async () => {
        await driver.wait(
            until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")),
            timeOut,
        );
        const learningPathsList = await driver.findElements(
            By.css(".tabDetails_cardwrapper_children__x4NMP"),
        );
        const loopCount = learningPathsList.length;

        for (let item = 0; item < loopCount; item++) {
            const updatedList = await driver.findElements(
                By.css(".tabDetails_cardwrapper_children__x4NMP"),
            );
            // Select Learning path is not completed with badge icon
            const isHasBadgeIcon = await updatedList[item]
                .findElement(By.className("card_certificate__1Ncvc"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);
            if (isHasBadgeIcon) {
                await updatedList[item].click();
                //Check Favourite Icon is displayed
                const isHasFavouriteIcon = await checkElementExists(
                    driver,
                    "className",
                    "SocialMediaShareButton_btnContainer__xBnuM",
                );
                assert.ok(isHasFavouriteIcon, `Favourite Icon is not displayed`);

                //Favourite icon should be displayed as filled in white
                const isHasImgFav = await checkElementExists(
                    driver,
                    "xpath",
                    "//button[@aria-label='favourite icon']",
                );
                assert.ok(isHasImgFav, `Icon is not displayed`);

                const favouriteButton = await driver.wait(
                    until.elementLocated(
                        By.className("SocialMediaShareButton_btnContainer__xBnuM"),
                    ),
                    timeOut,
                );
                const likeIcon = (
                    await favouriteButton.findElement(By.css("img")).getAttribute("src")
                ).includes("likeIcon.b295a0fc.svg");
                assert.ok(likeIcon, `Like icon is not displayed`);
                await favouriteButton.click();
                const favIcon = (
                    await favouriteButton.findElement(By.css("img")).getAttribute("src")
                ).includes("favorite.647593da.svg");
                assert.ok(favIcon, `Favourite icon should be displayed as filled in white`);

                // Check course under learning path should play successfully
                const subCourse = await driver.findElements(By.css(".card_card__dPAc9"));

                for (let x = 0; x < subCourse.length; x++) {
                    await subCourse[x].click();
                    const originalWindow = await driver.getWindowHandle();
                    // Start Course
                    await driver
                        .wait(
                            until.elementLocated(
                                By.className("courseDurationModal_btn_container__NANdK"),
                            ),
                            timeOut,
                        )
                        .click();

                    const windows = await driver.getAllWindowHandles();
                    windows.forEach(async (handle) => {
                        if (handle !== originalWindow) {
                            await driver.switchTo().window(handle);
                        }
                    });
                    await driver.wait(until.titleIs("Adapt"), timeOut);
                    assert.ok(
                        (await driver.getTitle()) === "Adapt",
                        "Navigation to detail course failed",
                    );
                    const lessonContent = await driver.wait(
                        until.elementLocated(By.className("page__inner")),
                        timeOut,
                    );
                    await driver.wait(until.elementIsVisible(lessonContent), timeOut);

                    const content = await driver.wait(
                        until.elementLocated(By.className("block__inner")),
                        timeOut,
                    );
                    await driver.wait(until.elementIsVisible(content), timeOut);

                    await driver.sleep(1000);
                    const screenshotDir = path.join(
                        "auto-testing-report",
                        "screenshots",
                        "learningPathFavourite",
                    );
                    await handleScreenShot(
                        driver,
                        screenshotDir,
                        `learningPathPlaySuccessfully.png`,
                    );
                    addContext(this, {
                        title: `Course under the Learning Path should play successfully`,
                        value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/learningPathPlaySuccessfully.png`,
                    });

                    await driver.close();
                    await driver.switchTo().window(originalWindow);
                    await driver.sleep(2000);

                    break;
                }
                break;
            }
        }
    });

    after(async () => await driver.quit());
});
