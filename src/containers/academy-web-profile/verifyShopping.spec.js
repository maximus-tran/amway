import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";

describe("KAN-7: Verify Shopping Navigation", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify it should open up e-Commerce website at a another tab", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    const user = {
      email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
      username: "GENE FLUECK",
      password: "Amway@1234"
    };
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys(user.email);
    await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
    await driver.findElement(By.id("loginform:loginButton")).click();
    const originalWindow = await driver.getWindowHandle();
    await driver
      .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
      .click();
    await driver
      .wait(until.elementLocated(By.xpath('//a[@aria-label="Pagina web Amway"]')), timeOut)
      .click()
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    const cartIcon = await driver.findElement(By.css(".header__shopping_cart"));
    await driver.wait(until.elementIsVisible(cartIcon), timeOut);
    assert.ok(await cartIcon.isDisplayed(), "Cart icon is not displayed.");
    const button = await driver.wait(until.elementLocated(By.className("button__button    button__full_width ")), timeOut)
    assert.ok(await button.isDisplayed(), "Error")
  });

  // after(async () => await driver.quit());
});
