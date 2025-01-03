// // server/models/File.js
// import mongoose from 'mongoose';

// const fileSchema = new mongoose.Schema({
//   fileName: { type: String, required: true },
//   filePath: { type: String, required: true },
//   jsonData: { type: Object, required: true },
//   uploadedAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('File', fileSchema);


import mongoose from 'mongoose';

// Schema for user data
const addressSchema = new mongoose.Schema({
  address_line_1: String,
  address_line_2: String,
  city: String,
  state: String,
  zip_code: String,
  country: String,
});

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  phone_number: String,
});

const socialAccountsSchema = new mongoose.Schema({
  facebook_id: String,
  google_id: String,
  twitter_id: String,
  github_id: String,
});

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  jsonData: [{
    user_id: { type: String, required: true },
    first_name: String,
    last_name: String,
    email: { type: String, required: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ },
    username: String,
    password: String,
    phone_number: String,
    profile_picture_url: String,
    date_of_birth: Date,
    gender: String,
    bio: String,
    address: addressSchema,
    role: String,
    status: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_email_verified: Boolean,
    is_phone_verified: Boolean,
    preferences: {
      theme: String,
      notifications: Boolean,
    },
    last_login_at: Date,
    social_accounts: socialAccountsSchema,
    group_id: String,
    manager_id: String,
    department: String,
    designation: String,
    hire_date: Date,
    salary: Number,
    employment_type: String,
    skills: [String],
    hobbies: [String],
    emergency_contact: emergencyContactSchema,
    marital_status: String,
    nationality: String,
    timezone: String,
    language: String,
    login_attempts: Number,
    is_account_locked: Boolean,
    account_locked_at: Date,
    account_unlocked_at: Date,
  }],
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('File', fileSchema);



// csv file

// user_id,first_name,last_name,email,username,password,phone_number,profile_picture_url,date_of_birth,gender,bio,address_line_1,address_line_2,city,state,zip_code,country,role,status,created_at,updated_at,is_email_verified,is_phone_verified,theme,notifications,last_login_at,facebook_id,google_id,twitter_id,github_id,group_id,manager_id,department,designation,hire_date,salary,employment_type,skills,hobbies,emergency_contact_name,emergency_contact_phone,marital_status,nationality,timezone,language,login_attempts,is_account_locked,account_locked_at,account_unlocked_at
// 12345,John,Doe,john.doe@example.com,johndoe,hashed_password,+1234567890,https://example.com/profile.jpg,1990-01-01,Male,Software engineer with a passion for coding.,123 Main St,Apt 4B,New York,NY,10001,USA,user,active,2024-12-27T12:00:00Z,2024-12-27T12:00:00Z,True,False,dark,True,2024-12-26T11:45:00Z,fb_12345,google_12345,twitter_12345,github_12345,group_001,manager_001,Engineering,Software Engineer,2022-06-15,85000,Full-time,"Python, JavaScript, React","Reading, Gaming, Traveling",Jane Doe,+1987654321,Single,American,UTC-5,English,1,False,,

