# File Sharing API
This project serves as a File Sharing API, providing functionality for uploading, retrieving, and deleting files. The API is built using Node.js and Express.js, with MongoDB as the database, ensuring a robust and efficient web service.

## Project Overview

This Node.js project implements a File Sharing API using Express.js with MongoDB as the database. The API allows users to upload, retrieve, and delete files through specified endpoints. Below are the key details of the project.

## Project Setup

### Node.js Version

The project is built using Node.js version 20.10.0.

### Dependencies

- Express.js: A fast, unopinionated, minimalist web framework for Node.js.
- MongoDB: A NoSQL database used for storing file-related data.

# Setting up Environment Variables

1. **Copy `.env.example` Content:**
   - Open the `.env.example` file in your code editor.
   - Copy all of its content.

2. **Create a New `.env` File:**
   - In the same directory as `.env.example`, create a new file named `.env`.

3. **Paste and Replace Values:**
   - Open the newly created `.env` file in your code editor.
   - Paste the copied content from `.env.example`.
   - Replace the placeholder values with your actual values.

## Example: .env
   - MONGODB_HOST=mongodb://localhost:27017/fileSharingDB
   - PROVIDER=local # local | google
   - FOLDER=storage
   - CRYPTO_KEY=your_actual_crypto_key
   - MAX_FILE_SIZE_LIMIT=2097152 #2MB (in bytes)
   - RATE_LIMIT_IN_HOUR=100  # Example value, replace with your desired limit
   - STORAGE_CLEAN_JOB_SCHEDULE='0 20 17 * * *' # 5:30PM
   - INACTIVE_FILE_PERIOD=-30  # Example value, replace with your desired period

### Scripts

The following npm scripts are available:

- `start`: Start the application using `node ./bin/www`.
- `dev`: Start the application in development mode using `nodemon ./bin/www`.
- `test`: Run tests using Jest.


## Database Setup (MongoDB)

1. Downlod MongoDB: [MongoDB Download](https://www.mongodb.com/try/download/community)
2. Install MongoDB: [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
