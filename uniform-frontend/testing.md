# UniForm API Testing Data

## 1. Authentication

### Student Registration
POST http://localhost:5000/api/auth/register
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe123@example.com",
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

#### Error Responses
```json
// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "email": ["Email is already taken"],
        "password": ["Password must be at least 8 characters long"],
        "phone": ["Invalid phone number format"]
    }
}

// 500 - Server Error
{
    "status": 500,
    "message": "Something went wrong. Please try again later."
}
```

### Student Login
POST http://localhost:5000/api/auth/login
```json
{
    "email": "johndoe123@example.com",
    "password": "Password123",
    "role": "STUDENT"
}

{
  "status": 200,
  "message": "Login successful",
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJiYzMyMmVjMC03YjgyLTRhMTMtODE3OS03OWE4NjE1YmQxMGUiLCJlbWFpbCI6ImpvaG5kb2UxMjNAZXhhbXBsZS5jb20iLCJyb2xlIjoiU1RVREVOVCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTc0ODc5Mjg4NywiZXhwIjoxNzQ5Mzk3Njg3fQ.Wn6Sd1A6skjaIUgSk3MBAT5CIsX2CxsgV6wo94EAutg",
  "user": {
    "studentId": "bc322ec0-7b82-4a13-8179-79a8615bd10e",
    "email": "johndoe123@example.com",
    "role": "STUDENT",
    "name": "John Doe"
  }
}
```

#### Error Responses
```json
// 401 - Invalid Credentials
{
    "status": 401,
    "message": "Invalid credentials"
}

// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "email": ["Email is required"],
        "password": ["Password is required"],
        "role": ["Role must be one of: STUDENT, ADMIN"]
    }
}
```

### Admin Creation
POST http://localhost:5000/admin/auth/create
```json
{
    "email": "admin@uniform.com",
    "password": "admin123",
    "password_confirmation": "admin123",
    "role": "ADMIN"
}

{
  "status": 200,
  "message": "Admin logged in successfully",
  "access_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiYmNiYjE1M2EtNmQyZS00ZDYyLTlhOTEtOWM0YTEzNzk1NGY5IiwiZW1haWwiOiJhZG1pbkB1bmlmb3JtLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0ODc5MzYzNywiZXhwIjoxNzQ5Mzk4NDM3fQ.ZdUk8tYLf8Sj7VIpqcoAW2lbSakBSqRjcHpbJqaAFb0",
  "admin": {
    "adminId": "bcbb153a-6d2e-4d62-9a91-9c4a137954f9",
    "email": "admin@uniform.com",
    "role": "ADMIN"
  }
}
```

#### Edge Cases
```json
// Create Admin with Minimum Fields
{
    "email": "admin2@uniform.edu",
    "password": "Admin123!",
    "password_confirmation": "Admin123!",
    "role": "ADMIN"
}

// Create Admin with Additional Institution Access
{
    "email": "admin3@uniform.edu",
    "password": "Admin123!",
    "password_confirmation": "Admin123!",
    "role": "ADMIN",
    "firstName": "Institution",
    "lastName": "Admin",
    "institutions": ["institution-id-1", "institution-id-2"]
}
```

#### Error Responses
```json
// 403 - Unauthorized
{
    "status": 403,
    "message": "Only existing admins can create new admins"
}

// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "email": ["Email is already taken"],
        "password": ["Password and confirmation do not match"]
    }
}
```

## 2. Academic Form

### Submit Form
POST http://localhost:5000/api/form
```json
{
    "sscBoard": "Dhaka",
    "hscBoard": "Dhaka",
    "sscRoll": "123456",
    "hscRoll": "789012",
    "reg": "456789",
    "sscGPA": 4.83,
    "hscGPA": 4.92,
    "sscStream": "SCIENCE",
    "hscStream": "SCIENCE"
}
```

### Get Form
GET http://localhost:5000/api/form
```json
// Response example:
{
    "status": 200,
    "form": {
        "formId": "form-id-here",
        "studentId": "student-id-here",
        "sscBoard": "Dhaka",
        "hscBoard": "Dhaka",
        "sscRoll": "123456",
        "hscRoll": "789012",
        "reg": "456789",
        "sscGPA": 4.83,
        "hscGPA": 4.92,
        "sscStream": "SCIENCE",
        "hscStream": "SCIENCE"
    }
}
```

## 3. Institution Management

### Create Institution
POST http://localhost:5000/admin/institutions
```json
{
    "name": "University of Dhaka",
    "type": "UNIVERSITY",
    "description": "Leading public university in Bangladesh",
    "website": "https://du.ac.bd",
    "location": "Dhaka, Bangladesh",
    "establishedIn": "1921-07-01T00:00:00.000Z"
}
// Output
{
  "status": 201,
  "message": "Institution added successfully!",
  "institution": {
    "institutionId": "f11bf41e-085e-4d9d-865c-51f5495631b3",
    "name": "University of Dhaka",
    "type": "UNIVERSITY",
    "description": "Leading public university in Bangladesh",
    "website": "https://du.ac.bd",
    "location": "Dhaka, Bangladesh",
    "establishedIn": "1921-07-01T00:00:00.000Z"
  }
}
```

### Create Institution (Batch)
POST http://localhost:5000/admin/institutions/batch
```json
{
    "institutions": [
        {
            "name": "University of Dhaka",
            "type": "UNIVERSITY",
            "description": "Leading public university in Bangladesh",
            "website": "https://du.ac.bd",
            "location": "Dhaka, Bangladesh",
            "establishedIn": "1921-07-01T00:00:00.000Z"
        },
        {
            "name": "BUET",
            "type": "ENGINEERING",
            "description": "Top engineering university",
            "website": "https://buet.ac.bd",
            "location": "Dhaka, Bangladesh",
            "establishedIn": "1962-01-01T00:00:00.000Z"
        }
    ]
}
```

#### Error Responses
```json
// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "institutions[0].name": ["Institution name is required"],
        "institutions[1].type": ["Type must be one of: UNIVERSITY, MEDICAL, ENGINEERING, PRIVATE_UNIVERSITY, OTHER"]
    }
}

// 403 - Unauthorized
{
    "status": 403,
    "message": "Only admins can create institutions"
}
```

### Get Institutions
GET http://localhost:5000/api/institutions
```json
// Response example:
{
    "status": 200,
    "institutions": [
        {
            "institutionId": "institution-id-here",
            "name": "University of Dhaka",
            "type": "UNIVERSITY",
            "description": "Leading public university in Bangladesh",
            "website": "https://du.ac.bd",
            "location": "Dhaka, Bangladesh",
            "establishedIn": "1921-07-01T00:00:00.000Z"
        }
    ]
}
```

### Get Institution Details
GET http://localhost:5000/api/institutions/:institutionId
```json
// Response example:
{
    "status": 200,
    "institution": {
        "institutionId": "institution-id-here",
        "name": "University of Dhaka",
        "type": "UNIVERSITY",
        "description": "Leading public university in Bangladesh",
        "website": "https://du.ac.bd",
        "location": "Dhaka, Bangladesh",
        "establishedIn": "1921-07-01T00:00:00.000Z",
        "units": [
            {
                "unitId": "unit-id-here",
                "name": "A Unit",
                "description": "Science and Engineering Unit"
            }
        ]
    }
}
```

## 4. Admission Unit Management

### Create Unit
POST http://localhost:5000/admin/institutions/:institutionId/units
```json
{
    "name": "A Unit",
    "description": "Science and Engineering Unit",
    "totalSeats": 100,
    "applicationFee": 500,
    "applicationDeadline": "2025-12-31T23:59:59.999Z",
    "admissionStart": "2025-12-01T00:00:00.000Z",
    "admissionEnd": "2025-12-31T23:59:59.999Z",
    "minSscGPA": 4.5,
    "minHscGPA": 4.5,
    "allowedSscStreams": ["SCIENCE"],
    "allowedHscStreams": ["SCIENCE"],
    "formFields": [
        {
            "label": "Physics Score",
            "type": "NUMBER",
            "isRequired": true
        },
        {
            "label": "Chemistry Score",
            "type": "NUMBER",
            "isRequired": true
        },
        {
            "label": "Mathematics Score",
            "type": "NUMBER",
            "isRequired": true
        }
    ]
}
```

### Create Units (Batch)
POST http://localhost:5000/admin/institutions/:institutionId/units/batch
```json
{
    "units": [
        {
            "name": "A Unit",
            "description": "Science and Engineering Unit",
            "totalSeats": 100,
            "applicationFee": 500,
            "applicationDeadline": "2025-12-31T23:59:59.999Z",
            "admissionStart": "2025-12-01T00:00:00.000Z",
            "admissionEnd": "2025-12-31T23:59:59.999Z",
            "minSscGPA": 4.5,
            "minHscGPA": 4.5,
            "allowedSscStreams": ["SCIENCE"],
            "allowedHscStreams": ["SCIENCE"],
            "formFields": [
                {
                    "label": "Physics Score",
                    "type": "NUMBER",
                    "isRequired": true
                }
            ]
        },
        {
            "name": "B Unit",
            "description": "Arts and Humanities Unit",
            "totalSeats": 50,
            "applicationFee": 400,
            "applicationDeadline": "2025-12-31T23:59:59.999Z",
            "admissionStart": "2025-12-01T00:00:00.000Z",
            "admissionEnd": "2025-12-31T23:59:59.999Z",
            "minSscGPA": 4.0,
            "minHscGPA": 4.0,
            "allowedSscStreams": ["ARTS"],
            "allowedHscStreams": ["ARTS"],
            "formFields": [
                {
                    "label": "Bengali Score",
                    "type": "NUMBER",
                    "isRequired": true
                }
            ]
        }
    ]
}
```

#### Error Responses
```json
// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "units[0].minSscGPA": ["GPA must be between 0 and 5"],
        "units[1].applicationDeadline": ["Application deadline must be after admission start date"]
    }
}

// 404 - Institution Not Found
{
    "status": 404,
    "message": "Institution not found"
}
```

### Update Unit
PUT http://localhost:5000/admin/units/:unitId
```json
{
    "applicationFee": 600,
    "totalSeats": 120,
    "formFields": [
        {
            "label": "Physics Score",
            "type": "NUMBER",
            "isRequired": true
        },
        {
            "label": "Chemistry Score",
            "type": "NUMBER",
            "isRequired": true
        },
        {
            "label": "Mathematics Score",
            "type": "NUMBER",
            "isRequired": true
        },
        {
            "label": "Biology Score",
            "type": "NUMBER",
            "isRequired": false
        }
    ]
}
```

### Get Unit Stats
GET http://localhost:5000/admin/units/:unitId/stats
```json
// Response example:
{
    "status": 200,
    "unit": {
        "unitId": "unit-id-here",
        "name": "A Unit",
        "description": "Science and Engineering Unit",
        "totalSeats": 120,
        "applicationFee": 600,
        "isOpen": true,
        "stats": {
            "total": 50,
            "submitted": 30,
            "reviewing": 10,
            "accepted": 5,
            "rejected": 5
        },
        "formFields": [
            {
                "id": "field-id-here",
                "label": "Physics Score",
                "type": "NUMBER",
                "isRequired": true
            }
        ],
        "institution": {
            "name": "University of Dhaka",
            "type": "UNIVERSITY",
            "description": "Leading public university in Bangladesh",
            "website": "https://du.ac.bd",
            "location": "Dhaka, Bangladesh"
        }
    }
}
```

### Get Institution Units
GET http://localhost:5000/api/institutions/:institutionId/units
```json
// Response example:
{
    "status": 200,
    "units": [
        {
            "unitId": "unit-id-here",
            "name": "A Unit",
            "description": "Science and Engineering Unit",
            "totalSeats": 100,
            "applicationFee": 500,
            "applicationDeadline": "2025-12-31T23:59:59.999Z",
            "admissionStart": "2025-12-01T00:00:00.000Z",
            "admissionEnd": "2025-12-31T23:59:59.999Z",
            "minSscGPA": 4.5,
            "minHscGPA": 4.5,
            "allowedSscStreams": ["SCIENCE"],
            "allowedHscStreams": ["SCIENCE"],
            "formFields": [
                {
                    "id": "field-id-here",
                    "label": "Physics Score",
                    "type": "NUMBER",
                    "isRequired": true
                }
            ],
            "institutionName": "University of Dhaka"
        }
    ]
}
```

## 5. Applications

### Submit Application
POST http://localhost:5000/api/applications
```json
{
    "unitId": "unit-id-here",
    "fieldAnswers": [
        {
            "fieldId": "physics-field-id",
            "value": "85"
        },
        {
            "fieldId": "chemistry-field-id",
            "value": "82"
        },
        {
            "fieldId": "mathematics-field-id",
            "value": "90"
        }
    ]
}
```

#### Edge Cases
```json
// Submit Application with Missing Required Fields
{
    "unitId": "unit-id-here",
    "fieldAnswers": [
        {
            "fieldId": "physics-field-id",
            "value": "85"
        }
    ]
}

// Submit Application with Invalid Score
{
    "unitId": "unit-id-here",
    "fieldAnswers": [
        {
            "fieldId": "physics-field-id",
            "value": "101"
        }
    ]
}

// Submit Application After Deadline
{
    "unitId": "expired-unit-id",
    "fieldAnswers": []
}
```

#### Error Responses
```json
// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "fieldAnswers": ["Missing required field: Chemistry Score"],
        "value": ["Score must be between 0 and 100"]
    }
}

// 400 - Application Deadline Passed
{
    "status": 400,
    "message": "Application deadline has passed for this unit"
}

// 400 - Ineligible
{
    "status": 400,
    "message": "You do not meet the eligibility requirements for this unit"
}

// 404 - Unit Not Found
{
    "status": 404,
    "message": "Admission unit not found"
}
```

### Update Application Status (Admin)
PUT http://localhost:5000/admin/applications/:applicationId/status
```json
{
    "status": "REVIEWING",
    "comment": "Application under review"
}
```

#### Edge Cases
```json
// Invalid Status Transition
{
    "status": "ACCEPTED",
    "comment": "Cannot accept without reviewing"
}

// Missing Comment
{
    "status": "REJECTED"
}
```

#### Error Responses
```json
// 400 - Invalid Status
{
    "status": 400,
    "errors": {
        "status": ["Invalid status transition from SUBMITTED to ACCEPTED"]
    }
}

// 400 - Missing Comment
{
    "status": 400,
    "errors": {
        "comment": ["Comment is required when rejecting an application"]
    }
}

// 404 - Application Not Found
{
    "status": 404,
    "message": "Application not found"
}
```

## 6. Student Profile

### Get Student Profile
GET http://localhost:5000/api/profile
```json
// Response example:
{
    "status": 200,
    "profile": {
        "studentId": "student-id-here",
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe123@example.com",
        "phone": "+1234567123",
        "address": "123 Main Street",
        "dob": "2000-01-01T00:00:00.000Z",
        "examPath": "NATIONAL",
        "medium": "English",
        "form": {
            "sscBoard": "Dhaka",
            "hscBoard": "Dhaka",
            "sscGPA": 4.83,
            "hscGPA": 4.92,
            "sscStream": "SCIENCE",
            "hscStream": "SCIENCE"
        }
    }
}
```

### Update Student Profile
PUT http://localhost:5000/api/profile
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567123",  
    "address": "456 New Street"
}
```

#### Edge Cases
```json
// Update Email (Should Not Be Allowed)
{
    "email": "newemail@example.com"
}

// Update with Invalid Phone Format
{
    "phone": "123456"
}
```

#### Error Responses
```json
// 400 - Validation Error
{
    "status": 400,
    "errors": {
        "email": ["Email cannot be updated"],
        "phone": ["Invalid phone number format"]
    }
}

// 403 - Unauthorized
{
    "status": 403,
    "message": "Access denied. Please log in again."
}

// 404 - Profile Not Found
{
    "status": 404,
    "message": "Student profile not found"
}
```

Note: Replace placeholder IDs (like :institutionId, unit-id-here, etc.) with actual IDs from your database.
When testing, consider the following scenarios:
1. Authentication token expiration
2. Concurrent updates to the same resource
3. Network timeouts
4. File upload limits
5. Rate limiting responses

#### Edge Cases - Institution Creation
```json
// Create Institution with Minimum Fields
{
    "name": "Test University",
    "type": "UNIVERSITY"
}

// Create Institution with Future Establishment Date
{
    "name": "Future University",
    "type": "UNIVERSITY",
    "establishedIn": "2026-01-01T00:00:00.000Z"
}

// Create Institution with Invalid Website
{
    "name": "Invalid Web University",
    "type": "UNIVERSITY",
    "website": "not-a-url"
}
```

#### Edge Cases - Unit Creation
```json
// Create Unit with Past Dates
{
    "name": "Past Unit",
    "totalSeats": 100,
    "applicationDeadline": "2024-12-31T23:59:59.999Z",
    "admissionStart": "2024-12-01T00:00:00.000Z",
    "admissionEnd": "2024-12-31T23:59:59.999Z",
    "minSscGPA": 4.5,
    "minHscGPA": 4.5,
    "allowedSscStreams": ["SCIENCE"],
    "allowedHscStreams": ["SCIENCE"]
}

// Create Unit with Zero Seats
{
    "name": "No Seats Unit",
    "totalSeats": 0,
    "applicationFee": 500,
    "minSscGPA": 4.5,
    "minHscGPA": 4.5,
    "allowedSscStreams": ["SCIENCE"],
    "allowedHscStreams": ["SCIENCE"]
}

// Create Unit with Invalid Field Type
{
    "name": "Invalid Field Unit",
    "totalSeats": 100,
    "minSscGPA": 4.5,
    "minHscGPA": 4.5,
    "allowedSscStreams": ["SCIENCE"],
    "allowedHscStreams": ["SCIENCE"],
    "formFields": [
        {
            "label": "Invalid Field",
            "type": "INVALID_TYPE",
            "isRequired": true
        }
    ]
}
```