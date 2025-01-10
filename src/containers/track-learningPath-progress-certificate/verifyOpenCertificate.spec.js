import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists, handleScreenShot } from "../../common/checkViewport.js";
import path from "path";
import addContext from "mochawesome/addContext.js";

describe("Verify Certificate UI in Learning Path drawer", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("It should get a certificate and the achievements section should be clickable.", async () => {
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
      const updatedList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));
      const isHasCompletedIcon = await updatedList[item].findElement(By.xpath("//img[@alt='course complete icon']")).isDisplayed().then(() => true).catch(() => false);
      const isHasBadgeIcon = await updatedList[item].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      if (isHasCompletedIcon && isHasBadgeIcon) {
        await updatedList[item].click();
        // Check certificate icon is displayed
        const isDisplayedCertificateIcon = await checkElementExists(
          driver,
          "xpath",
          "//img[@alt='certificate icon']"
        );
        assert.ok(isDisplayedCertificateIcon, "Certificate icon is not displayed");
        // Check the text 'Learning path completed!' is displayed
        const isDisplayedTheText = await checkElementExists(
          driver,
          "className",
          "learningpathdetails_completedTextContainer__mCbVc"
        );
        assert.ok(isDisplayedTheText, `The text "Learning path completed!" is not displayed`);
        // Check Certificate UI is displayed
        const isDisplayedCertificate = await checkElementExists(
          driver,
          "className",
          "awardModal_awardContainer__VZjWa awardModal_awardCompleted__bYI0j"
        );
        assert.ok(isDisplayedCertificate, "Certificate UI is not displayed");
        // Open certificate modal
        await driver.wait(until.elementLocated(By.className("awardModal_awardContainer__VZjWa awardModal_awardCompleted__bYI0j")), timeOut).click();
        // Wait background image is displayed
        await driver.sleep(1000);
        const isDisplayedCertificateModal = await checkElementExists(
          driver,
          "id",
          "LPcertificate"
        )
        assert.ok(isDisplayedCertificateModal, "Certificate modal is not displayed");

        const screenshotDir = path.join(
          "auto-testing-report",
          "screenshots",
          "verifyOpenCertificate",
        );
        await handleScreenShot(
          driver,
          screenshotDir,
          `verifyOpenCertificate.png`
        )
        addContext(this, {
          title: `Certificate modal is not exists`,
          value: `./${screenshotDir.replace("auto-testing-report", "").replace(/\\/g, "/")}/verifyOpenCertificate.png`,
        })
        break;
      }
    }
  });

  after(async () => await driver.quit());
});
