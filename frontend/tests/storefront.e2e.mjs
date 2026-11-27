import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright-core";
import { preview } from "vite";

test("production demo supports direct links, comparisons, shared shortlists and quotes", async (t) => {
  const routes = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8")).rewrites;
  for (const source of ["/products/:id", "/compare", "/shortlist", "/checkout"]) {
    assert.ok(routes.some((rule) => rule.source === source && rule.destination === "/index.html"), `Missing Vercel route ${source}`);
  }

  const server = await preview({
    mode: "demo",
    preview: { host: "127.0.0.1", port: 0 },
  });
  t.after(() => new Promise((done) => server.httpServer.close(done)));
  const base = `http://127.0.0.1:${server.httpServer.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
  t.after(() => browser.close());

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  page.setDefaultTimeout(12_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${base}/products/sample-cotton-poplin`);
  await page.getByRole("heading", { name: "Cloud Cotton Poplin", level: 1 }).waitFor();
  assert.equal(await page.getByLabel("Quantity", { exact: true }).inputValue(), "2");
  await page.getByRole("heading", { name: "Care instructions" }).waitFor();
  await page.getByRole("button", { name: "Add to cart", exact: true }).first().click();
  await page.getByRole("link", { name: "2 in your cart" }).click();
  assert.equal(await page.getByRole("button", { name: "Decrease quantity of Cloud Cotton Poplin" }).isDisabled(), true);
  await page.getByText("Minimum order: 2 metres").waitFor();
  await page.getByRole("link", { name: /Preview sample quote/i }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download sample quote/i }).click();
  const download = await downloadPromise;
  assert.match(await readFile(await download.path(), "utf8"), /Cloud Cotton Poplin × 2 metres/);

  await page.goto(`${base}/products`);
  await page.getByLabel("Fabric weight").selectOption("light");
  await page.getByLabel("Intended use").selectOption("Shirting");
  await page.getByText("1 fabric", { exact: true }).waitFor();
  assert.equal(new URL(page.url()).searchParams.get("weight"), "light");
  assert.equal(new URL(page.url()).searchParams.get("use"), "Shirting");
  await page.getByRole("button", { name: "Save Cloud Cotton Poplin" }).click();
  await page.getByRole("button", { name: "Compare Cloud Cotton Poplin" }).click();
  await page.getByRole("link", { name: "Clear filters" }).click();
  for (const name of ["Sandstone Cotton Twill", "Mulberry Silk Satin"]) {
    await page.getByRole("button", { name: `Compare ${name}` }).click();
  }
  assert.equal(await page.getByRole("button", { name: "Compare Pearl Silk Organza" }).isDisabled(), true);
  await page.getByRole("link", { name: "Compare fabrics, 3 selected" }).click();
  const table = page.getByRole("table", { name: "Fabric specifications side by side" });
  await table.getByRole("columnheader", { name: /Cloud Cotton Poplin/ }).waitFor();
  await table.getByText("115 GSM", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

  await page.getByRole("link", { name: "Saved fabrics, 1" }).click();
  const share = await page.getByLabel("Shortlist link").inputValue();
  assert.equal(new URL(share).searchParams.get("fabrics"), "sample-cotton-poplin");
  const recipient = await browser.newPage();
  await recipient.goto(share);
  await recipient.getByRole("heading", { name: /Shared fabric shortlist/i }).waitFor();
  await recipient.getByRole("heading", { name: "Cloud Cotton Poplin" }).waitFor();
  await recipient.getByRole("button", { name: "Save this shortlist" }).click();
  await recipient.getByRole("link", { name: "View saved fabrics" }).click();
  await recipient.getByRole("heading", { name: "Cloud Cotton Poplin" }).waitFor();
  await recipient.evaluate(() => {
    localStorage.setItem("fabricaa-comparison", JSON.stringify([
      { _id: "test-metre", name: "Fabric by metre", price: 100, priceUnit: "metre" },
      { _id: "test-yard", name: "Fabric by yard", price: 100, priceUnit: "yard" },
    ]));
  });
  await recipient.goto(`${base}/compare`);
  await recipient.getByText("Price units differ or are unspecified.", { exact: false }).waitFor();
  assert.deepEqual(pageErrors, []);
});

test("smoke: about, contact map honesty, skip link and more menu keyboard", async (t) => {
  const server = await preview({
    mode: "demo",
    preview: { host: "127.0.0.1", port: 0 },
  });
  t.after(() => new Promise((done) => server.httpServer.close(done)));
  const base = `http://127.0.0.1:${server.httpServer.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
  t.after(() => browser.close());

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(12_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${base}/`);
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await page.locator("#main-content").waitFor();

  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menu", { name: "More pages" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("menu", { name: "More pages" }).waitFor({ state: "hidden" });

  await page.goto(`${base}/about`);
  await page.getByRole("heading", { name: "About Fabricaa", level: 1 }).waitFor();
  await page.getByText("Example dashboard figures", { exact: false }).waitFor();
  await page.getByText("Sample location").first().waitFor();
  await page.getByRole("heading", { name: "Find our mill" }).waitFor();

  await page.goto(`${base}/contact#location`);
  await page.getByText("Illustrative map pin for the demo storefront", { exact: false }).waitFor();
  await page.getByText("Sample location").first().waitFor();
  await page.getByRole("region", { name: /Sample map showing an illustrative Fabricaa mill pin/i }).waitFor();
  await page.getByRole("link", { name: /Open sample pin in OpenStreetMap/i }).waitFor();

  await page.goto(`${base}/cart`);
  await page.getByRole("heading", { name: "Your cart is empty" }).waitFor();
  await page.getByRole("link", { name: /Browse products/i }).waitFor();
  const overlap = await page.evaluate(() => {
    const heading = document.querySelector("h2, h1");
    const link = [...document.querySelectorAll("a")].find((node) => /browse products/i.test(node.textContent || ""));
    if (!heading || !link) return true;
    const a = heading.getBoundingClientRect();
    const b = link.getBoundingClientRect();
    return !(b.top >= a.bottom - 1);
  });
  assert.equal(overlap, false, "Browse products should sit below the empty-cart heading");

  assert.deepEqual(pageErrors, []);
});
