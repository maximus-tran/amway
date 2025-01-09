import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";
import { scrollToElement } from "../../common/scrollTo.js";

describe("Verify Certificate UI in Learning Path drawer", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it(`It should be displayed at "Complete" tab and removed from In Progress tab`, async () => {
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

    const learningPathsList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
    const loopCount = learningPathsList.length;

    for (let item = 0; item < loopCount; item++) {
      const updatedList = await driver.findElements(By.css(".card_name__HOcFA"));
      const isHasCompletedIcon = await updatedList[item].findElement(By.xpath("//img[@alt='course complete icon']")).isDisplayed().then(() => true).catch(() => false);
      const isHasBadgeIcon = await updatedList[item].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      if (isHasCompletedIcon && isHasBadgeIcon) {
        const courseTitle = await updatedList[item].getText();
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
            "courseRemovedInProgressTab",
          );
          await handleScreenShot(
            driver,
            screenshotDir,
            `courseRemovedInProgressTab.png`,
          );
          addContext(this, {
            title: `The course ${courseTitleInProgress} is still existed in the In Progress section`,
            value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/courseRemovedInProgressTab.png`,
          });
          assert.ok(
            !(courseTitle === courseTitleInProgress),
            `The course ${courseTitle} is still existed in the In Progress section`,
          );
        }

        // Navigate to Completed tab
        await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
        // Check course is displayed in Completed tab
        await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
        const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));
        const loopCompletedCount = listCompleted.length;
        let isHasCompletedCourse = false;
        for (let index = 0; index < loopCompletedCount; index++) {
          isHasCompletedCourse = true;
          const courseTitleInCompleted = await listCompleted[index].getText();
          await scrollToElement(driver, listCompleted[index]);
          //capture screenshot
          const screenshotDir = path.join(
            "auto-testing-report",
            "screenshots",
            "courseRemovedInProgressTab",
          );
          await handleScreenShot(
            driver,
            screenshotDir,
            `courseDisplayedInCompleted.png`,
          );
          addContext(this, {
            title: `The course ${courseTitleInCompleted} is not existed in the Completed section`,
            value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/courseDisplayedInCompleted.png`,
          });
        }
        assert.ok(
          isHasCompletedCourse,
          `The course ${courseTitle} is not existed in the Completed section`,
        );

        break;
      }
    }
  });

  after(async () => await driver.quit());
});
