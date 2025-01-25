import { test, expect } from '@playwright/test';

test('should show profile button after login', async ({ page }) => {
  await page.goto('http://localhost:3000/public/user/signin'); 

  await page.fill('input[name="email"]', 'email@example.com');
  await page.fill('input[name="password"]', 'password123!');
  await page.fill('input[name="confirm-password"]', 'password123!');

  await page.click('input[type="submit"]');

  await page.waitForSelector('button:text("Profile")'); 

  const profileButton = await page.isVisible('button:text("Profile")');
  expect(profileButton).toBeTruthy();

});