(function () {
  const schema = window.StudyPlannerSchema;

  function makeError(column, code, message) {
    return { column, code, message };
  }

  function dateTextFromValue(value) {
    if (typeof value === "string") {
      return value;
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isRealDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
  }

  function validateRow(values, today) {
    const errors = [];

    if (values.length !== schema.columns.length) {
      return [makeError("row", "wrong_column_count", `Expected ${schema.columns.length} columns.`)];
    }

    const row = Object.fromEntries(schema.columns.map((column, index) => [column, values[index]]));

    schema.columns.forEach((column) => {
      if (row[column].trim() === "") {
        errors.push(makeError(column, "missing", `${column} is required.`));
      } else if (row[column] !== row[column].trim()) {
        errors.push(makeError(column, "extra_whitespace", `${column} cannot have extra spaces.`));
      }
    });

    if (row.due_date && row.due_date.trim() !== "") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        errors.push(makeError("due_date", "bad_format", "Use YYYY-MM-DD."));
      } else if (!isRealDate(row.due_date)) {
        errors.push(makeError("due_date", "invalid_date", "Use a real calendar date."));
      } else if (row.due_date < dateTextFromValue(today)) {
        errors.push(makeError("due_date", "past_date", "Due date cannot be before today."));
      }
    }

    if (row.course && row.course.trim() !== "" && !schema.courses.includes(row.course)) {
      errors.push(makeError("course", "not_allowed", "Course is not in the allowed list."));
    }

    if (row.assignment && row.assignment.length > schema.maximumAssignmentLength) {
      errors.push(makeError("assignment", "too_long", "Assignment must be 100 characters or fewer."));
    }

    if (row.priority && row.priority.trim() !== "" && !schema.priorities.includes(row.priority)) {
      errors.push(makeError("priority", "not_allowed", "Priority must be Low, Medium, or High."));
    }

    if (row.estimated_hours && row.estimated_hours.trim() !== "") {
      if (!/^\d+(\.\d+)?$/.test(row.estimated_hours)) {
        errors.push(makeError("estimated_hours", "bad_format", "Hours must be a plain number."));
      } else {
        const hours = Number(row.estimated_hours);
        if (hours <= 0) {
          errors.push(makeError("estimated_hours", "not_positive", "Hours must be above zero."));
        } else if (hours > schema.maximumHours) {
          errors.push(makeError("estimated_hours", "too_large", "Hours cannot be above 100."));
        }
      }
    }

    return errors;
  }

  function validateFile(text, today) {
    const rows = window.StudyPlannerCsv.parseCsv(text);
    const expectedHeader = schema.columns.join(",");
    const actualHeader = rows.length > 0 ? rows[0].join(",") : "";

    if (actualHeader !== expectedHeader) {
      return {
        loaded: [],
        rejected: [],
        warnings: [],
        fileErrors: [`Header must be exactly: ${expectedHeader}`]
      };
    }

    const loaded = [];
    const rejected = [];
    const warnings = [];
    const seenRows = new Map();

    rows.slice(1).forEach((values, index) => {
      const rowNumber = index + 2;
      const errors = validateRow(values, today);

      if (errors.length > 0) {
        rejected.push({ rowNumber, values, errors });
        return;
      }

      const row = Object.fromEntries(schema.columns.map((column, columnIndex) => [column, values[columnIndex]]));
      const duplicateKey = values.join("\u001f");
      if (seenRows.has(duplicateKey)) {
        warnings.push({
          rowNumber,
          message: `Possible duplicate of row ${seenRows.get(duplicateKey)}.`
        });
      } else {
        seenRows.set(duplicateKey, rowNumber);
      }
      loaded.push({ rowNumber, row });
    });

    return { loaded, rejected, warnings, fileErrors: [] };
  }

  window.StudyPlannerValidation = { isRealDate, validateRow, validateFile };
}());
