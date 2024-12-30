import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";

const cookieData = [
  {
    domain: '.amway.com',
    httpOnly: false,
    name: 'marketLang',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22locale%22%3A%22it-it%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735529032,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735529032,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiYWYzNTViZDMtNDExZC00NmY1LWFlNTItYTc2ZDc4MTg5OTBkIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzU1MjkwMzIsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTUyNTQzMiwiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.rtXsed_h_d7W4KTY8rWQIrZX_Em3Z-v7UdEYJLpoh-p7B5IPL5URvVE8KWcsteqy2XzLJ-vrbW9gRHr-6o5JbdB9IlyrTt0PsRHvqKkww91fAukeDhZlVokbDb7MDNyHdeHQytiOQj3UJ46RLMj7-EK_2MefexgwISuFVuoz8HzHXP8Cw2m2e-v894rWnDOmDszPtcchbJdpDCU_PcaFkBQ3wv-m_lacNmhZs7p5lpkwmnX-PQHVndHZT9okmDVrXRual4c3xqM07y7pZwKQDSTtVq3U13pOH5RuNUBkExVHfCiAniawvVlM0pctdAXOBxSCAQ7DAXWLMIE3Ues80Q%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735529032,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%2274e718bd-233f-49c8-bdd8-d3b3cbd18f40%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735529032,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiY2hhdElzc3Vlc0NvdW50IjowLCJpYXQiOjE3MzU1MjU0MzYsImV4cCI6MTczNTUyOTAzNn0.PY-IMKM6C-CDBPOMBvt1mWRJCOPfaLbJNQ6xmCqMUyU%22%7D'
  },
  {
    domain: '.amway.com',
    httpOnly: false,
    name: 'countryEsanQA',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22country%22%3A%22it%22%7D'
  }
]

describe("KAN-17: Verify UI detailed course", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Verify that can launch the Course successfully as per selected language", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver.manage().addCookie(cookieData[0]);
    await driver.manage().addCookie(cookieData[1]);
    await driver.manage().addCookie(cookieData[2]);
    await driver.manage().addCookie(cookieData[3]);
    await driver.manage().addCookie(cookieData[4]);
    await driver.manage().addCookie(cookieData[5]);

    await driver.navigate().to(`${baseURL}/dashboard?init=true`);

    await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut)
    const courses = await driver.findElement(By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"));
    await courses.click()
    await driver.wait(until.elementLocated(By.className("SectionTitle_section_container__RTAyL")), timeOut)
    assert.ok(await driver.getTitle() === "Courses", "Navigation to Courses Page failed");

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);

    const originalWindow = await driver.getWindowHandle();
    for (let index = 0; index < 4; index++) {
      index !== 0 && await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
      await driver.wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), timeOut).click();
      await driver.wait(until.elementLocated(By.xpath('//button[@class="CourseHeader_content_child__LUX1f"]')), timeOut).click();
      const languageOptions = await driver.findElements(By.css(".CourseHeader_content_child__LUX1f"));

      if (languageOptions.length > index) {
        await languageOptions[index].click();
      }

      await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
      const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
      await list[1].click();

    }

    await driver.wait(until.elementLocated(By.className("courseDurationModal_btn_container__NANdK")), timeOut).click();
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.wait(until.titleIs("Adapt"), timeOut);
    const element = await driver.wait(until.elementLocated(By.id("app")), timeOut);
    assert.ok(await element.isDisplayed(), "Element 'app' is not displayed");
    assert.ok(await driver.getTitle() === "Adapt", "Navigation to detail course failed");
    await driver.close();

    await driver.switchTo().window(originalWindow);
  });

  it("Verify that Title, Description, Author & Skill (where applicable) should be in selected language as per setup in Admin portal", async () => {
    await driver.navigate().to(`${baseURL}/courses`);
    await driver.wait(until.elementLocated(By.className("tabDetails_cardwrapper_children__9RdHs")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs")); //thẻ li

    const listData = [];
    for (const item of list.slice(0, 4)) {
      const title = await item.findElement(By.className("card_name__HOcFA")).getText();
      const description = await item.findElement(By.className("card_description__Ax4dg ellipses")).getText();
      listData.push({ title, description });
    }

    for (let i = 0; i < 4; i++) {
      await list[i].click();
      const titlePopup = await driver
        .wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut)
        .getText();
      const descriptionPopup = await driver
        .wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut)
        .getText();

      assert.ok(listData[i].title === titlePopup, `Title does not match for item ${i + 1}`);
      assert.ok(listData[i].description === descriptionPopup, `Description does not match for item ${i + 1}`);

      await driver.findElement(By.className("startLaunchCourse_cross_icon__eyRob")).click();
    }
  });

  // after(async () => await driver.quit());
});
