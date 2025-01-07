import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

describe("Verify complete the course", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it(`"Course Completed!" message with confetti background should be displayed`, async () => {
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

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

    for (let item = 0; item < list.length; item++) {
      const awardIcon = await list[item].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      if (awardIcon) {
        await list[item].click();
        //Check "Completed Course" is displayed
        const isHasCompletedCourse = await checkElementExists(
          driver,
          "className",
          "startLaunchCourse_completedTextContainer__6I5ub"
        )
        assert.ok(isHasCompletedCourse, `The text "Completed Course!" is not displayed`);

        //Open confetti background
        await driver.wait(until.elementLocated(By.className("awardModal_awardContainer__xf2lG awardModal_awardCompleted__kM1Oh")), timeOut).click();
        const isHasConfettiBackground = await checkElementExists(
          driver,
          "className",
          "courseCompletionWithAward_courseCompletionWithAwardContainer__LfrdE"
        )
        assert.ok(isHasConfettiBackground, `Confetti Background is not displayed`);

        //Check the text "Course Completed!" is displayed
        const isHasTextDisplayed = await checkElementExists(
          driver,
          "className",
          "courseCompletionWithAward_mainTitleContainer__Byd5E"
        );
        assert.ok(isHasTextDisplayed, `The text "Completed Course!" is not displayed in confetti background`);

        //Download button should be displayed below the confetti
        const isHasDownloadButton = await checkElementExists(
          driver,
          "className",
          "courseCompletionWithAward_saveAwardLink__Dbelt"
        )
        assert.ok(isHasDownloadButton, `Download button is not displayed`);

        // //Click download button award
        // await driver.wait(until.elementLocated(By.className("courseCompletionWithAward_saveAwardLink__Dbelt")), timeOut).click();
        break;
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  });

  after(async () => await driver.quit());
});
