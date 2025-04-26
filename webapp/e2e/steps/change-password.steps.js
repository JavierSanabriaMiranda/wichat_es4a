const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/change-password.feature');
const i18n = require('../i18n-test-helper.js');
const { expect } = require('expect-puppeteer');
const axios = require('axios');

let page;
let browser;

let username = "changePasswordUser";
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
 * Auxiliar method that logs in with the registered user and goes to the user page.
 * The user has the username "validUser" and the password "ValidPassword123".
 */
const setupAuthenticatedUser = async () => {
    // Log in with the user's credentials
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await expect(page).toClick('button', { text: i18n.t('login-message') });
    await expect(page).toFill(`input[placeholder="${i18n.t('enter-username-placeholder')}"]`, username);
    await expect(page).toFill(`input[placeholder="${i18n.t('enter-password-placeholder')}"]`, password);
    await expect(page).toClick('button', { text: i18n.t('login-message') });

    // Goes to the user page after logging in
    await expect(page).toMatchElement('h1', { text: i18n.t('welcome-home') });
    await page.goto("http://localhost:3000/user", { waitUntil: "networkidle0" });
}

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

    

    test('User successfully changes their password', ({ given, when, then }) => {
        const newPassword = 'NewValidPassword123';

        given('A user logged in', async () => {
            
            setupAuthenticatedUser();
        });

        when('They fill in the change password form and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            // Fills in the current password, new password and confirm password fields
            await expect(page).toFill('[data-testid="current-password-input"]', password)
            await expect(page).toFill('[data-testid="new-password-input"]', newPassword)
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', newPassword)

            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('A confirmation modal should be shown', async () => {
            console.log("Waiting for confirmation modal...");
            await page.waitForSelector('[data-testid="modal-confirmation-password"]', { visible: true });
            console.log("Confirmation modal shown!");
            await expect(page).toClick('button', { text: i18n.t('close-button-text') });
        });

    });

    test('User enters a new password that doesn\'t match the confirmation', ({ given, when, then }) => {

        when('They fill in the change password form with mismatched passwords and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            await expect(page).toFill('[data-testid="current-password-input"]', password);
            await expect(page).toFill('[data-testid="new-password-input"]', 'NewPassword123');
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', 'DifferentPassword123');
            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('The error message "Passwords do not match" should be shown', async () => {
            await expect(page).toMatchElement('p.text-danger', { text: i18n.t('password-mismatch-error') });
        });
    });

    test('User enters a new password without an uppercase letter', ({ given, when, then }) => {

        when('They fill in the change password form with an invalid password and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            await expect(page).toFill('[data-testid="current-password-input"]', password);
            await expect(page).toFill('[data-testid="new-password-input"]', 'newpassword123');
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', 'newpassword123');
            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('The error message "Password must contain at least one uppercase letter" should be shown', async () => {
            await expect(page).toMatchElement('p.text-danger', { text: i18n.t('password-error-content') });
        });
    });

    test('User enters a new password without a number', ({ given, when, then }) => {

        when('They fill in the change password form with an invalid password and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            await expect(page).toFill('[data-testid="current-password-input"]', password);
            await expect(page).toFill('[data-testid="new-password-input"]', 'NoNumberPassword');
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', 'NoNumberPassword');
            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('The error message "Password must contain at least one number" should be shown', async () => {
            await expect(page).toMatchElement('p.text-danger', { text: i18n.t('password-error-content') });
        });
    });

    test('User enters a new password with spaces', ({ given, when, then }) => {
    
        when('They fill in the change password form with a password containing spaces and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            await expect(page).toFill('[data-testid="current-password-input"]', password);
            await expect(page).toFill('[data-testid="new-password-input"]', 'Password With Space');
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', 'Password With Space');
            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('The error message "Password cannot contain spaces" should be shown', async () => {
            await expect(page).toMatchElement('p.text-danger', { text: i18n.t('password-error-content') });
        });
    });

    test('User enters a new password with less than 8 characters', ({ given, when, then }) => {
        when('They fill in the change password form with a password shorter than 8 characters and submit it', async () => {
            await page.waitForSelector(`#formCurrentPassword`, { visible: true });
            await expect(page).toFill('[data-testid="current-password-input"]', password);
            await expect(page).toFill('[data-testid="new-password-input"]', 'short');
            await expect(page).toFill('[data-testid="confirm-new-password-input"]', 'short');
            await expect(page).toClick('button', { text: i18n.t('save-changes-button') });
        });

        then('The error message "Password must be at least 8 characters long" should be shown', async () => {
            await expect(page).toMatchElement('p.text-danger', { text: i18n.t('password-error-content') });
        });
    });


    afterAll(async () => {
        await browser.close();
    });
});