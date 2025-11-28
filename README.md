# Nuitée QA Automation Assessment 🚀

## 1. Executive Summary
This repository contains the technical assessment for the QA Lead role. The solution implements a unified test automation framework using **Playwright with TypeScript**, covering both the LiteAPI (Backend) and the White Label Website (Frontend).

## 2. Technology Stack & Justification
| Component | Tool | Justification |
| :--- | :--- | :--- |
| **Framework** | **Playwright** | Chosen for its speed, native handling of dynamic elements (auto-wait), and ability to test both API and UI in a single codebase, reducing context switching |
| **Language** | **TypeScript** | Provides static typing, which reduces runtime errors and improves code maintainability for a scaling team. |
| **Reporting** | **HTML Reporter** | Built-in reporting that captures traces, screenshots, and videos for easier debugging. |
| **Data** | **Faker.js** | Used to generate dynamic test data (names, emails) to avoid data collision and ensure test repeatability. |

---

## 3. Test Strategy

### Part 1: API Automation (LiteAPI)
* **Pattern:** Implemented a **Service Object Model**. The API logic is encapsulated in `lib/api/LiteApiClient.ts`, separating the implementation details (endpoints, headers) from the test logic.
* **Coverage:** The workflow covers the full booking lifecycle: `Get Hotels` -> `Get Rates` -> `PreBook` -> `Book` .
* **Error Handling:** The framework explicitly validates HTTP Status Codes (200 vs 400) and logs server responses on failure for rapid debugging.

### Part 2: Frontend Automation (White Label)
* **Pattern:** Implemented the **Page Object Model (POM)** in `lib/ui/HomePage.ts`. This ensures that if the UI changes, we update selectors in one place, not in every test.
* **Dynamic Elements:** To handle the dynamic nature of travel sites (spinners, delayed loading), I utilize Playwright's **Auto-waiting** mechanisms and explicit semantic locators (e.g., `getByRole('heading')`) instead of brittle CSS classes.
* **Resilience:** The tests allow for "soft handling" of non-critical elements like Cookie Banners.

---

## 4. How to Run the Tests
API -> npx playwright test tests/api/api_workflow.spec.ts
UI -> npx playwright test tests/ui/frontend_search.spec.ts --headed

### Prerequisites
* Node.js (v14+)
* NPM

### Installation
npm init playwright@latest
npm install dotenv
npm install @faker-js/faker --save-dev (DataManagement)