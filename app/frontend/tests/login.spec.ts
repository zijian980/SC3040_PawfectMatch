import { test, expect } from "@playwright/test"

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("Display Login Form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login to PawfectMatch" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Email Address" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible()
    await expect(page.getByRole("button", { name: "PROCEED" })).toBeVisible()
  })

  test("Validation: Empty Fields", async ({ page }) => {
    await page.getByRole("button", { name: "PROCEED" }).click()
    await expect(page.getByText("Email is required")).toBeVisible()
    await expect(page.getByText("Password is required")).toBeVisible()
  })

  test("Validation: Invalid Email", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email Address" }).fill("invalid-email")
    await page.getByRole("textbox", { name: "Password" }).fill("password")
    await page.getByRole("button", { name: "PROCEED" }).click()
    await expect(page.getByText("Enter a valid email")).toBeVisible()
  })

  test("Toggle Password Visibility", async ({ page }) => {
    const passwordInput = page.getByRole("textbox", { name: "Password" })
    await passwordInput.fill("password")
    await expect(page.getByRole("button", { name: "Show password" })).toBeVisible()
    await expect(passwordInput).toHaveAttribute("type", "password")
    await page.getByRole("button", { name: "Show password" }).click()
    await expect(page.getByRole("button", { name: "Hide password" })).toBeVisible()
    await expect(passwordInput).toHaveAttribute("type", "text")
  })

  // test("Submit Login Form", async ({ page }) => {
  //   await page.getByRole("textbox", { name: "Email Address" }).fill("test@example.com")
  //   await page.getByRole("textbox", { name: "Password" }).fill("password")
  //   await page.getByRole("button", { name: "PROCEED" }).click()
  //   await expect(true).toBe(true) // TBD: Replace with route after login
  // })
})
