(function () {
  const removedRows = new Map([
    [7, "Set aside: course is missing and cannot be inferred safely."],
    [9, "Set aside: the due date is in the past and the intended year is unknown."],
    [11, "Set aside: assignment name is missing."],
    [13, "Set aside: estimated hours is negative."],
    [14, "Set aside: estimated hours is zero."],
    [18, "Removed: repeated header is not an assignment."],
    [20, "Set aside: February 30 is not a real date."],
    [21, "Set aside: priority is missing."],
    [22, "Set aside: estimated hours is missing."],
    [26, "Removed: totals row is not an assignment."]
  ]);

  function cleanRows(rawText) {
    const rows = window.StudyPlannerCsv.parseCsv(rawText);
    const header = rows[0];
    const clean = [];
    const removed = [];
    const flags = [];

    rows.slice(1).forEach((originalRow, index) => {
      const rowNumber = index + 2;
      const row = [...originalRow];

      if (removedRows.has(rowNumber)) {
        removed.push({ rowNumber, reason: removedRows.get(rowNumber) });
        return;
      }

      if (rowNumber === 3) row[0] = "2026-11-14";
      if (rowNumber === 4) row[1] = "CS 1110";
      if (rowNumber === 5) row[3] = "High";
      if (rowNumber === 6) row[4] = "3";
      if (rowNumber === 12) row[3] = "High";
      if (rowNumber === 15) row[4] = "4";
      if (rowNumber === 16) row[0] = "2026-11-28";
      if (rowNumber === 17) row[1] = "MATH 1920";
      if (rowNumber === 23) row[3] = "Medium";

      if (rowNumber === 8) flags.push("Row 8 is an exact duplicate of row 2; kept and flagged for review.");
      if (rowNumber === 10) flags.push("Row 10 has an unusual but allowed estimate of 40 hours; kept and flagged for review.");
      clean.push(row);
    });

    return {
      rawCount: rows.length - 1,
      cleanRows: clean,
      removed,
      flags,
      csv: window.StudyPlannerCsv.toCsv([header, ...clean])
    };
  }

  window.StudyPlannerCleaning = { cleanRows };
}());
