# Study Planner

Study Planner is a simple tool for students to add assignments and see how many days remain until each is due.

## How to use it

1. Enter an assignment name.
2. Choose its due date and select **Add assignment**.
3. Review the assignment list and the number of days remaining.

Assignments are saved in the same browser, so they remain after the page is refreshed. The **Clear all** button removes every saved assignment.

## Tests

These tests were completed using made-up assignment names.

| # | Kind | What I do | What should happen | What happened | Pass? |
|---|---|---|---|---|---|
| 1 | Normal | Add "History essay" with a future due date | It appears with the correct number of days remaining | It appeared with the correct number of days remaining | Yes |
| 2 | Normal | Add a second assignment due sooner | Both appear in due-date order | Both appeared in due-date order | Yes |
| 3 | Edge | Add an assignment due today | It appears with "Due today" | It appeared with "Due today" | Yes |
| 4 | Edge | Refresh after adding assignments | Saved assignments remain on the page | The assignments remained after refresh | Yes |
| 5 | Wrong input | Submit with a blank name or date | A message asks for both fields and nothing is added | The message appeared and nothing was added | Yes |

The first three project requirements are covered by tests 1, 5, and 4:

1. Adding an assignment with a valid name and due date shows it with the correct number of days remaining.
2. Leaving the name or due date blank shows a message and adds nothing.
3. Refreshing the page keeps previously added assignments.

## Build log

- Asked for a basic study planner that shows the days until each assignment. Built a form and assignment list, then checked that a normal assignment displayed correctly.
- Asked for simple handling of incorrect input. Added messages for blank fields and past dates, then checked that invalid assignments were not added.
- Asked for assignments to remain after refreshing. Saved them in the browser and confirmed they were still listed after a refresh.
- Asked for the page to work on both a laptop and phone. Added a small responsive layout and checked it at narrow screen sizes.

## Changes

- Built the first version of the study planner.
- Added assignment names, due dates, and days-remaining calculations.
- Added browser storage, input checks, due-date sorting, and a clear button.
- Added a simple layout for laptop and phone screens.
