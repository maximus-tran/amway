import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";
import { isLanguageMatching } from "../../common/detectLanguage.js";

describe("KAN-17: Verify UI detailed course", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify that Title, Description, Author & Skill (where applicable) should be in selected language as per setup in Admin portal", async () => {
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

    //Navigate to Course tab
    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut)
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length > 3 ? 3 : list.length;

    for (let item = 0; item < loopCount; item++) {
      //Select a course
      await list[item].click();
      //Check dropdown is displayed
      const isDisplayedDropDown = await checkElementExists(driver, "className", "dropdown_drop_down__pHsMb");
      if (isDisplayedDropDown) {
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
              value: 'en'
            },
            {
              label: "Italiano",
              value: 'it'
            },
            {
              label: "Deutsch",
              value: 'de'
            },
            {
              label: "Chinese",
              value: 'zh'
            }
          ]
          const selectedLangValue = langArr.find(x => x.label === selectedLang).value

          const title = await driver
            .wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut)
            .getText();
          assert.ok(isLanguageMatching(title, [selectedLangValue]), `Title (${title}) not match to ${selectedLangValue}`);
          const description = await driver
            .wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut)
            .getText();
          if (await driver.findElements(By.className("tagDescriptionModal_tagContainer__qBucT")).length > 0) {
            const tags = await driver.findElement(By.className("tagDescriptionModal_tag_title__sm16V")).getText();
            assert.ok(isLanguageMatching(tags, [selectedLangValue]), `Tags (${tags}) not match to ${selectedLangValue}`);
          }
          assert.ok(isLanguageMatching(description, [selectedLangValue]), `Description (${description}) not match to ${selectedLangValue}`);
        }
      }

      else if (!isDisplayedDropDown) {
        const titleNew = await driver
          .wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut)
          .getText();
        assert.ok(isLanguageMatching(titleNew, validLanguage), `Title (${titleNew}) not matching to English`);
        const descriptionNew = await driver
          .wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut)
          .getText();
        const validLanguage = ["en"]
        if (await driver.findElements(By.className("tagDescriptionModal_tagContainer__qBucT")).length > 0) {
          const tags = await driver.findElement(By.className("tagDescriptionModal_tag_title__sm16V")).getText();
          assert.ok(isLanguageMatching(tags, validLanguage), `Tags (${tags}) not matching to English`);
        }
        assert.ok(isLanguageMatching(descriptionNew, validLanguage), `Description (${descriptionNew}) not matching to English`);
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  });

  it("Verify that can launch the Course successfully as per selected language", async () => {
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

    for (let i = 0; i < 3; i++) {
      //Select a course
      await list[i].click();
      //Check dropdown is displayed
      const isDisplayedDropDown = await checkElementExists(driver, "className", "dropdown_drop_down__pHsMb");
      if (isDisplayedDropDown) {
        const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
        await dropdown.click();
        const selectLanguage = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
        const selectLanguageCount = selectLanguage.length

        for (let x = 0; x < selectLanguageCount; x++) {
          if (x !== 0) {
            const updatedList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
            await updatedList[i].click();
            const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
            await dropdown.click();
          }
          //Start Course
          const originalWindow = await driver.getWindowHandle();
          const startCourse = await driver.wait(
            until.elementLocated(By.className("button_btn_text__rvpWC")),
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
          await driver.wait(until.titleIs("Adapt"), timeOut);
          assert.ok((await driver.getTitle()) === "Adapt", "Navigation to detail course failed");
          const lessonContent = await driver.wait(
            until.elementLocated(By.className("page__inner")),
            timeOut,
          );
          await driver.wait(until.elementIsVisible(lessonContent), timeOut);

          //Close detail course
          await driver.close();
          await driver.switchTo().window(originalWindow);

          await driver.sleep(7000);
        }
        break;
      }

      else if (!isDisplayedDropDown) {
        //Start Course
        const startCourse = await driver.wait(
          until.elementLocated(By.className("button_btn_text__rvpWC")),
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
        await driver.wait(until.titleIs("Adapt"), timeOut);
        assert.ok((await driver.getTitle()) === "Adapt", "Navigation to detail course failed");
        const lessonContent = await driver.wait(
          until.elementLocated(By.className("page__inner")),
          timeOut,
        );
        await driver.wait(until.elementIsVisible(lessonContent), timeOut);

        //Close detail course
        await driver.close();
        await driver.switchTo().window(originalWindow);
        await driver.sleep(7000);
      }
    }
  })

  after(async () => await driver.quit());
});
