Certainly! Here's the information presented in Markdown format:

---

## Project Overview

### Deployment Strategy - Node.js

The deployment strategy involves utilizing Node.js for server-side development.

### Routes

- **Homepage** (`/`)
- **Login**
  - `GET` (`/login`): Display the login page.
  - `POST` (`/login`): Connect the user and generate a token.
- **Register**
  - `GET` (`/register`): Display the registration page.
  - `POST` (`/register`): Create a new user in the database.
- **Profile**
  - `GET` (`/profile/:id`): Display the profile of the connected user.
  - `UPDATE` (`/profile/:id`): Update user information in the database.
  - `DELETE` (`/profile/:id`) *(optional)*: Delete the user from the database.
- **Dashboard**
  - `GET` (`/dashboard/:id`): Display all elements of the user's postulation property in their profile.
- **Offer**
  - `POST` (`/offer`): Add a job application to the user's profile.
  - `GET` (`/offers`): Display the page to add a job offer.
  - `GET` (`/offer/:id`): Display a job application from the user's profile.
  - `DELETE` (`/offer/delete/:id`): Delete a job application.
  - `UPDATE` (`/offer/update/:id`): Update a job application.

### Technologies

- **EJS**: For rendering views.

### Folder Structure

Follow the structure similar to the Net Ninja:

- **Server**
  - Routes
  - Controllers
  - Middlewares
  - `app.js`
- **Models**
  - `userSchema`
  - `offerSchema`
- **Frontend**
  - Views

### User Schema

```javascript
userSchema: {
  firstName: string (required),
  lastName: string (required),
  email: string (required, unique, lowercase, validate [isEmail]),
  github: string (unique),
  profilePicture: string,
  CV: string,
  password: string (required, minlength),
}
```

### Offer Schema

```javascript
offerSchema: {
  title: string,
  company: string,
  website: string,
  contact: {
    name: string,
    email: string,
    phone: number,
    address: string,
  },
  origin: string,
  status: string,
  comment: string,
}
```

### Development Roles

1. **Server Developer**
   - Routes
   - Controllers
   - Middlewares
   - `app.js`

2. **Database Developer**
   - Models
   - MongoDB Atlas setup

3. **Frontend Developer**
   - Views

---

This Markdown document provides a structured overview of the Node.js project, including deployment strategy, routes, technologies, folder structure, and development roles.
