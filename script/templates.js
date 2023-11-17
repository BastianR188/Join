/**
 * renders the buttons for contactEdit
 * @param {number} index
 * @returns {HTML} Template
 */
function renderContactEdit(index) {
  return `
    <button class="btn_save flex-box-centered" id="edit-btn" onClick="updateContact(${index}), toggleClass('contact-edit', 'show')">
      <b>Save</b>
      <img src="./assets/icons/checkmark.svg">
    </button>
    <button class="btn_delete" onclick="deleteContact('${index}', clearInfo()), toggleClass('contact-edit', 'show')">
      Delete
    </button>
  `;
}

/**
 * resets various inputs from tasks
 */
function resetFormTasks() {
  document.getElementById("add-initials").innerHTML = "";
  document.getElementById("printSubtasks").innerHTML = "";
  document.getElementById("assignee").innerHTML = `Select contacts to assign`;
  document.getElementById("category").innerHTML = `Select task category`;
}

/**
 * renders the first letter in the contact list
 * @param {string} initialLetter
 * @returns {HTML} Template
 */
function renderInitialLetter(initialLetter) {
  return `<div class="contact_letter font_normal">${initialLetter}</div><div class="parting_line"></div>`;
}

/**
 * generates HTML for contact information
 * @param {Array} element - contactData
 * @param {number} i - index
 * @returns {HTML} Template
 */

/**
 * renders the individual contacts
 * @param {Array} contact
 * @param {number} id - index
 * @returns {HTML} Template
 */
function editContaktList(contact, id) {
  return `
    <button onclick="showContactInformation('${contact.id}'), toggleClass('contact-info', 'show_info'), toggleClass('list-main', 'overflow_hidden'), toggleClass('contact-more', 'd-none')" class="contact">
      <div class="circle" id="${id}"></div>
      <div class="contact_overview">    
          <div>${contact.name}</div>
          <div class="mail" href="${contact.email}">${contact.email}</div>
      </div>
    </button>
  `;
}

/**
 * renders short info into contact info
 * @returns {any}
 */
function renderTextInfo() {
  return `<div>Contact Information</div>`;
}

/**
 * renders the circle from the user in contact
 * @returns {any}
 */
function renderCircel() {
  return `<div class="circle_info flex-box-centered" id="circle-info"></div>`;
}

/**
 * renders the edit and delete buttons in contact info
 * @param {any} i - the id to identify the respective user
 * @returns {any}
 */
function renderDrop(i) {
  return `
    <div class="contact_info_editbar p-8" onclick="toggleClass('contact-edit', 'show'), fillEdit('${i}')">
        <img src="./assets/icons/create.svg" class="contact_info_icon">
        <img src="./assets/icons/edit.svg" class="contact_info_icon, hover_image">
        <span>Edit</span>
    </div>
    <div class="contact_info_editbar p-8" onclick="deleteContact('${i}'), clearInfo(), toggleClass('contact-info', 'show_info'), toggleClass('list-main', 'overflow_hidden'), toggleClass('contact-more', 'd-none')">
        <img src="./assets/icons/trash.svg" class="contact_info_icon">
        <img src="./assets/icons/delete.svg" class="contact_info_icon, hover_image">
        <span>Delete</span>
    </div>
  `;
}

/**
 * renders in contact info from the respective contact
 * @param {any} i
 * @returns {any}
 */
function renderEdit(i) {
  return `
    <div class="contact_info_editbar" onclick="toggleClass('contact-edit', 'show'), fillEdit('${i}')">
        <img src="./assets/icons/create.svg" class="contact_info_icon">
        <img src="./assets/icons/edit.svg" class="contact_info_icon, hover_image">
        <span>Edit</span>
    </div>
    <div class="contact_info_editbar contact_info_iconbar" onclick="deleteContact('${i}', clearInfo())">
        <img src="./assets/icons/trash.svg" class="contact_info_icon">
        <img src="./assets/icons/delete.svg" class="contact_info_icon, hover_image">
        <span>Delete</span>
    </div>
  `;
}

/**
 * renders the mail in contact info
 * @param {any} element
 * @returns {any}
 */
function renderMail(element) {
  return `
    <div class="contact_email">
      <b>Email</b>
    </div>
    <a class="mail phone" href="mailto:${element.email}">${element.email}</a>
  `;
}

/**
 * renders the phone in contact info 
 * @param {any} element
 * @returns {any}
 */
function renderPhone(element) {
  if (element.phone.length > 1) {
    return `
      <div class="contact_phone">
        <b>Phone</b>
      </div>
      <a class="phone" href="tel:${element.phone}">${formattedPhone(
      element.phone
    )}</a>
    `;
  }
  return ``;
}

//HTML template functions for add-task

/**
 * generates the HTML for the contactlist in field Assignee on the add-task site
 * @param {Array} element
 * @param {number} index
 */
function showContactlist(element, index, selected, src) {
  if (element.disabled == false) {
    document.getElementById("users").innerHTML += `
      <div id="${element.id}" class="dflex-row assignee-box ${selected}" onclick="addAssigneeToTask('${element.id}')">
        <div class="initial-icon" id="initial-${index}"></div>
        <span>${element.name}</span>
        <img id="img-${element.id}" src="${src}">
      </div>
    `;

    addCircleInitial(element, "initial-" + index);
  }
}

/**
 * generates the HTML icons for the added subtask to delete or edit on the add-task site
 * @param {number} id
 */
function showIconsInAddedSubtask(id) {
  document.getElementById("printSubtasks").innerHTML = `
    <div class="list-subtasks edit-subtask">
      <input type="text" class="input-text" value="${addedSubtasks[id].subtask}" id="edit-field"/>
      <div class="list-subtasks">
        <img class="pointer" src="./assets/icons/checkmark-dark.svg" onclick="saveEditSubtask(${id})"/>
        <div class="middle-line"></div>
        <img class="pointer" src="./assets/icons/trash.svg" onclick="deleteSubtask(${id})"/>
      </div> 
    </div>
  `;
}

/**
 * shows the added subtasks below subtask input field
 * @param {number} i
 * @param {string} element
 */
function showAddedSubTasks(i, element) {
  document.getElementById("printSubtasks").innerHTML += `
    <div class="list-subtasks subtask">
      <li class="list-points" id=${i}>${element.subtask}</li>
      <div class="list-subtasks">
        <img class="pointer subtask-icons" src="./assets/icons/edit-dark.svg" onclick="editSubtask(${i})"/>
        <div class="middle-line"></div>
        <img class="pointer subtask-icons" src="./assets/icons/trash.svg" onclick="deleteSubtask(${i})"/>
      </div> 
    </div>
  `;
}

/**
 * generates the HTML icons for the subtask input field on the add-task site
 */
function showIconsInSubtaskInput() {
  document.getElementById("insertfield-subtask").innerHTML = `
    <input type="text" id="subtask-field"/>
      <div class="subtask-icons">
      <img src="./assets/icons/close.svg" onclick="closeSubtask()"/>
      <div class="middle-line"></div>
      <img src="./assets/icons/checkmark-dark.svg" onclick="addSubtask()"/>
    </div>
  `;
}

/**
 * resets the urgent button
 */
function resetPrioButtonUrgent() {
  document.getElementById("prio-urgent").classList.remove("activatePrioUrgent");
  document
    .getElementById("logo-urgent")
    .setAttribute("src", "./assets/icons/prio-urgent-orange.svg");
}

/**
 * resets the medium button
 */
function resetPrioButtonMedium() {
  document.getElementById("prio-medium").classList.remove("activatePrioMedium");
  document
    .getElementById("logo-medium")
    .setAttribute("src", "./assets/icons/prio-medium-yellow.svg");
}

/**
 * resets the low button
 */
function resetPrioButtonLow() {
  document.getElementById("prio-low").classList.remove("activatePrioLow");
  document
    .getElementById("logo-low")
    .setAttribute("src", "./assets/icons/prio-low-green.svg");
}

/**
 * sets the urgent button
 */
function setPrioButtonUrgent() {
  document.getElementById("prio-urgent").classList.add("activatePrioUrgent");
  document
    .getElementById("logo-urgent")
    .setAttribute("src", "./assets/icons/prio-urgent.svg");
}

/**
 * sets the medium button
 */
function setPrioButtonMedium() {
  document.getElementById("prio-medium").classList.add("activatePrioMedium");
  document
    .getElementById("logo-medium")
    .setAttribute("src", "./assets/icons/prio-medium.svg");
}

/**
 * sets the low button
 */
function setPrioButtonLow() {
  document.getElementById("prio-low").classList.add("activatePrioLow");
  document
    .getElementById("logo-low")
    .setAttribute("src", "./assets/icons/prio-low.svg");
}

/**
 * Resets the prio fields in html
 */
function resetPrioFieldHtml() {
  const urgentButton = document.getElementById("prio-urgent");
  const mediumButton = document.getElementById("prio-medium");
  const lowButton = document.getElementById("prio-low");
  const logoUrgent = document.getElementById("logo-urgent");
  const logoMedium = document.getElementById("logo-medium");
  const logoLow = document.getElementById("logo-low");

  urgentButton.classList.remove("activatePrioUrgent");
  mediumButton.classList.remove("activatePrioMedium");
  lowButton.classList.remove("activatePrioLow");

  logoUrgent.setAttribute("src", "./assets/icons/prio-urgent-orange.svg");
  logoMedium.setAttribute("src", "./assets/icons/prio-medium-yellow.svg");
  logoLow.setAttribute("src", "./assets/icons/prio-low-green.svg");
}

// HTML templates for board.html
// ===========================================================================================

/**
 * Generates the section containers where the tasks are placed according to their section status.
 * @param {string} section - Name of section
 * @param {number} i - Index of the section within the sections array.
 * @returns {HTML} Template for board.html
 */
function generateSectionHTML(section, i) {
  return `
  
  
    <div id="section${i}" class="section">
    <div class="sec-bar mobile">
    <span>${section}</span>
    <a id="add-task-button${i}" onclick ='showAddTask(${i})' class="add-task-button c-pointer">
      <svg class="svg-plus" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Capa 1">
        <g id="Group 11">
        <path id="Vector 13" class="svg-plus" d="M9 1.5V16.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
        <path id="Vector 14" class="svg-plus" d="M16.5 9.1416L1.5 9.1416" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
        </g>
        </g>
      </svg>
    </a>
  </div>
      <div id="drop-area${i}" class="drop-area" ondrop="moveTo('${section}')" ondragover="allowDrop(event); highlight('drop-area${i}')" ondragleave="removeHighlight('drop-area${i}')" >
        <div id="sec-default${i}"></div>
        <div  id="tasks${i}" class="sec-tasks"></div>
      </div>
    </div>
  `;
}

/**
 * Generates the Add Task form when called form board page.
 * @param {number} sectionIndex - Index of the section within the sections array.
 * @returns {HTML} Template for board.html
 */
function generateShowAddTaskHTML(sectionIndex) {
  return `
    <div class="show-add-task" >
      <div class="show-add-task-header">
          <span class="headline">Add Task</span>
          <img class="c-pointer" onclick="closeModalBox()" src="./assets/icons/close.svg" alt="">
      </div>
      <div data-include-html='./assets/templates/task-form.html'></div>
    </div>
  `;
}

/**
 * Generates the task shown in a section on the board.
 * @param {string{}} task - task json with all information
 * @returns {HTML} Template for generateSectionHTML()
 */
function generateTaskHTML(task) {
  return `
    <div draggable="true" ondragstart="startDragging(${task.id})" class="task c-pointer">
      <div class="task-content">
        <div class="task-header">
          <div id="category${task.id}" class="category" style="">${task.category}</div>
          <div class="up-down">
          <div onclick="taskUpDown(${task.id},1)" id="up${task.id}">↑</div>
          <div onclick="taskUpDown(${task.id},0)" id="down${task.id}">↓</div>
          </div>
        </div>
        <div class="task-content" onclick="showTaskDetails(${task.id})">
          <div>
            <p class="title">${task.title}</p>
            <div class="description">${task.description}</div>
          </div>
          <div id="progress-bar${task.id}" class="progress-bar"></div>
          <div class="task-footer">
            <div id="contact-icons${task.id}" class="contacts"></div>
            <div id="priority${task.id}" class="prio"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the 'No tasks in..' default card, when no tasks are in one section.
 * @param {string} section - Section name
 * @returns {HTML} Template for generateSectionHTML()
 */
function generateDefaultTaskHTML(section) {
  return `<div class="sec-default">No tasks ${section}</div>`;
}

/**
 * Generates the parent div where the icons are generated in.
 * @param {number} taskId - Id of the task
 * @param {number} listIndex - Index of the assignee in the list
 * @returns {HTML} Template for generateTaskHTML()
 */
function generateContactIconContainerHTML(taskId, listIndex) {
  return `<div id="icon${taskId}${listIndex}"></div>`;
}

/**
 * renders the initials of the contactlist
 */
function renderAddUser() {
  document.getElementById("add-initials").innerHTML = '';
  for (let i = 0; i < addedAssignees.length; i++) {
    user = findUserById(addedAssignees[i], contacts);
    document.getElementById("add-initials").innerHTML += `<div class="initial-icon" style="background-color: var(--profile-color-${user.color}">${user.initials}</div>`;
  }
}

/**
 * Rebuild the Subtaskfield in standard look
 */
function closeSubtask() {
  let insertfield = document.getElementById("insertfield-subtask");
  renderSubtasks();
  insertfield.classList.remove("activeSubtaskField");

  insertfield.innerHTML = `
    <input type="text" id="subtask-field" placeholder="Add new subtask" onclick="insertSubtask()"/>
      <img src="./assets/icons/capa 1 dark.svg" onclick="insertSubtask()"/>
  `;
}

/**
 * Generates the progress bar HTML elements for the task card.
 * @param {number} numberTasks - Number of subtasks
 * @param {number} numberFinishedTasks - Number of finished subtasks
 * @param {number} percent - Percentage of finished subtasks
 * @returns {HTML} Template for generateTaskHTML()
 */
function generateProgressBarHTML(numberTasks, numberFinishedTasks, percent) {
  return `
    <div class="bar">
      <div class="progress" style="width:${percent}%"></div>
    </div>
    <div class="subtask">${numberFinishedTasks}/${numberTasks} Subtasks</div>
  `;
}

/**
 * Generates the HTML elements for the detailed task modal.
 * @param {string{}} task - JSON of the task
 * @returns {HTML} Template for board.html
 */
function generateTaskDetailedHTML(task) {
  return `
    <div class="task-detailed" id="task-detailed">
      <div class="task-detailed-header">
        <div id="categoryTaskDetailed${task.id}" class="category" style="">${task.category
    }</div>
        <img class="c-pointer" onclick="closeModalBox()" src="./assets/icons/close.svg" alt="">
      </div>
      <div class="task-detailed-container" id="task-detailed-container">
        <div class="task-detailed-content" id="task-detailed-content">
          <div class="t-detailed-title">${task.title}</div>
          <div class="t-detailed-description">${task.description}</div>
          <div class="due-date">
            <span class="subheader">Due date: </span>
            <div>${dateToIsoString(task.dueDate)}</div>
          </div>
          <div id="priority" class="priority">
            <span class="subheader">Priority: </span>
            <div>${task.priority}</div>
          </div>
          <div class="assigned">
            <span class="subheader">Assigned To:</span>
            <div id="assigened-container"></div>
          </div>
          <div class="subtasks">
            <span class="subheader">Subtasks:</span>
            <div id ="subtask-container"></div>
          </div>
        </div>
        <div id="task-detailed-edit-content" class="task-detailed-edit-content d-none" data-include-html='./assets/templates/task-form.html?taskId=${task.id
    }'></div>
      </div>
      <div id="edit-delete" class="edit-delete">
        <div class="delete c-pointer contact_info_editbar" onclick="deleteTask(${task.id})">
        <img src="./assets/icons/trash.svg" class="contact_info_icon">
        <img src="./assets/icons/delete.svg" class="contact_info_icon, hover_image">
          <span>Delete</span>
        </div>
        <div class="seperator"></div>
        <a onclick="editTask(${task.id})" class="edit c-pointer contact_info_editbar">
        <img src="./assets/icons/create.svg" class="contact_info_icon">
        <img src="./assets/icons/edit.svg" class="contact_info_icon, hover_image">
          <span>Edit</span>
        </a>
      </div>
      <div id="create-clear-btn" class="create-clear-button  d-none">
            <div class="btn-container">
                <button id="clear-btn" type="button" class="clear-btn-3 c-pionter btn-hover clear-button"
                    onclick="closeModalBox()">
                    Clear
                    <div class="icon-24">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="iconoir:cancel">
                                <path id="Vector"
                                    d="M12.0692 12.0001L17.3122 17.2431M6.82617 17.2431L12.0692 12.0001L6.82617
                17.2431ZM17.3122 6.75708L12.0682 12.0001L17.3122 6.75708ZM12.0682 12.0001L6.82617 6.75708L12.0682 12.0001Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </g>
                        </svg>
                    </div>
                </button>
                <button id="create-btn" type="submit" class="create-button dflex-row flex-box-centered">
                    <nobr>Create Task</nobr>
                    <div class="icon-24">
                        <img class="icon-size" src="assets/icons/checkmark.svg" />
                    </div>
                </button>
            </div>
        </div>
    </div>
  `;
}

/**
 * Generates the symbol of the priority of the task.
 * @param {string} priority
 * @returns {HTML} - Template for generateTaskDetailedHTML()
 */
function generatePrioritySymbolHTML(priority) {
  if (priority == "low") priority = "prio-low-green.svg";
  if (priority == "medium") priority = "prio-medium-yellow.svg";
  if (priority == "urgent") priority = "prio-urgent-orange.svg";

  return `<img src="./assets/icons/${priority}" alt="">`;
}

/**
 * Generates HTML elements for the assignees part of the detailed task
 * @param {string} userName
 * @param {number} i - Index of the contact in the assignee list of the task.
 * @returns {HTML} Template for generateTaskDetailedHTML()
 */
function generateAssigneeUserHTML(userName, i) {
  return `
    <div id="contact" class="user">
      <div id="contactIcon${i}"></div>
      <span>${userName}</span>
    </div>
  `;
}

/**
 * Generates HTML elements for the subtasks part of the detailed task
 * @param {number} taskId - Id of the task
 * @param {string} subtask - subtask
 * @param {number} subtaskIndex - Index of the subtask within subtasks list
 * @returns {HTML} Template for generateTaskDetailedHTML()
 */
function generateSubtasksHTML(taskId, subtask, subtaskIndex) {
  let checkbox = "";
  if (subtask.status == 0) checkbox = "checkbox-outline-default.svg";
  if (subtask.status == 1) checkbox = "checkbox-outline-active.svg";

  return `
    <div class="subtask c-pointer" onclick="changeStatus(${taskId},${subtaskIndex})">
      <img src="./assets/icons/${checkbox}" alt="">
      <span>${subtask.subtask}</span>
    </div>
  `;
}
