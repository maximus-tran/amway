import { By, Key, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";
import { hoverOverElement } from "../../common/scrollTo.js";

describe("Academy web_Search_Filter", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("User should be able to see the cursor blinking", async () => {
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

    // Check search input is displayed
    const isDisplayedSearchFilter = await checkElementExists(
      driver,
      "className",
      "SearchBar_input_container__3sVPO"
    );
    assert.ok(isDisplayedSearchFilter, "Search Filter is not displayed")

    // Hover mouse to search input
    const element = await driver.findElement(By.id("autocomplete-input"));
    await hoverOverElement(driver, element);
  });

  it("Redirect to the Search: View & Filter Result screen with the entered search terms activated", async () => {
    // Entered search terms
    await driver.wait(until.elementLocated(By.id("autocomplete-input")), timeOut).sendKeys("award");

    // Press ENTER
    await driver.sleep(1000)
    await driver.actions().sendKeys(Key.ENTER).perform();
    await driver.wait(until.elementLocated(By.className("searchPage_mainWrapper__xBRaf")), timeOut);
    assert.ok((await driver.getTitle()) === "Search", "Navigation to Search failed");

    // Click outside to turn off pop up results
    await driver.wait(until.elementLocated(By.className("searchPage_lbl__KlUL8")), timeOut).click();

    await driver.sleep(1000)
    // Check View & Filter is displayed
    const isDisplayedFilter = await checkElementExists(
      driver,
      "className",
      "searchPage_filterInnerWrapper__nAADu"
    );
    assert.ok(isDisplayedFilter, "View & Filter is not displayed");

    // Check result table is displayed
    const isDisplayedResultTable = await checkElementExists(
      driver,
      "className",
      "searchPage_resultContainer__OS62z"
    )
    assert.ok(isDisplayedResultTable, "Result table is not displayed");

    const screenshotDir = path.join(
      "auto-testing-report",
      "screenshots",
      "academyWebSearchFilter",
    );
    await handleScreenShot(
      driver,
      screenshotDir,
      `verifySearchFilter.png`,
    );
    addContext(this, {
      title: `Result screen is not existed in Favourite tab`,
      value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/verifySearchFilter.png`,
    });
  });

  it("User should go to Courses tab by default with total Number Of Courses and it should show Learning path pill tab next to Courses pill tab with the and total Number Of Learning Paths", async () => {
    // Check Learning Path pill tab is displayed next to Courses pill tab
    const isDisplayedPillTab = await checkElementExists(
      driver,
      "className",
      "tab_wrapper__DEA_E"
    )
    assert.ok(isDisplayedPillTab, "Pill tab is not displayed");

    // Get the value of the search input
    const searchValue = await driver.wait(until.elementLocated(By.id("autocomplete-input")), timeOut).getAttribute("value");
    // Total Results for ""
    const totalResultFor = await driver.wait(until.elementLocated(By.className("searchPage_resultCount__8coJT")), timeOut).getText();
    assert.ok(await totalResultFor.includes(searchValue), `${searchValue} and ${totalResultFor} is not match`);

    await driver.sleep(1000);
    const screenshotDir = path.join(
      "auto-testing-report",
      "screenshots",
      "academyWebSearchFilter",
    );
    await handleScreenShot(
      driver,
      screenshotDir,
      `totalNumberOfCourses.png`,
    );
    addContext(this, {
      title: `Total Number Of Courses and it should show Learning path pill tab next to Courses pill tab`,
      value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/totalNumberOfCourses.png`,
    });
  })

  it("It should display the search result that matches between the Courses/ Learning Path title, Description, Author/Speaker Name or CST and key words", async () => {
    const haveResult = await checkElementExists(
      driver,
      "className",
      "searchResultCard_card__8KfTe"
    );

    if (haveResult) {
      const listResult = await driver.findElements(By.className("searchResultCard_card__8KfTe"));
      const loopCount = listResult.length;

      for (let item = 0; item < loopCount; item++) {
        const courseContent = await listResult[item].getText();
        // Get the value of the search input
        const searchValue = await driver.wait(until.elementLocated(By.id("autocomplete-input")), timeOut).getAttribute("value");
        assert.ok(await courseContent.toLowerCase().includes(searchValue.toLowerCase()), `${searchValue} is not match between the Courses/ Learning Path title, Description, Author/Speaker Name or CST and key words`);

        await driver.sleep(1000);
        const screenshotDir = path.join(
          "auto-testing-report",
          "screenshots",
          "academyWebSearchFilter",
        );
        await handleScreenShot(
          driver,
          screenshotDir,
          `matchingContent.png`,
        );
        addContext(this, {
          title: `Total Number Of Courses and it should show Learning path pill tab next to Courses pill tab`,
          value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/matchingContent.png`,
        });

        break;
      }
    }
  })

  it("It should redirect to the respective Course details screen", async () => {
    const haveResult = await checkElementExists(
      driver,
      "className",
      "searchResultCard_card__8KfTe"
    );

    if (haveResult) {
      const listResult = await driver.findElements(By.className("searchResultCard_card__8KfTe"));
      const loopCount = listResult.length;

      for (let item = 0; item < loopCount; item++) {
        await listResult[item].click();
        // Check course details modal is displayed
        const isDisplayedCourseDetails = await checkElementExists(
          driver,
          "className",
          "startLaunchCourse_start_launch_course_container__qYr6q"
        );
        assert.ok(isDisplayedCourseDetails, "Course details screen is not displayed")

        await driver.wait(until.elementLocated(By.className("startLaunchCourse_section_container__ZsDA4")), timeOut);
        const screenshotDir = path.join(
          "auto-testing-report",
          "screenshots",
          "academyWebSearchFilter",
        );
        await handleScreenShot(
          driver,
          screenshotDir,
          `redirectToCourseDetails.png`,
        );
        addContext(this, {
          title: `Total Number Of Courses and it should show Learning path pill tab next to Courses pill tab`,
          value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/redirectToCourseDetails.png`,
        });

        break;
      }
    }
  })

  after(async () => await driver.quit());
});
