// src/e2e/steps/login-form.steps.js
const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/game.feature');
const i18n = require('../i18n-test-helper.js');
const { expect } = require('expect-puppeteer');
const axios = require('axios');

let page;
let browser;

let username = "gameUser";
let password = "ValidPassword123";

/**
 * Auxiliar method that registers a user with the username "validUser" and the password "ValidPassword123".
 */
const registerNewUser = async () => {
    // Register the user if not already registered
    await axios.post('http://localhost:8000/adduser', {
        username: username,
        password: password,
        confirmPassword: password,
    });
}

/**
 * Auxiliar method that logs in with the registered user.
 * The user has the username "validUser" and the password "ValidPassword123".
 */
const setupAuthenticatedUser = async () => {
    // Log in with the user's credentials
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await expect(page).toClick('button', { text: i18n.t('login-message') });
    
    await page.waitForSelector('[data-testid="login-username-input"]', { visible: true });

    await expect(page).toFill(`input[placeholder="${i18n.t('enter-username-placeholder')}"]`, username);
    await expect(page).toFill(`input[placeholder="${i18n.t('enter-password-placeholder')}"]`, password);
    await expect(page).toClick('button', { text: i18n.t('login-message') });

    await page.waitForSelector('h1', { text: i18n.t('welcome-home') });
    await expect(page).toMatchElement('h1', { text: i18n.t('welcome-home') });
    
}

/**
 * Parametrized function to set the game configuration
 * @param {String} questions - Number of questions to be asked in the game. Value must be one of the options available in the dropdown.
 * @param {String} time - Time limit for each question. Value must be one of the options available in the dropdown.
 * @param {String} topicClass - Class name of the topic button to be selected.
 * @param {String} topicText - Text of the topic button to be selected.
 */
const configureGame = async ({ questions = '10', time = '60s', topicClass = 'toggle-btn-geography', topicText }) => {
    
    await page.waitForSelector('button', { text: i18n.t("quickGame-home") });
    // Opens the modal
    await expect(page).toClick('button', { text: i18n.t("quickGame-home") });
    await expect(page).toMatchElement('h2', { text: i18n.t("title-configuration") });

    // Number of Questions
    await expect(page).toClick('button', { text: '30' });
    await expect(page).toClick('.dropdown-menu .dropdown-item', { text: questions });
    await expect(page).toMatchElement('button', { text: questions });

    // Time per question
    await expect(page).toClick('button', { text: '120s' });
    await expect(page).toClick('.dropdown-menu .dropdown-item', { text: time });
    await expect(page).toMatchElement('button', { text: time });

    // Makes sure the play button is disabled when no topic is selected
    await expect(page).toMatchElement('button', {
        text: i18n.t("play-configuration"),
        disabled: true
    });

    // Selects the topic
    await expect(page).toClick(`label.${topicClass}`, {
        text: topicText || i18n.t("geography-configuration")
    });

    // Makes sure the play button is enabled when a topic is selected
    await expect(page).toMatchElement('button', {
        text: i18n.t("play-configuration"),
        disabled: false
    });
    await expect(page).toClick('button', { text: i18n.t("play-configuration") });

};


defineFeature(feature, test => {

    // Launches the tests in a headless browser or a non-headless browser based on the environment (GITHUB_ACTIONS)
    // Sets the default timeout for Puppeteer actions to 30 seconds
    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            : await puppeteer.launch({ headless: false, slowMo: 10 });

        page = await browser.newPage();
        setDefaultOptions({ timeout: 30000 });

        registerNewUser();
    });

    // Redirects to the home page and waits for the page to load
     
    beforeEach(async () => {
        await page.goto("http://localhost:3000/", {
            waitUntil: "networkidle0",
        });
    });
    
   

    test('User successfully sees their played game in the history', ({ given, when, then }) => {
            given('A user logged in', async () => {
                await setupAuthenticatedUser();
            });
    
            when('The user configures and plays a new game', async () => {
                // Configures the game with 10 questions, 60 seconds each, and the geography topic
                await configureGame({
                    questions: '10',
                    time: '60s',
                    topicClass: 'toggle-btn-geography',
                    topicText: i18n.t("geography-configuration")
                });
                // Waits for the game to load
                for (let i = 0; i < 10; i++) {
                    // Waits for the buttons to be visible and enabled
                    await page.waitForSelector('.answer-button-not-answered:not([disabled])');
    
                    // Clicks always the first answer button
                    await page.click('.answer-button-not-answered');
                }

                await expect(page).toMatchElement('h2', { text: i18n.t("game-details-text") });
            });
    
            then('The user should see the played game in their history', async () => {
                // Goes to the user page
                await page.goto("http://localhost:3000/user", { waitUntil: "networkidle0" });
                
                // Click on the "Game History" tab to view the history
                await expect(page).toClick('a', { text: i18n.t('game-history') });

                // Wait for the game history list to load and check if the game appears
                await page.waitForSelector('[data-testid="game-history-button-0"]', { visible: true });
                
                // Verify that the game history button contains relevant game information
                const gameHistoryText = await page.$eval('[data-testid="game-history-button-0"]', el => el.textContent);
                
                // Check that the game mode appears
                expect(gameHistoryText).toContain('NORMAL'); 

                // Click on the game history button to view the game details
                await expect(page).toClick('[data-testid="game-history-button-0"]');

                // Wait for the game details to load
                await page.waitForSelector('h5', { text: i18n.t("game-details-text") });

                const accordionButtons = await page.$$('.accordion-button');
                expect(accordionButtons.length).toBe(10); // Checks that there are 10 questions in the accordion
                
            });
    }, 60000); // 60 seconds timeout for the test
    
    test('The user completes a normal game with 10 geography questions, 60 seconds each', ({ given, when, then }) => {
        given('The user has configured a game with:', async () => {
            await configureGame({
                questions: '10',
                time: '60s',
                topicClass: 'toggle-btn-geography',
                topicText: i18n.t("geography-configuration")
            });
        });

        when('The user answers all questions', async () => {
            for (let i = 0; i < 10; i++) {
                // Waits for the buttons to be visible and enabled
                await page.waitForSelector('.answer-button-not-answered:not([disabled])');

                // Clicks always the first answer button
                await page.click('.answer-button-not-answered');

                // Waits for the next question to load
                
            }
        });

        then('The user is redirected to the game results page', async () => {

            await expect(page).toMatchElement('h2', { text: i18n.t("game-details-text") });
        });
        then('The results show 10 questions answered', async () => {
            const accordionButtons = await page.$$('.accordion-button');
            expect(accordionButtons.length).toBe(10); // Checks that there are 10 questions in the accordion
        });

    }, 60000); // 60 seconds timeout for the test

    test('The user exits the game before ending', ({ given, when, then }) => {
        given('The user has configured a game with:', async () => {
            await configureGame({
                questions: '10',
                time: '120s',
                topicClass: 'toggle-btn-geography',
                topicText: i18n.t("geography-configuration")
            });
        });

        when('The user clicks the exit button', async () => {
            await page.waitForSelector('.exit-button');

            await expect(page).toClick('.exit-button');
            // Expects the modal to be visible
            await expect(page).toMatchElement('div', { text: i18n.t('exit-confirm-msg-title') });
            // Clicks on the exit button in the modal
            await expect(page).toClick('button', { text: i18n.t('exit-confirm-msg-exit') });
        });

        then('The user is redirected to the home page', async () => {
            
            await expect(page).toMatchElement('h1', { text: i18n.t("welcome-home") });
        });
    });

    test('The user asks a question about the image to the LLM', ({ given, when, then }) => {
        given('The user has configured a game with:', async () => {
            await configureGame({
                questions: '10',
                time: '60s',
                topicClass: 'toggle-btn-geography',
                topicText: i18n.t("geography-configuration")
            });
        });

        when('The user asks for a clue to the LLM', async () => {
            // Should be a first llm message saying hello
            const llmMsgs = await page.$$('.llm-message');
            expect(llmMsgs.length).toBe(1);

            const msg = "¿Me puedes dar una pista sobre la imagen?";

            await expect(page).toFill('.llm-chat-input', msg);
            await expect(page).toClick('.send-prompt-button');
            
        });

        then('The LLM answers the question', async () => {
            const llmMsgs = await page.$$('.llm-message');
            const userMsgs = await page.$$('.user-message');

            // Check that there are 2 LLM messages and 1 user message
            expect(llmMsgs.length).toBe(2);
            expect(userMsgs.length).toBe(1);
        });
    });
    
    afterAll(async () => {
        await browser.close();
    });
});