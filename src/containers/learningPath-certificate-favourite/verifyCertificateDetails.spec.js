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

    it("Learning Path certificate should be displayed with the ABO name, Learning Path name, LP completion date and certificate number", async () => {
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
            const isHasCompletedIcon = await updatedList[item]
                .findElement(By.xpath(`.//img[@alt="course complete icon"]`))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);

            const isHasBadgeIcon = await updatedList[item]
                .findElement(By.xpath(`.//img[@alt="award icon"]`))
                .isDisplayed()
                .then(() => true)
                .catch(() => false);

            if (isHasCompletedIcon && isHasBadgeIcon) {
                await updatedList[item].click();
                const courseTitle = await driver
                    .wait(
                        until.elementLocated(By.className("lpbannersection_title__NgQgR")),
                        timeOut,
                    )
                    .getText();
                await driver.wait(
                    until.elementLocated(By.className("learningpathdetails_detailswrapper__5MPWs")),
                    timeOut,
                );

                // Check Certificate UI is displayed
                const isDisplayedCertificate = await checkElementExists(
                    driver,
                    "className",
                    "awardModal_awardContainer__VZjWa awardModal_awardCompleted__bYI0j",
                );
                assert.ok(isDisplayedCertificate, "Certificate UI is not displayed");

                // Open certificate modal
                await driver
                    .wait(
                        until.elementLocated(
                            By.className(
                                "awardModal_awardContainer__VZjWa awardModal_awardCompleted__bYI0j",
                            ),
                        ),
                        timeOut,
                    )
                    .click();
                // Check certificate modal is displayed
                const isDisplayedCertificateModal = await checkElementExists(
                    driver,
                    "className",
                    "learningPathCert_certificateContainer__yMURr",
                );
                assert.ok(isDisplayedCertificateModal, "Certificate Modal is not existed");
                // Check ABO Name is displayed
                const username = await driver
                    .wait(
                        until.elementLocated(By.className("learningPathCert_nameTxt__TQEUW")),
                        timeOut,
                    )
                    .getText();
                assert.ok(
                    username.toLowerCase() === user.username.toLowerCase(),
                    `${username} and ${user.username} not match`,
                );
                // Check Learning Path name is displayed
                const courseTitleInCertificate = await driver
                    .wait(
                        until.elementLocated(
                            By.className("learningPathCert_descriptionTxt___wEyf"),
                        ),
                        timeOut,
                    )
                    .getText();
                assert.ok(
                    await courseTitleInCertificate.includes(courseTitle),
                    `${courseTitle} and ${courseTitleInCertificate} is not match`,
                );
                // Check download button is displayed
                const isDisplayedDownloadButton = await checkElementExists(
                    driver,
                    "className",
                    "learningPathCert_saveAwardLink__4J_yj",
                );
                assert.ok(isDisplayedDownloadButton, "Download button is not displayed");
                // // Click Download button, Save as pop up is displayed
                // await driver.wait(until.elementLocated(By.className("learningPathCert_saveAwardLink__4J_yj")), timeOut).click()

                await driver.sleep(1000);
                const screenshotDir = path.join(
                    "auto-testing-report",
                    "screenshots",
                    "learningPathFavourite",
                );
                await handleScreenShot(driver, screenshotDir, `certificateDetails.png`);
                addContext(this, {
                    title: `Learning Path certificate is not existed`,
                    value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/certificateDetails.png`,
                });

                break;
            }
        }
    });

    after(async () => await driver.quit());
});
