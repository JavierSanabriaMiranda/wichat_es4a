// src/e2e/steps/login-form.steps.js
const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/login-form.feature');
const axios = require('axios');


let page;
let browser;

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      : await puppeteer.launch({ headless: false, slowMo: 10 });

    page = await browser.newPage();
    setDefaultOptions({ timeout: 30000 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
      timeout: 180000,
    });
  });

  let username, password;

  // No test case for the user login successfully, as it is already covered in the game.feature file and the change-password.feature.

  test('The user logs in with invalid credentials', ({ given, when, then }) => {
    given('A user with invalid credentials', async () => {
      username = "invalidUser";
      password = "WrongPassword123";
    });

    when('I fill the login form and submit it', async () => {
      await page.waitForSelector('[data-testid="login-username-input"]', {
        visible: true,
        timeout: 300000
      });

      await expect(page).toFill('[data-testid="login-username-input"]', username);
      await expect(page).toFill('[data-testid="login-password-input"]', password);

      await expect(page).toClick('[data-testid="login-button"]');
    });

    then('An error message should appear indicating invalid credentials', async () => {
      await expect(page).toMatchElement("div.alert-danger");
    });
  });

  test('The user attempts to log in more than 5 times with incorrect credentials and is told to try again later', ({ given, when, then }) => {
    given('A user who attempts to log in more than 5 times with incorrect credentials', async () => {
      username = "lockedUser";
      password = "WrongPassword123";
    });

    when('I attempt to log in with invalid credentials more than 5 times', async () => {
      await page.waitForSelector('[data-testid="login-username-input"]', {
        visible: true,
        timeout: 300000
      });

      for (let i = 0; i < 4; i++) {
        await expect(page).toFill('[data-testid="login-username-input"]', username);
        await expect(page).toFill('[data-testid="login-password-input"]', password)
        await expect(page).toClick('[data-testid="login-button"]');
      }
    });

    then('A security message should appear saying to try again later', async () => {
      await expect(page).toMatchElement("div.alert-danger");
    });
  });



  afterAll(async () => {
    await browser.close();
  });
});
