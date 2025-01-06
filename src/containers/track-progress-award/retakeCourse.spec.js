import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

describe("Verify completed courses", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Retake button should be displayed with completed label and tick", async () => {
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

        //Navigate to completed section
        await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);

        const listCompleted = await driver.findElements(
            By.css(".tabDetails_cardwrapper_children__9RdHs"),
        );

        let isHasProgressBar = false;
        for (let i = 0; i < 3; i++) {
            const tickIcon = await listCompleted[i]
                .findElement(By.css(".tabDetails_cardwrapper_children__9RdHs:nth-child(1) .card_bottom_area__miHVB img:nth-child(2)"))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);
            const progressBar = await checkElementExists(driver, "card_progressbar_wrapper__36Fzy");
            //Check course with tick icon and progress bar
            if (tickIcon && !progressBar) {
                isHasProgressBar = true;
                await listCompleted[i].click();
                //Check the label button has "Retake course" content
                const retakeButton = await driver
                    .wait(until.elementLocated(By.className("button_btn_text__rvpWC")), 10000)
                    .getText();
                const langArr = [
                    { label: "Ripeti il corso" },
                    { label: "Retake Course" },
                    { label: "重修课程" },
                ];
                const buttonValue = langArr.find((x) => x.label === retakeButton);
                assert.ok(
                    retakeButton === buttonValue.label,
                    `Retake button (${retakeButton}) is not displayed in course ${i}`,
                );
                //Check completed icon is displayed
                const completedIcon = await checkElementExists(
                    driver,
                    "xpath",
                    "//img[@alt='done symbol']"
                );
                assert.ok(completedIcon, `Completion icon is not displayed in course ${i}`);
                await driver
                    .wait(
                        until.elementLocated(By.className("startLaunchCourse_cross_icon__eyRob")),
                        timeOut,
                    )
                    .click();
            }
        }
        assert.ok(isHasProgressBar, `Progress bar is still displayed`)
    });

    it("User should be able to retake the course, but progress should not updated as it is already completed", async () => {
        const listCompleted = await driver.findElements(
            By.css(".tabDetails_cardwrapper_children__9RdHs"),
        );

        for (let course = 0; course < listCompleted.length; course++) {
            //Select a course in completed section
            await listCompleted[course].click();
            const originalWindow = await driver.getWindowHandle();
            //getText title of course
            const titlePopup = await driver
                .wait(
                    until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")),
                    timeOut,
                )
                .getText();
            //Start course
            const retakeButton = await driver.wait(
                until.elementLocated(By.className("button_btn_text__rvpWC")),
                timeOut,
            );
            await retakeButton.click();

            //Navigate to detail course
            const windows = await driver.getAllWindowHandles();
            windows.forEach(async (handle) => {
                if (handle !== originalWindow) {
                    await driver.switchTo().window(handle);
                }
            });
            await driver.wait(until.titleIs("Adapt"), timeOut);
            assert.ok((await driver.getTitle()) === "Adapt", "Navigation to detail course failed");
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
            const iframe = await driver.findElements(By.css("iframe"));
            if (iframe.length > 0) {
                await driver.switchTo().frame(iframe[0]);
            }
            const video = await checkElementExists(
                driver,
                "xpath",
                "//video[@id='video_html5_api']"
            );
            if (video) {
                const videoElement = await driver.findElement(
                    By.xpath("//video[@id='video_html5_api']"),
                );
                const duration = await driver.executeScript(
                    "return arguments[0].duration;",
                    videoElement,
                );
                const playVideo = await driver.wait(
                    until.elementLocated(By.className("vjs-big-play-button")),
                    timeOut,
                );
                await playVideo.click();
                await driver.executeScript("arguments[0].currentTime;", videoElement);
                await driver.sleep(Math.floor(duration * 1000));
            }

            //Check course only contains an image
            const img = await checkElementExists(
                driver,
                "className",
                "component__image graphic__image"
            );
            if (img) {
                await driver.executeScript("window.scrollBy(0,document.body.scrollHeight)");
                const progress = await driver.findElement(By.className("pagelevelprogress__indicator-bar js-indicator-bar"));
                const progressPercentage = await driver.executeScript(
                    "return arguments[0].style.width;",
                    progress
                );
                assert.ok(progressPercentage === "100%", "Course not completed");
            }

            //Close detail course
            await driver.close();
            await driver.switchTo().window(originalWindow);

            await driver.sleep(8000);
            //Navigate to complete section
            await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
            await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);
            const afterRetake = await driver.findElements(By.className("card_name__HOcFA"));

            for (let i = 0; i < afterRetake.length; i++) {
                const titleRetakeCourse = await afterRetake[i].getText();
                const progressBar = await checkElementExists(
                    driver,
                    "className",
                    "card_progressbar_wrapper__36Fzy",
                );
                assert.ok(!progressBar, "Progress Bar is displayed")

                if (titlePopup === titleRetakeCourse) {
                    await afterRetake[i].click();
                    const completedIcon = await checkElementExists(
                        driver,
                        "xpath",
                        "//img[@alt='done symbol']",
                    );
                    assert.ok(completedIcon, `Completion icon is not displayed in course ${i}`);
                    await driver
                        .wait(
                            until.elementLocated(
                                By.className("startLaunchCourse_cross_icon__eyRob"),
                            ),
                            timeOut,
                        )
                        .click();
                    break;
                }
            }
            break;
        }
    });

    after(async () => await driver.quit());
});
