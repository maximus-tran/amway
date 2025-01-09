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

  it("Learning Path should be open", async () => {
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

    //Navigate to Learning Paths tab
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
      const updatedList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
      const isHasDotIcon = await updatedList[item].findElement(By.className("card_dotseparator__rbh7m")).isDisplayed().then(() => true).catch(() => false);
      if (isHasDotIcon) {
        await updatedList[item].click();
        const subCourse = await driver.findElements(By.className("card_card__dPAc9"));
        const mainTitle = await driver.wait(until.elementLocated(By.className("lpbannersection_title__NgQgR")), timeOut).getText();
        console.log(mainTitle)
        const loopCourseCount = subCourse.length > 2
        for (let x = 0; x < loopCourseCount; x++) {
          //Start Course
          const originalWindow = await driver.getWindowHandle();
          const startCourse = await driver.wait(
            until.elementLocated(By.className("learningpathdetails_btn_container__rCzyi")),
            timeOut,
          );
          await startCourse.click();

          //Navigate to detail course
          const windows = await driver.getAllWindowHandles();
          windows.forEach(async (handle) => {
            if (handle !== originalWindow) {
              await driver.switchTo().window(handle);
            }
          });
          const lessonContent = await driver.wait(
            until.elementLocated(By.id("app")),
            timeOut,
          );
          await driver.wait(until.elementIsVisible(lessonContent), timeOut);

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

          console.log("Resuming the auto test...");

          //Close detail course
          await driver.switchTo().window(originalWindow);

          const isDisplayedCompletedIcon = await checkElementExists(
            driver,
            "xpath",
            "//img[@alt='course complete icon']"
          );
          assert.ok(isDisplayedCompletedIcon, `Completed icon is not displayed in course ${x}`);
          const completedCourseCount = await driver.findElements(By.xpath("//img[@alt='course complete icon']"));
          const subCourseNew = await driver.findElements(By.className("card_card__dPAc9"));
          console.log(`${completedCourseCount.length}/${subCourseNew.length} courses completed`);

          await scrollToElement(driver, await driver.findElement(By.className("card_bottom_area__miHVB")));
          const screenshotDir = path.join(
            "auto-testing-report",
            "screenshots",
            "verifyTotalNumberOfCourses",
          );
          await handleScreenShot(
            driver,
            screenshotDir,
            `verifyTotalNumberOfCourses.png`,
          );
          addContext(this, {
            title: `No courses have been completed yet`,
            value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/verifyTotalNumberOfCourses.png`,
          });

          // //Back to learning path tab
          await driver.sleep(800);
          await driver.wait(until.elementLocated(By.xpath("//div[@id=\'__next\']/main/div/div/div/button/span[2]")), timeOut).click();

          break;
        }

        await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
        //Check progress bar is displayed in the course you just studied in 'Total' tab
        const list = await driver.findElements(By.css(".card_name__HOcFA"));
        for (let y = 0; y < list.length; y++) {
          const courseProgress = await list[y].getText();
          if (mainTitle === courseProgress) {
            //Check progress bar is displayed 
            const isDisplayedProgressBarInCard = await checkElementExists(
              driver,
              "className",
              "card_lpduration__FTNMb"
            )
            assert.ok(isDisplayedProgressBarInCard, `Progress bar is not displayed in course ${y}`);
            break;
          }
          //Navigate to In progress tab
          await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
          // Learning Path should be displayed at In Progress tab
          await driver.wait(until.elementLocated(By.className("tabDetails_card_wrapper__SBAfO")), timeOut);
          const listProgress = await driver.findElements(By.className("card_name__HOcFA"));
          const loopProgressCount = listProgress.length;
          for (let y = 0; y < loopProgressCount; y++) {
            const courseTitle = await listProgress[y].getText();
            await scrollToElement(driver, listProgress[y]);
            //capture screenshot
            const screenshotDir = path.join(
              "auto-testing-report",
              "screenshots",
              "verifyTotalNumberOfCourses",
            );
            await handleScreenShot(
              driver,
              screenshotDir,
              `verifyTotalNumberOfCourses_1.png`,
            );
            addContext(this, {
              title: `The course ${courseTitle} is existed in the In Progress section`,
              value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/verifyTotalNumberOfCourses_1.png`,
            });
            assert.ok(mainTitle === courseTitle,
              `The course ${mainTitle} is not existed in the In Progress section`,
            );
          }
          break;
        }
        break;
      }
    }
  });

  after(async () => await driver.quit());
});
