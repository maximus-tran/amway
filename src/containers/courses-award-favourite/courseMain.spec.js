import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

describe("Verify navigate to course main tab from Dashboard", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it(`Course should be displayed at "Complete" and "Favourite" tab`, async () => {
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

    //Navigate to course tab
    const courses = await driver.findElement(
      By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"),
    );
    await courses.click();
    await driver.wait(
      until.elementLocated(By.className("courseTabs_tabs_wrapper__LQBEa")),
      timeOut,
    );
    assert.ok((await driver.getTitle()) === "Courses", "Navigation to Courses Page failed");

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

    for (let item = 0; item < list.length; item++) {
      const isHasAwardIcon = await checkElementExists(
        driver,
        "xpath",
        "//img[@alt='award icon']"
      )
      const isHasCompletedIcon = await checkElementExists(
        driver,
        "xpath",
        "//img[@alt='course complete icon']"
      )
      const isHasFavIcon = await checkElementExists(
        driver,
        "className",
        "card_favorite__ZqIw6"
      )
      if (isHasAwardIcon && isHasCompletedIcon && isHasFavIcon) {
        //getText title in 'total' tab
        const title = await driver.wait(until.elementLocated(By.className("card_name__HOcFA")), timeOut).getText();

        //Navigate to Favorite tab
        await driver.wait(until.elementLocated(By.id("tab-favorite")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-favorite")), timeOut);
        const listFavorite = await driver.findElements(By.className("card_name__HOcFA"));

        for (let x = 0; x < listFavorite.length; x++) {
          const titleFav = await listFavorite[x].getText();
          if (title === titleFav) {
            const isHasAwardIcon = await checkElementExists(
              driver,
              "xpath",
              "//img[@alt='award icon']"
            )
            assert.ok(isHasAwardIcon, `Award icon is not displayed in Favorite tab`);
            const isHasCompletedIcon = await checkElementExists(
              driver,
              "xpath",
              "//img[@alt='course complete icon']"
            )
            assert.ok(isHasCompletedIcon, `Completed icon is not displayed in Favorite tab`);
            const isHasFavIcon = await checkElementExists(
              driver,
              "className",
              "card_favorite__ZqIw6"
            )
            assert.ok(isHasFavIcon, `Favorite icon is not displayed in Favorite tab`);

            break;
          }
        }

        //Navigate to Completed tab
        await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);
        const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));

        for (let y = 0; y < listCompleted.length; y++) {
          const titleCompleted = await listCompleted[y].getText();
          if (title === titleCompleted) {
            const isHasAwardIcon = await checkElementExists(
              driver,
              "xpath",
              "//img[@alt='award icon']"
            )
            assert.ok(isHasAwardIcon, `Award icon is not displayed in Completed tab`);
            const isHasCompletedIcon = await checkElementExists(
              driver,
              "xpath",
              "//img[@alt='course complete icon']"
            )
            assert.ok(isHasCompletedIcon, `Completed icon is not displayed in Completed tab`);
            const isHasFavIcon = await checkElementExists(
              driver,
              "className",
              "card_favorite__ZqIw6"
            )
            assert.ok(isHasFavIcon, `Favorite icon is not displayed in Completed tab`);

            break;
          }
        }
        break;
      }
    }
  });

  after(async () => await driver.quit());
});
