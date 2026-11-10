(function () {
  const fixedToday = "2026-11-10";
  const goodRow = ["2026-11-12", "HIST 1510", "Reading response", "Medium", "2"];
  const tests = [];

  function addTest(name, run) {
    tests.push({ name, run });
  }

  function hasCode(errors, column, code) {
    return errors.some((error) => error.column === column && error.code === code);
  }

  addTest("A valid row passes", () => StudyPlannerValidation.validateRow(goodRow, fixedToday).length === 0);
  addTest("A row must have exactly five columns", () => hasCode(StudyPlannerValidation.validateRow(goodRow.slice(0, 4), fixedToday), "row", "wrong_column_count"));
  addTest("Every column is required", () => goodRow.every((value, index) => {
    const row = [...goodRow];
    row[index] = "";
    return hasCode(StudyPlannerValidation.validateRow(row, fixedToday), StudyPlannerSchema.columns[index], "missing");
  }));
  addTest("Extra spaces are rejected", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110 ", "Lab", "High", "2"], fixedToday), "course", "extra_whitespace"));
  addTest("Date must use YYYY-MM-DD", () => hasCode(StudyPlannerValidation.validateRow(["11/12/2026", "CS 1110", "Lab", "High", "2"], fixedToday), "due_date", "bad_format"));
  addTest("Date must be a real calendar date", () => hasCode(StudyPlannerValidation.validateRow(["2026-02-30", "CS 1110", "Lab", "High", "2"], fixedToday), "due_date", "invalid_date"));
  addTest("Date cannot be before today", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-09", "CS 1110", "Lab", "High", "2"], fixedToday), "due_date", "past_date"));
  addTest("Course must be in the allowed list", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "cs 1110", "Lab", "High", "2"], fixedToday), "course", "not_allowed"));
  addTest("Assignment must be 100 characters or fewer", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110", "A".repeat(101), "High", "2"], fixedToday), "assignment", "too_long"));
  addTest("Priority must be Low, Medium, or High", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110", "Lab", "Urgent", "2"], fixedToday), "priority", "not_allowed"));
  addTest("Hours must be a plain number", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110", "Lab", "High", "$2"], fixedToday), "estimated_hours", "bad_format"));
  addTest("Hours must be above zero", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110", "Lab", "High", "0"], fixedToday), "estimated_hours", "not_positive"));
  addTest("Hours cannot be above 100", () => hasCode(StudyPlannerValidation.validateRow(["2026-11-12", "CS 1110", "Lab", "High", "101"], fixedToday), "estimated_hours", "too_large"));
  addTest("File header must match the contract", () => StudyPlannerValidation.validateFile("date,course,assignment,priority,estimated_hours\n", fixedToday).fileErrors.length === 1);

  function renderResult(name, passed, detail) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const resultCell = document.createElement("td");
    const detailCell = document.createElement("td");

    nameCell.textContent = name;
    resultCell.textContent = passed ? "PASS" : "FAIL";
    resultCell.className = passed ? "pass" : "fail";
    detailCell.textContent = detail || "";
    row.append(nameCell, resultCell, detailCell);
    document.querySelector("#test-results").append(row);
    return passed;
  }

  async function runAllTests() {
    let passedCount = 0;

    tests.forEach((test) => {
      let passed = false;
      try {
        passed = test.run();
      } catch (error) {
        passed = false;
      }
      if (renderResult(test.name, passed)) passedCount += 1;
    });

    const [cleanText, rawText] = await Promise.all([
      fetch("clean.csv").then((response) => response.text()),
      fetch("raw.csv").then((response) => response.text())
    ]);
    const cleanResult = StudyPlannerValidation.validateFile(cleanText, fixedToday);
    const rawResult = StudyPlannerValidation.validateFile(rawText, fixedToday);

    const cleanPassed = cleanResult.loaded.length === 15 && cleanResult.rejected.length === 0 && cleanResult.warnings.length === 1;
    if (renderResult("clean.csv loads 15 rows", cleanPassed, `${cleanResult.loaded.length} loaded, ${cleanResult.rejected.length} rejected, ${cleanResult.warnings.length} warning`)) passedCount += 1;

    const rawPassed = rawResult.loaded.length === 6 && rawResult.rejected.length === 19 && rawResult.warnings.length === 1;
    if (renderResult("raw.csv rejects its bad rows", rawPassed, `${rawResult.loaded.length} loaded, ${rawResult.rejected.length} rejected, ${rawResult.warnings.length} warning`)) passedCount += 1;

    const total = tests.length + 2;
    const summary = document.querySelector("#summary");
    summary.textContent = `${passedCount} of ${total} tests pass.`;
    summary.className = passedCount === total ? "pass" : "fail";
  }

  runAllTests().catch(() => {
    const summary = document.querySelector("#summary");
    summary.textContent = "Could not load the CSV files. Open this page from the live site.";
    summary.className = "fail";
  });
}());
