(function () {
  window.StudyPlannerSchema = {
    columns: ["due_date", "course", "assignment", "priority", "estimated_hours"],
    courses: ["BIO 1350", "CS 1110", "ECON 1110", "HIST 1510", "MATH 1920"],
    priorities: ["Low", "Medium", "High"],
    maximumAssignmentLength: 100,
    maximumHours: 100
  };
}());
