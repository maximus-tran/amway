import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

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
      const isHasBadgeIcon = await updatedList[item].findElement(By.className("card_certificate__1Ncvc")).isDisplayed().then(() => true).catch(() => false);
      if (isHasBadgeIcon) {
        await updatedList[item].click();
        const isDisplayedBannerSection = await checkElementExists(
          driver,
          "className",
          "lpbannersection_container__IygsL"
        );
        assert.ok(isDisplayedBannerSection, "Banner section is not displayed");
        const isDisplayedDetails = await checkElementExists(
          driver,
          "className",
          "learningpathdetails_detailswrapper__5MPWs"
        );
        assert.ok(isDisplayedDetails, "Learning Path details is not displayed");
        //Back to learning path tab
        await driver.wait(until.elementLocated(By.className("button_button_wrapper__XaMM9 button_rounded__7_4oM button_seconday_btn__KmHyZ")), timeOut).click();
        break;
      }
    }
  });

  it("User should be able to view the certificate UI and two add courses", async () => {
    await driver.wait(until.elementLocated(By.css(".tabDetails_cardwrapper_children__x4NMP")), timeOut);
    const learningPathsList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
    const loopCount = learningPathsList.length;

    for (let item = 0; item < loopCount; item++) {
      const updatedList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
      const isHasBadgeIcon = await updatedList[item].findElement(By.className("card_certificate__1Ncvc")).isDisplayed().then(() => true).catch(() => false);
      if (isHasBadgeIcon) {
        await updatedList[item].click();
        //Check course in learning path
        const subCourse = await driver.findElements(By.className("card_card__dPAc9"));
        assert.ok(subCourse.length > 2, "Course in Learning Path is less than 2 courses");
        //Check Certificate UI is displayed
        const isDisplayedCertificate = await checkElementExists(
          driver,
          "className",
          "awardModal_awardContainer__VZjWa awardModal_notAwardCompleted__Px30q"
        );
        assert.ok(isDisplayedCertificate, "Certificate UI is not displayed");

        break;
      }
    }
  })

  after(async () => await driver.quit());
});
