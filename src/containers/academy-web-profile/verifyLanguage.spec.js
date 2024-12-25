import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { detectAll } from "tinyld";

describe("KAN-8: Verify Language Selection", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Select English language", async () => {
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
    await driver
      .wait(until.elementLocated(By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]')), timeOut)
      .click()
    await driver
      .wait(until.elementLocated(By.css('.CourseHeader_option_title__qilMd:nth-child(1)')), timeOut)
      .click()
    const englishBanner = await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
    const textContent = await englishBanner.getText()
    const detectedLanguages = detectAll(textContent).map(x => x.lang);
    const isMatch = detectedLanguages.includes("en")
    assert.ok(isMatch, "Incorrect language");
  });

  it("Select Chinese language", async () => {
    await driver
      .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
      .click();
    await driver
      .wait(until.elementLocated(By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]')), timeOut)
      .click()
    await driver
      .wait(until.elementLocated(By.xpath("//div[@id='profileModal']/div/button[2]")), timeOut)
      .click()
    const chineseBanner = await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
    const textContent = await chineseBanner.getText()
    const detectedLanguages = detectAll(textContent).map(x => x.lang);
    const isMatch = detectedLanguages.includes("zh")
    assert.ok(isMatch, "Incorrect language");
  });

  it("Select Italian language", async () => {
    await driver
      .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut)
      .click();
    await driver
      .wait(until.elementLocated(By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]')), timeOut)
      .click()
    await driver
      .wait(until.elementLocated(By.xpath("//div[@id='profileModal']/div/button[3]")), timeOut)
      .click()
    const italianBanner = await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
    const textContent = await italianBanner.getText()
    const detectedLanguages = detectAll(textContent).map(x => x.lang);
    const isMatch = detectedLanguages.includes("it")
    assert.ok(isMatch, "Incorrect language");
  });

  after(async () => await driver.quit());
});
