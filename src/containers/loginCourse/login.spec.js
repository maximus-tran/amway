import { By, until } from "selenium-webdriver";
import { buildDriver, openMobileWebsite } from "../../common/browserBuild.js";

const cookieData = [
    {
        domain: ".amway.com",
        expiry: 1765960443,
        httpOnly: false,
        name: "utag_main",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "v_id:0193d3c0bafd00207460319081960506f003606700bd0$_sn:1$_ss:1$_st:1734426243646$ses_id:1734424443646%3Bexp-session$_pn:1%3Bexp-session",
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
        expiry: 1734428036,
        httpOnly: false,
        name: "academy_user",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22login%22%3A%220100701425354601%22%2C%22FirstName%22%3A%22Matias%22%2C%22LastName%22%3A%22Defrere%22%7D",
    },
    {
        domain: "www.qa.ana.academy-preprod.amway.com",
        expiry: 1734428036,
        httpOnly: false,
        name: "userDetails",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22aboNumber%22%3A%227014253546%22%2C%22partyId%22%3A%22120258805%22%2C%22firstName%22%3A%22Matias%22%2C%22lastName%22%3A%22Defrere%22%2C%22name%22%3A%22Matias%20Defrere%22%2C%22role%22%3A%22ABO%22%2C%22highestPin%22%3A%22209%22%2C%22salesPlanAff%22%3A%22010%22%2C%22countryCode%22%3A%22US%22%2C%22amwayId%22%3A%223af88858-9208-48cc-8665-be007d65eb53%22%2C%22showWelcomeVideo%22%3Afalse%2C%22isProspectUser%22%3Afalse%2C%22isProspect2User%22%3Afalse%2C%22aboDetailsToken%22%3A%22%22%2C%22loginId%22%3A%220100701425354601%22%2C%22refreshtoken%22%3A%22%22%2C%22accesstoken%22%3A%22eyJraWQiOiIxYTUwNGY4NS00ZTQyLTRkM2MtOGVhMC0zZDVhNWNlMDU0NmZfc2lnX3JzMjU2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI1YjFmNGQ3Mi0wYTM1LTRhOWEtOTcyMi01NDViNWQ3NTNiZTciLCJjb2RlIjoiYmFjMDJhYzAtODMzMC00YWQ0LTliYjYtOTE4MzU4MjEwMWI1Iiwib3JpZ2luIjoiYmF0Y2giLCJpc3MiOiJodHRwczovL2dsdXUtcHJlcHJvZDAxLXFhYW1lci5hbXN0YWNrLWFtd2F5aWR2Mi1wcmVwcm9kLmFtd2F5Z2xvYmFsLmNvbSIsIm1hc2hlcnlDbGllbnRJZCI6ImQ0YjY2MzMzLTdiZmQtNDQ3Yy1hM2MyLWVhODM3ZTQ3ZTY3ZCIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJpbnVtIjoiNWIxZjRkNzItMGEzNS00YTlhLTk3MjItNTQ1YjVkNzUzYmU3IiwibXNzIjoiYWJvTnVtPTcwMTQyNTM1NDYgc2FsZXNQbGFuQWZmPTAxMCBwYXJ0eUlkPTEyMDI1ODgwNSIsImNsaWVudF9pZCI6ImQ0YjY2MzMzLTdiZmQtNDQ3Yy1hM2MyLWVhODM3ZTQ3ZTY3ZCIsImxvZ2luX3BhcnR5aWQiOiIxMjAyNTg4MDUiLCJjc3BhIjoiMDEwIiwiYXVkIjoiZDRiNjYzMzMtN2JmZC00NDdjLWEzYzItZWE4MzdlNDdlNjdkIiwieDV0I1MyNTYiOiIiLCJzY29wZSI6WyJyb2xlIiwiYWNjdF90eXBlIiwib2ZmbGluZV9hY2Nlc3MiLCJvcGVuaWQiLCJwcm9maWxlIl0sInN0YXRlIjoiZXlKaGJYZGZiRzVuSWpwdWRXeHNMQ0poYlhkZlkyeHBaVzUwWVhCd0lqb2lRV05oWkdWdGVWZGxZbk5wZEdWQlRrRWlMQ0oxYVdRaU9pSXhORGMzTkRZMk1qY3hNVGd5SWl3aVpHVmxjR3hwYm1zaU9pSWlMQ0pqWXlJNmJuVnNiSDAiLCJleHAiOjE3MzQ0MjgwMzYsInBhcnR5SWQiOiIxMjAyNTg4MDUiLCJpYXQiOjE3MzQ0MjQ0MzYsImFjY291bnQiOnsiY291bnRyeSI6IlVTIiwicm9sZSI6IkJ1c2luZXNzT3duZXIiLCJzYWxlc19wbGFuX2FmZiI6IjAxMCIsInJlc2lnbl9kYXRlIjoiIiwiYWNjdF90eXBlIjoiQW13YXlCdXNpbmVzcyIsImxjbF9wYXJ0eWlkIjoiMTIwMjU4ODA1IiwiYWJvIjoiNzAxNDI1MzU0NiIsInN0YXR1cyI6IkFDVElWRSJ9LCJ1c2VybmFtZSI6Im1pcmFuZGFhZ3VlZGEwODBAZ21haWwuY29tIiwiZ2JsX3BhcnR5aWQiOiIxMjAyNTg4MDUifQ.YI5nNRUUqLITmctMsyfVW4UvyNz8fQzSGlblntvMl6MOGi82LLSwNBE6-PtWDF5OwjQIN9B2XcbvLmV694gFufT666Ozc6OPV5pKjGDcVTl-QlBnCTimWxcrtu79u0viIWA1EYh3PHmgwLPKbAu6HqwelfbJ0mqlL0O-Ou30E_KY6blV9i5eDbZ9cZ7NCxib92rO5lbni_qOeBjigB87i2WP77r6NSE7afI7tkI-p93Db4E-XJ1UN924wd3wM6XIWprUXsCX9mVDFvvSGBqKCdS_m9nzAqwdOpBGu60arDycw4BkAV-X4yGsyMunbKu6w9zd3BCdpbt09mBSrTIj7w%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1734428036,
        httpOnly: false,
        name: "refreshtoken",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22refreshtoken%22%3A%22b022f7da-0cd2-4af6-8326-e60896f726a0%22%7D",
    },
    {
        domain: ".amway.com",
        expiry: 1734428036,
        httpOnly: false,
        name: "aboDetailsToken",
        path: "/",
        sameSite: "Lax",
        secure: false,
        value: "%7B%22aboDetailsToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm8iOiI3MDE0MjUzNTQ2IiwiYWZmIjoiMDEwIiwicGFydHlJZCI6IjEyMDI1ODgwNSIsImhpZ2hlc3RHbG9iYWxBd2QiOiIyMDkiLCJidGNJbmZvIjpudWxsLCJzaWduYXR1cmVJbmZvIjpudWxsLCJjb3VudHJ5Q29kZSI6IlVTIiwiYW13YXlJZCI6IjNhZjg4ODU4LTkyMDgtNDhjYy04NjY1LWJlMDA3ZDY1ZWI1MyIsIkJUQ0NvdXJzZXNTdGF0dXMiOm51bGwsImlhdCI6MTczNDQyNDQzOSwiZXhwIjoxNzM0NDI4MDM5fQ.kZwhw5PGnYWi4aApdQRvMb8ZRGJ6I183D75Qt5fOuV4%22%7D",
    },
];

describe("Check entry point", () => {
    let driver;
    before(async () => {
        driver = await openMobileWebsite();
    });

    it("TC_ID_1 Entry point - access course page", async () => {
        await driver.get("https://www.qa.ana.academy-preprod.amway.com/login");
        await driver
            .wait(until.elementLocated(By.id("username")), 10000)
            .sendKeys("mirandaagueda080@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("amway@1234");
        await driver.findElement(By.css(".btn.btn-block.baseButton.btn-primary.activated")).click();

        // await driver.manage().addCookie(cookieData[0]);
        // await driver.manage().addCookie(cookieData[1]);
        // await driver.manage().addCookie(cookieData[2]);
        // await driver.manage().addCookie(cookieData[3]);
        // await driver.manage().addCookie(cookieData[4]);
        // await driver.manage().addCookie(cookieData[5]);

        // await driver.navigate().to("https://www.qa.ana.academy-preprod.amway.com/dashboard");
        // // Step 2: Wait for successful login
        await driver.wait(until.elementLocated(By.id("mainContent")), 20000);

        // // Step 3: Save cookies to a file
        const cookies = await driver.manage().getCookies();
        console.log("Cookies saved successfully!", cookies);
    });

    // after(async () => await driver.quit());
});
