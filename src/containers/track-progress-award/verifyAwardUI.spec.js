import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";
import { isLanguageMatching } from "../../common/detectLanguage.js";

describe("KAN-21: Verify Award UI in course detail", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("User should be able to view the Award UI, added languages in the Language selector drop-down", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys("MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com");
    await driver.findElement(By.id("loginform:password")).sendKeys("Amway@1234");
    await driver.findElement(By.id("loginform:loginButton")).click();

    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut)
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length > 3 ? 3 : list.length;

    for (let item = 0; item < loopCount; item++) {
      const awardIcon = await list[item].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      if (awardIcon) {
        await list[item].click();
        const isDisplayedAward = await checkElementExists(driver, "awardModal_image_wrapper__zoJSV");
        const isDiplayedDropDown = await checkElementExists(driver, "dropdown_drop_down__pHsMb");
        if (isDisplayedAward && isDiplayedDropDown) {
          const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
          await dropdown.click();

          const selectLanguage = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
          for (let i = 0; i < selectLanguage.length; i++) {
            if (i !== 0) {
              const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
              await dropdown.click();
            }
            const selectLanguageNew = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
            const selectedLang = await selectLanguageNew[i].getText();
            await selectLanguageNew[i].click();
            const langArr = [
              {
                label: "English",
                value: "en"
              },
              {
                label: "Italiano",
                value: "it"
              },
              {
                label: "Deutsch",
                value: "de"
              },
              {
                label: "中文",
                value: "zh"
              },
              {
                label: "Français",
                value: "fr"
              }
            ]
            const selectedLangValue = langArr.find(x => x.label === selectedLang).value;

            const img = await driver.wait(until.elementLocated(By.className("awardModal_image_wrapper__zoJSV")), timeOut);
            const titleAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardtitle__7ethH")), timeOut)
              .getText();
            const descriptionAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardSmallDesc__tDF_M")), timeOut)
              .getText();
            assert.ok(await img.isDisplayed(), "Award image is not displayed");
            assert.ok(isLanguageMatching(titleAward, [selectedLangValue]), `Title Award (${titleAward}) not match to ${selectedLang}`);
            assert.ok(isLanguageMatching(descriptionAward, [selectedLangValue]), `Description Award (${descriptionAward}) not match to ${selectedLang}`);
          }
          await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
          break;
        }
        else if (isDisplayedAward && !isDiplayedDropDown) {
          const img = await driver.wait(until.elementLocated(By.className("awardModal_image_wrapper__zoJSV")), timeOut);
          const titleAward = await driver
            .wait(until.elementLocated(By.className("awardModal_awardtitle__7ethH")), timeOut)
            .getText();
          const descriptionAward = await driver
            .wait(until.elementLocated(By.className("awardModal_awardSmallDesc__tDF_M")), timeOut)
            .getText();
          const primaryLanguage = ["en"];
          assert.ok(await img.isDisplayed(), "Award image is not displayed");
          assert.ok(isLanguageMatching(titleAward, primaryLanguage), `Title Award (${titleAward}) not match to English`);
          assert.ok(isLanguageMatching(descriptionAward, primaryLanguage), `Description Award (${descriptionAward}) not match to English`);
        }
        await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
        break;
      }
    }
  });

  it("Verify start learning course", async () => {
    if (await driver.findElement(By.className("startLaunchCourse_start_launch_course_container__qYr6q")).isDisplayed()) {
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
    const listAll = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = listAll.length > 3 ? 3 : listAll.length;
    for (let course = 0; course < loopCount; course++) {
      const originalWindow = await driver.getWindowHandle();
      await listAll[course].click();
      const contentButton = await driver.wait(until.elementLocated(By.className("button_btn_text__rvpWC")), timeOut).getText();
      const langArr = [
        { label: "Continua" },
        { label: "Inizio il corso" },
        { label: "Continue" },
        { label: "Start Course" },
        { label: "继续" },
        { label: "开始课程" },
      ]
      const buttonValue = langArr.find(x => x.label === contentButton);
      if (buttonValue) {
        const titleCourse = await driver.wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut).getText();
        const descriptionCourse = await driver.wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut).getText();

        await driver.wait(until.elementLocated(By.className("button_button_wrapper__XaMM9 button_rounded__7_4oM ")), timeOut).click();
        const windows = await driver.getAllWindowHandles();
        windows.forEach(async handle => {
          if (handle !== originalWindow) {
            await driver.switchTo().window(handle);
          }
        });
        await driver.wait(until.titleIs("Adapt"), timeOut);
        assert.ok(await driver.getTitle() === "Adapt", "Navigation to detail course failed");
        const lessonContent = await driver.wait(until.elementLocated(By.className("page__inner")), timeOut);
        await driver.wait(until.elementIsVisible(lessonContent), timeOut);
        await driver.close();

        await driver.switchTo().window(originalWindow);

        await driver.sleep(8000);
        await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();

        await driver.wait(until.elementLocated(By.id("tabpanel-in_progress")), timeOut);
        const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

        for (let i = 0; i < list.length; i++) {
          await list[i].click();
          const titleInProgress = await driver.wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut).getText();
          if (titleCourse === titleInProgress) {
            const progressBar = await list[i].findElement(By.className("card_progressbar_wrapper__36Fzy"));
            assert.ok(await progressBar.isDisplayed(), "Progress Bar does not displayed")
            const titlePopup = await driver
              .wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut)
              .getText();
            const descriptionPopup = await driver
              .wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut)
              .getText();

            assert.ok(titleCourse === titlePopup, `${titleCourse} and ${titlePopup} not match`);
            assert.ok(descriptionCourse === descriptionPopup, `${descriptionCourse} and ${descriptionPopup} not match`);
          }
          await driver.wait(until.elementLocated(By.className("startLaunchCourse_cross_icon__eyRob")), timeOut).click();
          break;
        }
        break;
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  })

  after(async () => await driver.quit());
});
