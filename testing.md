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

### Admin Creation

POST http://localhost:5000/api/system/admins

```json
{
  "email": "admincu@example.com",
  "password": "admin",
  "institutionId": "2f2f2470-de67-4f0f-90a3-033c994111eb"
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
