// src/e2e/steps/login-form.steps.js
const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/game.feature');
const i18n = require('../i18n-test-helper.js');
const { expect } = require('expect-puppeteer');

let page;
let browser;

defineFeature(feature, test => {

    // Launches the tests in a headless browser or a non-headless browser based on the environment (GITHUB_ACTIONS)
    // Sets the default timeout for Puppeteer actions to 30 seconds
    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            : await puppeteer.launch({ headless: false, slowMo: 10 });

        page = await browser.newPage();
        setDefaultOptions({ timeout: 30000 });
    });

    // Redirects to the home page and waits for the page to load
    beforeEach(async () => {
        await page.goto("http://localhost:3000/", {
            waitUntil: "networkidle0",
        });
    });

    test('The user completes a normal game with 10 geography questions, 60 seconds each', ({ given, when, then }) => {
        given('The user has configured a game with:', async () => {
            // Opens the game configuration modal
            await expect(page).toClick('button', { text: i18n.t("quickGame-home") });

            // Configures the game
            await expect(page).toMatchElement('h2', { text: i18n.t("title-configuration") });
            
            // Opens the dropdown menu for number of questions
            await expect(page).toClick('button', { text: '30' });
            // Selects 10 questions
            await expect(page).toClick('.dropdown-menu .dropdown-item', { text: '10' });
            await expect(page).toMatchElement('button', { text: '10' }); // Verifica que ahora muestra "10"
            
            // Opens the dropdown menu for time per question
            await expect(page).toClick('button', { text: '120s' });
            // Selects 60 seconds
            await expect(page).toClick('.dropdown-menu .dropdown-item', { text: '60s' });
            await expect(page).toMatchElement('button', { text: '60s' });
            
            // Checks that the play button is disabled when topics are not selected
            await expect(page).toMatchElement('button', { text: i18n.t("play-configuration"), disabled: true });
            // Selects the topic "Geography"
            await expect(page).toClick('label.toggle-btn-geography', {text: i18n.t("geography-configuration")});
            // Checks that the play button is enabled when topics are selected and clicks it
            await expect(page).toMatchElement('button', { text: i18n.t("play-configuration"), disabled: false });
            await expect(page).toClick('button', { text: i18n.t("play-configuration") });

            await page.waitForTimeout(500); // Waits for the game page to load

            const url = page.url();  // Takes the current URL
            expect(url).toMatch(/\/game/);  // Checks if the URL contains "/game"
            console.log("Se ha ejecutado el bloque given")
        });

        console.log("Voy a entrar al when")

        when('The user answers all questions', async () => {
            console.log("Estoy en el when")
            for (let i = 0; i < 10; i++) {
                // Waits for the buttons to be visible and enabled
                await page.waitForSelector('.answer-button-not-answered:not([disabled])');

                // Clicks always the first answer button
                await page.click('.answer-button-not-answered');

                // Waits for the next question to load
                await page.waitForTimeout(500);
            }
        });

        then('The user is redirected to the game results page', async () => {
            await page.waitForTimeout(1000);

            const url = page.url();  // Takes the current URL
            expect(url).toMatch(/\/game\/results/);  // Checks if the URL contains "/game/results"

            await expect(page).toMatchElement('h2', { text: i18n.t("game-details-text") });
        });
        then('The results show 10 questions answered', async () => {
            const accordionButtons = await page.$$('.accordion-button');
            expect(accordionButtons.length).toBe(10); // Checks that there are 10 questions in the accordion
        });

    }, 60000); // 60 seconds timeout for the test
});