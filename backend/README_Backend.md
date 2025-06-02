---

# UniForm Backend Setup - Complete Guide (JavaScript, Windows)

This guide covers the full backend setup, from PostgreSQL installation and configuration to running your Node.js/Express/JavaScript application with Prisma.

## 1\. Global Prerequisites (Windows)

Ensure you have the following software installed:

-   **Git:**
    -   Download and install Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
-   **Node.js & npm:** (LTS version recommended)
    -   Download the Windows Installer from: [https://nodejs.org/en/download/](https://nodejs.org/en/download/) (npm is included)
    -   **Verification:** Open **Command Prompt (cmd)** or **PowerShell** and run:
        ```cmd
        node -v
        npm -v
        ```
-   **Code Editor:** (VS Code recommended)
    -   Download: [https://code.visualstudi.com/](https://www.google.com/search?q=https://code.visualstudi.com/)
    -   **Recommended VS Code Extensions:** ESLint, Prettier, Prisma, PostgreSQL.

## 2\. PostgreSQL Server Installation & Initial Setup (Windows)

### 2.1. Install PostgreSQL on Windows

-   Use the official Windows installer from the PostgreSQL website: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
-   **Follow the installation wizard:**
    -   Choose components (typically Server, pgAdmin 4, Command Line Tools).
    -   **Set a strong password for the default `postgres` superuser.** Remember this password\!
    -   Note the port (default is `5432`).
    -   The installer usually starts the PostgreSQL service automatically.

### 2.2. Create Database and User for UniForm

You can use `pgAdmin 4` (recommended for visual setup) or the `psql` command-line tool.

#### Option A: Using `pgAdmin 4`

1.  **Open `pgAdmin 4`** (from Start Menu).
2.  **Connect to your PostgreSQL server:** Enter the `postgres` superuser password.
3.  **Create Database `uniform_db`:**
    -   In `pgAdmin`, expand "Servers" -\> "PostgreSQL (version)" -\> "Databases".
    -   Right-click "Databases" -\> "Create" -\> "Database...".
    -   In the "General" tab, set "Database" to `uniform_db`. Click "Save".
4.  **Create User `uniform_user`:**
    -   In `pgAdmin`, expand "Servers" -\> "PostgreSQL (version)" -\> "Login/Group Roles".
    -   Right-click "Login/Group Roles" -\> "Create" -\> "Login/Group Role...".
    -   In the "General" tab, set "Name" to `uniform_user`.
    -   Go to the "Definition" tab and set a strong password for `uniform_user` (e.g., `'your_secure_password'`). **Remember this password\!**
    -   Go to the "Privileges" tab. Set "Can create databases?" to **Yes**. This is crucial for Prisma Migrate.
    -   Go to the "Parameters" tab. Click "Add new row" (+).
        -   "Name": `search_path`
        -   "Value": `"$user", public`
    -   Click "Save".
5.  **Grant Schema Permissions (Crucial):**
    -   In `pgAdmin`, expand "Servers" -\> "PostgreSQL (version)" -\> "Databases" -\> "uniform_db" -\> "Schemas".
    -   Right-click on the `public` schema -\> "Properties...".
    -   Go to the "Privileges" tab. Add a new row for `uniform_user`.
    -   For `uniform_user`, grant `ALL` privileges (check all boxes for `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `CREATE`, `CONNECT`). Click "Save".

#### Option B: Using `psql` Command Line

Open your **Command Prompt (cmd)** or **PowerShell** and connect to PostgreSQL as the `postgres` superuser:

```cmd
psql -U postgres
```

(Enter the `postgres` superuser password when prompted).

Execute the following SQL commands one by one at the `psql` prompt:

```sql
-- 1. Create a new database for UniForm
CREATE DATABASE uniform_db;

-- 2. Create a new user (role) for UniForm
-- !!! IMPORTANT: REPLACE 'your_secure_password' with a strong password for this user !!!
CREATE USER uniform_user WITH PASSWORD 'your_secure_password';

-- 3. Grant all privileges on the database to the new user
GRANT ALL PRIVILEGES ON DATABASE uniform_db TO uniform_user;

-- 4. Grant permission to create databases (CRUCIAL for Prisma Migrate's shadow database)
ALTER USER uniform_user CREATEDB;

-- 5. Connect to the newly created database to grant schema permissions
\c uniform_db

-- 6. Grant all privileges on the 'public' schema to the new user (CRUCIAL for Prisma Migrate)
GRANT ALL ON SCHEMA public TO uniform_user;

-- 7. Set default search path for the user (good practice)
ALTER ROLE uniform_user SET search_path TO public;

-- Exit psql
\q
```

**Important:** Remember the `uniform_user` password you just set. You'll need it for the backend's database connection in the `.env` file.

## 3\. Project Initialization & Repository Cloning

If you haven't already, clone your UniForm project repository.

```cmd
# Navigate to your desired development directory (e.g., your Projects folder)
cd C:\Users\YourUser\Documents\Projects

# Clone the repository (replace with your actual repository URL)
git clone <your-uniform-repo-url>

# Navigate into the cloned project's root directory
cd Uniform
```

## 4\. Backend Setup (Node.js, Express, JavaScript, Prisma)

Navigate to the `backend` directory. All commands from now on will be run from here in your **Command Prompt (cmd)** or **PowerShell**:

```cmd
cd backend
```

### 4.1. Initialize the Node.js Project

This creates your `package.json` file.

```cmd
npm init -y
```

### 4.2. Install Core Dependencies

```cmd
npm install express prisma @prisma/client jsonwebtoken bcrypt dotenv cors zod pg
```

### 4.3. Install Development Dependencies (Tools)

```cmd
npm install --save-dev nodemon
```

### 4.4. Initialize Prisma

This sets up Prisma and creates the `prisma` directory with `schema.prisma`.

```cmd
npx prisma init --datasource-provider postgresql
```

### 4.5. Add Your Database Schema (`prisma/schema.prisma`)

Open `uniform/backend/prisma/schema.prisma` and replace its content with the following:

```prisma
// uniform/backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


enum ExamPath {
  NATIONAL
  MADRASHA
  BRITISH
}

enum InstitutionType {
  UNIVERSITY
  MEDICAL
  ENGINEERING
  PRIVATE_UNIVERSITY
  OTHER
}

enum FieldType {
  TEXT
  NUMBER
  FILE
}

model Student {
  studentId    String   @id @default(uuid())
  firstName    String   @db.VarChar(190)
  lastName     String   @db.VarChar(190)
  email        String   @unique
  phone        String?  @db.VarChar(15)
  password     String   @db.VarChar(255)
  address      String?  @db.VarChar(300)
  role         String   @default("STUDENT")
  dob          DateTime
  examPath     ExamPath
  medium       String?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt

  form         Form?
  applications AppliedUnit[]
  fieldAnswers FieldAnswer[]
}

model Form {
  formId    String @id @default(uuid())
  studentId String @unique
  sscBoard  String
  hscBoard  String
  sscRoll   String
  hscRoll   String
  reg       String
  sscGPA    Float
  hscGPA    Float
  sscStream String
  hscStream String

  student Student @relation(fields: [studentId], references: [studentId])
}

model Institution {
  institutionId String             @id @default(uuid())
  name          String @unique // <-- IMPORTANT: This is unique
  type          InstitutionType    @default(UNIVERSITY)
  description   String?
  website       String?
  location      String?
  establishedIn DateTime?

  admins        AdminInstitution[]
  units         AdmissionUnit[]
  formFields    FormField[]
}

model AdmissionUnit {
  unitId              String   @id @default(uuid())
  name                String
  institutionId       String
  minSscGPA           Float
  minHscGPA           Float
  allowedSscStreams   String[]
  allowedHscStreams   String[]
  description         String?
  totalSeats          Int       @default(0)
  applicationFee      Float     @default(0)
  applicationDeadline DateTime?
  admissionStart      DateTime?
  admissionEnd        DateTime?

  institution  Institution   @relation(fields: [institutionId], references: [institutionId])
  applications AppliedUnit[]
  formFields   FormField[]
}

model AppliedUnit {
  id            String   @id @default(uuid())
  studentId     String
  unitId        String
  status        String   @default("SUBMITTED")
  submittedAt   DateTime @default(now())
  statusHistory Json?

  student      Student       @relation(fields: [studentId], references: [studentId])
  unit         AdmissionUnit @relation(fields: [unitId], references: [unitId])
  fieldAnswers FieldAnswer[]
}

model Admin {
  adminId   String   @id @default(uuid())
  email     String   @unique
  password  String   @db.VarChar(255)
  role      String   @default("INSTITUTION_ADMIN") // Or "SYSTEM_ADMIN"
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  institutions AdminInstitution[]
}

model AdminInstitution {
  id            String @id @default(uuid())
  adminId       String
  institutionId String

  admin       Admin       @relation(fields: [adminId], references: [adminId])
  institution Institution @relation(fields: [institutionId], references: [institutionId])
}

model FormField {
  id            String    @id @default(uuid())
  label         String
  type          FieldType
  isRequired    Boolean   @default(true)
  isReusable    Boolean   @default(false)
  institutionId String?
  unitId        String?

  institution  Institution?   @relation(fields: [institutionId], references: [institutionId])
  unit         AdmissionUnit? @relation(fields: [unitId], references: [unitId])
  fieldAnswers FieldAnswer[]
}

model FieldAnswer {
  id            String  @id @default(uuid())
  studentId     String
  fieldId       String
  appliedUnitId String?  // optional if reusable field (institution-level)

  value         String

  student     Student      @relation(fields: [studentId], references: [studentId])
  field       FormField    @relation(fields: [fieldId], references: [id])
  appliedUnit AppliedUnit? @relation(fields: [appliedUnitId], references: [id])
}
```

### 4.6. Create `.env` file for Backend

Create a file named `.env` directly inside `uniform/backend` and paste the following content:

```bash
# uniform/backend/.env

# Database Configuration (ensure this matches your PostgreSQL setup)
DATABASE_URL="postgresql://uniform_user:your_secure_password@localhost:5432/uniform_db?schema=public"

# JWT Secret (!!! IMPORTANT: Replace with a strong, random string !!!)
# You can generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your_very_strong_and_random_jwt_secret_here"

# Optional: Port for the backend server
PORT=5000
```

**Remember to replace `your_secure_password` with the password you set for `uniform_user` in PostgreSQL (Step 2.2).**
**Also, replace `your_very_strong_and_random_jwt_secret_here` with a truly random, long string.**

### 4.7. Run Prisma Migrations and Generate Client

```cmd
# Create and apply migration for unique name (answer 'y' if prompted)
npx prisma migrate dev --name add_unique_institution_name

# Generate Prisma client (always run after schema changes or migrations)
npx prisma generate
```

### 4.8. Create Database Seed File (`prisma/seed.js`)

```cmd
mkdir prisma
fsutil file createnew prisma\seed.js 0
```

Open `uniform/backend/prisma/seed.js` and paste the following content:

```javascript
// uniform/backend/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding...");

	// --- Common Data ---
	const adminPassword = await bcrypt.hash("adminpassword123", 10);
	const systemAdmin = await prisma.admin.upsert({
		where: { email: "system.admin@uniform.com" },
		update: {},
		create: {
			email: "system.admin@uniform.com",
			password: adminPassword,
			role: "SYSTEM_ADMIN",
		},
	});
	console.log(`Created system admin with ID: ${systemAdmin.adminId}`);

	// --- Dhaka University Data ---
	const dhakaUniversity = await prisma.institution.upsert({
		where: { name: "Dhaka University" },
		update: {},
		create: {
			name: "Dhaka University",
			type: "UNIVERSITY",
			description: "The oldest university in Bangladesh.",
			website: "https://www.du.ac.bd",
			location: "Dhaka, Bangladesh",
			establishedIn: new Date("1921-07-01T00:00:00Z"),
		},
	});
	console.log(`Created institution: ${dhakaUniversity.name}`);

	const duUnitA = await prisma.admissionUnit.upsert({
		where: { unitId: "du-unit-a" },
		update: {
			minSscGPA: 4.5,
			minHscGPA: 4.5,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			totalSeats: 1000,
			applicationFee: 1000,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
		create: {
			unitId: "du-unit-a",
			name: "Unit A (Science & Engineering)",
			institutionId: dhakaUniversity.institutionId,
			minSscGPA: 4.5,
			minHscGPA: 4.5,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			description:
				"Admission unit for Science and Engineering faculties.",
			totalSeats: 1000,
			applicationFee: 1000,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${duUnitA.name} for ${dhakaUniversity.name}`
	);

	const duUnitB = await prisma.admissionUnit.upsert({
		where: { unitId: "du-unit-b" },
		update: {
			minSscGPA: 3.5,
			minHscGPA: 3.5,
			allowedSscStreams: ["Humanities", "Business Studies"],
			allowedHscStreams: ["Humanities", "Business Studies"],
			totalSeats: 800,
			applicationFee: 800,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
		create: {
			unitId: "du-unit-b",
			name: "Unit B (Arts & Social Sciences)",
			institutionId: dhakaUniversity.institutionId,
			minSscGPA: 3.5,
			minHscGPA: 3.5,
			allowedSscStreams: ["Humanities", "Business Studies"],
			allowedHscStreams: ["Humanities", "Business Studies"],
			description:
				"Admission unit for Arts and Social Sciences faculties.",
			totalSeats: 800,
			applicationFee: 800,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${duUnitB.name} for ${dhakaUniversity.name}`
	);

	const adminInstitutionDU = await prisma.adminInstitution.upsert({
		where: {
			id: `${systemAdmin.adminId}-${dhakaUniversity.institutionId}`,
		},
		update: {},
		create: {
			adminId: systemAdmin.adminId,
			institutionId: dhakaUniversity.institutionId,
		},
	});
	console.log(
		`Linked admin ${systemAdmin.email} to institution ${dhakaUniversity.name}`
	);

	// --- University of Chittagong Data ---
	const chittagongUniversity = await prisma.institution.upsert({
		where: { name: "University of Chittagong" },
		update: {},
		create: {
			name: "University of Chittagong",
			type: "UNIVERSITY",
			description:
				"A public university located in Chittagong, Bangladesh.",
			website: "https://cu.ac.bd",
			location: "Chittagong, Bangladesh",
			establishedIn: new Date("1966-11-18T00:00:00Z"),
		},
	});
	console.log(`Created institution: ${chittagongUniversity.name}`);

	const cuUnitScience = await prisma.admissionUnit.upsert({
		where: { unitId: "cu-unit-science" },
		update: {
			minSscGPA: 4.0,
			minHscGPA: 4.0,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			totalSeats: 700,
			applicationFee: 950,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
		create: {
			unitId: "cu-unit-science",
			name: "Unit A (Science Faculty)",
			institutionId: chittagongUniversity.institutionId,
			minSscGPA: 4.0,
			minHscGPA: 4.0,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			description: "Admission unit for various Science disciplines.",
			totalSeats: 700,
			applicationFee: 950,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${cuUnitScience.name} for ${chittagongUniversity.name}`
	);

	const cuUnitArts = await prisma.admissionUnit.upsert({
		where: { unitId: "cu-unit-arts" },
		update: {
			minSscGPA: 3.0,
			minHscGPA: 3.0,
			allowedSscStreams: ["Humanities"],
			allowedHscStreams: ["Humanities"],
			totalSeats: 500,
			applicationFee: 750,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
		create: {
			unitId: "cu-unit-arts",
			name: "Unit B (Arts Faculty)",
			institutionId: chittagongUniversity.institutionId,
			minSscGPA: 3.0,
			minHscGPA: 3.0,
			allowedSscStreams: ["Humanities"],
			allowedHscStreams: ["Humanities"],
			description: "Admission unit for Arts disciplines.",
			totalSeats: 500,
			applicationFee: 750,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${cuUnitArts.name} for ${chittagongUniversity.name}`
	);

	const adminInstitutionCU = await prisma.adminInstitution.upsert({
		where: {
			id: `${systemAdmin.adminId}-${chittagongUniversity.institutionId}`,
		},
		update: {},
		create: {
			adminId: systemAdmin.adminId,
			institutionId: chittagongUniversity.institutionId,
		},
	});
	console.log(
		`Linked admin ${systemAdmin.email} to institution ${chittagongUniversity.name}`
	);

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
```

### 4.9. Run the Seed Script

```cmd
npx prisma db seed
```

**Verification:**
After running this, confirm the data is present using Prisma Studio (`npx prisma studio`) or `psql` (`psql -U uniform_user -d uniform_db` then `SELECT * FROM "Institution";`).

### 4.10. Create Basic Backend Application Structure (`src/app.js`)

```cmd
mkdir src
fsutil file createnew src\app.js 0
```

Open `uniform/backend/src/app.js` and paste the following content:

```javascript
// uniform/backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config(); // Load environment variables from .env file

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("UniForm Backend API is running!");
});

app.get("/test-db", async (req, res) => {
	try {
		await prisma.$connect();
		res.status(200).json({ message: "Database connection successful!" });
	} catch (error) {
		console.error("Database connection error:", error);
		res.status(500).json({
			message: "Database connection failed.",
			error: error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Access it at http://localhost:${PORT}`);
});

process.on("beforeExit", async () => {
	await prisma.$disconnect();
});
```

### 4.11. Configure `package.json` with All Scripts

Open your `uniform/backend/package.json` file and replace its _entire content_ with the following:

```json
{
	"name": "backend",
	"version": "1.0.0",
	"description": "UniForm Backend API for University Applicants",
	"main": "src/app.js",
	"scripts": {
		"start": "node src/app.js",
		"dev": "nodemon src/app.js",
		"prisma:migrate": "npx prisma migrate dev",
		"prisma:generate": "npx prisma generate",
		"prisma:seed": "node prisma/seed.js",
		"prisma:studio": "npx prisma studio",
		"postinstall": "npx prisma generate",
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"keywords": [],
	"author": "Taqi Ismail, Aong Cho Thing Marma, Md. Sadman Sami Khan",
	"license": "ISC",
	"dependencies": {
		"@prisma/client": "^6.8.2",
		"bcrypt": "^6.0.0",
		"cors": "^2.8.5",
		"dotenv": "^16.5.0",
		"express": "^4.19.2",
		"jsonwebtoken": "^9.0.2",
		"pg": "^8.12.0",
		"prisma": "^6.8.2",
		"zod": "^3.25.46"
	},
	"devDependencies": {
		"nodemon": "^3.1.10"
	},
	"prisma": {
		"seed": "node prisma/seed.js"
	}
}
```

### 4.12. Start the Backend Server

```cmd
npm run dev
```

You should see output similar to:
`Server is running on port 5000`
`Access it at http://localhost:5000`

You can open `http://localhost:5000` in your browser to verify it's running, and `http://localhost:5000/test-db` to confirm the database connection.

---

This comprehensive guide should help you get your UniForm backend running smoothly on Windows with JavaScript\!
