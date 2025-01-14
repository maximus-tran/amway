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

describe("Academy web_Error Handling", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it(`User should be able to see : Placeholder screen with error message: it should be "Unable to connect Please check your Wi - Fi connection and refresh the page."`, async () => {
  // Set offline mode
  await driver.executeCdpCommand('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });  
    
    await driver.get(`${baseURL}/dashboard?init=true`);
    // Login
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys(user.email);
    await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
    await driver.findElement(By.id("loginform:loginButton")).click();

    const isDisplayImage = await checkElementExists(
      driver,
      "className",
      "errorHandling_image__HkWOB"
    );
    assert.ok(isDisplayImage, "Error handling image is not exists");

    const isDisplayedNotification = await checkElementExists(
      driver,
      "className",
      "errorHandling_text1__sVmfo"
    );
    assert.ok(isDisplayedNotification, `The text "Unable to connect" is not exists`);

    const isDisplayMessage = await checkElementExists(
      driver,
      "className",
      "errorHandling_text2__NiTaR"
    );
    assert.ok(isDisplayMessage, `The text "Please check your Wi - Fi connection and refresh the page." is not exists`);
  });

  it("It should display the Refresh Page button for user to refresh the page", async () => {
    const isDisplayRefreshButton = await checkElementExists(
      driver,
      "className",
      "errorHandling_homeBtn___Oz_L"
    );
    assert.ok(isDisplayRefreshButton, `Refresh button is not exists`);
  })

  after(async () => await driver.quit());
});
