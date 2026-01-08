# Jeevan-Rakth Backend Setup Instructions

## MongoDB Configuration

1. **Update `.env.local` file** with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_cluster_connection_string
   NEXTAUTH_SECRET=generate_a_random_secret_string_here
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Get your MongoDB URI**:
   - Go to your MongoDB Atlas cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name (e.g., `jeevan-rakth`)

   Example:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jeevan-rakth?retryWrites=true&w=majority
   ```

3. **Generate NEXTAUTH_SECRET**:
   Run this command in terminal:
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string generator

## Features Implemented

### Authentication System
- ✅ User registration with role selection (Donor, Hospital, NGO)
- ✅ Email and password validation
- ✅ Password requirements: minimum 6 characters with at least one special character
- ✅ Role-based field validation (phone required for Donor and NGO)
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP-only cookies for secure token storage

### User Roles
1. **Donor** - Can donate blood and save lives
2. **Hospital** - Can manage blood inventory
3. **NGO** - Can organize donation drives

### API Routes
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user

### Role-Based Dashboards
- `/dashboard/donor` - Donor dashboard
- `/dashboard/hospital` - Hospital dashboard
- `/dashboard/ngo` - NGO dashboard

## How to Use

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Create an Account
- Go to `/signup`
- Select your role (Donor, Hospital, or NGO)
- Fill in the required fields:
  - Name
  - Email
  - Phone (for Donor and NGO only)
  - Password (min 6 characters with special character)
  - Confirm Password
  - Agree to terms
- Click "Create Account"

### 3. Login
- After successful registration, you'll be redirected to `/login`
- Enter your email and password
- Upon successful login, you'll be redirected to your role-specific dashboard

## Password Requirements
- Minimum 6 characters
- Must contain at least one special character (!@#$%^&*(),.?":{}|<>)

## Security Features
- Passwords are hashed using bcryptjs (12 rounds)
- JWT tokens stored in HTTP-only cookies
- Tokens expire after 7 days
- Password validation on both frontend and backend
- Email uniqueness validation

## Next Steps (To Be Implemented)
- Google OAuth authentication
- Email verification
- Password reset functionality
- User profile management
- Enhanced dashboard features per role

## Troubleshooting

### MongoDB Connection Error
- Verify your MongoDB URI is correct
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### Password Validation Error
Make sure your password:
- Is at least 6 characters long
- Contains at least one special character

### Login Issues
- Check if you're using the correct email and password
- Verify that your account was created successfully
- Clear browser cookies and try again
