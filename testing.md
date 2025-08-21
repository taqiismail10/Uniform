# UniForm API Testing Data

## 1. Student Authentication

### Student Reg

`Input`

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

`Output`

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

### System Admin Profile

GET http://localhost:5000/api/system/admins/profile

`Output`

```json
{
  "status": 200,
  "profile": {
    "systemAdminId": "d74b820b-c96c-4234-bbd4-cecea7c3b778",
    "email": "taqiismail10@uniform.com",
    "role": "SYSTEM_ADMIN",
    "createdAt": "2025-08-07T20:48:45.009Z",
    "updatedAt": "2025-08-07T20:48:45.009Z"
  },
  "admin": {
    "systemAdminId": "d74b820b-c96c-4234-bbd4-cecea7c3b778",
    "email": "taqiismail10@uniform.com",
    "role": "SYSTEM_ADMIN",
    "iat": 1755800697,
    "exp": 1787336697
  }
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

### Institution List

GET http://localhost:5000/api/system/institutions

```json
{
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
  "email": "admin@example.com",
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

### Unit Creation

POST http://localhost:5000/api/admin/units
`Single Stream -> Input`

```json
{
  "name": "A",
  "description": "Engineering Department",
  "isActive": true,
  "applicationDeadline": "2025-12-31 23:59:59",
  "maxApplications": 100,
  "requirements": [
    {
      "sscStream": "SCIENCE",
      "hscStream": "SCIENCE",
      "minSscGPA": 4.0,
      "minHscGPA": 4.5
    }
  ]
}
```

`Output`

```json
{
  "status": 201,
  "data": {
    "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
    "name": "Engineering",
    "description": "Engineering Department",
    "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
    "isActive": true,
    "applicationDeadline": "2025-12-31T23:59:59.000Z",
    "maxApplications": 100,
    "autoCloseAfterDeadline": true,
    "createdAt": "2025-08-17T14:22:59.178Z",
    "updatedAt": "2025-08-17T14:22:59.178Z",
    "requirements": [
      {
        "id": "ec6feb0d-6836-414a-b78f-5383a7d5c41e",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.5,
        "createdAt": "2025-08-17T14:22:59.179Z",
        "updatedAt": "2025-08-17T14:22:59.179Z"
      }
    ],
    "institution": {
      "name": "University of Dhaka",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883"
    }
  }
}
```

`Multiple Stream -> Input`

```json
{
  "name": "Engineering Faculty",
  "description": "Multi-disciplinary engineering program",
  "isActive": true,
  "applicationDeadline": "2025-12-31",
  "maxApplications": 300,
  "requirements": [
    {
      "sscStream": "SCIENCE",
      "hscStream": "SCIENCE",
      "minSscGPA": 4.0,
      "minHscGPA": 4.5
    },
    {
      "sscStream": "SCIENCE",
      "hscStream": "COMMERCE",
      "minSscGPA": 4.5,
      "minHscGPA": 4.0
    },
    {
      "sscStream": "SCIENCE",
      "hscStream": "ARTS",
      "minSscGPA": 4.2,
      "minHscGPA": 4.3
    }
  ]
}
```

`Output`

```json
{
  "status": 201,
  "data": {
    "unitId": "33a8ae8e-e3dd-4cff-bde1-c3a138336c9d",
    "name": "Engineering Faculty",
    "description": "Multi-disciplinary engineering program",
    "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
    "isActive": true,
    "applicationDeadline": "2025-12-31T00:00:00.000Z",
    "maxApplications": 300,
    "autoCloseAfterDeadline": true,
    "createdAt": "2025-08-17T14:37:00.016Z",
    "updatedAt": "2025-08-17T14:37:00.016Z",
    "requirements": [
      {
        "id": "3bf7c7e3-bb4a-40f3-b44b-10354e85f870",
        "unitId": "33a8ae8e-e3dd-4cff-bde1-c3a138336c9d",
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.5,
        "createdAt": "2025-08-17T14:37:00.017Z",
        "updatedAt": "2025-08-17T14:37:00.017Z"
      },
      {
        "id": "0b78dfc9-4801-4b03-a739-734769cad139",
        "unitId": "33a8ae8e-e3dd-4cff-bde1-c3a138336c9d",
        "sscStream": "COMMERCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4.5,
        "minHscGPA": 4,
        "createdAt": "2025-08-17T14:37:00.017Z",
        "updatedAt": "2025-08-17T14:37:00.017Z"
      },
      {
        "id": "5204fc96-f7e2-462a-913d-ae8cb5e3f661",
        "unitId": "33a8ae8e-e3dd-4cff-bde1-c3a138336c9d",
        "sscStream": "ARTS",
        "hscStream": "SCIENCE",
        "minSscGPA": 4.2,
        "minHscGPA": 4.3,
        "createdAt": "2025-08-17T14:37:00.017Z",
        "updatedAt": "2025-08-17T14:37:00.017Z"
      }
    ],
    "institution": {
      "name": "University of Dhaka",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883"
    }
  }
}
```

### Updating Unit

PUT http://localhost:5000/api/admin/units/f9777252-b9ca-4b32-9817-379c2386790f

`Output`

```json
{
  "status": 200,
  "message": "Unit updated successfully",
  "data": {
    "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
    "name": "Updated Engineering Department",
    "description": "Engineering with multiple stream options",
    "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
    "isActive": true,
    "applicationDeadline": "2025-12-31T23:59:59.000Z",
    "maxApplications": 100,
    "autoCloseAfterDeadline": true,
    "createdAt": "2025-08-17T14:22:59.178Z",
    "updatedAt": "2025-08-17T15:36:42.050Z",
    "requirements": [
      {
        "id": "999b8cb3-a650-416d-813f-7570af68580b",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.5,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      },
      {
        "id": "13332f15-1479-4b6c-a93f-91a175cc8736",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "COMMERCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4.2,
        "minHscGPA": 4,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      }
    ],
    "institution": {
      "name": "University of Dhaka",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883"
    },
    "_count": { "applications": 0 }
  }
}
```

### Adding Extra Stream to Unit

POST http://localhost:5000/api/admin/units/f9777252-b9ca-4b32-9817-379c2386790f/requirements

`Input`

```json
{
  "requirements": [
    {
      "sscStream": "ARTS",
      "hscStream": "COMMERCE",
      "minSscGPA": 3.5,
      "minHscGPA": 3.8
    },
    {
      "sscStream": "ARTS",
      "hscStream": "ARTS",
      "minSscGPA": 3.0,
      "minHscGPA": 3.5
    }
  ]
}
```

```json
{
  "status": 201,
  "message": "2 requirement(s) added successfully",
  "data": {
    "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
    "name": "Updated Engineering Department",
    "description": "Engineering with multiple stream options",
    "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
    "isActive": true,
    "applicationDeadline": "2025-12-31T23:59:59.000Z",
    "maxApplications": 100,
    "autoCloseAfterDeadline": true,
    "createdAt": "2025-08-17T14:22:59.178Z",
    "updatedAt": "2025-08-17T15:36:42.050Z",
    "requirements": [
      {
        "id": "999b8cb3-a650-416d-813f-7570af68580b",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.5,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      },
      {
        "id": "13332f15-1479-4b6c-a93f-91a175cc8736",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "COMMERCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4.2,
        "minHscGPA": 4,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      },
      {
        "id": "348eb4ed-437c-4f27-be6e-67398b253467",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "ARTS",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.2,
        "createdAt": "2025-08-17T16:07:49.498Z",
        "updatedAt": "2025-08-17T16:07:49.498Z"
      },
      {
        "id": "c71c8bea-ce52-4968-8e56-dfb6ddfeb731",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "ARTS",
        "hscStream": "COMMERCE",
        "minSscGPA": 3.5,
        "minHscGPA": 3.8,
        "createdAt": "2025-08-17T16:09:11.013Z",
        "updatedAt": "2025-08-17T16:09:11.013Z"
      },
      {
        "id": "88e0dff0-7743-4298-b59c-16994a78feed",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "ARTS",
        "hscStream": "ARTS",
        "minSscGPA": 3,
        "minHscGPA": 3.5,
        "createdAt": "2025-08-17T16:09:11.013Z",
        "updatedAt": "2025-08-17T16:09:11.013Z"
      }
    ],
    "institution": {
      "name": "University of Dhaka",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883"
    },
    "_count": { "applications": 0 }
  }
}
```

### Delete Requirements from Units

DELETE http://localhost:5000/api/admin/units/f9777252-b9ca-4b32-9817-379c2386790f/requirements/c71c8bea-ce52-4968-8e56-dfb6ddfeb731

```json
{
  "status": 200,
  "message": "Requirement removed successfully",
  "data": {
    "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
    "name": "Updated Engineering Department",
    "description": "Engineering with multiple stream options",
    "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
    "isActive": true,
    "applicationDeadline": "2025-12-31T23:59:59.000Z",
    "maxApplications": 100,
    "autoCloseAfterDeadline": true,
    "createdAt": "2025-08-17T14:22:59.178Z",
    "updatedAt": "2025-08-17T15:36:42.050Z",
    "requirements": [
      {
        "id": "999b8cb3-a650-416d-813f-7570af68580b",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.5,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      },
      {
        "id": "13332f15-1479-4b6c-a93f-91a175cc8736",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "COMMERCE",
        "hscStream": "SCIENCE",
        "minSscGPA": 4.2,
        "minHscGPA": 4,
        "createdAt": "2025-08-17T15:36:42.054Z",
        "updatedAt": "2025-08-17T15:36:42.054Z"
      },
      {
        "id": "348eb4ed-437c-4f27-be6e-67398b253467",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "ARTS",
        "hscStream": "SCIENCE",
        "minSscGPA": 4,
        "minHscGPA": 4.2,
        "createdAt": "2025-08-17T16:07:49.498Z",
        "updatedAt": "2025-08-17T16:07:49.498Z"
      },
      {
        "id": "88e0dff0-7743-4298-b59c-16994a78feed",
        "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
        "sscStream": "ARTS",
        "hscStream": "ARTS",
        "minSscGPA": 3,
        "minHscGPA": 3.5,
        "createdAt": "2025-08-17T16:09:11.013Z",
        "updatedAt": "2025-08-17T16:09:11.013Z"
      }
    ],
    "institution": {
      "name": "University of Dhaka",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883"
    },
    "_count": { "applications": 0 }
  }
}
```

GET http://localhost:5000/api/admin/units

```json
{
  "status": 200,
  "data": [
    {
      "unitId": "33a8ae8e-e3dd-4cff-bde1-c3a138336c9d",
      "name": "Engineering Faculty",
      "description": "Multi-disciplinary engineering program",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
      "isActive": true,
      "applicationDeadline": "2025-12-31T00:00:00.000Z",
      "maxApplications": 300,
      "autoCloseAfterDeadline": true,
      "createdAt": "2025-08-17T14:37:00.016Z",
      "updatedAt": "2025-08-17T14:37:00.016Z"
    },
    {
      "unitId": "f9777252-b9ca-4b32-9817-379c2386790f",
      "name": "Updated Engineering Department",
      "description": "Engineering with multiple stream options",
      "institutionId": "e833dd84-e308-40ba-be2b-63cfe5299883",
      "isActive": true,
      "applicationDeadline": "2025-12-31T23:59:59.000Z",
      "maxApplications": 100,
      "autoCloseAfterDeadline": true,
      "createdAt": "2025-08-17T14:22:59.178Z",
      "updatedAt": "2025-08-17T15:36:42.050Z"
    }
  ]
}
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
