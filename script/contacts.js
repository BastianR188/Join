let groupedContacts = {};

/**
 * loads the contacts and renders it
 * @returns {any}
 */
async function init() {
  checkCookieValueInContacts("./login.html");

  await includeHTML();
  setActiveTab();
  setBadgeInitial();

  await loadContactsFromServer();
  render();
}

document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    let contactAdd = document.getElementById('contact-add');
    let contactInputField = document.getElementById('contactInputField');
    if (!contactInputField) {
      if (contactAdd && contactAdd.classList.contains('show')) {
        toggleClass('contact-add', 'show'), cancelAdd('Add')
      }
    }
    let contactEdit = document.getElementById('contact-edit');
    if (contactEdit && contactEdit.classList.contains('show')) {
      toggleClass('contact-edit', 'show'), cancelAdd('Add')
    }
  }
});

document.addEventListener('click', function (event) {
  if (event.target.id === 'contact-add') {
    toggleClass('contact-add', 'show'), cancelAdd('Add')
  }
  if (event.target.id === 'contact-edit') {
    toggleClass('contact-edit', 'show'), cancelAdd('Add')
  }
});

/**
 * renders gets the contacts
 * @returns {any}
 */
function render() {
  sortContacts();
  sortContactsInGroup();
  renderContacts();
}

/**
 * sorts the contacts alphabetically
 * @returns {any}
 */
function sortContacts() {
  contacts.sort((a, b) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * groups the contacts by the main letter
 * @returns {any}
 */
function sortContactsInGroup() {
  groupedContacts = {};
  contacts.forEach((contact) => {
    sortContactInGroup(contact);
  });
}

/**
 * sorts the contacts into alphabetical groups
 * @param {any} contact
 * @returns {any}
 */
function sortContactInGroup(contact) {
  if (!contact.disabled) {
    let initialLetter = contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[initialLetter]) {
      groupedContacts[initialLetter] = [];
    }
    groupedContacts[initialLetter].push(contact);
  }
}

/**
 * renders the contacts
 * @returns {any}
 */
function renderContacts() {
  document.getElementById("contact-list").innerHTML = ``;
  for (let initialLetter in groupedContacts) {
    document.getElementById("contact-list").innerHTML +=
      renderInitialLetter(initialLetter);
    renderForEachContact(initialLetter);
  }
}

/**
 * renders every contact for every main letter
 * @param {any} initialLetter
 * @returns {any}
 */
function renderForEachContact(initialLetter) {
  groupedContacts[initialLetter].forEach((contact, index) => {
    document.getElementById("contact-list").innerHTML += editContaktList(
      contact,
      `contact-circle${initialLetter}${index}`
    );
    addCircleInitial(contact, `contact-circle${initialLetter}${index}`);
  });
}

/**
 * displays the respective contact information when checked
 * @param {any} id
 * @returns {any}
 */
function showContactInformation(id) {
  contacts.forEach((element, i) => {
    if (element.id === id) {
      let renderID = ["namecircle", "nameinfo", "mail", "phone", "editdesk", "drop", "textinfo",];
      let renderData = [renderCircel(), `${element.name}`, renderMail(element), renderPhone(element), renderEdit(i), renderDrop(i), renderTextInfo(),];
      renderID.forEach(function (id, index) {
        document.getElementById(id).innerHTML = renderData[index];
      });
      addCircleInitial(element, "circle-info");
    }
  });
}

/**
 * adds the initials and the color of the contact
 * @param {Array} contact
 * @returns {string} - users initials
 */
function getInitials(contact) {
  const nameArr = contact.name.toUpperCase().split(" ");
  let initials = "";
  if (nameArr.length > 0) {
    initials += nameArr[0].charAt(0);
    if (nameArr.length > 1) {
      initials += nameArr[1].charAt(0);
    }
  }
  return initials;
}

/**
 * deactivates the respective contact
 * @param {any} index
 * @returns {any}
 */
async function deleteContact(index) {
  contacts[index].disabled = true;
  render();
  await storeData("contacts", contacts); // saves the contacts on the server
}

/**
 * clear the details shown
 * @returns {any}
 */
function clearInfo() {
  let elements = ["namecircle", "nameinfo", "mail", "phone", "editdesk", "drop", "textinfo",];
  elements.forEach(function (element) {
    document.getElementById(element).innerHTML = "";
  });
}

/**
 * adds or removes a class from the respective id
 * @param {any} element - the element from id
 * @param {any} className - the class to toggle
 * @returns {any}
 */
function toggleClass(element, className) {
  document.getElementById(element).classList.toggle(className);
}

/**
 * automatically fills the input fields when editing
 * @param {any} index
 * @returns {any}
 */
function fillEdit(index) {
  getFillEdit(index);
  addCircleInitial(contacts[index], "circle_edit");
  document.getElementById("edit-btn").innerHTML = renderContactEdit(index);
}

/**
 * gets the data for the input fields when editing
 * @param {any} index
 * @returns {any}
 */
function getFillEdit(index) {
  document.getElementById("nameEditInput").value = contacts[index].name;
  document.getElementById("phoneEditInput").value = contacts[index].phone;
  document.getElementById("emailEditInput").value = contacts[index].email;
}

/**
 * the respective contact is replaced
 * @param {any} index
 * @returns {any}
 */
async function updateContact(index) {
  let contactData = getContactData(index);
  contacts[index] = contactData;
  render();
  await storeData("contacts", contacts); // saves the contacts on the server
  showContactInformation(contactData.id);
}

/**
 * gets the data for the update contact
 * @param {number} index
 * @returns {Array} - get the user data
 */
function getContactData(index) {
  let contactData = getValue("Edit");
  contactData.id = contacts[index].id;
  if (contacts[index].password) {
    contactData.password = contacts[index].password;
  } else {
    contactData.password = generateUniqueUserID(allUserIDs());
  }
  contactData.disabled = false;
  contactData.color = (getColorNumberFromId(contactData.id) % 14) + 1;
  contactData.initials = getInitials(contactData);
  return contactData;
}

/**
 * gets the color depending on the id
 * @param {any} id
 * @returns {any}
 */
function getColorNumberFromId(id) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    const charCode = id.charCodeAt(i);
    sum += charCode;
  }
  return sum;
}

/**
 * gets the values from the various input fields
 * @param {number} i
 * @returns {Array} - name, phone and email data from new user
 */
function getValue(i) {
  let name = document.getElementById(`name${i}Input`).value;
  let phone = document.getElementById(`phone${i}Input`).value;
  let email = document.getElementById(`email${i}Input`).value;
  name = capitalizeName(name);
  cancelAdd(`${i}`);
  return { name, phone, email };
}

/**
 * capitalize the first letter of the name
 * @param {string} sentence - name from user
 * @returns {string} capitalize name from user
 */
function capitalizeName(sentence) {
  let name = sentence.split(" ");
  for (let i = 0; i < name.length; i++) {
    name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
  }
  return name.join(" ");
}

/**
 * Empties the various input fields
 * @param {any} i
 * @returns {any}
 */
function cancelAdd(i) {
  document.getElementById(`name${i}Input`).value = "";
  document.getElementById(`phone${i}Input`).value = "";
  document.getElementById(`email${i}Input`).value = "";
}

/**
 * saves the new user
 */
async function saveContact() {
  let newContact = getValue("Add");
  if (!checkAlreadyExists(newContact)) {
    await createNewContact(newContact);
  }
  render();
  await storeData("contacts", contacts); // saves the contacts on the server
}

/**
 * creates new contacts
 * @param {Array} newContact - value data from new user
 */
async function createNewContact(newContact) {
  newContact.id = generateUniqueUserID(allUserIDs());
  newContact.password = generateUniqueUserID(allUserIDs());
  newContact.disabled = false;
  newContact.color = (getColorNumberFromId(newContact.id) % 14) + 1;
  newContact.initials = getInitials(newContact);
  contacts.push(newContact);
}

/**
 * returns the id of all users
 */
function allUserIDs() {
  return contacts.map((contact) => contact.id);
}

/**
 * checks whether name and email already exist in contacts
 * @param {Array} newContact - value data from new user
 * @returns {boolean}
 */
function checkAlreadyExists(newContact) {
  return contacts.some((element) => {
    if (newContact.name == element.name && newContact.email == element.email) {
      element.disabled = false;
      return true;
    }
  });
}

// contact confirmed window
function confirmContact(id) {
  toggleClass(id, "show");
  setTimeout(function () {
    toggleClass(id, "show");
  }, 1250);
}

/**
 * formats phone number
 * @param {number} phone
 * @returns {number} - phone number with space
 */
function formattedPhone(phone) {
  if (!phone.includes(" ")) {
    phone = phone.slice(0, 3) + " " + phone.slice(3, 6) + " " + phone.slice(6);
  }
  return phone;
}
