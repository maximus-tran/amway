import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

describe("Verify learning paths list", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify user should be able to see newly created LP at Learning Path section", async () => {
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

    for (let item = 0; item < learningPathsList.length; item++) {
      const isHasNewlyTag = await checkElementExists(
        driver,
        "className",
        "pill_pill_wrapper__gIDX_ pill_new__dn82x"
      );
      assert.ok(isHasNewlyTag, "Newly Tag is not displayed");
    }
  });

  it("User should be able to see unicode chars at Learning Path Title, Description and Author/Speaker name", async () => {
    const learningPathsList = await driver.findElements(By.css(".tabDetails_cardwrapper_children__x4NMP"));

    for (let item = 0; item < learningPathsList.length; item++) {
      const isHasTitleDisplayed = await checkElementExists(
        driver,
        "className",
        "card_name__HOcFA"
      );
      assert.ok(isHasTitleDisplayed, "Title is not displayed");

      const isHasDescriptionDisplayed = await checkElementExists(
        driver,
        "className",
        "card_description__Ax4dg ellipses"
      );
      assert.ok(isHasDescriptionDisplayed, "Description is not displayed");
    }
  })

  after(async () => await driver.quit());
});
