import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import { scrollToElement } from "../../common/scrollTo.js";
import path from "path";
import addContext from "mochawesome/addContext.js";

const user = {
    email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
    username: "GENE FLUECK",
    password: "Amway@1234",
};

describe("Academy web_Courses_Track progress_Award", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it(`Click on the same course at In Progress tab and complete it: It should be displayed at "Complete" tab and removed from In Progress tab`, async function () {
        await driver.get(`${baseURL}/dashboard?init=true`);
        //Login
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();
        await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut);

        //Navigate to course tab
        const courses = await driver.findElement(
            By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"),
        );
        await courses.click();
        await driver.wait(
            until.elementLocated(By.className("courseTabs_tabs_wrapper__LQBEa")),
            timeOut,
        );
        assert.ok((await driver.getTitle()) === "Courses", "Navigation to Courses Page failed");

        //Navigate to in progress section
        await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-in_progress")), timeOut);

        const listProgress = await driver.findElements(
            By.css(".tabDetails_cardwrapper_children__9RdHs"),
        );
        const loopCount = listProgress.length;

        for (let i = 0; i < loopCount; i++) {
            const awardIcon = await listProgress[i]
                .findElement(By.className("card_award__R_edO"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);
            const progressBar = await checkElementExists(
                driver,
                "className",
                "card_progressbar_wrapper__36Fzy",
            );

            //Check course with award icon, time icon and progress bar
            if (awardIcon && progressBar) {
                const originalWindow = await driver.getWindowHandle();
                await listProgress[i].click();
                const titleCourse = await driver
                    .wait(
                        until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")),
                        timeOut,
                    )
                    .getText();
                //Start course
                const button = await driver.wait(
                    until.elementLocated(By.className("courseDurationModal_btn_container__NANdK")),
                    timeOut,
                );
                await button.click();

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

                await driver.executeScript(
                    'alert("Manual testing is required to complete this course");',
                );
                // Step 3: Wait for the initial page (window) to close
                let initialWindowHandle = await driver.getWindowHandle();
                await driver.wait(
                    async function () {
                        // Get the list of all window handles
                        let currentWindowHandles = await driver.getAllWindowHandles();

                        // Check if the initial window handle is no longer in the list
                        return !currentWindowHandles.includes(initialWindowHandle);
                    },
                    1000000,
                    "Waiting for the initial window to close...",
                ); // Timeout of 10 seconds

                console.log("resuming the auto test...");

                // await driver.close();
                await driver.switchTo().window(originalWindow);
                await driver.sleep(8000);
                //Back to main page
                await driver.wait(until.elementLocated(By.className("courseCompletionModal_homeBtn__39f1_")), timeOut).click();

                //Check course should be removed from In Progress tab
                await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
                await driver.wait(until.elementLocated(By.id("tabpanel-in_progress")), timeOut);
                const title = await driver.findElements(By.className("card_name__HOcFA"));
                const loopProgressCount = title.length;
                for (let index = 0; index < loopProgressCount; index++) {
                    const courseTitle = await title[index].getText();
                    if (titleCourse === courseTitle) {
                        await scrollToElement(driver, title[index]);
                        //capture screenshot
                        const screenshotDir = path.join(
                            "auto-testing-report",
                            "screenshots",
                            "completeAcademyWebCoursesProgressAward",
                        );
                        await handleScreenShot(
                            driver,
                            screenshotDir,
                            `completeAcademyWebCoursesProgressAward.png`,
                        );
                        addContext(this, {
                            title: `The course ${titleCourse} is still existed in the In Progress section`,
                            value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/completeAcademyWebCoursesProgressAward.png`,
                        });
                        assert.ok(
                            !(titleCourse === courseTitle),
                            `The course ${titleCourse} is still existed in the In Progress section`,
                        );
                    }
                }

                //Check course should be displayed at "Complete" tab
                await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
                await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);
                const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));
                const loopCompletedCount = listCompleted.length;
                let isHasCompletedCourse = false;
                for (let index = 0; index < loopCompletedCount; index++) {
                    const titleCompleted = await listCompleted[index].getText();
                    if (titleCourse === titleCompleted) {
                        isHasCompletedCourse = true;
                        break;
                    }
                }
                assert.ok(
                    isHasCompletedCourse,
                    "The course is not existed in the Completed section",
                );
                break;
            }
        }
    });

    after(async () => await driver.quit());
});
