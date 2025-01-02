import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";

describe("KAN-23: Verify award after finishing course", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("It should get an Award and the Achievements section on that course card should be clickable", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver
      .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
      .sendKeys("MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com");
    await driver.findElement(By.id("loginform:password")).sendKeys("Amway@1234");
    await driver.findElement(By.id("loginform:loginButton")).click();

    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut);
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.className("courseTabs_tabs_wrapper__LQBEa")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    // await driver.wait(until.elementLocated(By.id("tab-in_progress")), timeOut).click();
    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);

    const listProgress = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

    for (let i = 0; i < listProgress.length; i++) {
      const awardIcon = await listProgress[i].findElement(By.xpath("//img[@alt='award icon']")).isDisplayed().then(() => true).catch(() => false);
      const timeIcon = await driver.wait(until.elementLocated(By.xpath("//img[@alt='time icon']")), timeOut).isDisplayed();
      const progressBar = await driver.wait(until.elementLocated(By.className("card_progressbar_wrapper__36Fzy")), timeOut).isDisplayed();
      if (awardIcon && timeIcon && progressBar) {
        const originalWindow = await driver.getWindowHandle();
        await listProgress[2].click();
        const titleCourse = await driver.wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut).getText();
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

        const videoElement = await driver.findElement(By.xpath("//video[@id='video_html5_api']"));
        const duration = await driver.executeScript("return arguments[0].duration;", videoElement);
        const playVideo = await driver.wait(until.elementLocated(By.className("vjs-big-play-button")), timeOut);
        await playVideo.click();
        await driver.executeScript('arguments[0].currentTime;', videoElement);
        await driver.sleep(Math.floor(duration * 1000));

        await driver.close();

        await driver.switchTo().window(originalWindow);

        await driver.sleep(8000);
        await driver.wait(until.elementLocated(By.id("tab-completed")), timeOut).click();

        await driver.wait(until.elementLocated(By.id("tabpanel-completed")), timeOut);
        const listCompleted = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));

        let courseCompleted = false;
        for (let i = 0; i < listCompleted.length; i++) {
          await listCompleted[i].click();
          const titleCompleted = await driver.wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut).getText();
          if (titleCourse === titleCompleted) {
            const retakeCourse = await driver.wait(until.elementLocated(By.className("button_btn_text__rvpWC")), timeOut).getText();
            const langArr = [
              { label: "Ripeti il corso" },
              { label: "Retake Course" },
              { label: "重修课程" },
            ]
            const buttonValue = langArr.find(x => x.label === retakeCourse);
            assert.strictEqual(retakeCourse, buttonValue.label, `${retakeCourse} and ${buttonValue} not match`)

            const completedIcon = await driver.wait(until.elementLocated(By.xpath("//img[@alt='done symbol']")), timeOut);
            assert.ok(await completedIcon.isDisplayed(), "Completion icon is not displayed");

            const achievementIcon = await driver.wait(until.elementLocated(By.xpath("//img[@alt='achievement icon']")), timeOut);
            assert.ok(await achievementIcon.isDisplayed(), "Achievement icon is not displayed");

            const img = await driver.wait(until.elementLocated(By.className("awardModal_image_wrapper__zoJSV")), timeOut);
            const titleAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardtitle__7ethH")), timeOut)
            const descriptionAward = await driver
              .wait(until.elementLocated(By.className("awardModal_awardSmallDesc__tDF_M")), timeOut)
            assert.ok(await img.isDisplayed(), "Award image is not displayed");
            assert.ok(await titleAward.isDisplayed(), `${titleAward} is not displayed`);
            assert.ok(await descriptionAward.isDisplayed(), `${descriptionAward} is not displayed`);
            await driver.wait(until.elementLocated(By.className("awardModal_awardContainer__xf2lG awardModal_awardCompleted__kM1Oh")), timeOut).click();
            await driver.wait(until.elementLocated(By.className("courseCompletionWithAward_courseCompletionWithAwardContainer__LfrdE")), timeOut).isDisplayed();
            const titlePopup = await driver.findElement(By.className("courseCompletionWithAward_courseName__sn4EG")).getText();
            assert.ok(await titleAward.getText() === titlePopup, `${titleAward} and ${titlePopup} not match`);
            await driver.findElement(By.className("icon courseCompletionWithAward_cross_icon__OBd0_")).click();
            break;
          }
          await driver.wait(until.elementLocated(By.className("startLaunchCourse_cross_icon__eyRob")), timeOut).click();
        }
        if (!courseCompleted) {
          console.log("Not completed the course");
          break;
        }
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  })

  after(async () => await driver.quit());
});