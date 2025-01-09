import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";
import { isLanguageMatching } from "../../common/detectLanguage.js";

describe("Verify learning path detail", () => {
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
      //Select a course
      await driver.wait(until.elementLocated(By.css(".tabDetails_cardwrapper_children__x4NMP")), timeOut);
      // item !== 0 && await learningPathsList[item].click();
      const updatedList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
      await updatedList[item].click();
      //Check dropdown is displayed
      const isDisplayedDropDown = await checkElementExists(
        driver,
        "className",
        "learningpathdetails_dropdowncontainer__Ju6wq"
      );
      if (isDisplayedDropDown) {
        const dropdown = await driver.wait(until.elementLocated(By.className("learningpathdetails_dropdowncontainer__Ju6wq")), timeOut);
        await dropdown.click();
        const selectLanguage = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));

        for (let i = 0; i < selectLanguage.length; i++) {
          if (i !== 0) {
            const dropdown = await driver.wait(until.elementLocated(By.className("learningpathdetails_dropdowncontainer__Ju6wq")), timeOut);
            await dropdown.click();
          }
          //Select language
          const selectLanguageNew = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
          const selectedLang = await selectLanguageNew[i].getText();
          await selectLanguageNew[i].click();
          const langArr = [
            { label: "English", value: 'en' },
            { label: "Italiano", value: 'it' },
            { label: "Deutsch", value: 'de' },
            { label: "Chinese", value: 'zh' },
            { label: "Français", value: 'fr' }
          ]
          const selectedLangValue = langArr.find(x => x.label === selectedLang).value
          //Compare title, description after selecting language
          const mainTitle = await driver
            .wait(until.elementLocated(By.className("lpbannersection_title__NgQgR")), timeOut)
            .getText();
          assert.ok(isLanguageMatching(mainTitle, [selectedLangValue]), `Title (${mainTitle}) not match to ${selectedLang}`);
          const mainDescription = await driver
            .wait(until.elementLocated(By.className("learningpathdetails_description__1Ecmp")), timeOut)
            .getText();
          assert.ok(isLanguageMatching(mainDescription, [selectedLangValue]), `Description (${mainDescription}) not match to ${selectedLang}`);
          const subTitle = await driver.wait(until.elementLocated(By.className("card_name__HOcFA")), timeOut).getText();
          assert.ok(isLanguageMatching(subTitle, [selectedLangValue]), `Title (${subTitle}) not match to ${selectedLang}`);
          const subDescription = await driver
            .wait(until.elementLocated(By.className("card_description__Ax4dg ellipses")), timeOut)
            .getText();
          assert.ok(isLanguageMatching(subDescription, [selectedLangValue]), `Description (${subDescription}) not match to ${selectedLang}`);
        }
        break;
      }
      await driver.wait(until.elementLocated(By.className("button_button_wrapper__XaMM9 button_rounded__7_4oM button_seconday_btn__KmHyZ")), timeOut).click();
    }
  });

  it("Verify that can launch the Learning Path successfully as per selected language", async () => {
    const learningPathsList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
    const loopCount = learningPathsList.length;

    for (let item = 0; item < loopCount; item++) {
      //Select a course
      await learningPathsList[item].click();
      //Check dropdown is displayed
      const isDisplayedDropDown = await checkElementExists(driver, "className", "learningpathdetails_dropdowncontainer__Ju6wq");
      if (isDisplayedDropDown) {
        const dropdown = await driver.wait(until.elementLocated(By.className("learningpathdetails_dropdowncontainer__Ju6wq")), timeOut);
        await dropdown.click();
        const selectLanguage = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
        for (let i = 0; i < selectLanguage.length; i++) {
          if (i !== 0) {
            const dropdown = await driver.wait(until.elementLocated(By.className("learningpathdetails_dropdowncontainer__Ju6wq")), timeOut);
            await dropdown.click();
          }

          const originalWindow = await driver.getWindowHandle();
          //Select language
          const selectLanguageNew = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
          await selectLanguageNew[i].click();

          //Start Course
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
            until.elementLocated(By.className("page__inner")),
            timeOut,
          );
          await driver.wait(until.elementIsVisible(lessonContent), timeOut);

          //Close detail course
          await driver.close();
          await driver.switchTo().window(originalWindow);
          await driver.sleep(7000);

          break;
        }
        break;
      }
      await driver.wait(until.elementLocated(By.className("button_button_wrapper__XaMM9 button_rounded__7_4oM button_seconday_btn__KmHyZ")), timeOut).click();
    }
  })

  after(async () => await driver.quit());
});
