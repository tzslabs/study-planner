# Study Planner

Study Planner is a simple tool for students to add assignments and see how many days remain until each is due.

## How to use it

1. Enter an assignment name.
2. Choose its due date and select **Add assignment**.
3. Review the assignment list and the number of days remaining.

Assignments are saved in the same browser, so they remain after the page is refreshed. The **Clear all** button removes every saved assignment.

To import assignments, choose a CSV file and select **Import CSV**. Valid rows are added to the planner. Invalid rows are rejected with their row number, column, and reason.

## Tests

These tests were completed using made-up assignment names.

| # | Kind | What I do | What should happen | What happened | Pass? |
|---|---|---|---|---|---|
| 1 | Normal | Add "History essay" with a future due date | It appears with the correct number of days remaining | It appeared with the correct number of days remaining | Yes |
| 2 | Wrong input | Submit with a blank name or date | A message asks for both fields and nothing is added | The message appeared and nothing was added | Yes |
| 3 | Edge | Refresh after adding assignments | Saved assignments remain on the page | The assignments remained after refresh | Yes |
| 4 | Normal | Add a second assignment due sooner | Both appear in due-date order | Both appeared in due-date order | Yes |
| 5 | Edge | Add an assignment due today | It appears with "Due today" | It appeared with "Due today" | Yes |
| 6 | Data | Import `data/clean.csv` | 15 rows load, 0 are rejected, and 1 duplicate warning appears | 15 loaded, 0 rejected, and 1 duplicate warning appeared | Yes |
| 7 | Data | Import `data/raw.csv` | 6 rows load and 19 are rejected with reasons; 1 duplicate warning appears | 6 loaded, 19 rejected with reasons, and 1 duplicate warning appeared | Yes |
| 8 | Data | Import a row whose hours value is `$2` | The row is rejected because hours must be a plain number | The row was rejected with that reason | Yes |

The first three tests are the three project requirements:

1. Adding an assignment with a valid name and due date shows it with the correct number of days remaining.
2. Leaving the name or due date blank shows a message and adds nothing.
3. Refreshing the page keeps previously added assignments.

## Data

The data is a completely made-up practice file created for this project. It contains no real or private information.

### Problems and decisions

| Problem | Rows | Decision |
|---|---|---|
| Date uses MM/DD/YYYY | 3 | Fixed to `2026-11-14`. |
| Course uses lowercase letters | 4 | Standardized to `CS 1110`. |
| Priority has lowercase letters and an extra space | 5 | Standardized to `High`. |
| Hours contains a word | 6 | Changed `3 hours` to the plain number `3`. |
| Course is missing | 7 | Set aside because the course cannot be inferred safely. |
| Exact duplicate | 8 | Kept and flagged as a possible duplicate. |
| Due date is in the past | 9 | Set aside because the intended year is unknown. |
| Unusually large estimate of 40 hours | 10 | Kept and flagged because it is unusual but allowed. |
| Assignment name is missing | 11 | Set aside because the name cannot be inferred. |
| Priority says `Urgent` | 12 | Standardized to the equivalent allowed label `High`. |
| Hours is negative or zero | 13–14 | Set aside because estimated hours must be above zero. |
| Hours contains a dollar sign | 15 | Changed `$4` to the plain number `4`. |
| Date uses words | 16 | Fixed to `2026-11-28`. |
| Course has trailing spaces | 17 | Removed the extra spaces. |
| Repeated header | 18 | Removed because it is not an assignment. |
| Date is impossible | 20 | Set aside because February 30 is not a real date. |
| Priority is missing | 21 | Set aside rather than inventing a value. |
| Hours is missing | 22 | Set aside rather than inventing a value. |
| Priority uses all capital letters | 23 | Standardized to `Medium`. |
| Totals row | 26 | Removed because it is not an assignment. |

### Data contract

The file must have exactly these five columns in this order:

| Column | Rules |
|---|---|
| `due_date` | Required real date in `YYYY-MM-DD` format; today or later; no extra spaces. |
| `course` | Required; one of `BIO 1350`, `CS 1110`, `ECON 1110`, `HIST 1510`, or `MATH 1920`; no extra spaces. |
| `assignment` | Required; 100 characters or fewer; no extra spaces. |
| `priority` | Required; exactly `Low`, `Medium`, or `High`; no extra spaces. |
| `estimated_hours` | Required plain number above 0 and no greater than 100; no symbols, words, or extra spaces. |

The row accounting check passes: **25 raw rows = 15 clean rows + 10 rows removed or set aside**. Row 8 remains in the clean file but receives a possible-duplicate warning.

[View the live validation tests](https://tzslabs.github.io/study-planner/data/tests.html) and [view the live cleaning check](https://tzslabs.github.io/study-planner/data/clean.html).

## Build log

- Asked for a basic study planner that shows the days until each assignment. Built a form and assignment list, then checked that a normal assignment displayed correctly.
- Asked for simple handling of incorrect input. Added messages for blank fields and past dates, then checked that invalid assignments were not added.
- Asked for assignments to remain after refreshing. Saved them in the browser and confirmed they were still listed after a refresh.
- Asked for the page to work on both a laptop and phone. Added a small responsive layout and checked it at narrow screen sizes.
- Week 6: Asked for a made-up messy dataset, documented cleaning decisions, validation tests, and CSV import. Checked the row totals, ran every contract test, and imported both the clean and raw files. The clean file loaded fully; the raw file rejected its bad rows with reasons.

## Changes

- Built the first version of the study planner.
- Added assignment names, due dates, and days-remaining calculations.
- Added browser storage, input checks, due-date sorting, and a clear button.
- Added a simple layout for laptop and phone screens.
- Added made-up raw and clean assignment data, a data contract, cleaning checks, and validation tests.
- Added CSV import with rejected-row explanations and duplicate warnings.
