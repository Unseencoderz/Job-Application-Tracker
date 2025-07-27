import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    profile: {
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        avatar: {
            type: String,
            default: null
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        location: {
            type: String,
            maxlength: [100, 'Location cannot exceed 100 characters']
        },
        phoneNumber: {
            type: String,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        },
        linkedinUrl: {
            type: String,
            match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
        },
        githubUrl: {
            type: String,
            match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please enter a valid GitHub URL']
        },
        portfolioUrl: {
            type: String,
            match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
        },
        resumeUrl: {
            type: String,
            match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
        },
        skills: [{
            type: String,
            trim: true,
            maxlength: [50, 'Skill name cannot exceed 50 characters']
        }],
        experience: {
            type: String,
            enum: ['fresher', 'junior', 'mid', 'senior', 'lead', 'executive'],
            default: 'fresher'
        },
        jobPreferences: {
            jobTypes: [{
                type: String,
                enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
            }],
            workMode: [{
                type: String,
                enum: ['remote', 'onsite', 'hybrid']
            }],
            preferredRoles: [{
                type: String,
                trim: true
            }],
            salaryExpectation: {
                min: Number,
                max: Number,
                currency: {
                    type: String,
                    default: 'USD'
                }
            }
        },
        goals: {
            dailyApplicationTarget: {
                type: Number,
                min: [1, 'Daily target must be at least 1'],
                max: [50, 'Daily target cannot exceed 50'],
                default: 5
            },
            weeklyApplicationTarget: {
                type: Number,
                min: [1, 'Weekly target must be at least 1'],
                max: [200, 'Weekly target cannot exceed 200'],
                default: 25
            },
            targetRole: String,
            targetCompanies: [String]
        }
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        },
        reminderFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'never'],
            default: 'daily'
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        }
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('profile.fullName').get(function () {
    if (this.profile.firstName && this.profile.lastName) {
        return `${this.profile.firstName} ${this.profile.lastName}`;
    }
    return this.profile.firstName || this.profile.lastName || this.username;
});

// Index for search optimization
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    return userObject;
};

export default mongoose.model('User', userSchema);