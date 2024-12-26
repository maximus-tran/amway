import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { scrollToElement } from "../../common/scrollTo.js";

const cookieData = [
  {
    domain: '.amway.com',
    expiry: 1766715987,
    httpOnly: false,
    name: 'utag_main',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: 'v_id:019400c96c160002517b56cb3ac20506f004106700bd0$_sn:1$_ss:1$_st:1735181787991$ses_id:1735179987991%3Bexp-session$_pn:1%3Bexp-session'
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
    expiry: 1735183581,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735183581,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiMjFmZjE1ZTItNGRkMC00YjI0LTkzNWEtNmVlYjcwZTZlYmEzIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzUxODM1ODEsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTE3OTk4MSwiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.nZS0RI2dq2a6BqFlTFWCfEEIY72YLY6HE1nloF4Z7yPXQpFDp5XlL639MgHPg7QHd3lkGjnuxfeWo5MiR785tCQKn6-pInrurRRYHA0YaVXjqiFgWnno5pZPpvnFIzJm2RkvDJ0QY-Cb6ML1I_CzlohOV_QQt8rjo0DSXHiay5TzejPPH9jgRA-EBLfuAuWRn2wxscIppeX824KFFeScBIeP8rVCKdNj2WhssUGFR3B56J029q9w7SW0xKYcKJeftmRPcVD4D3RlwND2zxHRlHW58KNgLPI56O8Zr9469usCAnKAM0Bv7VJA-YVcGz0hhGHocSkEAFJ5Z_fvENziDg%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735183581,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%22a73492d5-6013-41d6-b0c1-d840aeea6327%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735183581,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiaWF0IjoxNzM1MTc5OTg2LCJleHAiOjE3MzUxODM1ODZ9._7YoTOh5yrEOD7EmEmIGT7VsyQwSae-Bd_1JZ-zC_tE%22%7D'
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

    await driver.wait(until.elementLocated(By.className("categoryCard_wrapper__5MdCo")), timeOut);
    const categoryItems = await driver
      .findElements(By.css(".dashboardcategories_wrapper__5udRt .categoryCard_wrapper__5MdCo"))
    assert.ok(categoryItems.length === 10, "Incorrect number of categories");
    assert.ok((await categoryItems[0].findElement(By.css('img')).getAttribute('src')).includes('Earn_Money.jpg'), 'Not earn monney category')
    assert.ok((await categoryItems[1].findElement(By.css('img')).getAttribute('src')).includes('Lead_a_Team.jpg'), 'Not lead a team category')
    assert.ok((await categoryItems[2].findElement(By.css('img')).getAttribute('src')).includes('Learn_the_Rules.jpg'), 'Not learn the rules category')
    assert.ok((await categoryItems[3].findElement(By.css('img')).getAttribute('src')).includes('Sell_on_Social.jpg'), 'Not sell on social category')
    assert.ok((await categoryItems[4].findElement(By.css('img')).getAttribute('src')).includes('Sponsor_New_ABOs.jpg'), 'Not sponsor new ABOs category')
    assert.ok((await categoryItems[5].findElement(By.css('img')).getAttribute('src')).includes('Health_and_Wellbeing_Solutions.jpg'), 'Not health and webllbeing category')
    assert.ok((await categoryItems[6].findElement(By.css('img')).getAttribute('src')).includes('Nutrition.jpg'), 'Not nutrition category')
    assert.ok((await categoryItems[7].findElement(By.css('img')).getAttribute('src')).includes('Beauty_and_personal_Care.jpg'), 'Not beauty and personal care category')
    assert.ok((await categoryItems[8].findElement(By.css('img')).getAttribute('src')).includes('croppedImage.jpeg'), 'Not croppedImage category')
    assert.ok((await categoryItems[9].findElement(By.css('img')).getAttribute('src')).includes('Durables_and_Home_Care.jpg'), 'Not home category')
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
