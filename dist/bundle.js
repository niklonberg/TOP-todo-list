/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/FormManager.js":
/*!************************************!*\
  !*** ./src/modules/FormManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProjectManager.js */ "./src/modules/ProjectManager.js");
/* harmony import */ var _TodoUIManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TodoUIManager.js */ "./src/modules/TodoUIManager.js");



const FormManager = (() => {
  /* references */
  const createNewTodoBtn = document.querySelector("#create-new-todo");
  const createNewProjectBtn = document.querySelector("#create-new-project");

  const handleBtnCreateFormClick = (event) => {
    const elementToAppendFormTo = event.target.previousElementSibling;
    if (elementToAppendFormTo.querySelector("form")) return;

    const isNewProject = determineFormType(event);

    const formTypeTemplate = isNewProject
      ? createProjectForm()
      : createTodoForm();

    createAndAppendForm(elementToAppendFormTo, formTypeTemplate);

    const form = elementToAppendFormTo.querySelector("form");
    initializeForm(form, isNewProject);
  };

  const initializeForm = (form, isNewProject) => {
    const submitHandler = (event) => {
      handleFormSubmit(event, form, isNewProject);
      form.removeEventListener("submit", submitHandler);
      form.remove();
    };
    form.addEventListener("submit", submitHandler);
  };

  const handleFormSubmit = (event, form, isNewProject) => {
    event.preventDefault();
    const templateObj = createObjectFromForm(getInputElements(form));
    const object = isNewProject
      ? _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].addProject(templateObj)
      : _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].addTodoToSelectedProject(templateObj);

    _TodoUIManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addLatestItem(object, isNewProject);
  };

  const editSelectedItem = () => {};

  const getInputElements = (form) =>
    [...form.elements].filter((item) => item.tagName === "INPUT");

  createNewProjectBtn.addEventListener("click", handleBtnCreateFormClick);

  createNewTodoBtn.addEventListener("click", handleBtnCreateFormClick);
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormManager);

function determineFormType(event) {
  return event.target.id.includes("project");
}

function createTodoForm() {
  return `
  <form action="#" id="add-todo-form">
    <label for="title">Title: </label>
    <input type="text" name="title" id="title" />
    <label for="description">Description: </label>
    <input type="text" name="description" id="description" />
    <label for="isImportant">Extra important?</label>
    <input type="checkbox" name="isImportant" id="isImportant" />
    <button type="submit">Add todo</button>
  </form>
  `;
}

function createProjectForm() {
  return `
  <form action="#" id="add-project-form">
    <label for="title">Title: </label>
    <input type="text" name="title" id="title" />
    <button type="submit">Add todo</button>
  </form>
  `;
}

function createObjectFromForm(formInputs) {
  return formInputs.reduce((object, item) => {
    if (item.type === "checkbox") {
      return { ...object, [item.id]: item.checked };
    } else {
      return item.value ? { ...object, [item.id]: item.value } : object;
    }
  }, {});
}

function createAndAppendForm(elementToAppendFormTo, formTypeTemplate) {
  elementToAppendFormTo.insertAdjacentHTML("beforeend", formTypeTemplate);
}


/***/ }),

/***/ "./src/modules/ProjectFactory.js":
/*!***************************************!*\
  !*** ./src/modules/ProjectFactory.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let projectIDCounter = 0;

function ProjectFactory(object) {
  const project = {
    title: object.title,
    projectID: projectIDCounter,
    isSelected: false,
    todos: [],
  };

  //use object.setPrototypeOf to assign methods to protoype, to avoid duplication
  Object.setPrototypeOf(project, sharedMethods);

  projectIDCounter++;
  return project;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectFactory);

const sharedMethods = {
  getTodos: function () {
    return this.todos;
  },

  addTodo: function (todo) {
    this.todos.push(todo);
  },

  removeTodo: function (todoID) {
    this.todos = this.todos.filter((todo) => todo.todoID !== todoID);
  },

  toggleTodoBoolProperty: function (todoID, todoProperty) {
    const targetTodo = this.todos.find((todo) => todo.todoID === todoID);
    targetTodo[todoProperty] = !targetTodo[todoProperty];
  },

  toggleSelected: function () {
    this.isSelected = !this.isSelected;
  },
};


/***/ }),

/***/ "./src/modules/ProjectManager.js":
/*!***************************************!*\
  !*** ./src/modules/ProjectManager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TodoFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TodoFactory.js */ "./src/modules/TodoFactory.js");
/* harmony import */ var _ProjectFactory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProjectFactory.js */ "./src/modules/ProjectFactory.js");



const ProjectManager = (() => {
  let projects = [];
  let currSelectedProj;

  const addProject = (projectTitle) => {
    const project = (0,_ProjectFactory_js__WEBPACK_IMPORTED_MODULE_1__["default"])(projectTitle);
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
    const todo = (0,_TodoFactory_js__WEBPACK_IMPORTED_MODULE_0__["default"])(inputElements);
    currSelectedProj.addTodo(todo);
    console.log(projects);
    return todo;
  };

  const removeTodoFromSelectedProject = (todoID) => {
    currSelectedProj.removeTodo(todoID);
  };

  const getAllTasks = () => {
    return projects
      .map((project) => {
        return project.getTodos();
      })
      .flat();
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
    getAllTasks,
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectManager);

// get todays tasks
// get tasks within next 7 days
// get important tasks
// could be one 'getFilteredTasks() based on what calls it'


/***/ }),

/***/ "./src/modules/TodoFactory.js":
/*!************************************!*\
  !*** ./src/modules/TodoFactory.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let todoIDCounter = 0;

function TodoFactory(obj) {
  const todo = {};
  todo.todoID = todoIDCounter;
  todo.isCompleted = false;
  todo.isImportant = false;

  for (const [key, value] of Object.entries(obj)) {
    todo[key] = value;
  }

  todoIDCounter++;
  return todo;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TodoFactory);

/* loops through each key in argumentobj */
/* returns {} with key:value pairs*/
/* title */
/* description */
/* dueDate */
/* priority */
/* notes */
/* checklist (sub steps) */
/* maybe add methods to the objects as well? */


/***/ }),

/***/ "./src/modules/TodoUIManager.js":
/*!**************************************!*\
  !*** ./src/modules/TodoUIManager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProjectManager.js */ "./src/modules/ProjectManager.js");
/* harmony import */ var _createListItemFromObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createListItemFromObject.js */ "./src/modules/createListItemFromObject.js");
/* harmony import */ var _createBaseGroupHTML_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createBaseGroupHTML.js */ "./src/modules/createBaseGroupHTML.js");




const TodoUIManager = (() => {
  /* references */
  const appContent = document.querySelector("#app-content");
  const mainContent = document.querySelector("#content");
  const projectsList = document.querySelector("#projects-list");

  /* test, have single event listener on #home */
  const allTasks = document.querySelector("#all-tasks");
  allTasks.addEventListener("click", () => {
    console.log(_ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAllTasks());
  });
  /* test */

  let previousListGroupSelection;

  //change to renderProjects, as it is run once on startup / or is it?
  const renderProjectsList = () => {
    removeHTMLContent(projectsList);
    const projects = _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getProjects();

    projects.forEach((project) =>
      projectsList.appendChild((0,_createListItemFromObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(project))
    );
  };

  const renderSelectedGroup = () => {
    removeHTMLContent(mainContent);
    const [h1, list] = (0,_createBaseGroupHTML_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedProject());
    mainContent.append(h1, list);

    const selectedProjectTodos = _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedProjectTodos();
    const currGroupTodosList = document.querySelector("#curr-grouping-todos");

    selectedProjectTodos.forEach((project) =>
      currGroupTodosList.appendChild((0,_createListItemFromObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(project))
    );
  };

  const addLatestItem = (object, isNewProject) => {
    console.log(object);
    const currGroupTodosList = document.querySelector("#curr-grouping-todos");
    const item = (0,_createListItemFromObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object);
    isNewProject
      ? projectsList.appendChild(item)
      : currGroupTodosList.appendChild(item);
  };

  const editSelectedItem = () => {
    //update selected items textContent
    //tells formManager to create form to edit in
    //all actual data changes handled by project manager
  };

  /* revisit fn */
  const removeSelectedItem = (event) => {
    const [objectToDelete, objectID, parentLi] = determineTodoOrProject(event);

    if (objectToDelete === "project") {
      _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].removeProject(objectID);
      parentLi.remove();
      mainContent.innerHTML = ""; //This needs to change
    }
    if (objectToDelete === "todo") {
      _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].removeTodoFromSelectedProject(objectID);
      parentLi.remove();
    }

    console.log(_ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getProjects());
  };
  appContent.addEventListener("click", removeSelectedItem);

  const showSelectedGroup = (event) => {
    const listGroupSelection = event.target.closest("li");
    if (listGroupSelection !== previousListGroupSelection) {
      const projectID = +listGroupSelection.dataset.project;
      _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setSelectedProject(projectID); //rename when you add the other groups
      renderSelectedGroup(); //'today', 'important' etc.
      previousListGroupSelection = listGroupSelection;
    }
  };
  projectsList.addEventListener("click", showSelectedGroup);

  const toggleBtnTodoProperty = (event) => {
    let todoProperty = determineTodoProperty(event);

    if (todoProperty) {
      const btn = event.target;
      const todoID = +btn.parentElement.dataset.todo;
      _ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedProject().toggleTodoBoolProperty(
        todoID,
        todoProperty
      );
      console.log(_ProjectManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedProject());
    }
  };
  appContent.addEventListener("click", toggleBtnTodoProperty);

  return {
    renderProjectsList,
    renderSelectedGroup,
    addLatestItem,
  };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TodoUIManager);

function determineTodoProperty(event) {
  let todoProperty = null;
  if (event.target.classList.contains("toggle-complete-btn"))
    todoProperty = "isCompleted";
  if (event.target.classList.contains("toggle-important-btn"))
    todoProperty = "isImportant";
  return todoProperty;
}

function determineTodoOrProject(event) {
  if (event.target.classList.contains("delete-item")) {
    const btn = event.target;
    const parentLi = btn.closest("li");
    const parentObjectDataset = parentLi.dataset;
    const objectToDelete = Object.keys(parentObjectDataset)[0];
    const objectID = +Object.values(parentObjectDataset)[0];
    return [objectToDelete, objectID, parentLi];
  }
  return [null, null];
}

function removeHTMLContent(element) {
  element.innerHTML = "";
}


/***/ }),

/***/ "./src/modules/createBaseGroupHTML.js":
/*!********************************************!*\
  !*** ./src/modules/createBaseGroupHTML.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement.js */ "./src/modules/createElement.js");


function createBaseGroupHTML(projectObj) {
  const h1 = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("h1", "test", "grouping-title");
  h1.textContent =
    projectObj?.title ?? "Default Title"; /* projects must have title
  so get rid of this line */
  /* get title from li that called it? */

  const list = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ul", "test2", "curr-grouping-todos");

  return [h1, list];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBaseGroupHTML);


/***/ }),

/***/ "./src/modules/createElement.js":
/*!**************************************!*\
  !*** ./src/modules/createElement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createElement(type = "div", classname = "", id = "") {
  const ele = document.createElement(type);
  if (classname) ele.classList.add(classname);
  if (id) ele.id = id;
  return ele;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createElement);


/***/ }),

/***/ "./src/modules/createListItemFromObject.js":
/*!*************************************************!*\
  !*** ./src/modules/createListItemFromObject.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement.js */ "./src/modules/createElement.js");


function createListItemFromObject(object) {
  const [objID, idTag] = getObjectIDAndTag(object);

  const li = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("li");
  li.dataset[idTag] = objID;

  for (const [key, value] of Object.entries(object)) {
    /* console.log(key + ": " + value); */
    if (key === "title") {
      const heading = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("h3");
      heading.textContent = value;
      li.appendChild(heading);
    }

    if (key === "description") {
      const p = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("p");
      p.textContent = value;
      li.appendChild(p);
    }
  }

  if (object.hasOwnProperty("todoID")) {
    /* use order to place completeBtn all the way to left in li */
    const checkCompleteBtn = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("button", "toggle-complete-btn");
    checkCompleteBtn.textContent = "Mark complete"; /* make sep fn */
    li.appendChild(checkCompleteBtn);

    const checkImportantBtn = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("button", "toggle-important-btn");
    checkImportantBtn.textContent = "Mark important"; /* make sep fn */
    li.appendChild(checkImportantBtn);
  }

  const editContainer = createEditContainer();
  li.appendChild(editContainer);

  return li; /* lots of repeating appendCHilding */
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createListItemFromObject);

function createEditContainer() {
  const editContainer = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("div", "edit-container");
  const editBtn = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("button", "edit-item");
  editBtn.textContent = "Edit";
  const deleteBtn = (0,_createElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])("button", "delete-item");
  deleteBtn.textContent = "Delete";
  editContainer.append(editBtn, deleteBtn);

  return editContainer;
}

function getObjectIDAndTag(object) {
  const key1 = "projectID";
  const key2 = "todoID";
  const objID = object.hasOwnProperty(key1)
    ? object.projectID
    : object.hasOwnProperty(key2)
    ? object.todoID
    : null;

  const idTag = object.hasOwnProperty(key1)
    ? "project"
    : object.hasOwnProperty(key2)
    ? "todo"
    : null;

  return [objID, idTag];
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_FormManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/FormManager.js */ "./src/modules/FormManager.js");
/* harmony import */ var _modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/ProjectManager.js */ "./src/modules/ProjectManager.js");
/* harmony import */ var _modules_TodoUIManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/TodoUIManager.js */ "./src/modules/TodoUIManager.js");
const log = console.log;



log(_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addProject({ title: "Refurnish Home" });
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addProject({ title: "Paint Walls" });
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].setSelectedProject(0);
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addTodoToSelectedProject({
  title: "move sofa",
  description: "lift dont drag",
});
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addTodoToSelectedProject({
  title: "move table",
  description: "drag it roughly",
});
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].setSelectedProject(1);
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addTodoToSelectedProject({
  title: "buy paint",
  description: "mix it well before applying",
});
_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].addTodoToSelectedProject({
  title: "buy brush",
});
log(_modules_ProjectManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].getProjects());
_modules_TodoUIManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].renderProjectsList("projects");
_modules_TodoUIManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].renderSelectedGroup("todos");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSx3QkFBd0IsNkRBQWE7QUFDckMsa0JBQWtCLDZEQUFhO0FBQy9CO0FBQ0Esb0JBQW9CLDZEQUFhO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztVQ3JFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNtRDtBQUNNO0FBQ0Y7QUFDdkQsSUFBSSxrRUFBYztBQUNsQixrRUFBYyxjQUFjLHlCQUF5QjtBQUNyRCxrRUFBYyxjQUFjLHNCQUFzQjtBQUNsRCxrRUFBYztBQUNkLGtFQUFjO0FBQ2Q7QUFDQTtBQUNBLENBQUM7QUFDRCxrRUFBYztBQUNkO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsa0VBQWM7QUFDZCxrRUFBYztBQUNkO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsa0VBQWM7QUFDZDtBQUNBLENBQUM7QUFDRCxJQUFJLGtFQUFjO0FBQ2xCLGlFQUFhO0FBQ2IsaUVBQWEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvRm9ybU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL1Byb2plY3RGYWN0b3J5LmpzIiwid2VicGFjazovL3RvcC10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9Qcm9qZWN0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly90b3AtdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvVG9kb0ZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL1RvZG9VSU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2NyZWF0ZUJhc2VHcm91cEhUTUwuanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2NyZWF0ZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2NyZWF0ZUxpc3RJdGVtRnJvbU9iamVjdC5qcyIsIndlYnBhY2s6Ly90b3AtdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLXRvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvamVjdE1hbmFnZXIgZnJvbSBcIi4vUHJvamVjdE1hbmFnZXIuanNcIjtcbmltcG9ydCBUb2RvVUlNYW5hZ2VyIGZyb20gXCIuL1RvZG9VSU1hbmFnZXIuanNcIjtcblxuY29uc3QgRm9ybU1hbmFnZXIgPSAoKCkgPT4ge1xuICAvKiByZWZlcmVuY2VzICovXG4gIGNvbnN0IGNyZWF0ZU5ld1RvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NyZWF0ZS1uZXctdG9kb1wiKTtcbiAgY29uc3QgY3JlYXRlTmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlYXRlLW5ldy1wcm9qZWN0XCIpO1xuXG4gIGNvbnN0IGhhbmRsZUJ0bkNyZWF0ZUZvcm1DbGljayA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnRUb0FwcGVuZEZvcm1UbyA9IGV2ZW50LnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgIGlmIChlbGVtZW50VG9BcHBlbmRGb3JtVG8ucXVlcnlTZWxlY3RvcihcImZvcm1cIikpIHJldHVybjtcblxuICAgIGNvbnN0IGlzTmV3UHJvamVjdCA9IGRldGVybWluZUZvcm1UeXBlKGV2ZW50KTtcblxuICAgIGNvbnN0IGZvcm1UeXBlVGVtcGxhdGUgPSBpc05ld1Byb2plY3RcbiAgICAgID8gY3JlYXRlUHJvamVjdEZvcm0oKVxuICAgICAgOiBjcmVhdGVUb2RvRm9ybSgpO1xuXG4gICAgY3JlYXRlQW5kQXBwZW5kRm9ybShlbGVtZW50VG9BcHBlbmRGb3JtVG8sIGZvcm1UeXBlVGVtcGxhdGUpO1xuXG4gICAgY29uc3QgZm9ybSA9IGVsZW1lbnRUb0FwcGVuZEZvcm1Uby5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKTtcbiAgICBpbml0aWFsaXplRm9ybShmb3JtLCBpc05ld1Byb2plY3QpO1xuICB9O1xuXG4gIGNvbnN0IGluaXRpYWxpemVGb3JtID0gKGZvcm0sIGlzTmV3UHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IHN1Ym1pdEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGhhbmRsZUZvcm1TdWJtaXQoZXZlbnQsIGZvcm0sIGlzTmV3UHJvamVjdCk7XG4gICAgICBmb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgc3VibWl0SGFuZGxlcik7XG4gICAgICBmb3JtLnJlbW92ZSgpO1xuICAgIH07XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHN1Ym1pdEhhbmRsZXIpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUZvcm1TdWJtaXQgPSAoZXZlbnQsIGZvcm0sIGlzTmV3UHJvamVjdCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdGVtcGxhdGVPYmogPSBjcmVhdGVPYmplY3RGcm9tRm9ybShnZXRJbnB1dEVsZW1lbnRzKGZvcm0pKTtcbiAgICBjb25zdCBvYmplY3QgPSBpc05ld1Byb2plY3RcbiAgICAgID8gUHJvamVjdE1hbmFnZXIuYWRkUHJvamVjdCh0ZW1wbGF0ZU9iailcbiAgICAgIDogUHJvamVjdE1hbmFnZXIuYWRkVG9kb1RvU2VsZWN0ZWRQcm9qZWN0KHRlbXBsYXRlT2JqKTtcblxuICAgIFRvZG9VSU1hbmFnZXIuYWRkTGF0ZXN0SXRlbShvYmplY3QsIGlzTmV3UHJvamVjdCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFNlbGVjdGVkSXRlbSA9ICgpID0+IHt9O1xuXG4gIGNvbnN0IGdldElucHV0RWxlbWVudHMgPSAoZm9ybSkgPT5cbiAgICBbLi4uZm9ybS5lbGVtZW50c10uZmlsdGVyKChpdGVtKSA9PiBpdGVtLnRhZ05hbWUgPT09IFwiSU5QVVRcIik7XG5cbiAgY3JlYXRlTmV3UHJvamVjdEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQnRuQ3JlYXRlRm9ybUNsaWNrKTtcblxuICBjcmVhdGVOZXdUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVCdG5DcmVhdGVGb3JtQ2xpY2spO1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgRm9ybU1hbmFnZXI7XG5cbmZ1bmN0aW9uIGRldGVybWluZUZvcm1UeXBlKGV2ZW50KSB7XG4gIHJldHVybiBldmVudC50YXJnZXQuaWQuaW5jbHVkZXMoXCJwcm9qZWN0XCIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUb2RvRm9ybSgpIHtcbiAgcmV0dXJuIGBcbiAgPGZvcm0gYWN0aW9uPVwiI1wiIGlkPVwiYWRkLXRvZG8tZm9ybVwiPlxuICAgIDxsYWJlbCBmb3I9XCJ0aXRsZVwiPlRpdGxlOiA8L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0aXRsZVwiIGlkPVwidGl0bGVcIiAvPlxuICAgIDxsYWJlbCBmb3I9XCJkZXNjcmlwdGlvblwiPkRlc2NyaXB0aW9uOiA8L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkZXNjcmlwdGlvblwiIGlkPVwiZGVzY3JpcHRpb25cIiAvPlxuICAgIDxsYWJlbCBmb3I9XCJpc0ltcG9ydGFudFwiPkV4dHJhIGltcG9ydGFudD88L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiaXNJbXBvcnRhbnRcIiBpZD1cImlzSW1wb3J0YW50XCIgLz5cbiAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5BZGQgdG9kbzwvYnV0dG9uPlxuICA8L2Zvcm0+XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb2plY3RGb3JtKCkge1xuICByZXR1cm4gYFxuICA8Zm9ybSBhY3Rpb249XCIjXCIgaWQ9XCJhZGQtcHJvamVjdC1mb3JtXCI+XG4gICAgPGxhYmVsIGZvcj1cInRpdGxlXCI+VGl0bGU6IDwvbGFiZWw+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInRpdGxlXCIgaWQ9XCJ0aXRsZVwiIC8+XG4gICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+QWRkIHRvZG88L2J1dHRvbj5cbiAgPC9mb3JtPlxuICBgO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RGcm9tRm9ybShmb3JtSW5wdXRzKSB7XG4gIHJldHVybiBmb3JtSW5wdXRzLnJlZHVjZSgob2JqZWN0LCBpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0udHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICByZXR1cm4geyAuLi5vYmplY3QsIFtpdGVtLmlkXTogaXRlbS5jaGVja2VkIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlID8geyAuLi5vYmplY3QsIFtpdGVtLmlkXTogaXRlbS52YWx1ZSB9IDogb2JqZWN0O1xuICAgIH1cbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbmRBcHBlbmRGb3JtKGVsZW1lbnRUb0FwcGVuZEZvcm1UbywgZm9ybVR5cGVUZW1wbGF0ZSkge1xuICBlbGVtZW50VG9BcHBlbmRGb3JtVG8uaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGZvcm1UeXBlVGVtcGxhdGUpO1xufVxuIiwibGV0IHByb2plY3RJRENvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBQcm9qZWN0RmFjdG9yeShvYmplY3QpIHtcbiAgY29uc3QgcHJvamVjdCA9IHtcbiAgICB0aXRsZTogb2JqZWN0LnRpdGxlLFxuICAgIHByb2plY3RJRDogcHJvamVjdElEQ291bnRlcixcbiAgICBpc1NlbGVjdGVkOiBmYWxzZSxcbiAgICB0b2RvczogW10sXG4gIH07XG5cbiAgLy91c2Ugb2JqZWN0LnNldFByb3RvdHlwZU9mIHRvIGFzc2lnbiBtZXRob2RzIHRvIHByb3RveXBlLCB0byBhdm9pZCBkdXBsaWNhdGlvblxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YocHJvamVjdCwgc2hhcmVkTWV0aG9kcyk7XG5cbiAgcHJvamVjdElEQ291bnRlcisrO1xuICByZXR1cm4gcHJvamVjdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdEZhY3Rvcnk7XG5cbmNvbnN0IHNoYXJlZE1ldGhvZHMgPSB7XG4gIGdldFRvZG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9kb3M7XG4gIH0sXG5cbiAgYWRkVG9kbzogZnVuY3Rpb24gKHRvZG8pIHtcbiAgICB0aGlzLnRvZG9zLnB1c2godG9kbyk7XG4gIH0sXG5cbiAgcmVtb3ZlVG9kbzogZnVuY3Rpb24gKHRvZG9JRCkge1xuICAgIHRoaXMudG9kb3MgPSB0aGlzLnRvZG9zLmZpbHRlcigodG9kbykgPT4gdG9kby50b2RvSUQgIT09IHRvZG9JRCk7XG4gIH0sXG5cbiAgdG9nZ2xlVG9kb0Jvb2xQcm9wZXJ0eTogZnVuY3Rpb24gKHRvZG9JRCwgdG9kb1Byb3BlcnR5KSB7XG4gICAgY29uc3QgdGFyZ2V0VG9kbyA9IHRoaXMudG9kb3MuZmluZCgodG9kbykgPT4gdG9kby50b2RvSUQgPT09IHRvZG9JRCk7XG4gICAgdGFyZ2V0VG9kb1t0b2RvUHJvcGVydHldID0gIXRhcmdldFRvZG9bdG9kb1Byb3BlcnR5XTtcbiAgfSxcblxuICB0b2dnbGVTZWxlY3RlZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNTZWxlY3RlZCA9ICF0aGlzLmlzU2VsZWN0ZWQ7XG4gIH0sXG59O1xuIiwiaW1wb3J0IFRvZG9GYWN0b3J5IGZyb20gXCIuL1RvZG9GYWN0b3J5LmpzXCI7XG5pbXBvcnQgUHJvamVjdEZhY3RvcnkgZnJvbSBcIi4vUHJvamVjdEZhY3RvcnkuanNcIjtcblxuY29uc3QgUHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBsZXQgcHJvamVjdHMgPSBbXTtcbiAgbGV0IGN1cnJTZWxlY3RlZFByb2o7XG5cbiAgY29uc3QgYWRkUHJvamVjdCA9IChwcm9qZWN0VGl0bGUpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gUHJvamVjdEZhY3RvcnkocHJvamVjdFRpdGxlKTtcbiAgICBwcm9qZWN0cy5wdXNoKHByb2plY3QpO1xuICAgIHJldHVybiBwcm9qZWN0O1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZVByb2plY3QgPSAocHJvamVjdElEKSA9PlxuICAgIChwcm9qZWN0cyA9IHByb2plY3RzLmZpbHRlcigocHJvamVjdCkgPT4gcHJvamVjdC5wcm9qZWN0SUQgIT09IHByb2plY3RJRCkpO1xuXG4gIC8qIGNvbnN0IGdldFByb2plY3QgPSAocHJvamVjdElEKSA9PiB7fTsgKi9cblxuICBjb25zdCBnZXRQcm9qZWN0cyA9ICgpID0+IHByb2plY3RzO1xuXG4gIGNvbnN0IGdldFNlbGVjdGVkUHJvamVjdCA9ICgpID0+IGN1cnJTZWxlY3RlZFByb2o7XG5cbiAgY29uc3QgZ2V0U2VsZWN0ZWRQcm9qZWN0VG9kb3MgPSAoKSA9PiBjdXJyU2VsZWN0ZWRQcm9qLmdldFRvZG9zKCk7XG5cbiAgY29uc3Qgc2V0U2VsZWN0ZWRQcm9qZWN0ID0gKHByb2plY3RJRCkgPT4ge1xuICAgIGRlc2VsZWN0Q3VyclByb2plY3QoKTtcbiAgICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgICBpZiAocHJvamVjdC5wcm9qZWN0SUQgPT09IHByb2plY3RJRCkge1xuICAgICAgICBjdXJyU2VsZWN0ZWRQcm9qID0gcHJvamVjdDtcbiAgICAgICAgY3VyclNlbGVjdGVkUHJvai50b2dnbGVTZWxlY3RlZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyU2VsZWN0ZWRQcm9qKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGRlc2VsZWN0Q3VyclByb2plY3QgPSAoKSA9PiBjdXJyU2VsZWN0ZWRQcm9qPy50b2dnbGVTZWxlY3RlZCgpO1xuXG4gIGNvbnN0IGFkZFRvZG9Ub1NlbGVjdGVkUHJvamVjdCA9IChpbnB1dEVsZW1lbnRzKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJzZWxlY3RlZCBwcm9qZWN0IGlzOiBcIiwgY3VyclNlbGVjdGVkUHJvaik7XG4gICAgY29uc3QgdG9kbyA9IFRvZG9GYWN0b3J5KGlucHV0RWxlbWVudHMpO1xuICAgIGN1cnJTZWxlY3RlZFByb2ouYWRkVG9kbyh0b2RvKTtcbiAgICBjb25zb2xlLmxvZyhwcm9qZWN0cyk7XG4gICAgcmV0dXJuIHRvZG87XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlVG9kb0Zyb21TZWxlY3RlZFByb2plY3QgPSAodG9kb0lEKSA9PiB7XG4gICAgY3VyclNlbGVjdGVkUHJvai5yZW1vdmVUb2RvKHRvZG9JRCk7XG4gIH07XG5cbiAgY29uc3QgZ2V0QWxsVGFza3MgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHByb2plY3RzXG4gICAgICAubWFwKChwcm9qZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiBwcm9qZWN0LmdldFRvZG9zKCk7XG4gICAgICB9KVxuICAgICAgLmZsYXQoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZFByb2plY3QsXG4gICAgcmVtb3ZlUHJvamVjdCxcbiAgICBnZXRQcm9qZWN0cyxcbiAgICBnZXRTZWxlY3RlZFByb2plY3QsXG4gICAgZ2V0U2VsZWN0ZWRQcm9qZWN0VG9kb3MgLyogc3VyZSBhYm91dCBleHBvcnQgYWxsIG9mIHRoZW0/PyAqLyxcbiAgICBzZXRTZWxlY3RlZFByb2plY3QsXG4gICAgYWRkVG9kb1RvU2VsZWN0ZWRQcm9qZWN0LFxuICAgIHJlbW92ZVRvZG9Gcm9tU2VsZWN0ZWRQcm9qZWN0LFxuICAgIGdldEFsbFRhc2tzLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdE1hbmFnZXI7XG5cbi8vIGdldCB0b2RheXMgdGFza3Ncbi8vIGdldCB0YXNrcyB3aXRoaW4gbmV4dCA3IGRheXNcbi8vIGdldCBpbXBvcnRhbnQgdGFza3Ncbi8vIGNvdWxkIGJlIG9uZSAnZ2V0RmlsdGVyZWRUYXNrcygpIGJhc2VkIG9uIHdoYXQgY2FsbHMgaXQnXG4iLCJsZXQgdG9kb0lEQ291bnRlciA9IDA7XG5cbmZ1bmN0aW9uIFRvZG9GYWN0b3J5KG9iaikge1xuICBjb25zdCB0b2RvID0ge307XG4gIHRvZG8udG9kb0lEID0gdG9kb0lEQ291bnRlcjtcbiAgdG9kby5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICB0b2RvLmlzSW1wb3J0YW50ID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqKSkge1xuICAgIHRvZG9ba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgdG9kb0lEQ291bnRlcisrO1xuICByZXR1cm4gdG9kbztcbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9kb0ZhY3Rvcnk7XG5cbi8qIGxvb3BzIHRocm91Z2ggZWFjaCBrZXkgaW4gYXJndW1lbnRvYmogKi9cbi8qIHJldHVybnMge30gd2l0aCBrZXk6dmFsdWUgcGFpcnMqL1xuLyogdGl0bGUgKi9cbi8qIGRlc2NyaXB0aW9uICovXG4vKiBkdWVEYXRlICovXG4vKiBwcmlvcml0eSAqL1xuLyogbm90ZXMgKi9cbi8qIGNoZWNrbGlzdCAoc3ViIHN0ZXBzKSAqL1xuLyogbWF5YmUgYWRkIG1ldGhvZHMgdG8gdGhlIG9iamVjdHMgYXMgd2VsbD8gKi9cbiIsImltcG9ydCBQcm9qZWN0TWFuYWdlciBmcm9tIFwiLi9Qcm9qZWN0TWFuYWdlci5qc1wiO1xuaW1wb3J0IGNyZWF0ZUxpc3RJdGVtRnJvbU9iamVjdCBmcm9tIFwiLi9jcmVhdGVMaXN0SXRlbUZyb21PYmplY3QuanNcIjtcbmltcG9ydCBjcmVhdGVCYXNlR3JvdXBIVE1MIGZyb20gXCIuL2NyZWF0ZUJhc2VHcm91cEhUTUwuanNcIjtcblxuY29uc3QgVG9kb1VJTWFuYWdlciA9ICgoKSA9PiB7XG4gIC8qIHJlZmVyZW5jZXMgKi9cbiAgY29uc3QgYXBwQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwLWNvbnRlbnRcIik7XG4gIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICBjb25zdCBwcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2plY3RzLWxpc3RcIik7XG5cbiAgLyogdGVzdCwgaGF2ZSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIgb24gI2hvbWUgKi9cbiAgY29uc3QgYWxsVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FsbC10YXNrc1wiKTtcbiAgYWxsVGFza3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhQcm9qZWN0TWFuYWdlci5nZXRBbGxUYXNrcygpKTtcbiAgfSk7XG4gIC8qIHRlc3QgKi9cblxuICBsZXQgcHJldmlvdXNMaXN0R3JvdXBTZWxlY3Rpb247XG5cbiAgLy9jaGFuZ2UgdG8gcmVuZGVyUHJvamVjdHMsIGFzIGl0IGlzIHJ1biBvbmNlIG9uIHN0YXJ0dXAgLyBvciBpcyBpdD9cbiAgY29uc3QgcmVuZGVyUHJvamVjdHNMaXN0ID0gKCkgPT4ge1xuICAgIHJlbW92ZUhUTUxDb250ZW50KHByb2plY3RzTGlzdCk7XG4gICAgY29uc3QgcHJvamVjdHMgPSBQcm9qZWN0TWFuYWdlci5nZXRQcm9qZWN0cygpO1xuXG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT5cbiAgICAgIHByb2plY3RzTGlzdC5hcHBlbmRDaGlsZChjcmVhdGVMaXN0SXRlbUZyb21PYmplY3QocHJvamVjdCkpXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RlZEdyb3VwID0gKCkgPT4ge1xuICAgIHJlbW92ZUhUTUxDb250ZW50KG1haW5Db250ZW50KTtcbiAgICBjb25zdCBbaDEsIGxpc3RdID0gY3JlYXRlQmFzZUdyb3VwSFRNTChQcm9qZWN0TWFuYWdlci5nZXRTZWxlY3RlZFByb2plY3QoKSk7XG4gICAgbWFpbkNvbnRlbnQuYXBwZW5kKGgxLCBsaXN0KTtcblxuICAgIGNvbnN0IHNlbGVjdGVkUHJvamVjdFRvZG9zID0gUHJvamVjdE1hbmFnZXIuZ2V0U2VsZWN0ZWRQcm9qZWN0VG9kb3MoKTtcbiAgICBjb25zdCBjdXJyR3JvdXBUb2Rvc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2N1cnItZ3JvdXBpbmctdG9kb3NcIik7XG5cbiAgICBzZWxlY3RlZFByb2plY3RUb2Rvcy5mb3JFYWNoKChwcm9qZWN0KSA9PlxuICAgICAgY3Vyckdyb3VwVG9kb3NMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZUxpc3RJdGVtRnJvbU9iamVjdChwcm9qZWN0KSlcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGFkZExhdGVzdEl0ZW0gPSAob2JqZWN0LCBpc05ld1Byb2plY3QpID0+IHtcbiAgICBjb25zb2xlLmxvZyhvYmplY3QpO1xuICAgIGNvbnN0IGN1cnJHcm91cFRvZG9zTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3Vyci1ncm91cGluZy10b2Rvc1wiKTtcbiAgICBjb25zdCBpdGVtID0gY3JlYXRlTGlzdEl0ZW1Gcm9tT2JqZWN0KG9iamVjdCk7XG4gICAgaXNOZXdQcm9qZWN0XG4gICAgICA/IHByb2plY3RzTGlzdC5hcHBlbmRDaGlsZChpdGVtKVxuICAgICAgOiBjdXJyR3JvdXBUb2Rvc0xpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFNlbGVjdGVkSXRlbSA9ICgpID0+IHtcbiAgICAvL3VwZGF0ZSBzZWxlY3RlZCBpdGVtcyB0ZXh0Q29udGVudFxuICAgIC8vdGVsbHMgZm9ybU1hbmFnZXIgdG8gY3JlYXRlIGZvcm0gdG8gZWRpdCBpblxuICAgIC8vYWxsIGFjdHVhbCBkYXRhIGNoYW5nZXMgaGFuZGxlZCBieSBwcm9qZWN0IG1hbmFnZXJcbiAgfTtcblxuICAvKiByZXZpc2l0IGZuICovXG4gIGNvbnN0IHJlbW92ZVNlbGVjdGVkSXRlbSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IFtvYmplY3RUb0RlbGV0ZSwgb2JqZWN0SUQsIHBhcmVudExpXSA9IGRldGVybWluZVRvZG9PclByb2plY3QoZXZlbnQpO1xuXG4gICAgaWYgKG9iamVjdFRvRGVsZXRlID09PSBcInByb2plY3RcIikge1xuICAgICAgUHJvamVjdE1hbmFnZXIucmVtb3ZlUHJvamVjdChvYmplY3RJRCk7XG4gICAgICBwYXJlbnRMaS5yZW1vdmUoKTtcbiAgICAgIG1haW5Db250ZW50LmlubmVySFRNTCA9IFwiXCI7IC8vVGhpcyBuZWVkcyB0byBjaGFuZ2VcbiAgICB9XG4gICAgaWYgKG9iamVjdFRvRGVsZXRlID09PSBcInRvZG9cIikge1xuICAgICAgUHJvamVjdE1hbmFnZXIucmVtb3ZlVG9kb0Zyb21TZWxlY3RlZFByb2plY3Qob2JqZWN0SUQpO1xuICAgICAgcGFyZW50TGkucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coUHJvamVjdE1hbmFnZXIuZ2V0UHJvamVjdHMoKSk7XG4gIH07XG4gIGFwcENvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZVNlbGVjdGVkSXRlbSk7XG5cbiAgY29uc3Qgc2hvd1NlbGVjdGVkR3JvdXAgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBsaXN0R3JvdXBTZWxlY3Rpb24gPSBldmVudC50YXJnZXQuY2xvc2VzdChcImxpXCIpO1xuICAgIGlmIChsaXN0R3JvdXBTZWxlY3Rpb24gIT09IHByZXZpb3VzTGlzdEdyb3VwU2VsZWN0aW9uKSB7XG4gICAgICBjb25zdCBwcm9qZWN0SUQgPSArbGlzdEdyb3VwU2VsZWN0aW9uLmRhdGFzZXQucHJvamVjdDtcbiAgICAgIFByb2plY3RNYW5hZ2VyLnNldFNlbGVjdGVkUHJvamVjdChwcm9qZWN0SUQpOyAvL3JlbmFtZSB3aGVuIHlvdSBhZGQgdGhlIG90aGVyIGdyb3Vwc1xuICAgICAgcmVuZGVyU2VsZWN0ZWRHcm91cCgpOyAvLyd0b2RheScsICdpbXBvcnRhbnQnIGV0Yy5cbiAgICAgIHByZXZpb3VzTGlzdEdyb3VwU2VsZWN0aW9uID0gbGlzdEdyb3VwU2VsZWN0aW9uO1xuICAgIH1cbiAgfTtcbiAgcHJvamVjdHNMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzaG93U2VsZWN0ZWRHcm91cCk7XG5cbiAgY29uc3QgdG9nZ2xlQnRuVG9kb1Byb3BlcnR5ID0gKGV2ZW50KSA9PiB7XG4gICAgbGV0IHRvZG9Qcm9wZXJ0eSA9IGRldGVybWluZVRvZG9Qcm9wZXJ0eShldmVudCk7XG5cbiAgICBpZiAodG9kb1Byb3BlcnR5KSB7XG4gICAgICBjb25zdCBidG4gPSBldmVudC50YXJnZXQ7XG4gICAgICBjb25zdCB0b2RvSUQgPSArYnRuLnBhcmVudEVsZW1lbnQuZGF0YXNldC50b2RvO1xuICAgICAgUHJvamVjdE1hbmFnZXIuZ2V0U2VsZWN0ZWRQcm9qZWN0KCkudG9nZ2xlVG9kb0Jvb2xQcm9wZXJ0eShcbiAgICAgICAgdG9kb0lELFxuICAgICAgICB0b2RvUHJvcGVydHlcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhQcm9qZWN0TWFuYWdlci5nZXRTZWxlY3RlZFByb2plY3QoKSk7XG4gICAgfVxuICB9O1xuICBhcHBDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVCdG5Ub2RvUHJvcGVydHkpO1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyUHJvamVjdHNMaXN0LFxuICAgIHJlbmRlclNlbGVjdGVkR3JvdXAsXG4gICAgYWRkTGF0ZXN0SXRlbSxcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFRvZG9VSU1hbmFnZXI7XG5cbmZ1bmN0aW9uIGRldGVybWluZVRvZG9Qcm9wZXJ0eShldmVudCkge1xuICBsZXQgdG9kb1Byb3BlcnR5ID0gbnVsbDtcbiAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b2dnbGUtY29tcGxldGUtYnRuXCIpKVxuICAgIHRvZG9Qcm9wZXJ0eSA9IFwiaXNDb21wbGV0ZWRcIjtcbiAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b2dnbGUtaW1wb3J0YW50LWJ0blwiKSlcbiAgICB0b2RvUHJvcGVydHkgPSBcImlzSW1wb3J0YW50XCI7XG4gIHJldHVybiB0b2RvUHJvcGVydHk7XG59XG5cbmZ1bmN0aW9uIGRldGVybWluZVRvZG9PclByb2plY3QoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWxldGUtaXRlbVwiKSkge1xuICAgIGNvbnN0IGJ0biA9IGV2ZW50LnRhcmdldDtcbiAgICBjb25zdCBwYXJlbnRMaSA9IGJ0bi5jbG9zZXN0KFwibGlcIik7XG4gICAgY29uc3QgcGFyZW50T2JqZWN0RGF0YXNldCA9IHBhcmVudExpLmRhdGFzZXQ7XG4gICAgY29uc3Qgb2JqZWN0VG9EZWxldGUgPSBPYmplY3Qua2V5cyhwYXJlbnRPYmplY3REYXRhc2V0KVswXTtcbiAgICBjb25zdCBvYmplY3RJRCA9ICtPYmplY3QudmFsdWVzKHBhcmVudE9iamVjdERhdGFzZXQpWzBdO1xuICAgIHJldHVybiBbb2JqZWN0VG9EZWxldGUsIG9iamVjdElELCBwYXJlbnRMaV07XG4gIH1cbiAgcmV0dXJuIFtudWxsLCBudWxsXTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSFRNTENvbnRlbnQoZWxlbWVudCkge1xuICBlbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG59XG4iLCJpbXBvcnQgY3JlYXRlRWxlbWVudCBmcm9tIFwiLi9jcmVhdGVFbGVtZW50LmpzXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VHcm91cEhUTUwocHJvamVjdE9iaikge1xuICBjb25zdCBoMSA9IGNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBcInRlc3RcIiwgXCJncm91cGluZy10aXRsZVwiKTtcbiAgaDEudGV4dENvbnRlbnQgPVxuICAgIHByb2plY3RPYmo/LnRpdGxlID8/IFwiRGVmYXVsdCBUaXRsZVwiOyAvKiBwcm9qZWN0cyBtdXN0IGhhdmUgdGl0bGVcbiAgc28gZ2V0IHJpZCBvZiB0aGlzIGxpbmUgKi9cbiAgLyogZ2V0IHRpdGxlIGZyb20gbGkgdGhhdCBjYWxsZWQgaXQ/ICovXG5cbiAgY29uc3QgbGlzdCA9IGNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBcInRlc3QyXCIsIFwiY3Vyci1ncm91cGluZy10b2Rvc1wiKTtcblxuICByZXR1cm4gW2gxLCBsaXN0XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQmFzZUdyb3VwSFRNTDtcbiIsImZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSA9IFwiZGl2XCIsIGNsYXNzbmFtZSA9IFwiXCIsIGlkID0gXCJcIikge1xuICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICBpZiAoY2xhc3NuYW1lKSBlbGUuY2xhc3NMaXN0LmFkZChjbGFzc25hbWUpO1xuICBpZiAoaWQpIGVsZS5pZCA9IGlkO1xuICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbGVtZW50O1xuIiwiaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSBcIi4vY3JlYXRlRWxlbWVudC5qc1wiO1xuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbUZyb21PYmplY3Qob2JqZWN0KSB7XG4gIGNvbnN0IFtvYmpJRCwgaWRUYWddID0gZ2V0T2JqZWN0SURBbmRUYWcob2JqZWN0KTtcblxuICBjb25zdCBsaSA9IGNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgbGkuZGF0YXNldFtpZFRhZ10gPSBvYmpJRDtcblxuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgLyogY29uc29sZS5sb2coa2V5ICsgXCI6IFwiICsgdmFsdWUpOyAqL1xuICAgIGlmIChrZXkgPT09IFwidGl0bGVcIikge1xuICAgICAgY29uc3QgaGVhZGluZyA9IGNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgIGxpLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09IFwiZGVzY3JpcHRpb25cIikge1xuICAgICAgY29uc3QgcCA9IGNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgcC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgbGkuYXBwZW5kQ2hpbGQocCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShcInRvZG9JRFwiKSkge1xuICAgIC8qIHVzZSBvcmRlciB0byBwbGFjZSBjb21wbGV0ZUJ0biBhbGwgdGhlIHdheSB0byBsZWZ0IGluIGxpICovXG4gICAgY29uc3QgY2hlY2tDb21wbGV0ZUJ0biA9IGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgXCJ0b2dnbGUtY29tcGxldGUtYnRuXCIpO1xuICAgIGNoZWNrQ29tcGxldGVCdG4udGV4dENvbnRlbnQgPSBcIk1hcmsgY29tcGxldGVcIjsgLyogbWFrZSBzZXAgZm4gKi9cbiAgICBsaS5hcHBlbmRDaGlsZChjaGVja0NvbXBsZXRlQnRuKTtcblxuICAgIGNvbnN0IGNoZWNrSW1wb3J0YW50QnRuID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCBcInRvZ2dsZS1pbXBvcnRhbnQtYnRuXCIpO1xuICAgIGNoZWNrSW1wb3J0YW50QnRuLnRleHRDb250ZW50ID0gXCJNYXJrIGltcG9ydGFudFwiOyAvKiBtYWtlIHNlcCBmbiAqL1xuICAgIGxpLmFwcGVuZENoaWxkKGNoZWNrSW1wb3J0YW50QnRuKTtcbiAgfVxuXG4gIGNvbnN0IGVkaXRDb250YWluZXIgPSBjcmVhdGVFZGl0Q29udGFpbmVyKCk7XG4gIGxpLmFwcGVuZENoaWxkKGVkaXRDb250YWluZXIpO1xuXG4gIHJldHVybiBsaTsgLyogbG90cyBvZiByZXBlYXRpbmcgYXBwZW5kQ0hpbGRpbmcgKi9cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTGlzdEl0ZW1Gcm9tT2JqZWN0O1xuXG5mdW5jdGlvbiBjcmVhdGVFZGl0Q29udGFpbmVyKCkge1xuICBjb25zdCBlZGl0Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImVkaXQtY29udGFpbmVyXCIpO1xuICBjb25zdCBlZGl0QnRuID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCBcImVkaXQtaXRlbVwiKTtcbiAgZWRpdEJ0bi50ZXh0Q29udGVudCA9IFwiRWRpdFwiO1xuICBjb25zdCBkZWxldGVCdG4gPSBjcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIFwiZGVsZXRlLWl0ZW1cIik7XG4gIGRlbGV0ZUJ0bi50ZXh0Q29udGVudCA9IFwiRGVsZXRlXCI7XG4gIGVkaXRDb250YWluZXIuYXBwZW5kKGVkaXRCdG4sIGRlbGV0ZUJ0bik7XG5cbiAgcmV0dXJuIGVkaXRDb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGdldE9iamVjdElEQW5kVGFnKG9iamVjdCkge1xuICBjb25zdCBrZXkxID0gXCJwcm9qZWN0SURcIjtcbiAgY29uc3Qga2V5MiA9IFwidG9kb0lEXCI7XG4gIGNvbnN0IG9iaklEID0gb2JqZWN0Lmhhc093blByb3BlcnR5KGtleTEpXG4gICAgPyBvYmplY3QucHJvamVjdElEXG4gICAgOiBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5MilcbiAgICA/IG9iamVjdC50b2RvSURcbiAgICA6IG51bGw7XG5cbiAgY29uc3QgaWRUYWcgPSBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5MSlcbiAgICA/IFwicHJvamVjdFwiXG4gICAgOiBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5MilcbiAgICA/IFwidG9kb1wiXG4gICAgOiBudWxsO1xuXG4gIHJldHVybiBbb2JqSUQsIGlkVGFnXTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiY29uc3QgbG9nID0gY29uc29sZS5sb2c7XG5pbXBvcnQgRm9ybU1hbmFnZXIgZnJvbSBcIi4vbW9kdWxlcy9Gb3JtTWFuYWdlci5qc1wiO1xuaW1wb3J0IFByb2plY3RNYW5hZ2VyIGZyb20gXCIuL21vZHVsZXMvUHJvamVjdE1hbmFnZXIuanNcIjtcbmltcG9ydCBUb2RvVUlNYW5hZ2VyIGZyb20gXCIuL21vZHVsZXMvVG9kb1VJTWFuYWdlci5qc1wiO1xubG9nKFByb2plY3RNYW5hZ2VyKTtcblByb2plY3RNYW5hZ2VyLmFkZFByb2plY3QoeyB0aXRsZTogXCJSZWZ1cm5pc2ggSG9tZVwiIH0pO1xuUHJvamVjdE1hbmFnZXIuYWRkUHJvamVjdCh7IHRpdGxlOiBcIlBhaW50IFdhbGxzXCIgfSk7XG5Qcm9qZWN0TWFuYWdlci5zZXRTZWxlY3RlZFByb2plY3QoMCk7XG5Qcm9qZWN0TWFuYWdlci5hZGRUb2RvVG9TZWxlY3RlZFByb2plY3Qoe1xuICB0aXRsZTogXCJtb3ZlIHNvZmFcIixcbiAgZGVzY3JpcHRpb246IFwibGlmdCBkb250IGRyYWdcIixcbn0pO1xuUHJvamVjdE1hbmFnZXIuYWRkVG9kb1RvU2VsZWN0ZWRQcm9qZWN0KHtcbiAgdGl0bGU6IFwibW92ZSB0YWJsZVwiLFxuICBkZXNjcmlwdGlvbjogXCJkcmFnIGl0IHJvdWdobHlcIixcbn0pO1xuUHJvamVjdE1hbmFnZXIuc2V0U2VsZWN0ZWRQcm9qZWN0KDEpO1xuUHJvamVjdE1hbmFnZXIuYWRkVG9kb1RvU2VsZWN0ZWRQcm9qZWN0KHtcbiAgdGl0bGU6IFwiYnV5IHBhaW50XCIsXG4gIGRlc2NyaXB0aW9uOiBcIm1peCBpdCB3ZWxsIGJlZm9yZSBhcHBseWluZ1wiLFxufSk7XG5Qcm9qZWN0TWFuYWdlci5hZGRUb2RvVG9TZWxlY3RlZFByb2plY3Qoe1xuICB0aXRsZTogXCJidXkgYnJ1c2hcIixcbn0pO1xubG9nKFByb2plY3RNYW5hZ2VyLmdldFByb2plY3RzKCkpO1xuVG9kb1VJTWFuYWdlci5yZW5kZXJQcm9qZWN0c0xpc3QoXCJwcm9qZWN0c1wiKTtcblRvZG9VSU1hbmFnZXIucmVuZGVyU2VsZWN0ZWRHcm91cChcInRvZG9zXCIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9