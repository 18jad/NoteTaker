// Variables
const noteContainer = document.querySelector(".note_container");
const modalContainer = document.querySelector(".modal_container");
const modalTitle = document.querySelector(".modal_title");
const modalBody = document.querySelector(".modal_body");
const modalClose = document.querySelector(".modal_button");
const modalId = document.querySelector(".note_id");
const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const noteInput = document.querySelector("#note");
const body = document.querySelector("body");
const modalBg = document.querySelector(".modal_bg");

// Class to create new note
class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = Math.floor(Math.random() * 2000);
  }
}

// Scripts
const addNewNote = (note) => {
  const addedNote = document.createElement("div");
  addedNote.classList.add("note");
  addedNote.innerHTML = `
       <h2 class="note_title">${note.title}</h2>
        <p class="note_body">
          ${note.body}
        </p>
        <div class="note_buttons">
          <button class="note_btn note_view" id="view_btn">View Details</button>
          <button class="note_btn note_delete" id="delete_btn">Delete Note</button>
        </div>
        <span class="id" hidden>${note.id}</span>
    `;
  noteContainer.appendChild(addedNote);
};

const getNotes = () => {
  let notes;
  if (localStorage.getItem("NoteApp.notes") === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem("NoteApp.notes"));
  }
  return notes;
};

const addNoteToLocalStorage = (note) => {
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem("NoteApp.notes", JSON.stringify(notes));
};

const displayNotes = () => {
  const notes = getNotes();
  notes.map((note) => {
    addNewNote(note);
  });
};

const removeNote = (id) => {
  const notes = getNotes();
  notes.map((note, i) => {
    if (note.id === id) {
      notes.splice(i, 1);
    }
    localStorage.setItem("NoteApp.notes", JSON.stringify(notes));
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    titleInput.value.trim() !== "" &&
    noteInput.value.trim() !== "" &&
    titleInput.value.trim().length >= 3 &&
    titleInput.value.trim().length <= 32 &&
    noteInput.value.trim().length >= 6
  ) {
    const newNote = new Note(titleInput.value, noteInput.value);
    addNewNote(newNote);
    titleInput.value = "";
    noteInput.value = "";
    addNoteToLocalStorage(newNote);
    alertMessage("Note successfully added!", "success-message");
  } else if (titleInput.value.trim() == "" || noteInput.value.trim() == "") {
    alertMessage("Input Fields cannot be empty", "alert-message");
    titleInput.focus();
  } else if (titleInput.value.trim().length < 3) {
    alertMessage("Title too short (min: 3 characters)", "alert-message");
  } else if (noteInput.value.trim().length < 6) {
    alertMessage("Note too short (min: 6 characters)", "alert-message");
  } else if (titleInput.value.trim().length >= 32) {
    alertMessage("Title too big (max: 32 characters)", "alert-message");
  }
});

const popUpModal = (title, body, id) => {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalId.textContent = id;
  modalContainer.classList.add("active");
};

const alertMessage = (message, divClass) => {
  const alertDiv = document.createElement("div");
  alertDiv.appendChild(document.createTextNode(message));
  alertDiv.className = `message ${divClass}`;
  form.insertAdjacentElement("beforebegin", alertDiv);
  setTimeout(() => alertDiv.remove(), 2400);
};

modalClose.addEventListener("click", () => {
  if (modalContainer.classList.contains("active")) {
    modalContainer.classList.toggle("active");
    body.classList.toggle("overflowing");
  }
});

modalBg.addEventListener("click", () => {
  if (modalContainer.classList.contains("active")) {
    modalContainer.classList.toggle("active");
    body.classList.toggle("overflowing");
  }
});

noteContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("note_view")) {
    const currentNote = e.target.closest(".note");
    const currentTitle = currentNote.querySelector(".note_title").textContent;
    const currentBody = currentNote.querySelector(".note_body").textContent;
    const currentId = currentNote.querySelector(".id").textContent;
    popUpModal(currentTitle, currentBody, currentId);
    body.classList.toggle("overflowing");
  } else if (e.target.classList.contains("note_delete")) {
    const currentNote = e.target.closest(".note");
    const id = parseInt(currentNote.querySelector(".id").textContent);
    currentNote.remove();
    removeNote(id);
    alertMessage("Your note has been permanently deleted.", "remove-message");
  }
});

displayNotes();
