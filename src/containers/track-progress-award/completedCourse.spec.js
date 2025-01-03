import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists, checkElementXpath } from "../../common/checkViewport.js";

describe("KAN-23: Verify award after finishing course", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("It should get an Award and the Achievements section on that course card should be clickable", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    const user = {
      email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
      password: "Amway@1234",
      username: "GENE FLUECK",
    }
    //Login
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys(user.email);
    await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
    await driver.findElement(By.id("loginform:loginButton")).click();
    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut);

    //Navigate to course tab
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.className("courseTabs_tabs_wrapper__LQBEa")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    //Navigate to in progress section
    await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
    await driver.wait(until.elementLocated(By.id("tabpanel-in_progress")), timeOut);

    const listProgress = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = listProgress.length > 3 ? 3 : listProgress.length;

    for (let i = 0; i < loopCount; i++) {
      const awardIcon = await listProgress[i].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      const timeIcon = await checkElementXpath(driver, "//img[@alt='time icon']");
      const progressBar = await checkElementExists(driver, "card_progressbar_wrapper__36Fzy");
      //Check course with award icon, time icon and progress bar
      if (awardIcon && timeIcon && progressBar) {
        const originalWindow = await driver.getWindowHandle();
        await listProgress[2].click();
        const titleCourse = await driver.wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut).getText();
        console.log('====================================');
        console.log(titleCourse);
        console.log('====================================');
        await driver.wait(until.elementLocated(By.className("startLaunchCourse_cross_icon__eyRob")), timeOut).click();
        //Start course
        const button = await driver.wait(until.elementLocated(By.className("courseDurationModal_btn_container__NANdK")), timeOut);
        await button.click();

        const windows = await driver.getAllWindowHandles();
        windows.forEach(async handle => {
          if (handle !== originalWindow) {
            await driver.switchTo().window(handle);
          }
        });
        await driver.wait(until.titleIs("Adapt"), timeOut);
        assert.ok(await driver.getTitle() === "Adapt", "Navigation to detail course failed");
        const lessonContent = await driver.wait(until.elementLocated(By.className("page__inner")), timeOut);
        await driver.wait(until.elementIsVisible(lessonContent), timeOut);

        const content = await driver.wait(until.elementLocated(By.className("block__inner")), timeOut);
        await driver.wait(until.elementIsVisible(content), timeOut);
        const iframe = await driver.findElements(By.css('iframe'));
        if (iframe.length > 0) {
          await driver.switchTo().frame(iframe[0]);
        }
        const video = await checkElementXpath(driver, "//video[@id='video_html5_api']");
        if (video) {
          const videoElement = await driver.findElement(By.xpath("//video[@id='video_html5_api']"));
          const duration = await driver.executeScript("return arguments[0].duration;", videoElement);
          const playVideo = await driver.wait(until.elementLocated(By.className("vjs-big-play-button")), timeOut);
          await playVideo.click();
          await driver.executeScript('arguments[0].currentTime;', videoElement);
          await driver.sleep(Math.floor(duration * 1000));
        }

        await driver.close();
        await driver.switchTo().window(originalWindow);

        await driver.sleep(1000);
        //Course should be removed removed from In Progress tab
        await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-in_progress")), timeOut);
        const title = await driver.findElements(By.className("card_name__HOcFA"));
        const loopProgressCount = title.length > 3 ? 3 : title.length;
        for (let index = 0; index < loopProgressCount; index++) {
          const courseTitle = await title[index].getText();
          assert.ok(titleCourse !== courseTitle, 'The course is still present in the In Progress section');
        }

        //Course should be displayed at "Complete" tab
        await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();
        await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);
        const listCompleted = await driver.findElements(By.className("card_name__HOcFA"));

        for (let x = 0; x < listCompleted.length; x++) {
          const titleCompleted = await listCompleted[x].getText();
          if (titleCourse === titleCompleted) {
            await listCompleted[x].click();
            //Check award card is displayed in pop up
            const img = await driver.wait(until.elementLocated(By.className("awardModal_image_wrapper__zoJSV")), timeOut);
            const titleAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardtitle__7ethH")), timeOut)
            const descriptionAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardSmallDesc__tDF_M")), timeOut)
            assert.ok(await img.isDisplayed(), "Award image is not displayed");
            assert.ok(await titleAward.isDisplayed(), `${titleAward} is not displayed`);
            assert.ok(await descriptionAward.isDisplayed(), `${descriptionAward} is not displayed`);
            //Open award card
            await driver.wait(until.elementLocated(By.className("awardModal_awardContainer__xf2lG awardModal_awardCompleted__kM1Oh")), timeOut).click();
            await driver.wait(until.elementLocated(By.className("courseCompletionWithAward_courseCompletionWithAwardContainer__LfrdE")), timeOut).isDisplayed();
            const titlePopup = await driver.findElement(By.className("courseCompletionWithAward_courseName__sn4EG")).getText();
            assert.ok(await titleAward.getText() === titlePopup, `${titleAward} and ${titlePopup} not match`);
            const usernameXpath = `//div[@aria-label='abo name - ${user.username}']`;
            const username = await driver.findElement(By.xpath(usernameXpath)).getText();
            assert.ok(username === user.username, `${username} and ${user.username} not match`);
            //Close award pop up
            await driver.findElement(By.className("icon courseCompletionWithAward_cross_icon__OBd0_")).click();
            //Close course pop up
            await driver.wait(until.elementLocated(By.className("startLaunchCourse_cross_icon__eyRob")), timeOut).click();
            break;
          }
          else if (!titleCompleted) {
            console.log("Course not completed")
          }
        }
        break;
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  })

  after(async () => await driver.quit());
});