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
