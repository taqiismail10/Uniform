# UniForm API Testing Data

## 1. Student Authentication

### Student Reg

#### Input

POST http://localhost:5000/api/auth/register

```json
{
  "fullName": "Aong Cho",
  "email": "aongcho880@example.com",
  "phone": "+1234567123",
  "password": "Password123",
  "password_confirmation": "Password123",
  "address": "123 Main Street",
  "role": "STUDENT",
  "dob": "2000-01-01T00:00:00.000Z",
  "examPath": "NATIONAL",
  "medium": "English"
}
```

#### Output

```json
{
  "status": 200,
  "message": "User created successfully",
  "user": {
    "studentId": "67a91bfd-8965-447a-8fd9-fd247c94a3e7",
    "fullName": "Aong Cho",
    "email": "aongcho880@example.com",
    "phone": "+1234567123",
    "password": "$2b$10$iXg4L2MsA1lQCMzKwSlvSeLGfY2oHcshmxYabcB.XP1xF0cKSBVMC",
    "address": "123 Main Street",
    "role": "STUDENT",
    "dob": "2000-01-01T00:00:00.000Z",
    "profile": null,
    "createdAt": "2025-08-07T05:58:54.410Z",
    "updatedAt": "2025-08-07T05:58:54.410Z"
  }
}
```

### Student Login

POST http://localhost:5000/api/auth/login

```json
{
  "email": "aongcho880@example.com",
  "password": "Password123",
  "role": "STUDENT"
}
```

### System Admin Login

POST http://localhost:5000/api/system/auth/login

```json
{
  "email": "taqiismail10@uniform.com",
  "password": "admin",
  "role": "SYSTEM_ADMIN"
}
```

```json
{
  "status": 200,
  "message": "System admin logged in successfully",
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1BZG1pbklkIjoiZDc0YjgyMGItYzk2Yy00MjM0LWJiZDQtY2VjZWE3YzNiNzc4IiwiZW1haWwiOiJ0YXFpaXNtYWlsMTBAdW5pZm9ybS5jb20iLCJyb2xlIjoiU1lTVEVNX0FETUlOIiwiaWF0IjoxNzU0NjMxNzE4LCJleHAiOjE3ODYxNjc3MTh9.y8Iq9md_PL7i1uT-9MJU8dnnzrYs_2u1Eh3QNw6CQLs"
}
```

### Institution and Institution Category Created

POST http://localhost:5000/api/system/institutions

```json
{
  "name": "University of Dhaka",
  "categoryName": "public university"
}
```

```json
{
  "status": 201,
  "message": "Institution added successfully!",
  "institution": {
    "institutionId": "9ede37aa-ed91-4b5a-a6e6-34eb01706806",
    "name": "University of Dhaka",
    "description": null,
    "address": null,
    "phone": null,
    "email": null,
    "website": null,
    "establishedYear": null,
    "logoUrl": null,
    "requirementsHscGPA": null,
    "requirementsSscGPA": null,
    "institutionCategoryInstitutionCategoryId": "683b4ff2-17e2-48bf-88f1-33bfe5c934e6"
  }
}
```

### Institution Deletion

DELETE http://localhost:5000/api/system/institutions/9ede37aa-ed91-4b5a-a6e6-34eb01706806

```json
{ "status": 200, "message": "Institution deleted successfully!" }
```

### Admin Creation and Assigned to Institution

POST http://localhost:5000/api/system/admins/create-and-assign

```json
{
  "email": "admin@example.com",
  "password": "admin",
  "institutionId": "991733aa-64ef-4040-aa0c-81491fa810d0"
}
```

```json
{
  "status": 200,
  "message": "Institution admin created successfully",
  "admin": {
    "adminId": "dd3b19cf-e066-4b7a-a7f7-29ed636245b3",
    "email": "admin@example.com",
    "password": "$2b$10$22czEW1tczaD4yX5sgazpeHiz7C5MvkZ1jUHskXT.MuBLhppyG2Fm",
    "role": "INSTITUTION_ADMIN",
    "createdAt": "2025-08-10T21:28:38.047Z",
    "updatedAt": "2025-08-10T21:28:38.047Z",
    "institutionId": "991733aa-64ef-4040-aa0c-81491fa810d0",
    "institution": {
      "institutionId": "991733aa-64ef-4040-aa0c-81491fa810d0",
      "name": "University of Chittagong",
      "description": null,
      "address": null,
      "phone": null,
      "email": null,
      "website": null,
      "establishedYear": null,
      "logoUrl": null,
      "requirementsHscGPA": null,
      "requirementsSscGPA": null,
      "institutionCategoryInstitutionCategoryId": null
    }
  }
}
```

### Admin Login

POST http://localhost:5000/api/admin/auth/login

```json
{
  "email": "admincu@example.com",
  "password": "admin",
  "role": "INSTITUTION_ADMIN"
}
```

```json  
{
  "status": 200,
  "message": "User logged in successfully",
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiYmVmMWZiN2UtODExNi00ZGY0LWJmMWEtNjZhY2ZkMzM3YWRkIiwiZW1haWwiOiJhZG1pbmN1QGV4YW1wbGUuY29tIiwiaWF0IjoxNzU0NjM2NDUyLCJleHAiOjE3ODYxNzI0NTJ9.y7n7QVCMV9751LMjSP5PtEkT4W10juxIDgx0jUgJHVw"
}
```

### Admin Update Password

PUT http://localhost:5000/api/admin/update-password

```json
{
  "oldPassword": "admincu",
  "newPassword": "admin"
}
```

```json
{ "status": 200, "message": "Password updated successfully" }
```

### Unassign Admin From Institution

PATCH http://localhost:5000/api/system/admins/dd3b19cf-e066-4b7a-a7f7-29ed636245b3/unassign-institution

```json
{
  "status": 200,
  "message": "Admin unassigned from institution successfully.",
  "admin": {
    "adminId": "dd3b19cf-e066-4b7a-a7f7-29ed636245b3",
    "email": "admin@example.com",
    "password": "$2b$10$22czEW1tczaD4yX5sgazpeHiz7C5MvkZ1jUHskXT.MuBLhppyG2Fm",
    "role": "INSTITUTION_ADMIN",
    "createdAt": "2025-08-10T21:28:38.047Z",
    "updatedAt": "2025-08-10T21:42:13.140Z",
    "institutionId": null
  }
}
```

### Student Profile

GET http://localhost:5000/api/profile

```json
  "status": 200,
  "profile": {
    "studentId": "59833947-c809-45c4-8a7f-bf8b2e064bd0",
    "fullName": "Aong Cho",
    "email": "aongcho880@example.com",
    "phone": "+1234567123",
    "password": "$2b$10$6LLzDM41opQXygS.ujA17e.0iPFAurTJ3rDna.MKpxsh32KjmO0KO",
    "address": "123 Main Street",
    "role": "STUDENT",
    "dob": "2000-01-01T00:00:00.000Z",
    "profile": null,
    "createdAt": "2025-08-07T06:06:17.419Z",
    "updatedAt": "2025-08-07T06:06:17.419Z"
  },
```

```json
  "user": {
    "studentId": "59833947-c809-45c4-8a7f-bf8b2e064bd0",
    "email": "aongcho880@example.com",
    "iat": 1754579660,
    "exp": 1786115660
  }
```
