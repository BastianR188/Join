// =================================================================================================
window.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  checkCookieValueInContacts("./login.html");

  await includeHTML();
  setActiveTab();
  setBadgeInitial();
  initWelcome();
  contacts = await loadContactsFromServer();
  initDashboardElements();
}

/**
 * starts all necessary functions to render the dasboard
 * @returns {any}
 */
async function initDashboardElements() {
  await loadTasksfromBackend();

  const tasksInBoard = countTasksInBoard(tasks);
  const todo = countTasksInSection(tasks, "section", "To do");
  const todoUrgent = countTasksInSection(tasks, "priority", "urgent");
  const inProgress = countTasksInSection(tasks, "section", "In progress");
  const awaitFeedback = countTasksInSection(tasks, "section", "Await feedback");
  const done = countTasksInSection(tasks, "section", "Done");

  changeFieldsOnTop(tasksInBoard, inProgress, awaitFeedback);
  changeFieldsOnMiddle(todoUrgent);
  sort(); 
  renderDate(); 
  changeFieldsOnBottom(todo, done);
}

/**
 * loads the tasks from backend
 */
async function loadTasksfromBackend() {
  let datas = await loadData("tasks");
  tasks = JSON.parse(datas);
}

/**
 * counts the tasks in the section
 * @param {any} data - 
 * @param {any} key
 * @param {any} sectionName
 * @returns {any}
 */
function countTasksInSection(data, key, sectionName) {
  let count = 0;
  validateString(key);
  validateString(sectionName);

  for (const item of data) if (item[key] === sectionName) count++;
  return count;
}

/**
 * counts the tasks
 * @param {any} data
 * @returns {any}
 */
function countTasksInBoard(data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) count++;
  return count;
}

/**
 * updates the cards
 * @param {any} rowElements
 * @param {any} numbers
 * @returns {any}
 */
function updateCardNumbers(rowElements, numbers) {
  rowElements.forEach((rowElement, i) => {
    const numElement = rowElement.querySelector(".card-num");
    if (numElement) numElement.textContent = numbers[i].toString();
  });
}

/**
 * changes and renders the top fields
 * @param {any} todo
 * @param {any} inProgress
 * @param {any} awaitFeedback
 * @returns {any}
 */
function changeFieldsOnTop(todo, inProgress, awaitFeedback) {
  const topRow = document.querySelectorAll('[data-field="top-row"]');
  const nums = [todo, inProgress, awaitFeedback];
  updateCardNumbers(topRow, nums);
}

/**
 * changes and renders the middle fields
 * @param {any} todo
 * @returns {any}
 */
function changeFieldsOnMiddle(todo) {
  const middleRow = document.querySelectorAll('[data-field="middle-row"]');
  const nums = [todo];
  updateCardNumbers(middleRow, nums);
}

/**
 * changes and renders the lower fields
 * @param {any} todo
 * @param {any} done
 * @returns {any}
 */
function changeFieldsOnBottom(todo, done) {
  const bottomRow = document.querySelectorAll('[data-field="bottom-row"]');
  const nums = [todo, done];
  updateCardNumbers(bottomRow, nums);
}

/**
 * sorts the tasks by priority and then by date
 * @returns {any}
 */
function sort() {
  tasks.sort((a, b) => {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    } else {
      return a.dueDate - b.dueDate;
    }
  });
}

/**
 * converts unixTimeStamp and renders date by month, day and year
 * @returns {any}
 */
function getDate() {
  const unixTimeStamp = tasks[0].dueDate;
  const date = new Date(unixTimeStamp);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
}

//                                                    
/**
 * render date    
 * @returns {any}
 */
function renderDate() {
  document.querySelector(".deadline-date").textContent = getDate();
}

/**
 * render the welcome message and animate it
 * @returns {any}
 */
async function initWelcome() {
  const isLogin = localStorage.getItem("alreadyLoggin") === "true";
  const { elements, userName } = await storageManagement();
  if (userName == null) {
    renderGreeting(elements, "", "");
  } else {
    renderGreeting(elements, userName, ",");
  }
  if (isLogin === false) {
    greetingsAnimation();
  } else {
    document.querySelector(".overlay").classList.add("d-none");
  }
}

/**
 * loads name and passes it on
 * @returns {any}
 */
async function storageManagement() {
  localStorage.setItem("alreadyLoggin", true);
  const userID = getCookie("join_user-id");
  let contacts = await loadContactsFromServer();
  const userName = findUserById(userID, contacts);
  const elements = document.querySelectorAll(".greeting-font");
  return { elements, userName };
}

/**
 * search name by id   
 * @param {any} id
 * @param {any} contacts
 * @returns {any}
 */
function findUserById(id, contacts) {
  const user = contacts.find((contact) => contact.id === id);
  return user ? user.name : null;
}

/**
 * welcome animation using CSS
 * @returns {any}
 */
function greetingsAnimation() {
  const overlayClass = document.querySelector(".overlay").classList;
  setTimeout(function () {
    overlayClass.add("hidden");
  }, 1250);
  setTimeout(function () {
    overlayClass.add("end");
  }, 2000);
}

/**
 * rendert welcome
 * @param {any} elements
 * @param {any} loginID
 * @param {any} space
 * @returns {any}
 */
function renderGreeting(elements, loginID, space) {
  elements.forEach((element) => {
    element.innerHTML = `<span>${greetingCurrentTime()}${space}<br><b class="greeting-user">${loginID}</b></span>`;
  });
}

/**
 * renders the greeting depending on the time
 * @returns {any}
 */
function greetingCurrentTime() {
  let hour = new Date().getHours();
  let greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return greeting;
}
