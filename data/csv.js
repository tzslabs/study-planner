(function () {
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let insideQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      const nextCharacter = text[index + 1];

      if (character === '"') {
        if (insideQuotes && nextCharacter === '"') {
          field += '"';
          index += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (character === "," && !insideQuotes) {
        row.push(field);
        field = "";
      } else if ((character === "\n" || character === "\r") && !insideQuotes) {
        if (character === "\r" && nextCharacter === "\n") {
          index += 1;
        }
        row.push(field);
        if (row.some((value) => value !== "")) {
          rows.push(row);
        }
        row = [];
        field = "";
      } else {
        field += character;
      }
    }

    row.push(field);
    if (row.some((value) => value !== "")) {
      rows.push(row);
    }

    return rows;
  }

  function escapeField(value) {
    const text = String(value);
    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function toCsv(rows) {
    return `${rows.map((row) => row.map(escapeField).join(",")).join("\n")}\n`;
  }

  window.StudyPlannerCsv = { parseCsv, toCsv };
}());
