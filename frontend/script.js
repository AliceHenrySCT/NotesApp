const BASE_URL = "http://localhost:5000/api/notes";

//Checks if token exists
const checkAuth = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

//Checks if a note is selected
const selNote = () => {
  const selNote = localStorage.getItem('selNote');
  return token ? true : false;
}

//Renders buttons on the homepage and redirects user if already logged in
if (document.title === 'Home') {
  const authButtons = document.getElementById('auth-buttons');
  if (checkAuth()) {
    location.href="notelist.html";
  } else {
    authButtons.innerHTML = `
      <a href="login.html"><button>Login</button></a>
      <a href="register.html"><button>Register</button></a>
    `;
  }
}

//Enables Login functionality 
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

//Register functionality
if (document.title === 'Register') {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    //Replace with your backend API endpoint
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

//Calls for welcome message and gets list of user note
if(document.title === 'Note List') {
  window.onload = getNotes;
  fetchWelcomeMessage()
}



//Function to fetch the welcome message from the server
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
    //Redirect to login page if the token is invalid or expired
    window.location.href = 'login.html';
  }
};

//Client-side logout function
const logout = () => {
  //Remove all tokens from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('selNote');

  //Shows a success message
  alert('Logged out successfully!');

  //Redirect to the home or login page
  window.location.href = 'index.html'; 
};

//function to get notes for athenticated user
async function getNotes() {
  const user = [localStorage.getItem('userId')];
  const response = await fetch(`${BASE_URL}/user/${user}`, { method: "GET" });
  const notes = await response.json();
  renderNotes(notes);
}

//function to display notes to user
function renderNotes(notes) {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = ""; //Clear the list

  notes.forEach((note) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = note.title;

    //Creates the view button
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "View";
    toggleButton.onclick = () => viewNote(note._id);

    //Creates the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteNote(note._id);

    //Appends elements to the list item
    li.appendChild(span);
    li.appendChild(toggleButton);
    li.appendChild(deleteButton);

    //Append the list item to the note list
    noteList.appendChild(li);
  });

  
}

//function to add note
async function addNote() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const owners = [localStorage.getItem('userId')];
  //check if user has supplied both a title and descrition before adding note to db
  if (title && description) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, owners }),
    });
    const newNote = await response.json();
    title.value = "";
    description.value = "";
    getNotes();
  }
}

//fuction to update selected note
async function updateNote() {
  const title = document.getElementById("selTitle").value;
  const description = document.getElementById("selDescription").value;
  const owners = localStorage.getItem('userId');
  const id = localStorage.getItem('selNote');
    //checks if user has supplied both a title and descrition before updating note to db
  if (title && description) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, owners }),
    });
    const newNote = await response.json();
    title.value = "";
    description.value = "";
    getNotes();
  }
}

//function to display selected note to user and allow editing
async function viewNote(id) {
  const response = await fetch(`${BASE_URL}/id/${id}`, { method: "GET" });
  const note = await response.json();
  localStorage.setItem('selNote', id);
  const selNoteDiv = document.getElementById('selNote')
  const selNoteTitle = document.getElementById('selTitle')
  const selNoteDesc = document.getElementById('selDescription')
  if(selNote){
    selNoteDiv.style.display = "inline";
    console.log(note);
    selNoteTitle.value = note.title;
    selNoteDesc.value = note.description;
  }
  getNotes();
}

//function to delete note from db
async function deleteNote(id) {
  if(id == localStorage.getItem('selNote')) {
    console.log(id);
    console.log(localStorage.getItem('selNote'));
    localStorage.removeItem('selNote');
    const selNoteDiv = document.getElementById('selNote')
    selNoteDiv.style.display = "none";
  }
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  getNotes();
}


