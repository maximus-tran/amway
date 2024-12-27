import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { scrollToElement } from "../../common/scrollTo.js";

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
    expiry: 1735201616,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735201616,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiZDljZDFhNDQtMmIxNy00OWE1LWIwZTMtMjc0MWU4NjNmYTNiIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzUyMDE2MTYsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTE5ODAxNiwiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.WHoWAU68EqGb-mAtXFjqeA-ubOplaYBUnR8qJhub5cZJqNMxe6uWJcTPe4jGCz86Rzxrybu4iVxP-0KYJiWlDP_NzhTDVsQYzanM1Yolg6cHYuZ_Rrm_54IqIc7RQ894XiOD7CipiolwMWUzCctBAsLpuIMPmQFhtBxZ3JODmceIk-NAn6XxpcUVw2PsVhQ1rCFp_GdGtIGHriyfsIEM42GzonyUGbcsuS0fc6t7oTMu-Tw2Aw_SP8KSnAeaBznQVxvS3G2-95CJ3MYKdfW_hXuzZZZbG8dBUEpuks0HOMMqX6RIaVTVsdG0t5Mu2OKbN48MAq_dMaWldvXpYZRYnA%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735201616,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%22cbf6c46a-a50e-4436-8617-fafc32c99e40%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735201616,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiY2hhdElzc3Vlc0NvdW50IjowLCJpYXQiOjE3MzUxOTgwMTgsImV4cCI6MTczNTIwMTYxOH0.CiIEP3M2lPkzZ7zGAV3xpOK4VSkvZe-n__lsevwdUmQ%22%7D'
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

describe("KAN-13: Category Navigation", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver.manage().addCookie(cookieData[0]);
    await driver.manage().addCookie(cookieData[1]);
    await driver.manage().addCookie(cookieData[2]);
    await driver.manage().addCookie(cookieData[3]);
    await driver.manage().addCookie(cookieData[4]);
    await driver.manage().addCookie(cookieData[5]);

    await driver.navigate().to(`${baseURL}/dashboard?init=true`);
  });
  const TCmessages = [
    'Verify Earn Money Category',
    'Verify Lead A Team Category',
    'Verify Business Skills Category',
    'Verify Communication Skills Category',
    'Verify Sponsoring Category',
    'Verify Health and Wellbeing Category',
    'Verify Nutrition Category',
    'Verify Beauty Category',
    'Verify Personal Care Category',
    'Verify Home Category'
  ]
  for (let index = 0; index < 10; index++) {
    it(TCmessages[index], async () => {
      index !== 0 && await driver.navigate().back();
      const element = await driver.wait(until.elementLocated(By.className("dashboard_required_section_wrapper__4WItr")), timeOut);
      await scrollToElement(driver, element);
      const categoryItems = await driver
        .findElements(By.css(".dashboardcategories_wrapper__5udRt .categoryCard_wrapper__5MdCo .categoryCard_titleContainer__e6SKI"))
      const items = await categoryItems[index].findElement(By.css('.categoryCard_title__VYQap'));
      const Url = await items.getAttribute('href');
      const Title = await items.getText();
      await items.click();
      await driver.wait(until.urlIs(Url), timeOut);
      assert.ok(Url === await driver.getCurrentUrl(), `Navigate to incorrect URL of  category`)
      assert.ok(await driver.getTitle() === 'Search', `Navigate to incorrect search page - ${Title} category`)
      const filter = await driver.wait(until.elementLocated(By.className("searchPage_item__UQlod")), timeOut).getText();
      assert.ok(Title === filter, `Incorrect mactching ${Title} category in filter section`)
    });
  }
  after(async () => await driver.quit());
});
