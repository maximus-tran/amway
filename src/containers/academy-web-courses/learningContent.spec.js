import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { scrollToCss, scrollToElement, scrollToXpath } from "../../common/scrollTo.js";

const cookieData =  [
  {
    domain: '.amway.com',
    expiry: 1766741227,
    httpOnly: false,
    name: 'utag_main',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: 'v_id:0194024a8d8a00739b8ad593ec500506f004106700bd0$_sn:1$_ss:1$_st:1735207027915$ses_id:1735205227915%3Bexp-session$_pn:1%3Bexp-session'
  },
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
    expiry: 1735208825,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735208825,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiZGUyMDNmZjItYjU2MS00OGM3LThkNTktNWFmYWQ0OTcwYjljIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzUyMDg4MjUsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTIwNTIyNSwiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.U3e_GRb6eLlXLFHNpUSjketu27thdpE64tfAOOdoinJJuF6alCWrA2MhLlDFZT7wRURYNsEF5NxT1cB7DMO8opy5-r9sH-03zA0kNJJSEbadVGdx_RgNmya54M5bpgEVALOicG117zUsiFumdVIRrq_h-MiK34EycgDMrMumPgaRqRq4-GNp9Y3aufZW4gY5FfjXYpAFyzn3kPCUJ6yaDy8edjRovm9W9_RkwKqqrA8Ym1GV3-vHhdtK4Z5rE-T5WvOUhnP9E-14yH_wOfIFvDmWyJXE2-uNORtMKrMXEAHCHllhQh0LGCRWfq--QJNkANuauhua1-jF0zLMi4s6ZA%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735208825,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%227ce67d68-58e4-4e18-8dbd-5efcfed7c831%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735208825,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiY2hhdElzc3Vlc0NvdW50IjowLCJpYXQiOjE3MzUyMDUyMjgsImV4cCI6MTczNTIwODgyOH0.9mTIAP4ueuyeIAXVB5Ymk68azEZThdkOEpCCSUO9JEA%22%7D'
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

describe("KAN-15: Verify that learning content is displayed & user group as per setup in Admin portal", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Category section", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver.manage().addCookie(cookieData[0]);
    await driver.manage().addCookie(cookieData[1]);
    await driver.manage().addCookie(cookieData[2]);
    await driver.manage().addCookie(cookieData[3]);
    await driver.manage().addCookie(cookieData[4]);
    await driver.manage().addCookie(cookieData[5]);

    await driver.navigate().to(`${baseURL}/dashboard?init=true`);

    await scrollToCss(driver, ".dashboard_section_heading_wrapper__hf2aj")
    const categoriesList = await driver.wait(until.elementLocated(By.className("dashboard_section_heading_wrapper__hf2aj")), timeOut);
    assert.ok(await categoriesList.isDisplayed(), "Category section display failed!")
  });

  it("Recommended section", async () => {
    await scrollToCss(driver, ".dashboard_card_wrapper__05W_L")
    const recommendedList = await driver.wait(until.elementLocated(By.className("dashboard_card_wrapper__05W_L")), timeOut);
    assert.ok(await recommendedList.isDisplayed(), "Recommended section display failed!")
  });

  it("What's new section", async () => {
    await scrollToCss(driver, ".dashboard_card_wrapper__05W_L")
    const whatNew = await driver.wait(until.elementLocated(By.className("dashboard_quickstudy_wrapper__HeOMF")), timeOut);
    assert.ok(await whatNew.isDisplayed(), "What's new section display failed!")
  });

  it("Learning Path section", async () => {
    const element = await driver.findElement(By.id("learning-path"));
    await scrollToElement(driver, element);
    const learningPath = await driver.wait(until.elementLocated(By.id("learning-path")), timeOut);
    assert.ok(await learningPath.isDisplayed(), "Learning Path section display failed!")
  });

  it("Learning Catalogue section", async () => {
    const element = await driver.findElement(By.id("learning-catalog"));
    await scrollToElement(driver, element);
    const catalogue = await driver.wait(until.elementLocated(By.id("learning-catalog")), timeOut);
    assert.ok(await catalogue.isDisplayed(), "Learning Catalogue section display failed!");
  });

  // after(async () => await driver.quit());
});
