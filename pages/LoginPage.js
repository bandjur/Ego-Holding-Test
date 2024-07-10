const { expect } = require('@playwright/test')
class LoginPage {
  constructor(page) {
    this.page = page
    this.lbl_username = page.locator("#input-21");
    this.lbl_password = page.locator("#password");
    this.btn_login = page.locator(".v-btn__content:has-text('Login')");
    this.lbl_hideShowPassword = page.locator("[aria-label='append icon']");
    this.btn_forgotPassword = page.locator(".v-btn__content:has-text('Forgotten password?')");
    this.alert = page.locator(".v-alert__content");
    this.toolbarTitle = page.locator(".v-toolbar__title");
  }

  async goTo() {
    await this.page.goto('http://207.154.213.8/login')
  }

  async login(username, password) {
    await this.lbl_username.fill(username)
    await this.lbl_password.fill(password)
    await this.btn_login.click()
  }

  async incorectLogin() {
    await this.page.waitForSelector('.v-alert__content', { state: 'visible' })
    await expect(this.alert).toHaveText(' Wrong email or password, please try again. ')
  }

  async hideShowPassword(){
    await this.lbl_hideShowPassword.click();
    const elementType = await this.page.getAttribute('#password', 'type');
    expect(elementType).toBe('text');
  }

  async successfullLogin() {
    await this.page.waitForSelector('.v-toolbar__title', { state: 'visible' })
    await expect(this.toolbarTitle).toHaveText('Check your Email and Enter OTP token');
  }

  async successfullResetPassword(browser, email) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://207.154.213.8/login');
    const click = page.locator(".v-btn__content:has-text('Forgotten password?')");
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null);
    await click.click();
    await navigationPromise;
    const newPage = await context.pages().find(p => p.url() !== page.url());
    const targetPage = newPage || page;
    await targetPage.waitForSelector('[name="email"]', { state: 'visible', timeout: 5000 });
    await targetPage.locator("[name='email']").fill(email);
    await targetPage.waitForSelector(".v-btn__content:has-text('Send')", { state: 'visible', timeout: 5000 });
    await targetPage.locator(".v-btn__content:has-text('Send')").click();
    await targetPage.waitForSelector('.v-alert__content', { state: 'visible', timeout: 5000 });
    await expect(targetPage.locator('.v-alert__content')).toHaveText(' You have been sent an email with a link to reset your password ');
    await targetPage.locator(".v-btn__content:has-text(' Go to Login ')").click()
    await expect(targetPage.locator('.v-toolbar__title')).toHaveText('Login to Super Ego Holding');
  }

  async unsuccessfullResetPassword(browser, email) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://207.154.213.8/login');
    const click = page.locator(".v-btn__content:has-text('Forgotten password?')");
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null);
    await click.click();
    await navigationPromise;
    const newPage = await context.pages().find(p => p.url() !== page.url());
    const targetPage = newPage || page;
    await targetPage.waitForSelector('[name="email"]', { state: 'visible', timeout: 5000 });
    await targetPage.locator("[name='email']").fill(email);
    await targetPage.waitForSelector(".v-btn__content:has-text('Send')", { state: 'visible', timeout: 5000 });
    await targetPage.locator(".v-btn__content:has-text('Send')").click();
    await targetPage.waitForSelector('.v-messages__message', { state: 'visible', timeout: 5000 });
    await expect(targetPage.locator('.v-messages__message')).toHaveText('The email field must be a valid email');
}
}

module.exports = { LoginPage }