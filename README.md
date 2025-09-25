# SoftwareCo Practical

## Setup Instructions
### Prerequisites

Ensure that you have the following installed:
`node>=14`

## Configure Environment Variables
Create a `.env` file and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   ```
## Run seeder
Run Seeder for insert admin role and user
`npm run seed:addAdminData`

## Run the application:
   `npm run dev`

By default, the server will be running on `http://localhost:5000`.

## API Endpoints:

### User Endpoints

1. **Create User**

   - **POST** `/api/users/create`
   - **Payload**:

   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@example.com",
     "password": "password123",
     "roleId": "<role_id>"
   }
   ```

2. **Get Users**

   - **POST** `/api/users/list`
   - **Payload**:

   ```json
   {
     "search": "",
     "limit": 10,
     "page": "1"
   }
   ```

3. **Update User**

   - **PUT** `/api/users/update/:id`
   - **Payload**:

   ```json
   {
     "firstName": "Jane",
     "lastName": "Doe",
     "email": "jane.doe@example.com",
     "roleId": "<role_id>"
   }
   ```

4. **Delete User**

   - **DELETE** `/api/users/delete/:id`

5. **Get User Details**

   - **GET** `/api/details/:id`

6. **Check Access Module**

   - **GET** `/api/users/check-access-module/:id`

7. **Update Many Users With Same Data**

   - **POST** `/api/users/update-many`
   - **Payload**:

   ```json
   {
     "userIds": ["<user_id>"],
     "<fieldName>": "Doe" //eg. "firstName": "Jane",
   }
   ```

8. **Update Many Users With Different Data**
   - **POST** `/api/users/update-many-diff`
   - **Payload**:
   ```json
   [
     {
       "_id": "<user_id>",
       "firstName": "Jane",
       "lastName": "Doe",
       "email": "jane.doe@example.com",
       "roleId": "<role_id>"
     }
   ]
   ```

---

### Role Endpoints

1. **Create Role**

   - **POST** `/api/roles/create`
   - **Payload**:

   ```json
   {
     "roleName": "Admin",
     "accessModules": ["module1", "module2"]
   }
   ```

2. **Get Roles**

   - **GET** `/api/roles/list`
   - **Payload**:

   ```json
   {
     "search": "",
     "limit": 10,
     "page": "1"
   }
   ```

3. **Update Role**

   - **PUT** `/api/roles/update/:id`
   - **Payload**:

   ```json
   {
     "roleName": "Admin",
     "accessModules": ["module1", "module3"]
   }
   ```

4. **Delete Role**

   - **DELETE** `/api/roles/delete/:id`

5. **Get Role Details**

   - **GET** `/api/roles/details/:id`

6. **Add Access Module**

   - **POST** `/api/roles/add-access-module/:id`
   - **Payload**:

   ```json
   {
     "accessModules": "module"
   }
   ```

7. **Get Role Details**
   - **POST** `/api/roles/delete-access-module/:id`
    - **Payload**:
    ```json
    {
        "accessModules": "module"
    }
    ```

---

### Auth Endpoints

1. **Signup**

   - **POST** `/api/auth/signup`
   - **Payload**:

   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```

2. **Login**

   - **POST** `/api/auth/login`
   - **Payload**:

   ```json
   {
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```