# Anonymous-Feedback
Welcome to the Student Feedback Web Project! This web application allows students to provide feedback on courses and instructors, and enables teachers to create courses and view student reviews. The project is built with a focus on user roles, ensuring that both students and teachers have the necessary functionalities to interact effectively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Student Role](#student-role)
  - [Teacher Role](#teacher-role)
- [Database](#database)

## Features

1. **Separate Roles for Teacher and Student**
   - Different functionalities for teachers and students to ensure a tailored user experience.

2. **Login and Registration Facility**
   - Login and registration for both teachers and students.

3. **Course Management for Teachers**
   - Teachers can create courses and view reviews left by students.

4. **Course Filtering and Reviewing for Students**
   - Students can filter courses by teacher and department name and leave reviews for courses.

5. **MongoDB Database Integration**
   - All information is stored in a MongoDB database.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript
  
- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MongoDB

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a MongoDB database set up and running.

### Installation
1. Install the dependencies:

   ```sh
   npm install express nodemon mongoose express-session
   ```

2. Configure the database connection:
    - Open mongodb compass and connect to localhost
    - Copy the connection string and your desired databse name in app.js file in the mongodb Connect part
      - In my code I have used "mongodb://localhost:27017/sample"

3. Start the server:

   ```sh
   nodemon app.js
   ```
  - If this doesn't work, use :
   ```sh
   npx nodemon server.js
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Student Role

- **Registration and Login:**
  - Students can register and log in to the application.

- **Filtering Courses:**
  - Students can filter courses by teacher and department name.

- **Giving Reviews:**
  - Students can leave reviews for courses they have taken.

### Teacher Role

- **Registration and Login:**
  - Teachers can register and log in to the application.

- **Creating Courses:**
  - Teachers can create new courses and provide details such as course name, description, and department.

- **Viewing Reviews:**
  - Teachers can view reviews left by students for their courses.

## Database

The application uses MongoDB to store all data. The database schema includes collections for users (teachers and students), courses, and reviews. Ensure you have configured your MongoDB connection using the connection string provide in the installation part
