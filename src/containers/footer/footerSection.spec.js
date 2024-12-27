import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { scrollToCss } from "../../common/scrollTo.js"
import { isLanguageMatching } from "../../common/detectLanguage.js"

const cookieData =  [
  {
    domain: '.amway.com',
    expiry: 1766807437,
    httpOnly: false,
    name: 'utag_main',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: 'v_id:0194063cd3a70014a82151ab1b610506f004106700bd0$_sn:1$_ss:1$_st:1735273237224$ses_id:1735271437224%3Bexp-session$_pn:1%3Bexp-session'
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
    expiry: 1735275033,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735275033,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJjb2RlIjoiNzMzNzRjNDktYWExMy00OTg3LTg4ZTctMDM5MzljZWE3N2QzIiwiYWJvTnVtYmVyIjoiMTAwNzE3NyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudC1xYS5hbXN0YWNrLWV1LXByZXByb2QuYW13YXkubmV0IiwidG9rZW5fdHlwZSI6ImJlYXJlciIsIm1zcyI6ImFib051bT0xMDA3MTc3IHNhbGVzUGxhbkFmZj0xNjAgcGFydHlJZD00MjM2NDU5OCIsImNsaWVudF9pZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsImxvZ2luX3BhcnR5aWQiOiI0MjM2NDU5OCIsImFjY291bnRTdWJUeXBlQ2QiOiJCdXNpbmVzc093bmVyIiwiY3NwYSI6IjE2MCIsImF1ZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsIng1dCNTMjU2IjoiIiwic2NvcGUiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImFjY291bnRUeXBlQ2QiOiJBbXdheUJ1c2luZXNzIiwibXVjIjoiNDIzNjQ1OTgiLCJleHAiOjE3MzUyNzUwMzMsInBhcnR5SWQiOiI0MjM2NDU5OCIsImlhdCI6MTczNTI3MTQzMywiYWNjb3VudCI6eyJjb3VudHJ5IjoiSVQiLCJsTmFtZSI6IkZMVUVDSyIsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZk5hbWUiOiJHRU5FIiwic2FsZXNfcGxhbl9hZmYiOiIxNjAiLCJsZXZlbCI6IlNpbHZlclNwb25zb3IiLCJyZW5ld2FsRmxhZyI6IjAiLCJsY2xfcGFydHlpZCI6IjQyMzY0NTk4IiwibU5hbWUiOiIiLCJhYm8iOiIxMDA3MTc3Iiwic3RhdHVzIjoiQWN0aXZlIn0sInVzZXJuYW1lIjoiTVBLRjM0SU1URUpTVTRTUUo2VUNPQzZGRlo0Q09QSk9ZV1NFSUlWTVpYTEtJV0VVMkJBUUBleGFtcGxlLmNvbSIsImNpZCI6IjgxNGQ3MTAxLWY2YjQtNDU0NC1hOTU4LTc3ZGJjOTM4NjI5ZSIsInN0YXR1cyI6ImFjdGl2ZSIsImdibF9wYXJ0eWlkIjoiNDIzNjQ1OTgifQ.s7-s-zBNLvP5MbORXotuMECqc00yXX8ryRiPfav3-UEDfo_OQ4SXZmGpGC6A_y9hcZxN-RKrYNXc_PcTjMsW7tR6Gq-ISlom6znLx6j_IPGEgBxYytpIgDd8KHaYLGKMBunGBKQ7TeF3s64biu2S4hwIeE4FBtAdc6ewFiZ2AOoex_JdDlfCIJdrh7k-n6sS3ACQpmZdhZaS5E-SKUJIFwlpw4e2rdkVxSJJQF6qESa8YQ6o5CCqIM4RRKnkdgh79kx5PPpf_QkHbAqbmRWU3pSzx4MbnMG_2q0Tl40TS4lGoRdDpf7vmHXcm9RkeTAeYj7Rfa7pIcXFHbi2wbGRzQ%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735275033,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%2207803086-2bb3-4986-81b0-4397910bbac1%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735275033,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiY2hhdElzc3Vlc0NvdW50IjowLCJpYXQiOjE3MzUyNzE0MzYsImV4cCI6MTczNTI3NTAzNn0.WPdy6vnnWHnfdMC5KT1jdCLMLFCsBJtD2nXBGb76KtA%22%7D'
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

describe("KAN-10: Footer", () => {
  let driver;
  before(async () => {
    driver = await buildDriver("chrome");
    await driver.manage().window().maximize();
  });

  it("Scroll down till bottom section and observe the footer section", async () => {
    await driver.get(`${baseURL}/dashboard?init=true`);
    await driver.manage().addCookie(cookieData[0]);
    await driver.manage().addCookie(cookieData[1]);
    await driver.manage().addCookie(cookieData[2]);
    await driver.manage().addCookie(cookieData[3]);
    await driver.manage().addCookie(cookieData[4]);
    await driver.manage().addCookie(cookieData[5]);

    await driver.navigate().to(`${baseURL}/dashboard?init=true`);

    await driver.wait(until.elementLocated(By.id("mainContent")), timeOut);
    await scrollToCss(driver, ".commonfooter_desc_container__Jlkrk");
    const validLanguages = ["it", "en", "zh"];
    //Row 1
    const information = await driver.wait(until.elementLocated(By.css("p[aria-label]")), timeOut);
    const infText = await information.getAttribute('aria-label');
    assert.ok(await information.isDisplayed(), "The Disclaimer is not displayed");
    assert.ok(isLanguageMatching(infText, validLanguages), "Incorrect content");

    //Row 2
    const copyright = await driver.wait(until.elementLocated(By.css("div[aria-label]")), timeOut);
    const infCopyright = await copyright.getAttribute('aria-label');
    assert.ok(isLanguageMatching(infCopyright, validLanguages), "Incorrect content");

    //Row 3
    const content = await driver.wait(until.elementLocated(By.className("commonfooter_privacy_policy__pkljo")), timeOut);
    const link = await content.findElements(By.css("a[href]"));
    assert.ok(await content.isDisplayed(), "Privacy Policy | Terms & Conditions is not displayed");
    assert.ok((await link[0].getAttribute('href')).includes('privacy-policy'), 'Privacy Policy is not displayed');
    assert.ok((await link[1].getAttribute('href')).includes('terms-of-use'), 'Terms & Conditions is not displayed');
  });

  after(async () => await driver.quit());
});
