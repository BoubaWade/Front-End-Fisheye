const header = document.querySelector("header");
const main = document.querySelector("main");
const contactButton = document.querySelector(".contact_button");

const closeModalButton = document.querySelector(".close_modal");
const contactModal = document.getElementById("contact_modal");
const h2Modal = document.querySelector(".modal h2");
const backgroundModalOpen = document.querySelector(".background_modal_open");

function displayModal() {
  contactModal.style.display = "block";
  backgroundModalOpen.classList.add("overlay");
  main.setAttribute("aria-hidden", "true");
  main.setAttribute("tabindex", "-1");

  header.setAttribute("aria-hidden", "true");
  header.setAttribute("tabindex", "-1");

  contactModal.setAttribute("aria-hidden", "false");
  contactModal.setAttribute("tabindex", "0");
  closeModalButton.focus();
}
contactButton.addEventListener("click", displayModal);

function closeModal() {
  contactModal.style.display = "none";
  backgroundModalOpen.classList.remove("overlay");
  contactModal.setAttribute("aria-hidden", "true");
  contactButton.focus();
}
closeModalButton.addEventListener("click", closeModal);

function handleKeyPress(e) {
  if (e.keyCode === 27) {
    closeModal();
  }
}
contactModal.addEventListener("keydown", handleKeyPress);

closeModalButton.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 || e.keyCode === 32) {
    closeModal();
  }
});

contactModal.addEventListener("keydown", (e) => {
  const focusableElements = contactModal.querySelectorAll(
    'button, [src], input, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});
//  -------------------------------TEST ET VALIDATION DU FORMULAIRE-------------------------------------

const errorFirstNameInput = document.querySelector(".error_first_name_input");
const errorLastNameInput = document.querySelector(".error_last_name_input");
const errorEmailInput = document.querySelector(".error_email_input");
const errorMessageInput = document.querySelector(".error_message_input");

let firstNameOutput, lastNameOutput, emailOutput, messageOutput;

// Fonction verifiant si le prénom est valide
const inputFirst = document.getElementById("first");

function firstNameChecker(value) {
  if (value == "" || value.length < 2) {
    inputFirst.style.outlineColor = "red";
    errorFirstNameInput.textContent =
      "Le prénom doit avoir minimum 2 caractères!";
    firstNameOutput = null;
  } else if (!/^[A-Z a-z]{2,100}$/.test(value)) {
    errorFirstNameInput.textContent =
      "Le prénom ne doit pas contenir de caractères spéciaux!";
    firstNameOutput = null;
  } else {
    inputFirst.style.outlineColor = "";
    errorFirstNameInput.textContent = "";
    firstNameOutput = value.toLowerCase();
  }
}
inputFirst.addEventListener("input", (e) => {
  firstNameChecker(e.target.value);
});

// Fonction verifiant si le nom est valide
function lastNameChecker(value) {
  if (value == "" || value.length < 2) {
    inputLast.style.outlineColor = "red";
    errorLastNameInput.textContent = "Le nom doit avoir minimum 2 caractères!";
    lastNameOutput = null;
  } else if (!/^[A-Z a-z]{2,100}$/.test(value)) {
    errorLastNameInput.textContent =
      "Le nom ne doit pas contenir de caractères spéciaux!";
    lastNameOutput = null;
  } else {
    inputLast.style.outlineColor = "";
    errorLastNameInput.textContent = "";
    lastNameOutput = value.toUpperCase();
  }
}
const inputLast = document.getElementById("last");
inputLast.addEventListener("input", (e) => {
  lastNameChecker(e.target.value);
});

// Fonction verifiant si l'email est valide
function emailChecker(value) {
  if (value == "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    inputEmail.style.outlineColor = "red";
    errorEmailInput.textContent = "E-mail non valide!";
    emailOutput = null;
  } else {
    inputEmail.style.outlineColor = "";
    errorEmailInput.textContent = "";
    emailOutput = value;
  }
}
const inputEmail = document.getElementById("email");
inputEmail.addEventListener("input", (e) => {
  emailChecker(e.target.value);
});

// Fonction verifiant si le message respecte les conditions
function messageChecker(value) {
  if (value == "" || value.length < 200) {
    inputMessage.style.outlineColor = "red";
    errorMessageInput.textContent =
      "Le message doit avoir minimum 200 caractères!";
    messageOutput = null;
  } else {
    inputMessage.style.outlineColor = "";
    errorMessageInput.textContent = "";
    messageOutput = value;
  }
}
const inputMessage = document.getElementById("message");
inputMessage.addEventListener("input", (e) => {
  messageChecker(e.target.value);
});

// Validation du formulaire
const form = document.querySelector("#contact_modal form");

function validate(e) {
  e.preventDefault();
  if (firstNameOutput && lastNameOutput && emailOutput && messageOutput) {
    const objectOutput = {
      firstNameOutput,
      lastNameOutput,
      emailOutput,
      messageOutput,
    };
    console.log(objectOutput);
    const inputs = document.querySelectorAll("#contact_modal input, textarea");

    inputs.forEach((input) => {
      input.value = "";
    });
    firstNameOutput = null;
    lastNameOutput = null;
    emailOutput = null;
    messageOutput = null;

    form.innerHTML = "";
    h2Modal.innerHTML = "";
    const validationConfirm = document.querySelector(".validation_confirm");
    validationConfirm.innerHTML = "Message envoyé";
  } else {
    const textFormInvalid = document.querySelector(".text-form-invalid");
    textFormInvalid.textContent = "Veuillez bien remplir le formulaire";
  }
}
form.addEventListener("submit", validate);
