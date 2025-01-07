import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";

describe("Verify Favourite course (with trophy icon)", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("User should be able to view the Award UI, Favourite icon", async () => {
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
      const awardIcon = await list[item].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      if (awardIcon) {
        await list[item].click();
        //Check course drawer should be open
        const isHasCourseDrawer = await checkElementExists(
          driver,
          "className",
          "startLaunchCourse_start_launch_course_container__qYr6q"
        )
        assert.ok(isHasCourseDrawer, "Course Drawer is not displayed");

        //Check Award UI is displayed
        const isHasTrophyImg = await checkElementExists(
          driver,
          "className",
          "awardModal_image_wrapper__zoJSV"
        )
        assert.ok(isHasTrophyImg, "Trophy Icon is not displayed");
        const isHasTitleAward = await checkElementExists(
          driver,
          "className",
          "awardModal_awardtitle__7ethH"
        )
        assert.ok(isHasTitleAward, `Title Award is not displayed`);
        const isHasDescriptionAward = await checkElementExists(
          driver,
          "className",
          "awardModal_awardSmallDesc__tDF_M"
        )
        assert.ok(isHasDescriptionAward, `Description Award is not displayed`);

        //Check Favourite Icon is displayed
        const isHasFavouriteIcon = await checkElementExists(
          driver,
          "className",
          "SocialMediaShareButton_btnContainer__xBnuM"
        );
        assert.ok(isHasFavouriteIcon, `Favourite Icon is not displayed`);

        //Favourite icon should be displayed as filled in white
        const favouriteButton = await driver.wait(until.elementLocated(By.className("SocialMediaShareButton_btnContainer__xBnuM")), timeOut);
        const isHasImgFav = await checkElementExists(
          driver,
          "xpath",
          "//button[@aria-label='favourite icon']"
        )
        assert.ok(isHasImgFav, `Icon is not displayed`);

        const imgFav = (await favouriteButton.findElement(By.css("img")).getAttribute("src")).includes("favorite.647593da.svg");     
        if (imgFav) {
          assert.ok(imgFav, `Favourite icon should be displayed as filled in white`);
        }

        else if (!(imgFav)) {
          const likeIcon = (await favouriteButton.findElement(By.css("img")).getAttribute("src")).includes("likeIcon.b295a0fc.svg");
          assert.ok(likeIcon,  `Like icon is not displayed`)
          await favouriteButton.click();
          const favIcon = (await favouriteButton.findElement(By.css("img")).getAttribute("src")).includes("favorite.647593da.svg");
          assert.ok(favIcon, `Favourite icon should be displayed as filled in white`);
        }

        break;
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  });

  after(async () => await driver.quit());
});
