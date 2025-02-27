const BASE_URL = 'http://localhost:5000/api/notes'; //Base URL for API endpoints

//Checks if token exists in local storage
const checkAuth = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

//Checks if a note is selected in local storage (may contain a bug using undefined variable)
const selNote = () => {
  const selNote = localStorage.getItem('selNote');
  return token ? true : false;
}

//On Home page, redirect if authenticated or display login/register buttons
if (document.title === 'Home') {
  const authButtons = document.getElementById('auth-buttons');
  if (checkAuth()) {
    location.href = 'notelist.html';
  } else {
    authButtons.innerHTML = `
      <a href='login.html'><button>Login</button></a>
      <a href='register.html'><button>Register</button></a>
    `;
  }
}

//On Login page, handle login form submission and authenticate user
if (document.title === 'Login') {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const message = document.getElementById('message');
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      message.textContent = 'Login successful! Redirecting...';
      setTimeout(() => (window.location.href = 'notelist.html'), 1500);
    } else {
      message.textContent = data.error || 'Login failed.';
    }
  });
}

//On Register page, handle registration form submission and create new user
if (document.title === 'Register') {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    //send new user data to backend
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    const message = document.getElementById('message');
    if (response.ok) {
      message.textContent = 'Registration successful! Redirecting to login...';
      setTimeout(() => (window.location.href = 'login.html'), 1500);
    } else {
      message.textContent = data.error || 'Registration failed.';
    }
  });
}

//On Note List page, load notes when window loads
if (document.title === 'Note List') {
  window.onload = getNotes;
  //fetchWelcomeMessage()
}

//Fetch welcome message from server using the stored token
async function fetchWelcomeMessage() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${BASE_URL}/welcome`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Authentication failed. Please log in again.');
    }

    const data = await response.json();
    alert(data.message); //Display the welcome message

  } catch (error) {
    alert(error.message);
    //Redirect to login page if token is invalid or expired
    window.location.href = 'login.html';
  }
};

//Log out the user by clearing local storage and redirecting to Home
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('selNote');

  alert('Logged out successfully!');
  window.location.href = 'index.html'; 
};

//Fetch notes for the authenticated user and render them
async function getNotes() {
  const user = [localStorage.getItem('userId')];
  const response = await fetch(`${BASE_URL}/user/${user}`, { method: 'GET' });
  const notes = await response.json();
  renderNotes(notes);
}

//Render notes on the page with view and delete options
function renderNotes(notes) {
  const noteList = document.getElementById('noteList');
  noteList.innerHTML = ''; //Clear existing list
  const noteDownloadList = document.getElementById('noteDownloadList');
  noteDownloadList.innerHTML = ''; //Clear existing download list

  notes.forEach((note) => {
    const li = document.createElement('li');
    const liD = document.createElement('li');

    const span = document.createElement('span');
    const spanD = document.createElement('span');
    span.textContent = note.title;
    spanD.textContent = note.title;    

    //Create the view button for each note
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'View';
    toggleButton.onclick = () => viewNote(note._id);
    toggleButton.id = 'listButton';

    //Create the delete button for each note
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteNote(note._id);
    deleteButton.id = 'listButton';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    //Append elements to list items
    li.appendChild(span);
    li.appendChild(toggleButton);
    li.appendChild(deleteButton);

    liD.appendChild(checkbox);
    liD.appendChild(spanD);
    liD.dataset.value = note._id;
    
    //Add list items to their respective lists
    noteList.appendChild(li);
    noteDownloadList.appendChild(liD);
  });
}

//Add a new note using form inputs and refresh the notes list
async function addNote() {
  const titleEle = document.getElementById('title');
  const descriptionEle = document.getElementById('description');
  const title = titleEle.value;
  const description = descriptionEle.value;
  const owners = [localStorage.getItem('userId')];
  if (title.length <= 15) {//Checks title length and pass alert to user if title is too long
    if (title && description) {//Checks that user enter both title and description
      const response = await fetch(BASE_URL, {//Sends data to backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, owners }),
      });
      const newNote = await response.json();
      //clears input text boxes after note has been added
      titleEle.value = '';
      descriptionEle.value = '';
      getNotes();//Refeshes notes list to display new note
    }
  }
  else{
    alert('Title may only contain 15 characters');
  }
}

//Update the selected note with new title and description
async function updateNote() {
  const title = document.getElementById('selTitle').value;
  const description = document.getElementById('selDescription').value;
  const owners = localStorage.getItem('userId');
  const id = localStorage.getItem('selNote');
  if (title.length <= 15) {//Checks title length and pass alert to user if title is too long
    if (title && description) {//Checks that user enter both title and description
      const response = await fetch(`${BASE_URL}/${id}`, {//Sends data to backend
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, owners }),
      });
      const newNote = await response.json();
      title.value = '';
      description.value = '';
      getNotes();
    }
  }
}

//View and edit a selected note; loads note details and owners
async function viewNote(id) {
  const response = await fetch(`${BASE_URL}/id/${id}`, { method: 'GET' });
  const note = await response.json();
  localStorage.setItem('selNote', id);
  const selNoteDiv = document.getElementById('selNote');
  const selNoteTitle = document.getElementById('selTitle');
  const selNoteDesc = document.getElementById('selDescription');

  if (selNote) {//checks if a note has been selected and displays the note if true
    selNoteDiv.style.display = 'inline';
    selNoteTitle.value = note.title;
    selNoteDesc.value = note.description;
    renderOwners(id);
    getUsers();
  }
  getNotes();
}

//Fetch list of users and render the owners list dropdown
async function getUsers() {
  const response = await fetch(`${BASE_URL}/users/`, { method: 'GET' });
  const users = await response.json();
  renderOwnersList(users);
}

//Render dropdown list of potential note owners with an option to add a user
async function renderOwnersList(users) {
  const newOwnerList = document.getElementById('newOwnerList');
  newOwnerList.innerHTML = ''; //Clear existing list
  const option = document.createElement('option');
  option.value = '';
  option.textContent = '--Please Choose a user--';
  newOwnerList.appendChild(option);
  users.forEach((user) => {
    const option = document.createElement('option');
    option.value = user._id;
    option.textContent = user.username;
    newOwnerList.appendChild(option);
  });
  const addOwnerButton = document.createElement('button');
  addOwnerButton.textContent = 'Add User';
  addOwnerButton.onclick = () => addOwner();
  newOwnerList.appendChild(addOwnerButton);
}

//Add a new user to the note's owners if not already included
async function addUser() {
  const ownerList = document.getElementById('newOwnerList');
  const newOwner = ownerList.value;
  const id = localStorage.getItem('selNote');
  const response = await fetch(`${BASE_URL}/id/${id}`, { method: 'GET' });
  const note = await response.json();
  const title = note.title;
  const description = note.description;
  const owners = note.owners;

  if (!owners.includes(newOwner)) {
    owners.push(newOwner);
    if (title && description && owners) {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, owners }),
      });
      title.value = '';
      description.value = '';
      viewNote(note._id);
    }
  }
  else{
    alert('User already has access to this note');
  }
}

//Render the list of current note owners with a remove button for each
async function renderOwners(noteId) {
  const ownerList = document.getElementById('ownerList');
  ownerList.innerHTML = ''; //Clears existing owner list
  const response = await fetch(`${BASE_URL}/id/${noteId}`, { method: 'GET' });
  const notes = await response.json();

  notes.owners.forEach(async (id) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const response = await fetch(`${BASE_URL}/username/${id}`, { method: 'GET' });
    const owner = await response.json();
    span.textContent = owner;

    //Create remove button for each owner
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeUser(owner, noteId);

    li.appendChild(span);
    li.appendChild(removeButton);
    ownerList.appendChild(li);
  });
}

//Remove a user from a note's owners and refresh the view
async function removeUser(owner, noteId) {
  const id = [owner, noteId];
  await fetch(`${BASE_URL}/username/${id}`, { method: 'PUT' });
  viewNote(noteId);
  getNotes();
}

//Delete a note and update the note list; hides selected note view if needed
async function deleteNote(id) {
  if (id == localStorage.getItem('selNote')) {
    localStorage.removeItem('selNote');
    const selNoteDiv = document.getElementById('selNote');
    selNoteDiv.style.display = 'none';
  }
  await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  getNotes();
}

//Open overlay to show note download options
function download() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  const overlayContentDown = document.getElementById('overlayContentDown');
  overlayContentDown.style.display = 'flex';
  getNotes();
}

//Close the overlay for upload/download actions
function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  const overlayContentDown = document.getElementById('overlayContentDown');
  overlayContentDown.style.display = 'none';
  const overlayContentUp = document.getElementById('overlayContentUp');
  overlayContentUp.style.display = 'none';
}

//Download the list of selected notes by iterating through checkboxes
async function downloadNoteList() {
  const noteDownloadList = document.getElementById('noteDownloadList');
  const listItems = noteDownloadList.querySelectorAll('li');
  listItems.forEach(async li => {
    const id = li.dataset.value;
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      const response = await fetch(`${BASE_URL}/id/${id}`, { method: 'GET' });
      const note = await response.json();
      downloadNote(note);
    }
  });
  closeOverlay();
}

//Trigger browser download of a note as a text file
function downloadNote(note) {
  let download = document.createElement('a');
  download.href = 'data:application/octet-stream,' + encodeURIComponent(note.title + '_' + note.owners + '_' + note.description);
  download.download = note.title + '.txt';
  download.click();
}

//Open overlay for file upload
function upload() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  const overlayContentUp = document.getElementById('overlayContentUp');
  overlayContentUp.style.display = 'flex';
}

//Read uploaded files, parse note data, and send to the server
function uploadFiles() {
  const filesToLoad = document.getElementById("filesToLoad").files;

  Array.from(filesToLoad).forEach(file => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result; //Get file content
      const data = text.split('_', 3);
      const title = data[0];
      const ownersString = data[1];
      const description = data[2];
      let owners = '';
    
      //Checks if there are multiple owners in the file
      //if multiple splits the string into an array
      if (ownersString.includes(',')) {
        owners = ownersString.split(',');
        console.log(owners + '1');
      }
      else{
        owners = ownersString;
        console.log(owners + '2');
      }
    
       //Validate file format for required fields
       if (!title || !owners || !description) {
        alert("File format error: missing title, owners, or description");
        return;
      }

      //Add current user to owners if not already included
      if (!owners.includes(localStorage.getItem('userId'))) {
        owners.push(localStorage.getItem('userId'));
      }
      
      //Send note data to backend API
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, owners }),
      });
      const newNote = await response.json();
      getNotes();
    };
    reader.readAsText(file);
  });
  closeOverlay();
}
