let actualActivePriority = "";
let addedAssignees = [];
let isOpenContactList = false;
let addedSubtasks = [];

/**
 * Loads all necessary functions to render the page correctly.
 */
async function renderAddTaskPage() {
  checkCookieValueInContacts("./login.html");
  await includeHTML();
  setActiveTab();
  setBadgeInitial();
  await loadTasksfromBackend();
  await loadContactsFromServer();
  checkEditTaskId();
  setInputToday();
  
}

/**
 * Renders the category options from the constant categories in the drop down menu
 */
function renderCategoryOptions() {
  const categoriesContainer = document.getElementById("categories");
  categoriesContainer.innerHTML = "";
  categories.forEach((element, index) => {
    const spanElement = renderCategoryOption(element, index);

    categoriesContainer.appendChild(spanElement);
  });
}

/**
 * Renders the category options evry single form the constant categories in the drop down menu
 */
function renderCategoryOption(element, index) {
  const spanElement = document.createElement("span");
  spanElement.textContent = element;
  spanElement.id = `category-${index}`;
  spanElement.addEventListener("click", () => {
    const selectedCategory = element;
    document.getElementById("category").innerHTML = selectedCategory;
    document.getElementById("category-required").removeAttribute("required");
    closeCategoryDropDown();
  });
  return spanElement;
}

/**
 * Creats the task id
 * @returns taskId
 */
function createTaskId() {
  let maxId = -1;
  if (tasks.length == 0) {
    return 0;
  }
  for (let i = 0; i < tasks.length; i++) {
    let currentId = tasks[i]["id"];
    if (currentId > maxId) {
      maxId = currentId;
    }
  }
  maxId++;
  return maxId;
}

/**
 * This function highlight the activated Prio Button
 * @param {string} prioType
 */
function markPrioField(prioType) {
  if (prioType === actualActivePriority) {
    resetPrioFields(prioType);
  } else {
    setPrioFields(prioType);
  }
}

/**
 * sets the values of priorities
 */
function setPrioFields(prioType) {
  resetPrioField();
  if (prioType === "urgent") { setPrioButtonUrgent(); actualActivePriority = prioType; }
  else if (prioType === "medium") { setPrioButtonMedium(); actualActivePriority = prioType; }
  else if (prioType === "low") { setPrioButtonLow(); actualActivePriority = prioType; }
  if (actualActivePriority.length > 0) { document.getElementById("prio-required").removeAttribute("required") }
}

/**
 * Resets the prio fields
 */
function resetPrioField() {
  actualActivePriority = "";
  resetPrioFieldHtml();
}

/**
 * resets all Contacts in the Assignee Field
 */
function resetAssigneeField() {
  document.getElementById("contacts").classList.add("dnone");
  document.getElementById("users").innerHTML = ``;
  isOpenContactList = false;
  addedAssignees = [];
}

/**
 * Render the Contacs in the Assignee Field
 */
function renderContacts() {
  let contactDiv = document.getElementById("contacts");
  toggleContactList(contactDiv);

  document.getElementById("users").innerHTML = '';
  contacts.forEach((element, index) => {
    if (addedAssignees.includes(element.id)) {
      showContactlist(element, index, 'selectedAssignee', './assets/icons/checkbox-outline-active-white.svg')
    } else { showContactlist(element, index, '', './assets/icons/checkbox-outline-default.svg') }
  });

}

/**
 * Shows or hides the contact list
 */
function toggleContactList(contactDiv) {
  if (isOpenContactList == false) {
    isOpenContactList = true;
    contactDiv.classList.remove("dnone");
  } else {
    isOpenContactList = false;
    contactDiv.classList.add("dnone");
  }
}

/**
 * Add selected Users to the array AddedUsers
 * @param {string} userId
 */
function addAssigneeToTask(userId) {
  let assignee = document.getElementById(userId).classList;
  assignee.toggle("selectedAssignee");
  if (assignee.contains("selectedAssignee")) {
    setCheckbox(userId);
  } else {
    unsetCheckbox(userId);
  }
  renderAddUser();
  showFirstAddedAssigneeInForm();
}

/**
 * puts a tick in the contact list if selected and pushes it into the array
 * @param {any} userId
 * @returns {any}
 */
function setCheckbox(userId) {
  document.getElementById("img-" + userId).src =
    "./assets/icons/checkbox-outline-active-white.svg";
  addedAssignees.push(userId);
  renderAddUser();
}

/**
 * Change icons by click in Subtaksfield
 */
function insertSubtask() {
  let insertfield = document.getElementById("insertfield-subtask");
  renderSubtasks();
  insertfield.classList.add("activeSubtaskField");
  showIconsInSubtaskInput();
  document.getElementById('subtask-field').focus()
}

/**
 * Stores a newly added subtask in the array addedSubtasks
 */
function addSubtask() {
  let subtask = document.getElementById("subtask-field").value;
  if (subtask != "") {
    addedSubtasks.push({ subtask: subtask, status: 0 });
    renderSubtasks();
    document.getElementById("subtask-field").value = "";
  }
  closeSubtask();
}

/**
 * Renders the added subtasks
 */
function renderSubtasks() {
  const printSubtasksElement = document.getElementById("printSubtasks");
  printSubtasksElement.innerHTML = "";
  for (let i = 0; i < addedSubtasks.length; i++) {
    const element = addedSubtasks[i];
    showAddedSubTasks(i, element);
  }
}

/**
 * Deletes the complete form content
 */
function clearForm() {
  document.getElementById("addTaskForm").reset();
  resetPrioField();
  resetAssigneeField();
  closeCategoryDropDown();
  addedSubtasks = [];
  contactsAlreadyLoaded = false;
  resetFormTasks();
}

/**
 * delete Subtaks from the variable addedSubtasks
 * @param {number} id id of the Subtask position in the variable addedSubtasks
 */
function deleteSubtask(id) {
  addedSubtasks.splice(id, 1);
  renderSubtasks();
}

/**
 * Open des Subtask to edit the text
 * @param {number} id
 */
function editSubtask(id) {
  const printSubtasksElement = document.getElementById("printSubtasks");
  closeSubtask();
  showIconsInAddedSubtask(id);
  document.getElementById('edit-field').focus();
}

/**
 * change the subtask text in the variable addedSubtasks
 * @param {number} id
 */
function saveEditSubtask(id) {
  const editSubtaks = document.getElementById("edit-field").value;
  let actualStatusSubtask = addedSubtasks[id].status;
  addedSubtasks.splice(id, 1, {
    subtask: editSubtaks,
    status: actualStatusSubtask,
  });
  renderSubtasks();
}

/**
 * Add selected Users to the array AddedUsers and show it in the form
 */
function selectAssigneefromExistingTask() {
  renderContacts();
  for (let id = 0; id < addedAssignees.length; id++) {
    selectAssignees(id);
  }
  showFirstAddedAssigneeInForm();
  document.getElementById("contacts").classList.add("dnone");
}

/**
 * gets the values from the input fields
 */
function getValueForTask(title, description, dueDate, category) {
  document.getElementById("titel-field").value = title;
  document.getElementById("description-field").value = description;
  document.getElementById("date-field").value = changeIsoDateInYYYYMMDD(dueDate);
  document.getElementById("category").innerHTML = category;
}

/**
 * This function checks if a task should be edit when loading the page.
 */
function checkEditTaskId() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTaskId = urlParams.get("taskId");
  if (urlTaskId) {
    setEditBtn(urlTaskId);
  }
}

/**
 * replaces the existing buttons with edit buttons
 */
function setEditBtn(urlTaskId) {
  loadTaskInAddTaskForm(urlTaskId);
  let createButton = document.getElementById("create-button");
  createButton.innerHTML = "<nobr>Edit Task</nobr>";
  createButton.type = "button";
  createButton.onclick = saveTask;
  let cancelButton = document.getElementById("clear-button");
  cancelButton.innerHTML = "Cancel";
  cancelButton.onclick = cancelTask;
}

/**
 * Cancels editing a task and links back to board.html.
 */
function cancelTask() {
  window.location.href = `./board.html`;
}
