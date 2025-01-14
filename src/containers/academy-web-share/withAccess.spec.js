import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import { isLanguageMatching } from "../../common/detectLanguage.js";
import path from "path";
import addContext from "mochawesome/addContext.js";

const user = {
  email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
  username: "GENE FLUECK",
  password: "Amway@1234",
};

describe("Academy web_Share_WithAccess", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("It should navigate to Course Details drawer and Learning Path details drawer", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    // Login
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys(user.email);
    await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
    await driver.findElement(By.id("loginform:loginButton")).click();

    const isDisplayedProfileIcon = await checkElementExists(
      driver,
      "className",
      "profileIcon_container__Pd3Ql"
    );
    assert.ok(isDisplayedProfileIcon, "Profile icon is not displayed");

    // Navigate to Course tab
    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut)
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length;

    for (let item = 0; item < loopCount; item++) {
      // Select a course
      await list[item].click();

      // Check course details is displayed
      const isDisplayedCourseDetails = await checkElementExists(
        driver,
        "className",
        "startLaunchCourse_start_launch_course_container__qYr6q"
      );
      assert.ok(isDisplayedCourseDetails, "Course details drawer is not displayed")

      // Close course details drawer
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
      break;
    }
  });

  it("It should show default share icon", async () => {
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length;

    for (let item = 0; item < loopCount; item++) {
      // Select a course
      await list[item].click();

      // Check share button is displayed
      const isDisplayedShareButton = await checkElementExists(
        driver,
        "className",
        "courseDurationModal_shareIcon__w6Mxt"
      )
      assert.ok(isDisplayedShareButton, "Share Button is not displayed");

      // Close course details drawer
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
      break;
    }
  })

  it(`The toast message should be appeared and stated "Link Copied! A share link has been copied to your clipboard. Press Ctrl-V to paste & share!"`, async () => {
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length;

    for (let item = 0; item < loopCount; item++) {
      // Select a course
      await list[item].click();

      // Click share button
      await driver.wait(until.elementLocated(By.className("courseDurationModal_shareIcon__w6Mxt")), timeOut).click();

      // Check "link copied!" pop up is displayed
      const isDisplayedLinkPopUp = await checkElementExists(
        driver,
        "className",
        "Toastify__toast-container Toastify__toast-container--top-center global_toastcontainer_width__XgSbG"
      )
      assert.ok(isDisplayedLinkPopUp, "Link Copied pop up is not displayed");

      // Check the message is displayed
      await driver.wait(until.elementIsVisible(driver.findElement(By.className("toast_desc__rhylE"))), timeOut);
      const isDisplayedMessage = await checkElementExists(
        driver,
        "className",
        "toast_desc__rhylE"
      );
      assert.ok(isDisplayedMessage, "The message is 'Link Copied! A share link has been copied to your clipboard. Press Ctrl-V to paste & share!' is not displayed");

      const validLanguage = ['it', 'en', 'zh']
      const title = await driver.wait(until.elementLocated(By.className("toast_info__Ap13d")), timeOut).getAttribute("innerHTML");
      assert.ok(isLanguageMatching(title, validLanguage), `The title is "${title}" is not displayed`)
      const message = await driver.wait(until.elementLocated(By.className("toast_desc__rhylE")), timeOut).getAttribute("innerHTML");
      assert.ok(isLanguageMatching(message, validLanguage), `The message is "${message}" is not displayed`);

      await driver.sleep(1000);
      const screenshotDir = path.join(
        "auto-testing-report",
        "screenshots",
        `academyWebShare`
      );
      await handleScreenShot(
        driver,
        screenshotDir,
        "displayedToastMessageWithAccess.png"
      );
      addContext(this, {
        title: `The toast message with access is not displayed in pop up`,
        value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/displayedToastMessageWithAccess.png`,
      });

      if (isDisplayedLinkPopUp) {
        // Close pop up
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("toast_closeButton__Rz4sT"))), timeOut).click();
      }
      // Close course details drawer
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
      break;
    }
  })

  it("ABO B (who has access) should be able to click on the link shared by ABO A", async () => {
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length;

    for (let item = 0; item < loopCount; item++) {
      // Select a course
      await list[item].click();

      // Click share button
      await driver.wait(until.elementLocated(By.className("courseDurationModal_shareIcon__w6Mxt")), timeOut).click();

      // Open link 
      await driver.executeScript(`
        return navigator.clipboard.readText();
      `);

      // Close pop up copying the link successfully
      await driver.wait(until.elementIsVisible(driver.findElement(By.className("toast_closeButton__Rz4sT"))), timeOut).click();

      // Close course details drawer
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
      break;
    }
  })

  after(async () => await driver.quit());
});
