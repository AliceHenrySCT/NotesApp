# NotesApp
Created by: Alice Henry

NotesApp is a full-stack application built with Node.js, Express, and MongoDB.
It provides users with the ability to register, log in, and manage notes.
Users can create, view, update, delete, share, and even download or upload note files.
The application uses JWT-based authentication and offers a simple, clean user interface.

## Features

- **User Management:** Register and log in with email, username, and password.
- **JWT Authentication:** Secure endpoints using JSON Web Tokens.
- **Note CRUD Operations:** Create, read, update, and delete notes.
- **Collaboration:** Share notes by granting access to multiple users.
- **File Operations:** Download notes as text files and upload files to create new notes.
- **Frontend:** A responsive UI built with HTML, CSS, and JavaScript.

## Installation and Setup

1. **Clone the repository:**

   git clone https://github.com/AliceHenrySCT/NotesApp.git
   cd notesapp

2. **Install dependencies:**

   Make sure you have Node.js installed. Then, install the necessary packages:

   npm install

3. **Set up MongoDB:**

   Ensure you have access to a MongoDB instance.

4. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

5. **Run the server:**

   Start the application using either:

   node server.js
   npm run start

   The server will run on port 5000 by default. You can change the port in the `.env` file if needed.

6. **Open the frontend:**

   Open the `index.html` file in your browser to access the application.

## Configuration

- **Environment Variables:**
  - MONGODB_URI: Your MongoDB connection string.
  - JWT_SECRET: A secret key for signing JWT tokens.
  - PORT: The port on which the server runs (default is 5000).

## API Documentation

The backend API is served under the `/api/notes` base path. Below are the available endpoints:

### User Authentication

- **Register**

  - **Endpoint:** POST /api/notes/register
  - **Description:** Registers a new user.
  - **Request Body:**

    {
      "username": "string",
      "email": "string",
      "password": "string"
    }

  - **Response:**
    - 201 Created:  
      {
        "message": "User registered successfully",
        "user": { /* user object */ }
      }
    - 400 Bad Request:  
      { "error": "Error message" }

- **Login**

  - **Endpoint:** POST /api/notes/login
  - **Description:** Authenticates a user and returns a JWT.
  - **Request Body:**

    {
      "email": "string",
      "password": "string"
    }

  - **Response:**
    - 200 OK:  
      {
        "message": "Login successful",
        "token": "JWT_TOKEN",
        "id": "user_id"
      }
    - 404 Not Found:  
      { "message": "User not found" }
    - 401 Unauthorized:  
      { "message": "Invalid credentials" }

- **Welcome Message**

  - **Endpoint:** GET /api/notes/welcome
  - **Description:** Returns a welcome message for authenticated users.
  - **Headers:** Authorization: Bearer <token>
  - **Response:**
    - 200 OK:  
      { "message": "Welcome [username]" }
    - 401/403: Authentication errors

### User Endpoints

- **Get All Users**

  - **Endpoint:** GET /api/notes/users/
  - **Description:** Retrieves all users.
  - **Response:**
    - 200 OK:  
      [ { "username": "string", "email": "string", ... }, ... ]
    - 404 Not Found:  
      { "error": "No users found" }

- **Get Username**

  - **Endpoint:** GET /api/notes/username/:id
  - **Description:** Retrieves the username for the given user ID.
  - **Response:**
    - 200 OK:  
      "username"
    - 404 Not Found:  
      { "error": "User not found" }

- **Remove User from Note**

  - **Endpoint:** PUT /api/notes/username/:id
  - **Description:** Removes a user from a note's owners list. The :id parameter should be a comma-separated string containing the user ID and note ID (e.g., "userId,noteId").
  - **Response:**
    - 200 OK: Returns the updated note object.
    - 404 Not Found:  
      { "error": "Note not found" }

### Note Endpoints

- **Create Note**

  - **Endpoint:** POST /api/notes/
  - **Description:** Creates a new note.
  - **Request Body:**

    {
      "title": "string (max 15 characters)",
      "description": "string",
      "owners": ["userId1", "userId2"]
    }

  - **Response:**
    - 201 Created: Returns the newly created note object.
    - 400 Bad Request: Validation error message.
  
- **Get Notes for a User**

  - **Endpoint:** GET /api/notes/user/:user
  - **Description:** Retrieves all notes where the specified user is listed as an owner.
  - **Response:**
    - 200 OK:  
      [ { "title": "string", "description": "string", "owners": ["userId", ...], ... }, ... ]
    - 404 Not Found:  
      { "error": "Note not found" }

- **Get Note by ID**

  - **Endpoint:** GET /api/notes/id/:id
  - **Description:** Retrieves a specific note by its ID.
  - **Response:**
    - 200 OK: Returns the note object.
    - 404 Not Found:  
      { "error": "Note not found" }

- **Update Note**

  - **Endpoint:** PUT /api/notes/:id
  - **Description:** Updates an existing note.
  - **Request Body:**

    {
      "title": "string (max 15 characters)",
      "description": "string",
      "owners": ["userId1", "userId2"]
    }

  - **Response:**
    - 200 OK: Returns the updated note object.
    - 404 Not Found:  
      { "error": "Note not found" }
    - 400 Bad Request: Validation error message.

- **Delete Note**

  - **Endpoint:** DELETE /api/notes/:id
  - **Description:** Deletes a note by its ID.
  - **Response:**
    - 200 OK:  
      { "message": "Note deleted" }
    - 404 Not Found:  
      { "error": "Note not found" }

### File Upload/Download

The frontend provides functionality for:

- **Downloading Notes:**  
  Users can select one or more notes to download as text files. The downloaded file contains the note title, a list of owner IDs, and the note description separated by underscores.

- **Uploading Note Files:**  
  Users can upload files containing note data. The expected file format is:
  - Format: title_owners_description
  - Details:  
    - title: The title of the note (max 15 characters) and can not contain underscores '_' .  
    - owners: Either a single owner or multiple owner IDs separated by commas. If current user's ID is not in the note it will be added when uploaded.  
    - description: The note description.
