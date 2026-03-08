const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db"); // your PostgreSQL pool
const PORT = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey123"; // use env var in production

const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Max 10 files
    fieldSize: 50 * 1024 * 1024 // 50MB for fields
  }
});

app.post("/api/AdminSignin", async (req, res) => {
  const { username, password } = req.body;

  console.log("Admin signin attempt:", username);

  // Check if fields are empty
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password required"
    });
  }

  try {
    // Hardcoded admin credentials
    const adminUsername = "admin";
    const adminPassword = "admin123";

    if (username === adminUsername && password === adminPassword) {
      // Create JWT token
      const token = jwt.sign(
        {
          adminId: 1,
          username: adminUsername,
          role: "admin",
          email: "admin@university.edu"
        },
        SECRET_KEY,
        { expiresIn: "8h" }
      );

      // Return success response
      return res.json({
        success: true,
        message: "Admin login successful",
        token: token,
        admin: {
          id: 1,
          username: adminUsername,
          email: "admin@university.edu",
          role: "admin"
        }
      });
    } else {
      // Wrong credentials
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

  } catch (error) {
    console.error("AdminSignin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

// ===================== ADMIN AUTHENTICATION MIDDLEWARE =====================
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Access denied. No token provided." 
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }
    
    // Check if the user is an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }
    
    req.admin = decoded;
    next();
  });
};

// ===================== ADMIN PORTAL ENDPOINTS (WITH MOCK DATA) =====================

// Mock data for testing
const mockStudents = [
  {
    id: 1,
    username: "john_doe",
    fullname: "John Doe",
    program: "Computer Science",
    email: "john@example.com",
    flag: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    username: "jane_smith",
    fullname: "Jane Smith",
    program: "Business Administration",
    email: "jane@example.com",
    flag: false,
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    username: "alex_wong",
    fullname: "Alex Wong",
    program: "Electrical Engineering",
    email: "alex@example.com",
    flag: true,
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    username: "sara_jones",
    fullname: "Sara Jones",
    program: "Medicine",
    email: "sara@example.com",
    flag: true,
    created_at: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    username: "mike_brown",
    fullname: "Mike Brown",
    program: "Law",
    email: "mike@example.com",
    flag: false,
    created_at: "2024-01-11T11:10:00Z"
  }
];

// Mock documents
const mockDocuments = [
  {
    id: 1,
    document_type: "transcript",
    file_name: "john_transcript.pdf",
    file_size: 1024000,
    mime_type: "application/pdf",
    uploaded_at: "2024-01-15T10:35:00Z",
    username: "john_doe",
    fullname: "John Doe"
  },
  {
    id: 2,
    document_type: "id_card",
    file_name: "jane_id.jpg",
    file_size: 512000,
    mime_type: "image/jpeg",
    uploaded_at: "2024-01-14T14:25:00Z",
    username: "jane_smith",
    fullname: "Jane Smith"
  }
];

// Admin Dashboard Statistics (with mock data)
app.get("/api/AdminPortal", authenticateAdmin, async (req, res) => {
  try {
    // Mock statistics
    const totalStudents = mockStudents.length;
    const completedApplications = mockStudents.filter(s => s.flag).length;
    const pendingApplications = mockStudents.filter(s => !s.flag).length;
    const totalDocuments = mockDocuments.length;

    // Get recent applications (last 3)
    const recentApplications = mockStudents.slice(0, 3);

    res.json({
      success: true,
      totalStudents: totalStudents,
      pendingApplications: pendingApplications,
      completedApplications: completedApplications,
      totalDocuments: totalDocuments,
      recentApplications: recentApplications,
      adminInfo: req.admin
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to load dashboard data" 
    });
  }
});
// --- Signin route ---
app.post("/api/Signin", async (req, res) => {
  const { Username, password } = req.body;

  if (!Username || !password) {
    return res.status(400).json({ message: "All fields are required..!" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM REGISTER WHERE username = $1',
      [Username.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.username, role: "Student" },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullname,
        program: user.program,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// --- Middleware to verify token ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

//////////////////////////////////////

app.get("/api/StudentDashboard", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM REGISTER WHERE id = $1",
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student data not found" });
    }

    // IMPORTANT: return in the shape the frontend expects
    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/View_Application", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch all data from the three tables in parallel
    const [personalInfo, academicInfo, programInfo] = await Promise.all([
      pool.query('SELECT * FROM personal_information WHERE id = $1', [userId]),
      pool.query('SELECT * FROM academic_information WHERE id = $1', [userId]),
      pool.query('SELECT * FROM program_information WHERE id = $1', [userId])
    ]);

    // Combine all data into a single response
    const applicationData = {
      personal: personalInfo.rows[0] || {},
      academic: academicInfo.rows[0] || {},
      program: programInfo.rows[0] || {}
    };

    console.log("✅ Application data fetched for user:", userId);
    
    res.json({
      success: true,
      data: applicationData
    });

  } catch (error) {
    console.error("❌ Error fetching application data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application data"
    });
  }
});

app.get("/api/Documents/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        document_type,
        file_name,
        file_data,
        file_size,
        mime_type
      FROM documents
      ORDER BY id ASC
    `);

    // Convert BYTEA → Buffer explicitly (safe)
    const documents = result.rows.map(doc => ({
      id: doc.id,
      document_type: doc.document_type,
      file_name: doc.file_name,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      file_data: doc.file_data.toString("base64") // 👈 required for JSON
    }));

    res.json({
      success: true,
      count: documents.length,
      documents
    });

  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch documents"
    });
  }
});

// --- Signup route (unchanged, unchanged response shape) ---
// app.post("/api/Signup", async (req, res) => {
//   const { program, fullName, username, email, password, confirmPassword } = req.body;

//   if (!program || !fullName || !username || !email || !password || !confirmPassword) {
//     return res.status(400).json({ message: "All fields are required..!" });
//   }

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       'INSERT INTO REGISTER (program, fullname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, fullname, email, program',
//       [program, fullName, username.toLowerCase(), email, hashedPassword]
//     );

//     return res.status(201).json({
//       message: "Signup successful",
//       user: result.rows[0],
//     });
//   } catch (err) {
//     console.error("Signup error:", err.message);
//     return res.status(500).json({ message: "Database error" });
//   }
// });

//////////////////////////////////////

app.post("/api/AddStudent", authenticateAdmin, upload.any(), async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('📥 Received request body:', req.body);
    console.log('📥 Received files:', req.files);

    // Parse JSON data from FormData
    const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {};
    const programInfo = req.body.programInfo ? JSON.parse(req.body.programInfo) : {};
    const academicInfo = req.body.academicInfo ? JSON.parse(req.body.academicInfo) : {};

    await client.query('BEGIN');

    // ✅ FIXED: Generate Registration Number FIRST
    const generateRegistrationNo = (studentId, department) => {
      const deptCode = department.substring(0, 3).toUpperCase();
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const paddedStudentId = studentId.toString().padStart(6, '0');
      return `REG${deptCode}${currentYear}${paddedStudentId}`.replace(/\s+/g, '');
    };

    // Generate temporary registration number using timestamp
    const tempId = Date.now().toString().slice(-6);
    const tempRegistrationNo = generateRegistrationNo(tempId, programInfo.selectedProgram);

    // 2. Generate and Hash Password
    const generateStudentPassword = (length = 10) => {
      const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const lowercase = 'abcdefghijkmnopqrstuvwxyz';
      const numbers = '23456789';
      
      const charset = uppercase + lowercase + numbers;
      
      let password = '';
      const randomBytes = crypto.randomBytes(length);
      
      for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length];
      }
      
      return password;
    };

    const plainPassword = generateStudentPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3. Create Student in REGISTER Table with temporary registration number
    const result = await client.query(
      `INSERT INTO REGISTER (
        program, fullname, username, email, password, 
        registration_no, semester, department_name, flag, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) 
      RETURNING id, username, fullname, email, program, registration_no`,
      [
        programInfo.programLevel,
        personalInfo.name,
        personalInfo.emailAddress,
        personalInfo.emailAddress,
        hashedPassword,
        tempRegistrationNo, // ✅ Use temporary registration number
        1,
        programInfo.selectedProgram,
        false
      ]
    );

    const studentId = result.rows[0].id;

    // ✅ Generate final registration number using the actual student ID
    const finalRegistrationNo = generateRegistrationNo(studentId, programInfo.selectedProgram);

    // ✅ Update the registration number with the final one
    await client.query(
      'UPDATE REGISTER SET registration_no = $1 WHERE id = $2',
      [finalRegistrationNo, studentId]
    );

    // 4. Save Personal Information
    if (Object.keys(personalInfo).length > 0) {
      const personalQuery = `
        INSERT INTO personal_information (
          id, name, father_name, religion, dob, gender, marital_status,
          nationality, domicile, cnic, email_address, mobile,
          permanent_address, current_address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) 
        DO UPDATE SET
          name = $2, father_name = $3, religion = $4, dob = $5, gender = $6,
          marital_status = $7, nationality = $8, domicile = $9, cnic = $10,
          email_address = $11, mobile = $12, permanent_address = $13,
          current_address = $14
      `;

      await client.query(personalQuery, [
        studentId,
        personalInfo.name,
        personalInfo.fatherName,
        personalInfo.religion,
        personalInfo.dob,
        personalInfo.gender,
        personalInfo.meritalStatus,
        personalInfo.nationality,
        personalInfo.domicile,
        personalInfo.cnic,
        personalInfo.emailAddress,
        personalInfo.mobile,
        personalInfo.permanentAddress,
        personalInfo.currentAddress
      ]);
    }

    // 5. Save Program Information
    if (Object.keys(programInfo).length > 0) {
      const programQuery = `
        INSERT INTO program_information (
          id, program, course, scholarship_interest
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) 
        DO UPDATE SET
          program = $2, course = $3, scholarship_interest = $4
      `;

      await client.query(programQuery, [
        studentId,
        programInfo.programLevel,
        programInfo.selectedProgram,
        programInfo.scholarshipInterest
      ]);
    }

    // 6. Save Academic Information
    if (Object.keys(academicInfo).length > 0) {
      const parseMarks = (marksString) => {
        if (!marksString) return { obtained: null, total: null };
        const parts = marksString.split('/').map(part => part.trim());
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return {
            obtained: parseInt(parts[0]),
            total: parseInt(parts[1])
          };
        }
        return { obtained: null, total: null };
      };

      const matricParsed = parseMarks(academicInfo.matricMarks);
      const interParsed = parseMarks(academicInfo.interMarks);

      const matricPercent = matricParsed.total > 0 ? 
        (matricParsed.obtained / matricParsed.total * 100).toFixed(2) : null;
      const interPercent = interParsed.total > 0 ? 
        (interParsed.obtained / interParsed.total * 100).toFixed(2) : null;

      const academicQuery = `
        INSERT INTO academic_information (
          id, 
          matric_board, matric_year, matric_marks, matric_obtained, matric_total, matric_percent,
          inter_board, inter_year, inter_marks, inter_obtained, inter_total, inter_percent,
          bachelor_title, bachelor_university, bachelor_cgpa,
          master_title, master_university, master_cgpa,
          phd_title, phd_university, phd_cgpa
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (id) 
        DO UPDATE SET
          matric_board = $2, matric_year = $3, matric_marks = $4, matric_obtained = $5, 
          matric_total = $6, matric_percent = $7, inter_board = $8, inter_year = $9,
          inter_marks = $10, inter_obtained = $11, inter_total = $12, inter_percent = $13,
          bachelor_title = $14, bachelor_university = $15, bachelor_cgpa = $16,
          master_title = $17, master_university = $18, master_cgpa = $19,
          phd_title = $20, phd_university = $21, phd_cgpa = $22
      `;

      await client.query(academicQuery, [
        studentId,
        academicInfo.matricBoard,
        academicInfo.matricYear,
        academicInfo.matricMarks,
        matricParsed.obtained,
        matricParsed.total,
        matricPercent,
        academicInfo.interBoard,
        academicInfo.interYear,
        academicInfo.interMarks,
        interParsed.obtained,
        interParsed.total,
        interPercent,
        academicInfo.bachelorTitle,
        academicInfo.bachelorUni,
        academicInfo.bachelorCGPA,
        academicInfo.masterTitle,
        academicInfo.masterUni,
        academicInfo.masterCGPA,
        academicInfo.phdTitle,
        academicInfo.phdUni,
        academicInfo.phdCGPA
      ]);
    }

    // 7. Save Documents
    if (req.files && req.files.length > 0) {
      const documentsQuery = `
        INSERT INTO documents (
          register_id, document_type, file_name, file_data, file_size, mime_type
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (register_id, document_type) 
        DO UPDATE SET
          file_name = $3, file_data = $4, file_size = $5, 
          mime_type = $6, uploaded_at = CURRENT_TIMESTAMP
      `;

      for (const file of req.files) {
        await client.query(documentsQuery, [
          studentId,
          file.fieldname,
          file.originalname,
          file.buffer,
          file.size,
          file.mimetype
        ]);
      }
    }

    // 8. Update flag
    await client.query(
      'UPDATE register SET flag = true WHERE id = $1', 
      [studentId]
    );

    await client.query('COMMIT');

    // 9. Send Welcome Email to Student
    try {
      // Configure email transporter
      const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.UNIVERSITY_EMAIL || 'university.admissions.pk@outlook.com',
          pass: process.env.EMAIL_PASSWORD || 'hsrcpfbcinfbueiq'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"University Admissions Office" <${process.env.UNIVERSITY_EMAIL || 'admissions@university.edu.pk'}>`,
        to: personalInfo.emailAddress,
        subject: 'Welcome to University - Your Student Portal Access',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .credentials { background-color: #e8f4fc; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
              .btn { display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
              .important { color: #e74c3c; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>XYZ University</h1>
              <p>Admissions Office</p>
            </div>
            
            <div class="content">
              <h2>Dear ${personalInfo.name},</h2>
              
              <p>We are delighted to inform you that your admission to <strong>${programInfo.selectedProgram}</strong> 
              has been successfully processed and confirmed.</p>
              
              <p>Welcome to XYZ University! We are excited to have you join our academic community.</p>
              
              <div class="credentials">
                <h3>🔐 Your Student Portal Login Credentials:</h3>
                <p><strong>Registration Number:</strong> ${finalRegistrationNo}</p>
                <p><strong>Username/Email:</strong> ${personalInfo.emailAddress}</p>
                <p><strong>Temporary Password:</strong> ${plainPassword}</p>
                <p><strong>Portal URL:</strong> https://portal.university.edu.pk</p>
              </div>
              
              <p>
                <a href="https://portal.university.edu.pk" class="btn">
                  Access Student Portal
                </a>
              </p>
              
              <p class="important">⚠️ IMPORTANT: For security reasons, please change your password immediately after first login.</p>
              
              <h3>📋 Next Steps:</h3>
              <ol>
                <li>Login to the student portal using the credentials above</li>
                <li>Complete your profile information</li>
                <li>Check your class schedule</li>
                <li>Review the academic calendar</li>
                <li>Connect with your academic advisor</li>
              </ol>
              
              <p>If you encounter any issues accessing the portal, please contact the IT Help Desk at 
              <a href="mailto:helpdesk@university.edu.pk">helpdesk@university.edu.pk</a> or call 021-XXXXXXX.</p>
              
              <p>We wish you a successful and enriching academic journey with us!</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>
              <strong>Admissions Office</strong><br>
              XYZ University<br>
              Main Campus, Karachi<br>
              Phone: 021-XXXXXXX<br>
              Email: <a href="mailto:admissions@university.edu.pk">admissions@university.edu.pk</a></p>
              
              <p><small>This is an automated email. Please do not reply to this message.</small></p>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', personalInfo.emailAddress);
      
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Don't fail the whole process if email fails
    }

    // 10. Send Response
    res.status(200).json({
      success: true,
      message: "Student added successfully",
      data: {
        studentId: studentId,
        registrationNo: finalRegistrationNo,
        name: personalInfo.name,
        email: personalInfo.emailAddress,
        program: programInfo.selectedProgram,
        temporaryPassword: plainPassword,
        note: "This password is only shown temporarily for debugging. Student should check their email for credentials."
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Add student error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error adding student",
      error: error.message 
    });
  } finally {
    client.release();
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const { semester } = req.query;
    
    if (!semester) {
      return res.status(400).json({ 
        error: "Semester parameter is required. Use /api/courses?semester=1" 
      });
    }

    const query = `
      SELECT * FROM computer_science 
      WHERE semester = $1 
      ORDER BY course_code
    `;
    
    const result = await pool.query(query, [semester]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: `No courses found for semester ${semester}` 
      });
    }
    
    res.json({
      semester: semester,
      count: result.rows.length,
      courses: result.rows
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});