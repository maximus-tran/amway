import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";
import { scrollToElement } from "../../common/scrollTo.js";

describe("Academy web_Learning Path_Certificate_Favourite", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Learning Path should be displayed at Completed tab and Favourite tab", async () => {
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
            const isHasCompletedIcon = await learningPathsList[item]
                .findElement(By.className("card_favorite__ZqIw6"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);

            const isHasFavouriteIcon = await learningPathsList[item]
                .findElement(By.className("card_favorite__ZqIw6"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);

            if (isHasCompletedIcon && isHasFavouriteIcon) {
                const courseTitle = await learningPathsList[item].getText();
                // Navigate to Completed tab
                await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
                await driver.wait(
                    until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")),
                    timeOut,
                );
                // Check course is displayed in Completed tab
                const learningPathCompleted = await driver.findElements(
                    By.className("card_card__dPAc9"),
                );
                const loopCourseCompleted = learningPathCompleted.length;

                for (let x = 0; x < loopCourseCompleted; x++) {
                    const courseTitleCompleted = await learningPathCompleted[x].getText();
                    await scrollToElement(driver, learningPathCompleted[x]);
                    await driver.sleep(1000);
                    console.log("/////////////");
                    const screenshotDir = path.join(
                        "auto-testing-report",
                        "screenshots",
                        "learningPathFavourite",
                    );
                    await handleScreenShot(
                        driver,
                        screenshotDir,
                        `courseDisplayedAtCompletedTab.png`,
                    );
                    addContext(this, {
                        title: `The course ${courseTitle} is not existed in Completed tab`,
                        value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/courseDisplayedAtCompletedTab.png`,
                    });
                    console.log("----------------");
                    assert.deepEqual(
                        courseTitle,
                        courseTitleCompleted,
                        `The course ${courseTitle} is not existed in Completed tab`,
                    );
                    break;
                }

                // Navigate to Favourite tab
                await driver.wait(until.elementLocated(By.id("tab-favorite")), timeOut).click();
                await driver.wait(
                    until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")),
                    timeOut,
                );
                // Check course is displayed in Favourite tab
                const learningPathFavourite = await driver.findElements(
                    By.className("card_card__dPAc9"),
                );
                const loopCourseFavourite = learningPathFavourite.length;

                for (let y = 0; y < loopCourseFavourite; y++) {
                    const courseTitleFavourite = await learningPathFavourite[y].getText();
                    await driver.sleep(1000);
                    console.log(";;;;;;;;;;;;;;;;;");
                    await scrollToElement(driver, learningPathFavourite[y]);
                    const screenshotDir = path.join(
                        "auto-testing-report",
                        "screenshots",
                        "learningPathFavourite",
                    );
                    await handleScreenShot(
                        driver,
                        screenshotDir,
                        `courseDisplayedAtFavouriteTab.png`,
                    );
                    addContext(this, {
                        title: `The course ${courseTitle} is not existed in Favourite tab`,
                        value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/courseDisplayedAtFavouriteTab.png`,
                    });
                    console.log("===================");
                    assert.deepEqual(
                        courseTitle,
                        courseTitleFavourite,
                        `The course ${courseTitle} is not existed in Favourite tab`,
                    );

                    break;
                }

                break;
            }
        }
    });

    after(async () => await driver.quit());
});
