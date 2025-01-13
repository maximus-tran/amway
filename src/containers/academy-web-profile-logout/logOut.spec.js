import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

const user = {
  email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
  username: "GENE FLUECK",
  password: "Amway@1234",
};

describe("Academy web_Profile_Logout", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify the functionality of the logout process on Academy Web, ensuring the user can effectively logout", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
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

    await driver
      .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
      .click();

    const isDisplayedSignout = await checkElementExists(
      driver,
      "css",
      ".CourseHeader_content_child__LUX1f:nth-child(3)",
    );
    assert.ok(isDisplayedSignout, "Sign out button not displayed");

    const originalWindow = await driver.getWindowHandle();
    await driver.wait(until.elementLocated(By.css(".CourseHeader_content_child__LUX1f:nth-child(3)")), timeOut).click();

    const windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    // Verify it should redirect to e-Commerce website at the same tab
    const cartIcon = await driver.wait(
      until.elementLocated(By.className("header__shopping_cart")),
      timeOut,
    );
    await driver.wait(until.elementIsVisible(cartIcon), timeOut);

    const isDisplayedModal = await checkElementExists(
      driver,
      "id",
      "modal-wrapper"
    )

    if (isDisplayedModal) {
      await driver.wait(until.elementLocated(By.id("accept-all")), timeOut).click();
    }

  });

  after(async () => await driver.quit());
});
