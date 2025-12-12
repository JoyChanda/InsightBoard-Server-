# Admin Access Guide - InsightBoard

## 🔐 How to Get Admin Access

### Method 1: Using the Create Admin Script (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd "e:\Web Development Journey\WD Projects\Assignment-11\InsightBoard (BE)"
   ```

2. **Run the create admin script:**
   ```bash
   npm run create-admin
   ```

3. **Default Admin Credentials:**
   - **Email:** `admin@insightboard.com`
   - **Password:** `admin123`
   - **Role:** `admin`

4. **⚠️ IMPORTANT:** Change the default password after first login!

### Method 2: Customize Admin Credentials

Before running the script, you can edit `createAdmin.js` to change the admin details:

```javascript
const adminData = {
  name: "Your Name",
  email: "your-email@example.com",
  password: "your-secure-password",
  role: "admin", // or "superadmin"
  status: "active",
};
```

Then run:
```bash
npm run create-admin
```

### Method 3: Direct Database Access (Advanced)

If you have MongoDB access, you can manually update a user's role:

```javascript
// In MongoDB Shell or Compass
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## 👥 User Roles

The system supports 4 user roles with different access levels:

1. **buyer** (default) - Regular users
2. **manager** - Can manage orders and production
3. **admin** - Full administrative access
4. **superadmin** - Highest level access

## 🚪 Accessing the Admin Dashboard

1. **Login with admin credentials** at the login page
2. **Navigate to Dashboard** - The dashboard will show admin-specific features
3. **Admin Routes** are protected by the `verifyAdmin` middleware

## 🔧 How Admin Authentication Works

### Backend Protection
Admin routes are protected using middleware in `src/middleware/auth.js`:

```javascript
export const verifyAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
```

### Frontend Protection
The frontend checks the user's role before rendering admin components:

```javascript
const { user } = useAuth();
if (user?.role === 'admin' || user?.role === 'superadmin') {
  // Show admin features
}
```

## 📝 Troubleshooting

### Problem: "Admin user already exists"
**Solution:** The admin email is already registered. Either:
- Use the existing admin credentials
- Delete the user from the database and run the script again
- Change the email in `createAdmin.js`

### Problem: "Cannot access admin routes"
**Solution:** Check that:
1. You're logged in with an admin account
2. The JWT token includes the correct role
3. The backend middleware is properly configured

### Problem: "MongoDB connection error"
**Solution:** Ensure:
1. MongoDB is running
2. `.env` file has correct `MONGO_URI`
3. Network/firewall allows MongoDB connections

## 🔄 Changing User Roles

If you need to promote an existing user to admin, you can create a route or use the database directly.

### Option 1: Database Update
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Admin Panel (if implemented)
Use the user management interface to change roles.

## 🛡️ Security Best Practices

1. **Change default passwords immediately**
2. **Use strong passwords** for admin accounts
3. **Limit the number of admin users**
4. **Enable logging** for admin actions
5. **Use HTTPS** in production
6. **Regularly audit** admin access logs

## 📞 Need Help?

If you encounter issues:
1. Check the MongoDB connection
2. Verify your `.env` configuration
3. Check server logs for error messages
4. Ensure all dependencies are installed
