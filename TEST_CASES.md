# A1. Manual test suite – Shop and check out (Sauce Demo)

## 1. Questions and assumptions

| # | Question for the product owner | Assumption I test against if there is no answer |
|---|-------------------------------|-------------------------------------------------|
| Q1 | Is the postal code checked against a format or length? | Any non-empty value is accepted; only "required" is enforced. |
| Q2 | What is the tax rule (rate, rounding)? | One flat rate, rounded to the cent; total = item total + tax. |
| Q3 | Is there a limit on items per cart, or can one product be added twice? | One of each product, so the maximum is 6 items. |
| Q4 | Does the cart survive logout and login, or a page refresh? | Cart survives refresh and navigation; behaviour after logout is recorded, not judged. |
| Q5 | How are ties and letter case handled when sorting (equal prices, "a" vs "A")? | Stable order for ties; case-insensitive name sort. |
| Q6 | Which browsers, devices and minimum screen width are supported? | Latest Chrome, Firefox, Safari and Edge; width from 375 px. |
| Q7 | Do the first/last name fields have length or character limits? | No limit beyond "required". |
| Q8 | Is there a session timeout, and what should happen to a user who opens two tabs? | No timeout; second tab shares the session. |

## 2. Test cases

| ID | Area | Type | Title | Pre-conditions | Steps | Test data | Expected result | Priority | Automate? |
|----|------|------|-------|----------------|-------|-----------|-----------------|----------|-----------|
| TC01 | Login | Positive | Standard user logs in | On login page | 1) Enter user and password 2) Click Login | standard_user / secret_sauce | Products page opens, title "Products" | P1 | Yes – smoke test on every build |
| TC02 | Login | Negative | Locked-out user is refused | On login page | 1) Enter locked user and password 2) Click Login | locked_out_user / secret_sauce | Error says the user has been locked out; stays on login page | P1 | Yes – business rule, cheap and stable |
| TC03 | Login | Negative | Wrong password is refused | On login page | 1) Enter valid user, wrong password 2) Login | standard_user / wrong_password | "Username and password do not match" error; no session | P1 | Yes – core security check |
| TC04 | Login | Boundary | Empty username, empty password, both empty | On login page | 1) Leave field(s) empty 2) Login | empty values | "Username is required" / "Password is required" errors | P2 | No – low risk, covered by exploratory runs |
| TC05 | Login | Boundary | Username with trailing space or different case | On login page | 1) Enter "Standard_User " 2) Login | variations of standard_user | Login refused (assumes exact match) | P3 | No – assumption not confirmed with PO |
| TC06 | Sorting | Positive | Price low to high | Logged in as standard user | 1) Choose "Price (low to high)" 2) Read every price | default 6 products | Whole list is in ascending price order | P1 | Yes – checks whole list; regression-prone |
| TC07 | Sorting | Positive | Price high to low | Logged in | 1) Choose "Price (high to low)" | default products | Whole list in descending price order | P2 | Yes – same page object as TC06 |
| TC08 | Sorting | Positive | Name A to Z and Z to A | Logged in | 1) Choose "Name (A to Z)" 2) Check 3) Choose "Name (Z to A)" 4) Check | default products | Names in ascending, then descending order | P2 | Yes – one loop, two options |
| TC09 | Cart | Positive | Add two items, remove one in cart | Logged in, empty cart | 1) Add Backpack and Bike Light 2) Check badge 3) Open cart 4) Remove Backpack | 2 products | Badge 2, then 1; cart shows only Bike Light | P1 | Yes – core journey |
| TC10 | Cart | Positive | Remove from products page | Logged in, empty cart | 1) Add Backpack 2) Click Remove on products page | Backpack | Badge disappears; button back to "Add to cart" | P2 | Yes – second removal path in the business rules |
| TC11 | Cart | Boundary | Add all six products | Logged in, empty cart | 1) Add all products 2) Open cart | 6 products | Badge 6; six rows in cart | P3 | No – covered inside TC13 |
| TC12 | Checkout | Positive | Full checkout | Logged in, 2 items in cart | 1) Checkout 2) Fill details 3) Continue 4) Check totals 5) Finish | Jane / Doe / 600001 | Total = item total + tax; "Thank you for your order"; cart empty | P1 | Yes – the main revenue path |
| TC13 | Checkout | Boundary | Totals with the maximum cart (6 items) | Logged in | 1) Add all items 2) Go to overview | 6 products | Item total equals the sum of the six prices; total = item total + tax | P2 | Yes – boundary on cart size |
| TC14 | Checkout | Negative | First name missing | 1 item in cart, on step one | 1) Leave first name empty 2) Continue | last Doe, zip 600001 | "First Name is required"; stays on step one | P1 | Yes – parameterized with TC15, TC16 |
| TC15 | Checkout | Negative | Last name missing | As above | 1) Leave last name empty 2) Continue | first Jane, zip 600001 | "Last Name is required" | P1 | Yes – parameterized |
| TC16 | Checkout | Negative | Postal code missing | As above | 1) Leave postal code empty 2) Continue | Jane / Doe / empty | "Postal Code is required" | P1 | Yes – parameterized |
| TC17 | Checkout | Boundary | Odd postal code and name values | On step one | 1) Enter letters, symbols, 100+ characters, emoji 2) Continue | "ABC-12 3", 150 x "9", "😀" | Behaviour recorded and raised with PO (see Q1, Q7) | P3 | No – rules unknown |
| TC18 | Checkout | Negative | Cancel on step one | 1 item in cart | 1) Click Cancel | n/a | Back to cart, item still there | P3 | No – low risk |
| TC19 | Checkout | Positive | Cancel on overview | On overview page | 1) Click Cancel | 1 item | Back to products; no order; cart still has the item | P2 | Yes – business rule |
| TC20 | Security | Negative | Products page by URL when logged out | Not logged in | 1) Open /inventory.html directly | n/a | Redirected to login with "only access ... when logged in" error | P1 | Yes – access control |
| TC21 | Security | Negative | Other inner pages by URL when logged out | Not logged in | 1) Open /cart.html, /checkout-step-one.html, /checkout-complete.html | n/a | Same error for each | P2 | Yes – parameterized |
| TC22 | Security | Negative | Logout then browser Back | Logged in | 1) Logout 2) Press Back | n/a | Protected page is not shown | P2 | No – browser history behaviour; check by hand first |
| TC23 | Usability | Positive | Keyboard-only checkout form | On step one | 1) Use Tab and Enter only to fill and submit | valid data | All fields reachable in logical order; Enter submits; errors are visible | P3 | No – human judgement |
| TC24 | Browser/screen | Positive | Checkout on a phone-size screen | 375 x 667 viewport, Chrome and Safari | 1) Run login, add, checkout | valid data | Nothing cut off; buttons usable; order placed | P2 | No – real-device check; Playwright mobile project is a later step |
| TC25 | Accessibility | Positive | Labels, contrast and screen reader | Any page | 1) Run axe scan 2) Tab through page 3) Listen with a screen reader | n/a | Fields have accessible names; focus is visible; images have alt text | P2 | No – manual plus axe report |

## 3. Exploratory charter (15 minutes) – problem_user

**Explore** the products, cart and checkout pages **with** problem_user **to discover** where its behaviour differs from standard_user.

Ideas to try: product images and names on the list and detail pages; sorting options; Add/Remove buttons for every product; badge count against cart contents; what is kept in each checkout field after typing; the final totals. Record each difference with a screenshot and note which standard_user step it breaks.

## 4. Strategy (under 150 words)

**UI layer (Yes cases):** the P1 journey on every build: login, sort, cart, checkout totals, required-field errors, URL guard. These are stable and high value.

**API/unit layer, if the client has one:** price and tax calculation, sort logic, field validation and the authorisation check on each endpoint. These run faster and fail less often than UI tests.

**Manual:** usability, accessibility, real-device and Safari checks, postal-code edge cases, and exploratory testing of problem users.

**Biggest remaining risk:** the tax and total rules and postal-code validation are undefined, and the known-problem users show the app can fail silently. A wrong charge or a lost order could reach customers. Browser coverage is also Chromium-only today.
