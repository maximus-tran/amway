import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { scrollToElement } from "../../common/scrollTo.js";

const cookieData = [
  {
    domain: '.amway.com',
    expiry: 1766660943,
    httpOnly: false,
    name: 'utag_main',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: 'v_id:0193fd81835100989c831b2152000506f004106700bd0$_sn:1$_ss:1$_st:1735126743698$ses_id:1735124943698%3Bexp-session$_pn:1%3Bexp-session'
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
    expiry: 1735128541,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735128541,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiYWRkODM2NWMtYmI4OC00NDY0LWE3NjctMTc0NDk4OTRhNjhlIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzUxMjg1NDEsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTEyNDk0MSwiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.JPjrIugMiZZfvUFi2FS-BmoU0zs8rtluZYIY7eF7wisPI5hB9LNtgmVffa8wxhcJKMBNF5f3fX1_8A5pUpV1kPE6FdAnzMGVMgZgY_8vVKdcfOYzdf0MlkmtnJoANC6b0h5MPW0A4FSenlosLTLNOWp3J1svGlQcjH3IUw0Ra0gq-15ZNfA75DxBDogxJl56h5-wJT5VTPkx2ZE6VGxDRLTbB9aKAhMxZGwiVG1c9W58DGUd9gtB8w5dxEJITJDVzV5IKxTWTswU_RmjAQtPEKHfjvGrGN79LDQ8mZZAEnEMOr5Ng9SE9WoQNJqd9YAO0XvxiIbpCtYj12rItWdqkQ%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735128541,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%223e3962ce-30ec-427b-bcaa-10bcbd84322d%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735128541,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiaWF0IjoxNzM1MTI0OTQ0LCJleHAiOjE3MzUxMjg1NDR9.trFVXLZaHSgQw6JrdOp8OGdszhEX-r-_x2JP2YwC0PE%22%7D'
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

describe("KAN-12: Verify Categories at the dashboard", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Displays the Categories section", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver.manage().addCookie(cookieData[0]);
    await driver.manage().addCookie(cookieData[1]);
    await driver.manage().addCookie(cookieData[2]);
    await driver.manage().addCookie(cookieData[3]);
    await driver.manage().addCookie(cookieData[4]);
    await driver.manage().addCookie(cookieData[5]);

    await driver.navigate().to(`${baseURL}/dashboard?init=true`);

    //Categories section
    const element = await driver.wait(until.elementLocated(By.className("dashboard_required_section_wrapper__4WItr")), timeOut);
    await scrollToElement(driver, element);

    await driver.wait(until.elementLocated(By.className("SectionTitle_section_container__RTAyL")), timeOut);
    const categoriesTitle = await driver
      .findElement(By.className("SectionTitle_section_container__RTAyL"))
      .isDisplayed();
    assert.ok(categoriesTitle, "The Categories section is not displayed");

    await driver.wait(until.elementLocated(By.className("dashboardcategories_wrapper__5udRt")), timeOut);
    const categoriesContent = await driver
      .findElement(By.className("dashboardcategories_wrapper__5udRt"))
      .isDisplayed();
    assert.ok(categoriesContent, "The Categories section is not displayed");

  });

  it("Display all the Categories in defined order below from left to right with max 4 cards at each row", async () => {
    const items = await driver.findElement(By.css('.dashboardcategories_wrapper__5udRt'));
    const card = await driver.findElement(By.className("categoryCard_wrapper__5MdCo"))
    const itemsRect = await items.getRect();
    const cardRect = await card.getRect();
    const cardsPerRow = Math.floor(itemsRect.width / cardRect.width);
    assert.ok(cardsPerRow < 5, "More than 4 cards in a row!")
  });

  after(async () => await driver.quit());
});
