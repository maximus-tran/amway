import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";
import { scrollToElement } from "../../common/scrollTo.js";

describe("Verify Certificate UI in Learning Path drawer", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it(`Retake button should be displayed with completed label and tick`, async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    const user = {
      email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
      password: "Amway@1234",
      username: "GENE FLUECK",
    };
    // Login
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
    assert.ok((await driver.getTitle()) === "Learning Path", "Navigation to Learning Paths failed");

    // Navigate to Completed tab
    await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
    await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
    const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));
    const loopCompletedCount = listCompleted.length;

    for (let item = 0; item < loopCompletedCount; item++) {
      const updatedList = await driver.findElements(By.css(".card_name__HOcFA"));
      const isHasCompletedIcon = await updatedList[item].findElement(By.xpath("//img[@alt='course complete icon']")).isDisplayed().then(() => true).catch(() => false);
      if (isHasCompletedIcon) {
        await updatedList[item].click();
        // Check retake button is displayed
        const isDisplayedRetakeButton = await checkElementExists(
          driver,
          "className",
          "learningpathdetails_btn_container__rCzyi"
        );
        assert.ok(isDisplayedRetakeButton, "Retake button is not displayed");
        // Check tick icon is displayed
        const isDisplayedTickIcon = await checkElementExists(
          driver,
          "xpath",
          "//div[@id=\'__next\']/main/div/div[2]/div[2]/div/div[2]/div/div/img"
        );
        assert.ok(isDisplayedTickIcon, "Tick icon is not displayed");

        // Wait learning path details is displayed
        await driver.sleep(1000);

        const screenshotDir = path.join(
          "auto-testing-report",
          "screenshots",
          "retakeLearningPathCourse"
        );
        await handleScreenShot(
          driver,
          screenshotDir,
          `retakeButtonAndTickIcon.png`
        );
        addContext(this, {
          title: `Retake button and Tick icon is not existed in Learning Path Details`,
          value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/retakeButtonAndTickIcon.png`,
        });

        // Back to Completed tab
        await driver.wait(until.elementLocated(By.className("button_seconday_btn__KmHyZ")), timeOut).click()

        break;
      }
    }
  });

  it("User should be able to retake the Learning Path, but progress should not updated as it is already completed", async () => {
    // Navigate to Completed tab
    await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
    await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
    const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));
    const loopCompletedCount = listCompleted.length;

    for (let item = 0; item < loopCompletedCount; item++) {
      const updatedList = await driver.findElements(By.css(".card_name__HOcFA"));
      const isHasCompletedIcon = await updatedList[item].findElement(By.xpath("//img[@alt='course complete icon']")).isDisplayed().then(() => true).catch(() => false);
      if (isHasCompletedIcon) {
        await updatedList[item].click();
        const courseTitle = await driver.wait(until.elementLocated(By.className("lpbannersection_title__NgQgR")), timeOut).getText();

        const originalWindow = await driver.getWindowHandle();
        // Start retake course
        await driver.wait(until.elementLocated(By.className("learningpathdetails_btn_container__rCzyi")), timeOut).click()

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
        // Wait for the initial page (window) to close
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

        await driver.switchTo().window(originalWindow);
        await driver.sleep(2000);

        const screenshotDir = path.join(
          "auto-testing-report",
          "screenshots",
          "retakeLearningPathCourse"
        );
        await handleScreenShot(
          driver,
          screenshotDir,
          `progressBarIsNotDisplayedAfterRetake.png`
        );
        addContext(this, {
          title: `Progress Bar is not existed after retake learning path`,
          value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/progressBarIsNotDisplayedAfterRetake.png`,
        });

        // Back to Completed tab
        await driver.sleep(2000);
        await driver.wait(until.elementLocated(By.className("button_seconday_btn__KmHyZ")), timeOut).click()

        // Navigate to In progress tab
        await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
        // Check course should be removed from In Progress tab
        await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
        const listProgress = await driver.findElements(By.className("card_name__HOcFA"));
        const loopProgressCount = listProgress.length;
        for (let index = 0; index < loopProgressCount; index++) {
          const courseTitleInProgress = await listProgress[index].getText();
          await scrollToElement(driver, listProgress[index]);
          //capture screenshot
          const screenshotDir = path.join(
            "auto-testing-report",
            "screenshots",
            "retakeLearningPathCourse",
          );
          await handleScreenShot(
            driver,
            screenshotDir,
            `learningPathCourseRemovedInProgressTab.png`,
          );
          addContext(this, {
            title: `The course ${courseTitleInProgress} is still existed in the In Progress section`,
            value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/learningPathCourseRemovedInProgressTab.png`,
          });
          assert.ok(
            !(courseTitle === courseTitleInProgress),
            `The course ${courseTitle} is still existed in the In Progress section`,
          );
        }

        break;
      }
    }
  })

  after(async () => await driver.quit());
});
