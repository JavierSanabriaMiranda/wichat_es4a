// src/e2e/steps/login-form.steps.js
const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/game.feature');
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

    await page.waitForSelector('[data-testid="login-username-input"]', {
        visible: true,
        timeout: 300000
    });

    await expect(page).toFill('[data-testid="login-username-input"]', username);
    await expect(page).toFill('[data-testid="login-password-input"]', password)
    await expect(page).toClick('[data-testid="login-button"]');

    await page.waitForSelector('[data-testid="home-title"]', {
        visible: true,
        timeout: 300000
    });
    await expect(page).toMatchElement('[data-testid="home-title"]');
}

/**
 * Parametrized function to set the game configuration
 * @param {String} questions - Number of questions to be asked in the game. Value must be one of the options available in the dropdown.
 * @param {String} time - Time limit for each question. Value must be one of the options available in the dropdown.
 * @param {String} topicClass - Class name of the topic button to be selected.
 */
const configureGame = async ({ questions = '10', time = '60s', topicClass = 'toggle-btn-geography', }) => {

    await page.waitForSelector('[data-testid="quickGame-button"]', {
        visible: true,
        timeout: 300000
    });
    // Opens the modal
    await expect(page).toClick('[data-testid="quickGame-button"]');
    // Waits for the modal to be visible
    await page.waitForSelector('[data-testid="configuration-modal-title"]', {
        visible: true,
        timeout: 300000
    });
    await expect(page).toMatchElement('#geography');

    // Number of Questions
    await expect(page).toClick('button', { text: '30' });
    await expect(page).toClick('.dropdown-menu .dropdown-item', { text: questions });
    await expect(page).toMatchElement('button', { text: questions });

    // Time per question
    await expect(page).toClick('button', { text: '120s' });
    await expect(page).toClick('.dropdown-menu .dropdown-item', { text: time });
    await expect(page).toMatchElement('button', { text: time });

    // Makes sure the play button is disabled when no topic is selected
    await expect(page).toMatchElement('[data-testid="play-configuration-button"]')

    // Selects the topic
    await expect(page).toClick('#geography');
    // Makes sure the play button is enabled when a topic is selected
    await expect(page).toMatchElement('[data-testid="play-configuration-button"]')
    await expect(page).toClick('[data-testid="play-configuration-button"]')

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
            timeout: 180000,
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
            });
            // Waits for the game to load
            for (let i = 0; i < 10; i++) {
                // Waits for the buttons to be visible and enabled
                await page.waitForSelector('.answer-button-not-answered:not([disabled])', {
                    visible: true,
                    timeout: 300000
                  });

                // Clicks always the first answer button
                await page.click('.answer-button-not-answered');
            }

            await expect(page).toMatchElement('[data-testid="game-details-text"]');
        });

        then('The user should see the played game in their history', async () => {
            // Goes to the user page
            await page.goto("http://localhost:3000/user", { waitUntil: "networkidle0" });

            // Click on the "Game History" tab to view the history
            await expect(page).toClick('[data-testid="game-history-link"]');

            // Wait for the game history list to load and check if the game appears
            await page.waitForSelector('[data-testid="game-history-button-0"]', {
                visible: true,
                timeout: 300000
            });

            // Verify that the game history button contains relevant game information
            const gameHistoryText = await page.$eval('[data-testid="game-history-button-0"]', el => el.textContent);

            // Check that the game mode appears
            expect(gameHistoryText).toContain('NORMAL');

            // Click on the game history button to view the game details
            await expect(page).toClick('[data-testid="game-history-button-0"]');

            // Wait for the game details to load
            await page.waitForSelector('h5', {
                visible: true,
                timeout: 300000
              });

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
            });
        });

        when('The user answers all questions', async () => {
            for (let i = 0; i < 10; i++) {
                // Waits for the buttons to be visible and enabled
                await page.waitForSelector('.answer-button-not-answered:not([disabled])', {
                    visible: true,
                    timeout: 300000
                  });

                // Clicks always the first answer button
                await page.click('.answer-button-not-answered');

                // Waits for the next question to load

            }
        });

        then('The user is redirected to the game results page', async () => {

            await expect(page).toMatchElement('[data-testid="game-details-text"]');
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
            });
        });

        when('The user clicks the exit button', async () => {
            await page.waitForSelector('.exit-button', {
                visible: true,
                timeout: 300000
              });

            await expect(page).toClick('.exit-button');
            // Expects the modal to be visible
            await expect(page).toMatchElement('[data-testid="exit-game-modal-button"]');
            // Clicks on the exit button in the modal
            await expect(page).toClick('[data-testid="exit-game-modal-button"]');
        });

        then('The user is redirected to the home page', async () => {

            await expect(page).toMatchElement('[data-testid="home-title"]');
        });
    });

    test('The user asks a question about the image to the LLM', ({ given, when, then }) => {
        given('The user has configured a game with:', async () => {
            await configureGame({
                questions: '10',
                time: '60s',
                topicClass: 'toggle-btn-geography',
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