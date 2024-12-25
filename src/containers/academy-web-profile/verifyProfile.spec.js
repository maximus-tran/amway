import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";

describe("KAN-6: Verify Profile", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify that ABO name is correctly displayed", async () => {
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

    await driver
      .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
      .click();
    console.log("check username", await driver.findElement(By.className(" CourseHeader_topbtn__lNqjt")).getAttribute("innerHTML"))

    let profile = await driver.findElement(By.className(" CourseHeader_topbtn__lNqjt"))
    assert.strictEqual(await profile.getText(), user.username, "Username does not match");
    console.log("Username:", await profile.getText());
  });

  it("ABO First name, Last Name at the top of profile modal", async () => {
    const element = await driver.findElement(By.css(".CourseHeader_content_child__LUX1f")).isDisplayed();
    assert.equal(element, true, "Location Error!");
  })

  it("Language, Shopping and Sign Out in the profile modal", async () => {
    const element = await driver.findElement(By.css(".CourseHeader_options_container__IAqgM")).isDisplayed();
    assert.equal(element, true, "Location Error!");
  })

  // after(async () => await driver.quit());
});
