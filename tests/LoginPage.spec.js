const { test } = require('@playwright/test')
const { LoginPage } = require('../pages/LoginPage')
let loginpage
let username, password
let dataset

try {
  dataset = JSON.parse(JSON.stringify(require('../utils/placeorder.json')))
} catch (error) {
  console.error("Loading Login credentials from Github secrets")
  dataset = {}
}

test.beforeEach(async ({ page }) => {
  loginpage = new LoginPage(page)

  username = dataset.username || process.env.USERNAME
  password = dataset.password || process.env.PASSWORD

  await loginpage.goTo()
})

test('Failed login(Empty Username)', async () => {
  await loginpage.login("", password)
  await loginpage.incorectLogin()
})

test('Failed login(Empty password)', async () => {
  await loginpage.login("", password)
  await loginpage.incorectLogin()
})

test('Failed login(Incorect Username)', async () => {
  await loginpage.login('test', password)
  await loginpage.incorectLogin()
})

test('Failed login(Incorect Password)', async () => {
  await loginpage.login(username, "test")
  await loginpage.incorectLogin()
})

test('Forgot password unsuccessful', async ({ browser }) => {
    await loginpage.unsuccessfullResetPassword(browser, "test")
  })

test('Forgot password successful', async ({ browser }) => {
  await loginpage.successfullResetPassword(browser, username)
})

test('Successful login', async () => {
    await loginpage.login(username, password)
    await loginpage.hideShowPassword();
    await loginpage.successfullLogin();
  })