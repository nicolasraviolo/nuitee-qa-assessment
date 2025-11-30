# Nuitée QA Automation Assessment 🚀

## 1. Executive Summary
This repository contains the technical assessment for the QA Lead role. The solution implements a unified test automation framework using **Playwright with TypeScript**, covering both the **Nuitee Connect LiteAPI** (Backend) and the **White Label Website** (Frontend).

📄 **Strategic Documentation:**
For a deep dive into the testing strategy, scope, risk analysis, and comprehensive test plans, please refer to the [**Master Test Plan Document**](https://docs.google.com/document/d/1wa2ZRK00mYPraRj82cwWU0l7re4MeXg2Pw0SAUS4h3Q/edit?tab=t.0#heading=h.da8k4fue8o7z).

---

## 2. Technology Stack & Justification

| Component | Tool | Justification |
| :--- | :--- | :--- |
| **Framework** | **Playwright** | Chosen for its speed, native handling of dynamic elements (auto-wait), multi-tab support, and unified API/UI testing capabilities. |
| **Language** | **TypeScript** | Provides static typing, which reduces runtime errors and improves code maintainability for a scaling team. |
| **API Client** | **Playwright APIRequestContext** | Native fetch wrapper that shares context with browser tests, allowing high-performance API testing without extra libraries like Axios. |
| **Reporting** | **HTML Reporter** | Built-in reporting that captures traces, screenshots, and videos for easier debugging. |
| **Data** | **Faker.js** | Used to generate dynamic test data (names, emails) to avoid data collision and ensure test repeatability. |

---

## 3. Project Architecture

The framework follows industry-standard design patterns to ensure scalability and separation of concerns.

### Part 1: API Automation (LiteAPI)
* **Pattern:** Implemented a **Service Object Model**. The API logic is encapsulated in `lib/api/LiteApiClient.ts`, separating endpoints and payload construction from test assertions.
* **Coverage:** The workflow covers the full booking lifecycle as requested: `Get Hotels` -> `Get Rates` -> `PreBook` -> `Book`.
* **Error Handling:** The framework explicitly validates HTTP Status Codes (200 vs 400/500) and logs server responses on failure for rapid debugging.

### Part 2: Frontend Automation (White Label)
* **Pattern:** Implemented the **Page Object Model (POM)** in `lib/ui/` (e.g., `HomePage.ts`, `HotelDetailsPage.ts`). This ensures maintainability; UI changes only require updates in one place.
* **Resilience & Dynamic Elements:**
    * Utilized Playwright's **Auto-waiting** to handle spinners and delayed loading without brittle hard-coded timeouts.
    * **Popup Handling:** Robust handling of new tabs/windows during the booking flow using `waitForEvent('popup')`.
* **Strategy:** To ensure test atomicity and reduce flakiness, the *Booking* test is decoupled from the *Search* functionality. It interacts with "Recommended Hotels" directly to verify the booking logic even if the search API experiences latency.
* **Mobile Responsiveness:** Specific tests configured via `test.use({ viewport... })` to emulate mobile devices (iPhone 12).

---

## 4. Getting Started

### Prerequisites
* **Node.js**: v18 or higher.
* **NPM**: Included with Node.js.

### Installation
Clone the repository and install dependencies:

```bash
git clone [https://github.com/nicolasraviolo/nuitee-qa-assessment](https://github.com/nicolasraviolo/nuitee-qa-assessment)
cd nuitee-qa-assessment
npm install
npx playwright install --with-deps