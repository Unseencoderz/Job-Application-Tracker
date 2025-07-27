import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', [
    body('profile.firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    body('profile.lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    body('profile.bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    body('profile.location')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),
    body('profile.phoneNumber')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    body('profile.linkedinUrl')
        .optional()
        .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*$/)
        .withMessage('Please enter a valid LinkedIn URL'),
    body('profile.githubUrl')
        .optional()
        .matches(/^https?:\/\/(www\.)?github\.com\/.*$/)
        .withMessage('Please enter a valid GitHub URL'),
    body('profile.portfolioUrl')
        .optional()
        .isURL()
        .withMessage('Please enter a valid portfolio URL'),
    body('profile.resumeUrl')
        .optional()
        .isURL()
        .withMessage('Please enter a valid resume URL')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id);

        // Update profile fields
        if (req.body.profile) {
            Object.keys(req.body.profile).forEach(key => {
                if (req.body.profile[key] !== undefined) {
                    user.profile[key] = req.body.profile[key];
                }
            });
        }

        // Update preferences if provided
        if (req.body.preferences) {
            Object.keys(req.body.preferences).forEach(key => {
                if (req.body.preferences[key] !== undefined) {
                    user.preferences[key] = req.body.preferences[key];
                }
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update user skills
// @route   PUT /api/user/skills
// @access  Private
router.put('/skills', [
    body('skills')
        .isArray()
        .withMessage('Skills must be an array'),
    body('skills.*')
        .isLength({ max: 50 })
        .withMessage('Each skill cannot exceed 50 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { skills } = req.body;

        const user = await User.findById(req.user.id);
        user.profile.skills = skills.map(skill => skill.trim()).filter(skill => skill.length > 0);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Skills updated successfully',
            skills: user.profile.skills
        });
    } catch (error) {
        console.error('Update skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update job preferences
// @route   PUT /api/user/job-preferences
// @access  Private
router.put('/job-preferences', [
    body('jobPreferences.jobTypes')
        .optional()
        .isArray()
        .withMessage('Job types must be an array'),
    body('jobPreferences.workMode')
        .optional()
        .isArray()
        .withMessage('Work mode must be an array'),
    body('jobPreferences.preferredRoles')
        .optional()
        .isArray()
        .withMessage('Preferred roles must be an array'),
    body('jobPreferences.salaryExpectation.min')
        .optional()
        .isNumeric()
        .withMessage('Minimum salary must be a number'),
    body('jobPreferences.salaryExpectation.max')
        .optional()
        .isNumeric()
        .withMessage('Maximum salary must be a number')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { jobPreferences } = req.body;

        const user = await User.findById(req.user.id);

        // Update job preferences
        Object.keys(jobPreferences).forEach(key => {
            if (jobPreferences[key] !== undefined) {
                if (key === 'salaryExpectation') {
                    user.profile.jobPreferences.salaryExpectation = {
                        ...user.profile.jobPreferences.salaryExpectation,
                        ...jobPreferences[key]
                    };
                } else {
                    user.profile.jobPreferences[key] = jobPreferences[key];
                }
            }
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Job preferences updated successfully',
            jobPreferences: user.profile.jobPreferences
        });
    } catch (error) {
        console.error('Update job preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update goals
// @route   PUT /api/user/goals
// @access  Private
router.put('/goals', [
    body('goals.dailyApplicationTarget')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Daily application target must be between 1 and 50'),
    body('goals.weeklyApplicationTarget')
        .optional()
        .isInt({ min: 1, max: 200 })
        .withMessage('Weekly application target must be between 1 and 200'),
    body('goals.targetRole')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Target role cannot exceed 100 characters'),
    body('goals.targetCompanies')
        .optional()
        .isArray()
        .withMessage('Target companies must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { goals } = req.body;

        const user = await User.findById(req.user.id);

        // Update goals
        Object.keys(goals).forEach(key => {
            if (goals[key] !== undefined) {
                user.profile.goals[key] = goals[key];
            }
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Goals updated successfully',
            goals: user.profile.goals
        });
    } catch (error) {
        console.error('Update goals error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get public profile by username
// @route   GET /api/user/:username
// @access  Public
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return only public information
        const publicProfile = {
            username: user.username,
            profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                fullName: user.profile.fullName,
                avatar: user.profile.avatar,
                bio: user.profile.bio,
                location: user.profile.location,
                linkedinUrl: user.profile.linkedinUrl,
                githubUrl: user.profile.githubUrl,
                portfolioUrl: user.profile.portfolioUrl,
                skills: user.profile.skills,
                experience: user.profile.experience
            },
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            user: publicProfile
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update avatar
// @route   PUT /api/user/avatar
// @access  Private
router.put('/avatar', [
    body('avatar')
        .isURL()
        .withMessage('Avatar must be a valid URL')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { avatar } = req.body;

        const user = await User.findById(req.user.id);
        user.profile.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            avatar: user.profile.avatar
        });
    } catch (error) {
        console.error('Update avatar error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Delete account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', [
    body('password')
        .notEmpty()
        .withMessage('Password is required to delete account')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { password } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Verify password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Deactivate account instead of deleting
        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;