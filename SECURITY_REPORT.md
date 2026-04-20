# Security Vulnerability Report - Placify AI

**Date:** April 11, 2026  
**Project:** Placify AI - Education-Job Alignment Platform  
**Assessment Type:** Manual Security Review  

---

## Executive Summary

This report documents critical and high-severity security vulnerabilities found in the Placify AI application. Immediate remediation is recommended to prevent unauthorized access, data exposure, and potential system compromise.

---

## Critical Vulnerabilities

### 1. Hardcoded API Key in Frontend Code
**Severity:** CRITICAL  
**Location:** `frontend/src/App.js:82-87`

```javascript
const adminHeaders = { 'X-API-Key': 'secret-admin-key' };
```

**Issue:** The admin API key is hardcoded directly in the frontend JavaScript code. This key grants access to:
- `/admin/skill_gaps` - View all students' skill gaps
- `/admin/at_risk_students` - View at-risk student data
- `/api/students` - Access all student records

**Impact:** Any user can view the frontend JavaScript, extract the API key, and gain full administrative access to all student data without authentication.

**Remediation:** 
- Implement proper JWT/Session-based authentication
- Never expose API keys in frontend code
- Use server-side proxy for admin operations

---

### 2. Hardcoded Admin Credentials in Login
**Severity:** CRITICAL  
**Location:** `frontend/src/components/LoginView.js:14,26`

```javascript
const allowedAdmins = ['jatin', 'trilok', 'akshar', 'bhavya', 'jatin trilok akshar bhbaya'];
// ...
if (allowedAdmins.includes(cleanUsername) && cleanPassword === '12345')
```

**Issue:** 
- Admin usernames are hardcoded in client-side JavaScript
- Password "12345" is hardcoded in plaintext
- These credentials are visible to anyone inspecting the frontend code

**Impact:** An attacker can trivially gain admin access using these credentials, allowing them to:
- View all student data
- Access at-risk student information
- Modify student profiles

**Remediation:**
- Implement server-side authentication
- Use secure password hashing (bcrypt/argon2)
- Never hardcode credentials in frontend code

---

### 3. Hardcoded Default API Key in Backend
**Severity:** HIGH  
**Location:** `backend/main.py:18`

```python
API_KEY_CREDENTIAL = os.environ.get("ADMIN_API_KEY", "secret-admin-key")
```

**Issue:** If the `ADMIN_API_KEY` environment variable is not set, the system falls back to a default weak key ("secret-admin-key").

**Impact:** If deployment forgets to set the environment variable, the system uses a predictable default key.

**Remediation:**
- Fail to start if API key is not configured (no defaults)
- Use strong, randomly generated API keys

---

### 4. API Keys Exposed in .env Files
**Severity:** CRITICAL  
**Locations:**
- `backend/.env` - Contains potentially sensitive tokens
- `.env` - Contains Adzuna API credentials
  - `ADZUNA_APP_ID=69a2677f`
  - `ADZUNA_APP_KEY=5e6b85c666e43c2a98d8ebb79dc5d919`

**Issue:** 
- Adzuna API keys are stored in `.env` file
- These credentials are exposed in the project root
- `.env` files may be accidentally committed to version control

**Impact:**
- Third-party API credentials can be stolen
- API quota can be exhausted by attackers
- Financial cost from unauthorized usage

**Remediation:**
- Add `.env` to `.gitignore`
- Never commit secrets to repository
- Use environment-specific secret management (Vault, AWS Secrets Manager)

---

### 5. No Rate Limiting on API Endpoints
**Severity:** HIGH  
**Location:** `backend/main.py`

**Issue:** No rate limiting is implemented on any API endpoints, including:
- `/api/students/login` - Student registration endpoint
- `/parse_resume` - Resume parsing with LLM integration
- `/admin/*` - Admin endpoints

**Impact:**
- Brute force attacks on login endpoint
- API abuse/DoS attacks
- LLM quota exhaustion through repeated calls

**Remediation:** Implement rate limiting (e.g., using `slowapi` or Flask-Limiter)

---

### 6. CORS Allows All Origins in Development
**Severity:** MEDIUM  
**Location:** `backend/main.py:20-26`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Issue:** While currently restricted to localhost, credentials are allowed with wildcard headers/methods.

**Remediation:** 
- In production, properly configure allowed origins
- Remove `allow_credentials=True` if not required

---

## High Vulnerabilities

### 7. No Input Validation on Student Login
**Severity:** HIGH  
**Location:** `backend/main.py:514-555`

```python
@app.post("/api/students/login")
def student_login(payload: dict):
    roll_no = payload.get("roll_no")
    # ... no sanitization
```

**Issue:** 
- No input length limits
- No SQL injection protection (though not using SQL)
- No validation of expected data types

**Remediation:** Add Pydantic models for request validation

---

### 8. No Server-Side Authentication Validation
**Severity:** HIGH  
**Location:** `frontend/src/components/LoginView.js`

**Issue:** 
- All authentication logic is performed in the frontend
- No server-side verification of admin credentials
- Server accepts any student login without validation

**Impact:** Client-side auth can be bypassed entirely by calling API directly.

---

### 9. Student Data Stored in Plain JSON Files
**Severity:** HIGH  
**Location:** `backend/data/student_data.json`

**Issue:** 
- All student data stored in unencrypted JSON files
- No access control on data files
- Anyone with file system access can read/modify data

**Remediation:** Use a proper database with encryption at rest

---

### 10. Previous RCE Vulnerability (Noted as Fixed)
**Severity:** INFO  
**Location:** `backend/main.py:832-841`

```python
# ----- Python Local Compilation Fallback (REMOVED FOR SECURITY) -----
# Local execution of user-submitted code is a critical RCE vulnerability.
```

**Note:** The code acknowledges a previous Remote Code Execution vulnerability that has been addressed by disabling local Python execution. This is good security awareness.

---

## Summary Table

| Vulnerability | Severity | Type | Fix Complexity |
|--------------|----------|------|----------------|
| Hardcoded API Key in Frontend | CRITICAL | Auth/Business Logic | Medium |
| Hardcoded Admin Credentials | CRITICAL | Auth | Medium |
| API Keys in .env Files | CRITICAL | Secrets Management | Easy |
| Default Fallback API Key | HIGH | Configuration | Easy |
| No Rate Limiting | HIGH | DoS Protection | Medium |
| No Server-Side Auth Validation | HIGH | Auth | Medium |
| Plain JSON Storage | HIGH | Data Protection | Hard |
| CORS Misconfiguration | MEDIUM | Network | Easy |

---

## Recommendations Priority

1. **Immediate (Fix Today):**
   - Remove hardcoded credentials from frontend
   - Add `.env` to `.gitignore`
   - Implement server-side authentication

2. **This Week:**
   - Remove default API key fallback
   - Implement rate limiting
   - Add proper input validation with Pydantic

3. **This Month:**
   - Migrate to database storage
   - Implement JWT/session authentication
   - Add security headers (CSP, HSTS, etc.)

---

*Report generated for security assessment purposes.*