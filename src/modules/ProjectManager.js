import TodoFactory from "./TodoFactory.js";
import ProjectFactory from "./ProjectFactory.js";

const ProjectManager = (() => {
  let projects = [];
  let currSelectedProj;

  const addProject = (projectTitle) => {
    const project = ProjectFactory(projectTitle);
    projects.push(project);
    return project;
  };

  const removeProject = (projectID) =>
    (projects = projects.filter((project) => project.projectID !== projectID));

  /* const getProject = (projectID) => {}; */

  const getProjects = () => projects;

  const getSelectedProject = () => currSelectedProj;

  const getSelectedProjectTodos = () => currSelectedProj.getTodos();

  const setSelectedProject = (projectID) => {
    deselectCurrProject();
    projects.forEach((project) => {
      if (project.projectID === projectID) {
        currSelectedProj = project;
        currSelectedProj.toggleSelected();
        console.log(currSelectedProj);
        return;
      }
    });
  };

  const deselectCurrProject = () => currSelectedProj?.toggleSelected();

  const addTodoToSelectedProject = (inputElements) => {
    console.log("selected project is: ", currSelectedProj);
    const todo = TodoFactory(inputElements);
    currSelectedProj.addTodo(todo);
    console.log(projects);
    return todo;
  };

  /* need to be able to remove todos from any project, hmm.. */
  const removeTodoFromSelectedProject = (todoID) => {
    currSelectedProj.removeTodo(todoID);
  };

  const getFilteredTasks = (someFlag) => {
    if (someFlag === "all") {
      return projects
        .map((project) => {
          return project.getTodos();
        })
        .flat();
    }
    if (someFlag === "today") {
      // filter through all projects todos
      // return the ones with a date obj of today
    }
    if (someFlag === "week") {
      // filter through all projects todos
      // return the ones with a date within next 7 days
    }
    if (someFlag === "important") {
      // filter through all projects todos
      // return the ones with a isImportant === true
    }
  };

  return {
    addProject,
    removeProject,
    getProjects,
    getSelectedProject,
    getSelectedProjectTodos /* sure about export all of them?? */,
    setSelectedProject,
    addTodoToSelectedProject,
    removeTodoFromSelectedProject,
    getFilteredTasks,
  };
})();

export default ProjectManager;

// get todays tasks
// get tasks within next 7 days
// get important tasks
// could be one 'getFilteredTasks() based on what calls it'
