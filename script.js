const form = document.querySelector("#assignment-form");
const nameInput = document.querySelector("#assignment-name");
const dateInput = document.querySelector("#due-date");
const message = document.querySelector("#message");
const assignmentList = document.querySelector("#assignment-list");
const emptyMessage = document.querySelector("#empty-message");
const clearButton = document.querySelector("#clear-button");

let assignments = loadAssignments();

function loadAssignments() {
  try {
    return JSON.parse(localStorage.getItem("studyPlannerAssignments")) || [];
  } catch (error) {
    return [];
  }
}

function saveAssignments() {
  localStorage.setItem("studyPlannerAssignments", JSON.stringify(assignments));
}

function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysUntil(dateText) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseDate(dateText) - getToday()) / millisecondsPerDay);
}

function describeDaysRemaining(days) {
  if (days === 0) {
    return "Due today";
  }

  if (days === 1) {
    return "1 day remaining";
  }

  return `${days} days remaining`;
}

function formatDate(dateText) {
  return parseDate(dateText).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderAssignments() {
  assignmentList.innerHTML = "";
  assignments.sort((first, second) => first.dueDate.localeCompare(second.dueDate));

  assignments.forEach((assignment) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const details = document.createElement("span");

    name.className = "assignment-name";
    name.textContent = assignment.name;
    details.className = "due-details";
    details.textContent = `${formatDate(assignment.dueDate)} — ${describeDaysRemaining(daysUntil(assignment.dueDate))}`;

    item.append(name, details);
    assignmentList.append(item);
  });

  emptyMessage.hidden = assignments.length > 0;
  clearButton.hidden = assignments.length === 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";

  const name = nameInput.value.trim();
  const dueDate = dateInput.value;

  if (!name || !dueDate) {
    message.textContent = "Enter an assignment name and due date.";
    return;
  }

  if (daysUntil(dueDate) < 0) {
    message.textContent = "Choose today or a future date.";
    return;
  }

  assignments.push({ name, dueDate });
  saveAssignments();
  renderAssignments();
  form.reset();
  nameInput.focus();
});

clearButton.addEventListener("click", () => {
  assignments = [];
  saveAssignments();
  renderAssignments();
  message.textContent = "All assignments were cleared.";
});

renderAssignments();
