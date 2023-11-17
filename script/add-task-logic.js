/**
 * Opens the drop down menu for the category selection
 */
function dropDownCategory() {
    const categorieField = document.getElementById("categories");
    if (categorieField.classList.contains("d-none")) {
        categorieField.classList.remove("d-none");
        renderCategoryOptions();
    } else {
        closeCategoryDropDown();
    }
}

/**
* closes the categroy drop down menu
*/
function closeCategoryDropDown() {
    const categorieField = document.getElementById("categories");
    categorieField.classList.add("d-none");
}

/**
 * adds or removes a class from the respective id
 * @param {any} element - id of element
 * @param {any} className - className to toggle
 */
function toggleClass(element, className) {
    document.getElementById(element).classList.toggle(className);
}

/**
 * empties the input fields
 */
function cancelAdd() {
    document.getElementById('nameAddInput').innerHTML = '';
    document.getElementById('emailAddInput').innerHTML = '';
    document.getElementById('phoneAddInput').innerHTML = '';
}

/**
 * This function takes the information from the add-task form and creat a task
 */
async function addTask() {
    let actualTask = captureProptertiesOfTask();
    tasks.push(actualTask);
    await storeData("tasks", tasks);
    clearForm();
    try {
        closeModalBox();
    } catch (error) { }

    if (window.location.href.endsWith("board.html")) {
    } else {
        window.location.href = "./board.html";
    }
}

/**
 * Returns the properties of the task input form as a JSON obejct
 * @returns task properties as JSON object
 */
function captureProptertiesOfTask() {
    let title = document.getElementById("titel-field").value;
    let description = document.getElementById("description-field").value;
    let selectedDateISO = document.getElementById("date-field").value;
    let category = document.getElementById("category").innerHTML;
    let actualTask = setActualTask(title, description, selectedDateISO, category);
    return actualTask;
}

/**
 * sets the values for the current task
 */
function setActualTask(title, description, selectedDateISO, category) {
    return {
      id: createTaskId(),
      title: title,
      description: description,
      assignee: addedAssignees,
      priority: actualActivePriority,
      dueDate: changeTimeFormatUnix(selectedDateISO),
      category: category,
      subtasks: addedSubtasks,
      section: sections[catchSectionId()],
    };
  }
  
/**
 * the function returns the index of the section Array for the Task.
 * the index for the section comes either from the url or from the variable sectionId
 * @returns sectionId
 */
function catchSectionId() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSectionId = urlParams.get("sectionId");
    if (urlSectionId) {
      return urlSectionId;
    } else if (sectionId == undefined) {
      sectionId = 0;
      return sectionId;
    } else {
      return sectionId;
    }
  }
  
/**
 * Changes time format from ddmmyyyy in Unix format
 */
function changeTimeFormatUnix(dateIsoFormat) {
    let date = new Date(dateIsoFormat);
    return date.getTime();
  }
 
/**
 * extract the initials from the first and surname
 * @param {string} name
 * @returns the first letter of the first and surname as a string
 */
function extractInitials(name) {
    let names = name.split(" ");
    let firstLetter = names[0].charAt(0);
    let secondLetter = names[1].charAt(0);
  
    return firstLetter + secondLetter;
  }
  
/**
 * searches and finds the user of based on the userid and returns it
 */
function findUserById(id, contacts) {
    const user = contacts.find((contact) => contact.id === id);
    return user;
  }
   
/**
 * extract the value of the downloaded Object from the Server
 * @param {object} promiseObject
 */
async function getValueFromPromise(promiseObject) {
    try {
      const result = await promiseObject;
      tasks = result.data.value;
    } catch (error) {
      console.error(error);
    }
  }
  
/**
 * selects the selected assignees
 */
function selectAssignees(id) {
    const userId = addedAssignees[id];
    const userInformation = contacts.filter((t) => t["id"] == userId)[0];
    if (userInformation.disabled == false) {
      document.getElementById(userId).classList.add("selectedAssignee");
      document.getElementById("img-" + userId).src =
        "./assets/icons/checkbox-outline-active-white.svg";
    }
  }
  
/**
 * this funktion loads a task with the parameter taskId in the task-form.html
 * @param {number} taskId
 */
function loadTaskInAddTaskForm(taskId) {
    let task = tasks.filter((t) => t["id"] == taskId)[0];
    let { title, description, dueDate, category, priority } = setTaskValue(task);
    getValueForTask(title, description, dueDate, category);
    markPrioField(priority);
    renderSubtasks();
    selectAssigneefromExistingTask();
    renderAddUser();
  }
 
/**
 * sets the values for the task
 */
function setTaskValue(task) {
    let id = task.id;
    let title = task.title;
    let description = task.description;
    addedAssignees = task.assignee;
    let priority = task.priority;
    let dueDate = dateToIsoString(task.dueDate);
    let category = task.category;
    addedSubtasks = task.subtasks;
    let section = task.section;
    return { title, description, dueDate, category, priority };
  }
 
/**
 * Saves task with the current informations available in the task form.
 */
async function saveTask() {
    let currentTask = getCurrentTaskData();
    const index = tasks.findIndex((t) => t["id"] == currentTask.id);
    tasks[index] = currentTask;
    await storeData("tasks", tasks);
    cancelTask();
  }
    
/**
 * enters the respective selected date
 */
function setInputToday() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) { dd = "0" + dd; }
    if (mm < 10) { mm = "0" + mm; }
    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("date-field").setAttribute("min", today);
  }
  
/**
 * Prepares the current available information in the task form
 * for saving them as one task in tasks.
 * @returns task in JSON format
 */
function getCurrentTaskData() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = parseInt(urlParams.get("taskId"));
    let title = document.getElementById("titel-field").value;
    let description = document.getElementById("description-field").value;
    let selectedDateISO = document.getElementById("date-field").value;
    let category = document.getElementById("category").innerHTML;
    let actualTask = { id: id, title: title, description: description, assignee: addedAssignees, priority: actualActivePriority, dueDate: changeTimeFormatUnix(selectedDateISO), category: category, subtasks: addedSubtasks, section: sections[catchSectionId()], };
    return actualTask;
  }
  
/**
 * Insert the first added Assignee from the AddTask Form in the Assigned to Field
 */
function showFirstAddedAssigneeInForm() {
    let userId = addedAssignees[0];
    let firstUserName = contacts.filter((t) => t["id"] == userId)[0];
    if (firstUserName == undefined) {
      document.getElementById("assignee").innerHTML = `Select contacts to assign`;
    } else {
      document.getElementById("assignee").innerHTML = `${firstUserName.name}`;
    }
  }
  
/**
 * removes a check mark in contact list when selected and removes it from the array
 */
function unsetCheckbox(userId) {
    document.getElementById("img-" + userId).src =
      "./assets/icons/checkbox-outline-default.svg";
    for (let i = 0; i < addedAssignees.length; i++) {
      if (addedAssignees[i] === userId) {
        addedAssignees.splice(i, 1);
        i--;
      }
    }
  }
  
/**
 * resets the values of the priorities
 */
function resetPrioFields(prioType) {
    if (prioType === "urgent") { resetPrioButtonUrgent(); }
    else if (prioType === "medium") { resetPrioButtonMedium(); }
    else if (prioType === "low") { resetPrioButtonLow(); }
    actualActivePriority = "";
    document.getElementById("prio-required").setAttribute("required", "");
  }
  