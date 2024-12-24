import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";

const cookieData = [
    {
        domain: "www.qa.ana.academy-preprod.amway.com",
        expiry: 1734431117,
        httpOnly: false,
        name: "userDetails",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22aboNumber%22%3A%227014253546%22%2C%22partyId%22%3A%22120258805%22%2C%22firstName%22%3A%22Matias%22%2C%22lastName%22%3A%22Defrere%22%2C%22name%22%3A%22Matias%20Defrere%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22209%22%2C%22salesPlanAff%22%3A%22010%22%2C%22countryCode%22%3A%22US%22%2C%22amwayId%22%3A%223af88858-9208-48cc-8665-be007d65eb53%22%2C%22showWelcomeVideo%22%3Afalse%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22loginId%22%3A%220100701425354601%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxYTUwNGY4NS00ZTQyLTRkM2MtOGVhMC0zZDVhNWNlMDU0NmZfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI1YjFmNGQ3Mi0wYTM1LTRhOWEtOTcyMi01NDViNWQ3NTNiZTciLCJjb2RlIjoiN2Y0ZDRiNDEtYjA3ZS00ZjU2LTg1NDAtMDk3MDEwYjQ1Y2YxIiwib3JpZ2luIjoiYmF0Y2giLCJpc3MiOiJodHRwczovL2dsdXUtcHJlcHJvZDAxLXFhYW1lci5hbXN0YWNrLWFtd2F5aWR2Mi1wcmVwcm9kLmFtd2F5Z2xvYmFsLmNvbSIsIm1hc2hlcnlDbGllbnRJZCI6ImQ0YjY2MzMzLTdiZmQtNDQ3Yy1hM2MyLWVhODM3ZTQ3ZTY3ZCIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJpbnVtIjoiNWIxZjRkNzItMGEzNS00YTlhLTk3MjItNTQ1YjVkNzUzYmU3IiwibXNzIjoiYWJvTnVtPTcwMTQyNTM1NDYgc2FsZXNQbGFuQWZmPTAxMCBwYXJ0eUlkPTEyMDI1ODgwNSIsImNsaWVudF9pZCI6ImQ0YjY2MzMzLTdiZmQtNDQ3Yy1hM2MyLWVhODM3ZTQ3ZTY3ZCIsImxvZ2luX3BhcnR5aWQiOiIxMjAyNTg4MDUiLCJjc3BhIjoiMDEwIiwiYXVkIjoiZDRiNjYzMzMtN2JmZC00NDdjLWEzYzItZWE4MzdlNDdlNjdkIiwieDV0I1MyNTYiOiIiLCJzY29wZSI6WyJyb2xlIiwiYWNjdF90eXBlIiwib2ZmbGluZV9hY2Nlc3MiLCJvcGVuaWQiLCJwcm9maWxlIl0sInN0YXRlIjoiZXlKaGJYZGZiRzVuSWpwdWRXeHNMQ0poYlhkZlkyeHBaVzUwWVhCd0lqb2lRV05oWkdWdGVWZGxZbk5wZEdWQlRrRWlMQ0oxYVdRaU9pSTRPRE14TXpZeU16Z3hNRGtpTENKa1pXVndiR2x1YXlJNklpSXNJbU5qSWpwdWRXeHNmUSIsImV4cCI6MTczNDQzMTExNywicGFydHlJZCI6IjEyMDI1ODgwNSIsImlhdCI6MTczNDQyNzUxNywiYWNjb3VudCI6eyJjb3VudHJ5IjoiVVMiLCJyb2xlIjoiQnVzaW5lc3NPd25lciIsInNhbGVzX3BsYW5fYWZmIjoiMDEwIiwicmVzaWduX2RhdGUiOiIiLCJhY2N0X3R5cGUiOiJBbXdheUJ1c2luZXNzIiwibGNsX3BhcnR5aWQiOiIxMjAyNTg4MDUiLCJhYm8iOiI3MDE0MjUzNTQ2Iiwic3RhdHVzIjoiQUNUSVZFIn0sInVzZXJuYW1lIjoibWlyYW5kYWFndWVkYTA4MEBnbWFpbC5jb20iLCJnYmxfcGFydHlpZCI6IjEyMDI1ODgwNSJ9.Ckhjh6_TAmvjps-ew8W-GBhc4w5Z9P7MdnbJw67QM_2PyP26yXY1v3XpMmn0s21RNCoevDLHKeF7id2mEEzTp69IA38UjjJHMgcQGhDFX0Ov84QvaX1HjwT4VB_I8FC5Hg63lYRDTdpTYnr3Ft2ScB1BgthcwNzp_EBPTMts20LKuq68svU-mYh7W6IVabFclfcpFwuU7GKLsERvpu-cnt5_pTOODAnva_ChmXzJMoCP055CZFRm5pOO8wvxBFwOAVZ0ICM3e-jBao2_RhaDRDibvMdbZ8AA3jD0Z7-JkRN-kiGQ2sutP_iHRSEar238chWq9viZgNg2bLlr0KFnGw%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1765963524,
        httpOnly: false,
        name: "utag_main",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "v_id:0193d3efbd9f0022e7ed481a9cb200084003607c00400$_sn:1$_ss:1$_st:1734429324514$ses_id:1734427524514%3Bexp-session$_pn:1%3Bexp-session",
    },
    {
        domain: ".amway.com",
        httpOnly: false,
        name: "marketLang",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22locale%22%3A%22en-us%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1734431117,
        httpOnly: false,
        name: "academy_user",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22login%22%3A%220100701425354601%22%2C%22FirstName%22%3A%22Matias%22%2C%22LastName%22%3A%22Defrere%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1734431117,
        httpOnly: false,
        name: "aboDetailsToken",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiI3MDE0MjUzNTQ2IiwiYWZmIjoiMDEwIiwicGFydHlJZCI6IjEyMDI1ODgwNSIsImhpZ2hlc3RHbG9iYWxBd2QiOiIyMDkiLCJidGNJbmZvIjpudWxsLCJzaWduYXR1cmVJbmZvIjpudWxsLCJjb3VudHJ5Q29kZSI6IlVTIiwiYW13YXlJZCI6IjNhZjg4ODU4LTkyMDgtNDhjYy04NjY1LWJlMDA3ZDY1ZWI1MyIsIkJUQ0NvdXJzZXNTdGF0dXMiOm51bGwsImlhdCI6MTczNDQyNzUyNCwiZXhwIjoxNzM0NDMxMTI0fQ.-knqZXGhcYtceCVEQVEbz8R8DdYN4z4p87bMG0uDSNA%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1734431117,
        httpOnly: false,
        name: "refreshtoken",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22refreshtoken%22%3A%228c6a0a1d-be2f-4d04-91a7-a21e04c1fd33%22%7D",
    },
];

describe("Check Header", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
    });

    it("Search", async () => {
        await driver.get("https://www.qa.ana.academy-preprod.amway.com/dashboard");
        await driver.manage().addCookie(cookieData[0]);
        await driver.manage().addCookie(cookieData[1]);
        await driver.manage().addCookie(cookieData[2]);
        await driver.manage().addCookie(cookieData[3]);
        await driver.manage().addCookie(cookieData[4]);
        await driver.manage().addCookie(cookieData[5]);

        await driver.navigate().to("https://www.qa.ana.academy-preprod.amway.com/dashboard");

        await driver
            .wait(until.elementLocated(By.id("autocomplete-input")), 20000)
            .sendKeys("test-rise");
        await driver.wait(until.elementLocated(By.id("suggestion-0")), 15000).click();
        //Favorite course
        // await driver.findElement(By.css(".SocialMediaShareButton_btnContainer__xBnuM")).click();
        //Close modal
        await driver.sleep(4000);
        await driver.findElement(By.css(".icon")).click();
    });

    it("Achievement Icon", async () => {
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.id("achievement icon")), 20000).click();
        await driver.sleep(4000);
        //Back to dashboard
        await driver.findElement(By.className("CourseHeader_logo_wrapper__Ufns0")).click();
    });

    it("Account Icon", async () => {
        await driver.sleep(1000);
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), 20000)
            .click();
        await driver.sleep(2000);
        //Select language option
        await driver
            .findElement(By.xpath("//div[@id='profileModal']/div[2]/button/div[2]"))
            .click();
        await driver.sleep(2000);
        //Redirect to France language
        await driver.findElement(By.xpath("//div[@id='profileModal']/div/button[2]")).click();
        await driver
            .wait(until.elementLocated(By.className("profileIcon_container__Pd3Ql")), 20000)
            .click();
        //Back to Account menu
        // await driver
        //     .wait(until.elementLocated(By.xpath("//div[@id=\'profileModal\']/button/p")), 30000)
        //     .click();
        //Sign out
        await driver.findElement(By.xpath('//div[@id="profileModal"]/div[2]/a[2]')).click();
    });

    it("Banner", async () => {
        await driver.get("https://www.qa.ana.academy-preprod.amway.com/dashboard");
        await driver.manage().addCookie(cookieData[0]);
        await driver.manage().addCookie(cookieData[1]);
        await driver.manage().addCookie(cookieData[2]);
        await driver.manage().addCookie(cookieData[3]);
        await driver.manage().addCookie(cookieData[4]);
        await driver.manage().addCookie(cookieData[5]);

        await driver.navigate().to("https://www.qa.ana.academy-preprod.amway.com/dashboard");
        await driver.sleep(4000);
        await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '//div[@id="__next"]/main/div/section/div/div/div/div[2]/div/button/span',
                    ),
                ),
                20000,
            )
            .click();
        //Pause video
        await driver.sleep(7000);
        await driver
            .wait(
                until.elementLocated(
                    By.xpath('//div[@id="__next"]/main/div[2]/section/div/div[4]/button/img'),
                ),
                15000,
            )
            .click();
        //Play video
        await driver.sleep(2000);
        await driver
            .findElement(By.xpath('//div[@id="__next"]/main/div/section/div/div[2]/button[2]/img'))
            .click();
        //Forward 10s
        await driver.sleep(3000);
        await driver
            .findElement(By.xpath('//div[@id="__next"]/main/div/section/div/div[2]/button[3]/img'))
            .click();
        //Return 10s
        await driver.sleep(3000);
        await driver
            .findElement(By.xpath('//div[@id="__next"]/main/div/section/div/div[2]/button[1]/img'))
            .click();
        //Close Video Modal
        await driver.sleep(2000);
        await driver.findElement(By.className("VideoModal_close_icon__onv_F")).click();
    });
});
