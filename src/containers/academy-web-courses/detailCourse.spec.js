import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/baseURL.js";
import assert from "assert";
import { checkElementExists } from "../../common/checkViewport.js";
import { isLanguageMatching } from "../../common/detectLanguage.js";

const cookieData = [
  {
    domain: '.amway.com',
    expiry: 1767090703,
    httpOnly: false,
    name: 'utag_main',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: 'v_id:0194171f1ebe0021772c03f004ac0506f004106700bd0$_sn:1$_ss:1$_st:1735556503039$ses_id:1735554703039%3Bexp-session$_pn:1%3Bexp-session'
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
    expiry: 1735558301,
    httpOnly: false,
    name: 'academy_user',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22login%22%3A%221600000100717701%22%2C%22FirstName%22%3A%22GENE%22%2C%22LastName%22%3A%22FLUECK%22%7D'
  },
  {
    domain: 'www.qa.esan.academy-preprod.amway.com',
    expiry: 1735558301,
    httpOnly: false,
    name: 'userDetails',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboNumber%22%3A%221007177%22%2C%22partyId%22%3A%2242364598%22%2C%22firstName%22%3A%22GENE%22%2C%22lastName%22%3A%22FLUECK%22%2C%22name%22%3A%22GENE%20FLUECK%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22305%22%2C%22salesPlanAff%22%3A%22160%22%2C%22countryCode%22%3A%22IT%22%2C%22amwayId%22%3A%2266901b91-d127-b4af-b645-1fccc63e2bca%22%2C%22showWelcomeVideo%22%3Atrue%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%221600000100717701%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxZjQwZDk4Mi1iMTJkLTQ5NmEtYTAwMy00MDk3MTk5NDkyNGRfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ODVhNDNmZC04MGIwLTQ1YzEtYmY2ZC0xNjg1MzZjYjY0NjYiLCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIl0sImNvZGUiOiI2OTE2Y2EzMS01NDQ1LTRkMWEtYTQwNS0wYWY3ODE5MTIyZTEiLCJhYm9OdW1iZXIiOiIxMDA3MTc3IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50LXFhLmFtc3RhY2stZXUtcHJlcHJvZC5hbXdheS5uZXQiLCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwibXNzIjoiYWJvTnVtPTEwMDcxNzcgc2FsZXNQbGFuQWZmPTE2MCBwYXJ0eUlkPTQyMzY0NTk4IiwiY2xpZW50X2lkIjoiODE0ZDcxMDEtZjZiNC00NTQ0LWE5NTgtNzdkYmM5Mzg2MjllIiwibG9naW5fcGFydHlpZCI6IjQyMzY0NTk4IiwiYWNjb3VudFN1YlR5cGVDZCI6IkJ1c2luZXNzT3duZXIiLCJjc3BhIjoiMTYwIiwiYXVkIjoiODE0ZDcxMDEtZjZiNC00NTQ0LWE5NTgtNzdkYmM5Mzg2MjllIiwieDV0I1MyNTYiOiIiLCJzY29wZSI6WyJvcGVuaWQiLCJvZmZsaW5lX2FjY2VzcyIsInByb2ZpbGUiXSwiYWNjb3VudFR5cGVDZCI6IkFtd2F5QnVzaW5lc3MiLCJtdWMiOiI0MjM2NDU5OCIsImV4cCI6MTczNTU1ODMwMSwicGFydHlJZCI6IjQyMzY0NTk4IiwiaWF0IjoxNzM1NTU0NzAxLCJhY2NvdW50Ijp7ImNvdW50cnkiOiJJVCIsImxOYW1lIjoiRkxVRUNLIiwicm9sZSI6IkJ1c2luZXNzT3duZXIiLCJmTmFtZSI6IkdFTkUiLCJzYWxlc19wbGFuX2FmZiI6IjE2MCIsImxldmVsIjoiU2lsdmVyU3BvbnNvciIsInJlbmV3YWxGbGFnIjoiMCIsImxjbF9wYXJ0eWlkIjoiNDIzNjQ1OTgiLCJtTmFtZSI6IiIsImFibyI6IjEwMDcxNzciLCJzdGF0dXMiOiJBY3RpdmUifSwidXNlcm5hbWUiOiJNUEtGMzRJTVRFSlNVNFNRSjZVQ09DNkZGWjRDT1BKT1lXU0VJSVZNWlhMS0lXRVUyQkFRQGV4YW1wbGUuY29tIiwiY2lkIjoiODE0ZDcxMDEtZjZiNC00NTQ0LWE5NTgtNzdkYmM5Mzg2MjllIiwic3RhdHVzIjoiYWN0aXZlIiwiZ2JsX3BhcnR5aWQiOiI0MjM2NDU5OCJ9.VqYoOK-B79solmbkpd29amvCqBuRfPhr5Y5BmYMOuMFrIfsJtJ2m1Sb5UCO6gJit3MLAj76kJUgv0XN0FSRx4AK3Oy91rNvbH3F6DkhnghWoB3x1EVJVobniVFbR_EZMAl_EjvPAMUhQ9zE9TnCw2hM1oATOy4A7Favxr7N41O_xd0IVRy-S4AZqyM-qXgYsvdfN92KV1ptE11pFY2pBQVMJOs-MsMMP6vkIUD7qX1f-ivXyeC-p5N4dN9_GnoTcCUSrJrAocKLDEhQZfAcRd_oL3KIeEDcyIY0EgJvwRgCiUh-PMx_wMpaT9sueTCxzyjESufvEzvfaFR_jE6rBRw%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735558301,
    httpOnly: false,
    name: 'refreshtoken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22refreshtoken%22%3A%22adc207a6-6c61-474b-afaf-62b8480aff61%22%7D'
  },
  {
    domain: '.amway.com',
    expiry: 1735558301,
    httpOnly: false,
    name: 'aboDetailsToken',
    path: '/',
    sameSite: 'Lax',
    secure: false,
    value: '%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiIxMDA3MTc3IiwiYWZmIjoiMTYwIiwicGFydHlJZCI6IjQyMzY0NTk4IiwiaGlnaGVzdEdsb2JhbEF3ZCI6IjMwNSIsImJ0Y0luZm8iOm51bGwsInNpZ25hdHVyZUluZm8iOm51bGwsImNvdW50cnlDb2RlIjoiSVQiLCJhbXdheUlkIjoiNjY5MDFiOTEtZDEyNy1iNGFmLWI2NDUtMWZjY2M2M2UyYmNhIiwiQlRDQ291cnNlc1N0YXR1cyI6bnVsbCwiY2hhdElzc3Vlc0NvdW50IjowLCJpYXQiOjE3MzU1NTQ3MDQsImV4cCI6MTczNTU1ODMwNH0.mZz5pVFRs7SmwwmWGt3oiVpav_X4Xz1HGIYdvJl09bM%22%7D'
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

    await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
    const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
    const loopCount = list.length > 3 ? 3 : list.length;

    for (let item = 0; item < loopCount; item++) {
      await list[item].click();
      const isDiplayedDropDown = await checkElementExists(driver, "dropdown_drop_down__pHsMb");
      if (isDiplayedDropDown) {
        const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
        await dropdown.click();
        const selectLanguage = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
        for (let i = 0; i < selectLanguage.length; i++) {
          if (i !== 0) {
            const dropdown = await driver.wait(until.elementLocated(By.className("dropdown_drop_down__pHsMb ")), timeOut);
            await dropdown.click();
          }
          const selectLanguageNew = await driver.findElements(By.css(".dropdown_list_item__GMMgn"));
          const selectedLang = await selectLanguageNew[i].getText();
          await selectLanguageNew[i].click();
          const langArr = [
            {
              label: "English",
              value: 'en'
            },
            {
              label: "Italiano",
              value: 'it'
            },
            {
              label: "Deutsch",
              value: 'de'
            },
            {
              label: "Chinese",
              value: 'zh'
            }
          ]
          const selectedLangValue = langArr.find(x => x.label === selectedLang).value

          const title = await driver
            .wait(until.elementLocated(By.className("startLaunchCourse_main_title__VMVRr")), timeOut)
            .getText();
          const description = await driver
            .wait(until.elementLocated(By.className("startLaunchCourse_courseDescription__7oyMU")), timeOut)
            .getText();
          assert.ok(isLanguageMatching(title, [selectedLangValue]), `Title does not match`);
          assert.ok(isLanguageMatching(description, [selectedLangValue]), `Description does not match`);
        }
      }
      await driver.wait(until.elementLocated(By.className("icon startLaunchCourse_cross_icon__eyRob")), timeOut).click();
    }
  });

  after(async () => await driver.quit());
});
