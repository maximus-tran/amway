import { By, until } from "selenium-webdriver";
import { buildDriver } from "../../common/browserBuild.js";
import { baseURL, timeOut } from "../../common/constants.js";
import assert from "assert";
import { scrollToElement } from "../../common/scrollTo.js";

const user = {
    email: "MPKF34IMTEJSU4SQJ6UCOC6FFZ4COPJOYWSEIIVMZXLKIWEU2BAQ@example.com",
    username: "GENE FLUECK",
    password: "Amway@1234",
};

const italianCategories = [
    {
        label: "Guadagna con Amway",
        imgSrc: "Earn_Money.jpg",
        href: "/search?categoryId=blta85c80921d63080e",
        itemTitle: "earn monney",
    },
    {
        label: "Guida un gruppo",
        imgSrc: "Lead_a_Team.jpg",
        href: "/search?categoryId=blt1c6265024a129ff7",
        itemTitle: "lead a team",
    },
    {
        label: "Competenze imprenditoriali",
        imgSrc: "Learn_the_Rules.jpg",
        href: "/search?categoryId=blt86d0d303f2f4c35e",
        itemTitle: "business skills",
    },
    {
        label: "Competenze comunicative",
        imgSrc: "Sell_on_Social.jpg",
        href: "/search?categoryId=blt6c925eccb69f3c39",
        itemTitle: "communication skills",
    },
    {
        label: "Sponsorizza",
        imgSrc: "Sponsor_New_ABOs.jpg",
        href: "/search?categoryId=blt18c000bcd4140170",
        itemTitle: "sponsoring",
    },
    {
        label: "Soluzioni per il benessere",
        imgSrc: "Health_and_Wellbeing_Solutions.jpg",
        href: "/search?categoryId=bltd1447db92815a248",
        itemTitle: "health and wellbeing solutions",
    },
    {
        label: "Nutrizione",
        imgSrc: "Nutrition.jpg",
        href: "/search?categoryId=blt9aa0ea71d85a5d01",
        itemTitle: "nutrition",
    },
    {
        label: "Bellezza",
        imgSrc: "Beauty_and_personal_Care.jpg",
        href: "/search?categoryId=blt3c24ae92b1eaf79a",
        itemTitle: "beauty",
    },
    {
        label: "Persona",
        imgSrc: "croppedImage.jpeg",
        href: "/search?categoryId=blt1d92d008ce90382c",
        itemTitle: "personal care",
    },
    {
        label: "Casa",
        imgSrc: "Durables_and_Home_Care.jpg",
        href: "/search?categoryId=blt6887cf6ae3ff0a61",
        itemTitle: "home",
    },
];

describe("Verify Categories at the dashboard", () => {
    let driver;
    before(async () => {
        driver = await buildDriver("chrome");
        await driver.manage().window().maximize();
    });

    it("Verify display correct thumbnail image categories", async () => {
        await driver.get(baseURL);
        await driver
            .wait(until.elementLocated(By.id("loginform:loginid")), timeOut)
            .sendKeys(user.email);
        await driver.findElement(By.id("loginform:password")).sendKeys(user.password);
        await driver.findElement(By.id("loginform:loginButton")).click();

        await driver.navigate().to(`${baseURL}/dashboard?init=true`);

        //Categories section
        const element = await driver.wait(
            until.elementLocated(By.className("dashboard_section_heading_wrapper__hf2aj")),
            timeOut,
        );
        await scrollToElement(driver, element);

        await driver.wait(
            until.elementLocated(By.className("SectionTitle_section_container__RTAyL")),
            timeOut,
        );
        const categoriesTitle = await driver
            .findElement(By.className("SectionTitle_section_container__RTAyL"))
            .isDisplayed();
        assert.ok(categoriesTitle, "The Categories section is not displayed");

        await driver.wait(
            until.elementLocated(By.className("categoryCard_wrapper__5MdCo")),
            timeOut,
        );
        const categoryItems = await driver.findElements(
            By.css(".dashboardcategories_wrapper__5udRt .categoryCard_wrapper__5MdCo"),
        );
        assert.ok(categoryItems.length === 10, "Incorrect number of categories");
        assert.ok(
            (await categoryItems[0].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[0].imgSrc,
            ),
            `Incorrect ${italianCategories[0].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[1].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[1].imgSrc,
            ),
            `Incorrect ${italianCategories[1].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[2].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[2].imgSrc,
            ),
            `Incorrect ${italianCategories[2].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[3].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[3].imgSrc,
            ),
            `Incorrect ${italianCategories[3].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[4].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[4].imgSrc,
            ),
            `Incorrect ${italianCategories[4].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[5].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[5].imgSrc,
            ),
            `Incorrect ${italianCategories[5].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[6].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[6].imgSrc,
            ),
            `Incorrect ${italianCategories[6].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[7].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[7].imgSrc,
            ),
            `Incorrect ${italianCategories[7].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[8].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[8].imgSrc,
            ),
            `Incorrect ${italianCategories[8].itemTitle} thumbnail`,
        );
        assert.ok(
            (await categoryItems[9].findElement(By.css("img")).getAttribute("src")).includes(
                italianCategories[9].imgSrc,
            ),
            `Incorrect ${italianCategories[9].itemTitle} thumbnail`,
        );
    });

    it("Display all the Categories in defined order below from left to right with max 4 cards at each row", async () => {
        const categoryItems = await driver.findElements(
            By.css(".dashboardcategories_wrapper__5udRt .categoryCard_wrapper__5MdCo"),
        );
        assert.ok(
            (await categoryItems[0].getText()) === italianCategories[0].label,
            `Not ${italianCategories[0].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[1].getText()) === italianCategories[1].label,
            `Not ${italianCategories[1].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[2].getText()) === italianCategories[2].label,
            `Not ${italianCategories[2].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[3].getText()) === italianCategories[3].label,
            `Not ${italianCategories[3].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[4].getText()) === italianCategories[4].label,
            `Not ${italianCategories[4].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[5].getText()) === italianCategories[5].label,
            `Not ${italianCategories[5].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[6].getText()) === italianCategories[6].label,
            `Not ${italianCategories[6].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[7].getText()) === italianCategories[7].label,
            `Not ${italianCategories[7].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[8].getText()) === italianCategories[8].label,
            `Not ${italianCategories[8].itemTitle} category`,
        );
        assert.ok(
            (await categoryItems[9].getText()) === italianCategories[9].label,
            `Not ${italianCategories[9].itemTitle} category`,
        );
        const items = await driver.findElement(By.css(".dashboardcategories_wrapper__5udRt"));
        const card = await driver.findElement(By.className("categoryCard_wrapper__5MdCo"));
        const itemsRect = await items.getRect();
        const cardRect = await card.getRect();
        const cardsPerRow = Math.floor(itemsRect.width / cardRect.width);
        assert.ok(cardsPerRow < 5, "More than 4 cards in a row!");
    });

    after(async () => await driver.quit());
});
