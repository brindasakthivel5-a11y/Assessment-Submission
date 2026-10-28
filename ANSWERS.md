# Section B and C answers

## B1. Review of the AI-generated test

### Problems found

1. **Weak assertion.** `expect(total).toBeTruthy()` passes for any non-empty text, even "Total: $0.00" or a wrong amount. The test is named "cart total is correct" but never checks a total.
2. **Fixed sleep.** `waitForTimeout(3000)` slows every run and is still not a guarantee. Wait for a visible condition instead, such as the cart badge showing 1.
3. **Ambiguous locator.** `text=Add to cart` matches six buttons. It clicks whichever comes first, so the test depends on the current product order and on which product it adds. The price it should check is never captured.
4. **Brittle locators.** `.shopping_cart_link` and similar CSS classes break with a style change. Use the `data-test` attributes or roles.
5. **No check that login worked.** If login fails, the test carries on and fails later with a confusing message.
6. **Hard-coded URL, user and password.** These belong in config or environment variables.
7. **No locators in page objects.** Selectors sit in the test body, so every test copies them.
8. **Weak test data.** "A", "B" and "1" work only because the site is lenient. Use realistic data from a shared place.
9. **Only one item, no tax check.** A cart total depends on item prices and tax, and neither is read.
10. **No cart checks on the way.** It never confirms the badge or the cart contents before checking out.
11. **Reads text, never parses it.** `textContent()` returns "Total: $32.39", a string. No number is ever compared.

### Rewrite

Uses the repo config (`testIdAttribute: 'data-test'`) and waits only through `expect`.

```ts
import { test, expect } from '@playwright/test';
import { config } from '../src/config';

const money = (text: string) => Number(text.replace(/[^0-9.]/g, ''));

test('TC12 cart total equals item total plus tax', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(config.users.standard);
  await page.getByTestId('password').fill(config.password);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('title')).toHaveText('Products');

  const item = page.getByTestId('inventory-item').first();
  const price = money(await item.getByTestId('inventory-item-price').innerText());
  await item.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();
  await expect(page.getByTestId('inventory-item')).toHaveCount(1);
  await page.getByTestId('checkout').click();

  await page.getByTestId('firstName').fill('Jane');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('600001');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('total-label')).toBeVisible();
  const itemTotal = money(await page.getByTestId('subtotal-label').innerText());
  const tax = money(await page.getByTestId('tax-label').innerText());
  const total = money(await page.getByTestId('total-label').innerText());

  expect(itemTotal).toBeCloseTo(price, 2);
  expect(tax).toBeGreaterThan(0);
  expect(total).toBeCloseTo(itemTotal + tax, 2);
});
```

In the real suite this test is `TC12` in `tests/checkout.spec.ts`, using page objects.

## B2. Test an AI feature – scenario 3, test case generator

| # | Check | How I build it | Scoring |
|---|-------|----------------|---------|
| 1 | **Valid output format.** Every response parses and matches the JSON schema the import expects. | Run 100+ user stories, including very long, empty, non-English and symbol-heavy ones. Validate each output against the schema and dry-run the import into a test tool. | **Automatic.** Pass rate must be 100%; any failure is listed with its input. |
| 2 | **Coverage.** The cases cover every rule in the story: positive, negative and boundary. | Use stories with a known list of rules (acceptance criteria). Each generated case must say which rule it covers. Count rules with no case, and rules with only a positive case. | **Automatic** for the rule-to-case mapping; **rubric** (1 to 5) for boundary and negative depth, on a sample reviewed by a tester. |
| 3 | **No invented requirements.** Cases do not assume rules the story never states. | Include deliberately vague stories. Each case must quote the story sentence it comes from. Check the quote exists in the story. For vague stories the tool should raise questions, not invent rules. | **Automatic** quote check; **human review** of a sample, because a real quote can still be misread. |
| 4 | **No duplicates, stable across runs.** | Compare title and steps of every pair (normalised text plus similarity score). Run the same story five times and compare the sets. | **Automatic.** Fail above an agreed duplicate rate; flag runs whose case sets differ a lot. |

## B3. Defect report

**Title:** [Products] "Price (low to high)" sort shows a $29.99 item above a $15.99 item (regression since 4.2.0)

**Environment:** Release 4.2.0, Chrome (version and OS to be recorded), standard_user, test environment URL. Not seen before 4.2.0.

**Steps to reproduce**
1. Log in as standard_user.
2. On the Products page open the sort menu and choose "Price (low to high)".
3. Read the prices from the top of the list down.

**Expected:** Prices rise from the first item to the last, so $15.99 appears before $29.99.

**Actual:** An item at $29.99 is shown before an item at $15.99. The list is not in ascending order.

**Frequency:** 100% of runs since 4.2.0.

**Severity: Major (not Critical).** Customers who sort by price see a wrong order, which misleads price-sensitive shoppers and hurts trust. It does not block checkout, lose data or charge wrong amounts, and shoppers can still read the list. It is a regression in a core browse feature on a release that is due soon, so it should be fixed before release.

**Evidence to attach:** screenshot showing the selected sort and the out-of-order prices; short screen recording; the failing automated test TC06 with its report and trace; the list of prices in the order shown; build number of the last good release for comparison; browser console and network log, to show whether sorting is done in the page or by the server. Root cause is not investigated.

## B4. Message to the product manager (under 150 words)

Hi [name],

Two findings from today's test run ahead of Friday's release:

1. Sorting by price (low to high) has been wrong since 4.2.0: a $29.99 item appears above a $15.99 one. Shoppers can still buy, but it looks broken.
2. Checkout fails about 1 in 10 runs and passes on retry. I don't yet know if that is a test problem or a real bug that could lose orders.

My recommendation: release on Friday only if the sort fix is in and re-tested by noon, and checkout passes 50 runs in a row tonight.

Practical alternative: release Friday with the price-sort option hidden, watch the checkout success rate closely, and keep a rollback ready.

I'll send the checkout result by 9am tomorrow. Can we agree a go/no-go time?

Thanks,
[name]

---

## C1. Prep notes: "Checkout has been failing for some users since this morning"

**What I ask first:** How many users and which ones (all, or a group)? Exactly when did it start, and what changed around then? What do they see: an error message, a spinner, a wrong charge? Which browser, device, country, payment method and account type? Can I get an example order, user ID or screenshot? Is it blocking revenue right now?

**Where I look:** monitoring and error-rate dashboards for the checkout and payment endpoints; application logs for those users, following one request ID end to end; recent releases, feature flags and config changes; the payment provider's status page; database and infrastructure alerts; the latest automated test results and any new failures.

**Reproduce and narrow down:** copy a failing user's conditions exactly (browser, payment method, cart contents, account type, region). Compare a failing user with a working one and change one thing at a time. Check whether it started exactly at a deployment time, and try the previous version or flag state to see if the problem goes away.

**Defect, data or environment?**
- Product defect: fails for everyone with the same steps, started with a release, same on a clean test account.
- Data problem: fails only for certain accounts, carts, addresses or amounts; fine with new test data.
- Environment problem: coincides with an outage, expired certificate, third-party failure or config change; logs show timeouts or connection errors rather than application errors.

**Updating the client:** acknowledge within minutes and say who is looking. Give a first status once I know scope and impact. After that send an update on a fixed rhythm (for example every 30 to 60 minutes), even if the update is "still investigating, here is what is ruled out". Offer a workaround if one exists, be honest about timing, and send a short written summary with cause and prevention when it is fixed.

## C2. A recent production issue you found 

I have found the issue of exporting the order receipts from virto is not working. Immediately, I have checked in the UAT environment. This was not working only in the production environment. I have informed the product manager about the issue and the issue was fixed by the developer on the spot. 

Fill in each point in two or three sentences:

1. **What happened and how I found it:** This issue was there in the long time, but it was not found because the testcase was not added by the initial tester. I found the issue while testing the new feature.
2. **Root cause:** The testcase was missed. So the testing of the functionality is missed.
3. **Explaining it to the client:** The mistake was explained to the project manager and the Team Lead firstly and then we have informed to the client.
4. **Stopping it happening again:** I have added the testcases and the test steps for the functionality in functional, smoke and the Regression test suites. Also, I have start working on the review all the testcases which was done by the previous testers
5. **Looking back:** one thing I would do differently is, I wont miss anything even if it is not in the testcase, i will test all the functionality once quickly in the production at the time of new feautre or changes in the build. 