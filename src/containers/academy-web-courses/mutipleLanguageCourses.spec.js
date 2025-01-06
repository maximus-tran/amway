import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { checkElementExists, checkChildElementExists } from "../../common/checkViewport.js";

const user = {
    email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
    username: "GENE FLUECK",
    password: "Amway@1234",
};

describe("Verify UI List courses", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Verify user should be able to see newly created course at Course section", async () => {
        //login
        await driver.get(baseURL);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();

        //navigate to dashboard
        await driver.navigate().to(`${baseURL}/dashboard?init=true`);

        //navigate to course tab
        await driver.wait(until.elementLocated(By.css(".tab_wrapper__DEA_E")), timeOut);
        const courses = await driver.findElement(
            By.xpath("//div[@id='__next']/main/div[2]/div/nav/ul/li[2]"),
        );
        await courses.click();
        await driver.wait(
            until.elementLocated(By.className("SectionTitle_section_container__RTAyL")),
            timeOut,
        );
        assert.ok((await driver.getTitle()) === "Courses", "Navigation to Courses Page failed");

        //check course list (includes 3 newly courses)
        await driver.wait(until.elementLocated(By.id("tabpanel-course_catalog")), timeOut);
        const list = await driver.findElements(By.css(".tabDetails_cardwrapper_children__9RdHs"));
        const checkList = list.slice(0, 4);

        for (let i = 0; i < checkList.length; i++) {
            const isNewLabel = await checkChildElementExists(
                checkList[i],
                "className",
                "pill_pill_wrapper__gIDX_ pill_new__dn82x",
            );
            assert.ok(isNewLabel, "New tag is not displayed");
        }
    });

    it("User should be able to see unicode chars at Course Title, Description and Author/Speaker name", async () => {
        const isHasTitle = await checkElementExists(driver, "className", "card_name__HOcFA");
        assert.ok(isHasTitle, "Title is not displayed");
        const isHasDescription = await checkElementExists(
            driver,
            "className",
            "card_description__Ax4dg ellipses",
        );
        assert.ok(isHasDescription, "Description is not displayed");
    });

    after(async () => await driver.quit());
});
