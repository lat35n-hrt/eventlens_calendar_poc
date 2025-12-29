import { test, expect } from "@playwright/test";

test.describe("EventLens UI", () => {
  test("loads and shows seeded events", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "EventLens Calendar PoC" })).toBeVisible();

    // Seed 3 items should be rendered somewhere on the page.
    // We assert by titles (stable in seed.sql).
    await expect(page.getByText("Neurology Grand Rounds: Advances in Stroke Care")).toBeVisible();
    await expect(page.getByText("Cardiology Lecture: Heart Failure Updates")).toBeVisible();
    await expect(page.getByText("Oncology Research Seminar: Immunotherapy Pipeline")).toBeVisible();
  });

  test("filters CME only -> 1 result", async ({ page }) => {
    await page.goto("/");

    // Toggle "CME only"
    await page.getByLabel("CME only").check();

    await expect(page.getByText("Neurology Grand Rounds: Advances in Stroke Care")).toBeVisible();
    await expect(page.getByText("Cardiology Lecture: Heart Failure Updates")).not.toBeVisible();
    await expect(page.getByText("Oncology Research Seminar: Immunotherapy Pipeline")).not.toBeVisible();
  });

  test("search keyword Oncology -> 1 result", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Keyword (q)").fill("Oncology");

    await expect(page.getByText("Oncology Research Seminar: Immunotherapy Pipeline")).toBeVisible();
    await expect(page.getByText("Neurology Grand Rounds: Advances in Stroke Care")).not.toBeVisible();
    await expect(page.getByText("Cardiology Lecture: Heart Failure Updates")).not.toBeVisible();
  });

  test("pagination with page_size=1 changes visible item", async ({ page }) => {
    await page.goto("/");

    // Set page size = 1
    await page.getByLabel("Page size").selectOption("1");

    // On page 1 (asc by start_at) the first seed event should be the earliest:
    // 2026-01-15 Neurology Grand Rounds
    await expect(page.getByText("Neurology Grand Rounds: Advances in Stroke Care")).toBeVisible();

    // Next page -> should show different title
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Cardiology Lecture: Heart Failure Updates")).toBeVisible();
    await expect(page.getByText("Neurology Grand Rounds: Advances in Stroke Care")).not.toBeVisible();
  });
});
