import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all applications for user
// @route   GET /api/applications
// @access  Private
router.get('/', [
    query('status').optional().isIn(['applied', 'in_review', 'interview', 'technical_test', 'offer', 'rejected', 'withdrawn', 'ghosted']),
    query('company').optional().isLength({ max: 100 }),
    query('search').optional().isLength({ max: 200 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['newest', 'oldest', 'company', 'status', 'priority'])
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

        const {
            status,
            company,
            search,
            page = 1,
            limit = 20,
            sort = 'newest'
        } = req.query;

        // Build filter object
        const filter = { user: req.user.id, isArchived: false };

        if (status) filter.status = status;
        if (company) filter.company = new RegExp(company, 'i');
        if (search) {
            filter.$or = [
                { jobTitle: new RegExp(search, 'i') },
                { company: new RegExp(search, 'i') },
                { notes: new RegExp(search, 'i') }
            ];
        }

        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'oldest':
                sortObj = { applicationDate: 1 };
                break;
            case 'company':
                sortObj = { company: 1, applicationDate: -1 };
                break;
            case 'status':
                sortObj = { status: 1, applicationDate: -1 };
                break;
            case 'priority':
                sortObj = { priority: -1, applicationDate: -1 };
                break;
            default:
                sortObj = { applicationDate: -1 };
        }

        const skip = (page - 1) * limit;

        const [applications, totalCount] = await Promise.all([
            Application.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('user', 'username profile.firstName profile.lastName'),
            Application.countDocuments(filter)
        ]);

        // Calculate stats
        const stats = await Application.aggregate([
            { $match: { user: req.user._id, isArchived: false } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    applied: { $sum: { $cond: [{ $eq: ['$status', 'applied'] }, 1, 0] } },
                    inReview: { $sum: { $cond: [{ $eq: ['$status', 'in_review'] }, 1, 0] } },
                    interview: { $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] } },
                    technicalTest: { $sum: { $cond: [{ $eq: ['$status', 'technical_test'] }, 1, 0] } },
                    offer: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                    withdrawn: { $sum: { $cond: [{ $eq: ['$status', 'withdrawn'] }, 1, 0] } },
                    ghosted: { $sum: { $cond: [{ $eq: ['$status', 'ghosted'] }, 1, 0] } }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: applications,
            stats: stats[0] || {
                total: 0, applied: 0, inReview: 0, interview: 0,
                technicalTest: 0, offer: 0, rejected: 0, withdrawn: 0, ghosted: 0
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('user', 'username profile.firstName profile.lastName');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
router.post('/', [
    body('jobTitle')
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ max: 200 })
        .withMessage('Job title cannot exceed 200 characters'),
    body('company')
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ max: 100 })
        .withMessage('Company name cannot exceed 100 characters'),
    body('status')
        .optional()
        .isIn(['applied', 'in_review', 'interview', 'technical_test', 'offer', 'rejected', 'withdrawn', 'ghosted']),
    body('applicationDate')
        .optional()
        .isISO8601()
        .withMessage('Application date must be a valid date'),
    body('jobDetails.url')
        .optional()
        .isURL()
        .withMessage('Job URL must be a valid URL'),
    body('notes')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Notes cannot exceed 5000 characters')
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

        const applicationData = {
            ...req.body,
            user: req.user.id
        };

        const application = await Application.create(applicationData);

        // Add initial timeline event
        await application.addTimelineEvent(
            'applied',
            'Application submitted',
            `Applied for ${application.jobTitle} at ${application.company}`
        );

        res.status(201).json({
            success: true,
            message: 'Application created successfully',
            data: application
        });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
router.put('/:id', [
    body('jobTitle')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Job title cannot exceed 200 characters'),
    body('company')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Company name cannot exceed 100 characters'),
    body('status')
        .optional()
        .isIn(['applied', 'in_review', 'interview', 'technical_test', 'offer', 'rejected', 'withdrawn', 'ghosted']),
    body('notes')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Notes cannot exceed 5000 characters')
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

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Store old status for timeline
        const oldStatus = application.status;

        // Update application
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                if (key === 'jobDetails' && application.jobDetails) {
                    application.jobDetails = { ...application.jobDetails, ...req.body[key] };
                } else {
                    application[key] = req.body[key];
                }
            }
        });

        await application.save();

        // Add timeline event for status change
        if (req.body.status && req.body.status !== oldStatus) {
            await application.addTimelineEvent(
                'status_updated',
                `Status changed to ${req.body.status}`,
                `Application status updated from ${oldStatus} to ${req.body.status}`
            );
        }

        res.status(200).json({
            success: true,
            message: 'Application updated successfully',
            data: application
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await Application.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Archive/Unarchive application
// @route   PATCH /api/applications/:id/archive
// @access  Private
router.patch('/:id/archive', async (req, res) => {
    try {
        const { archived = true } = req.body;

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.isArchived = archived;
        if (archived && !application.archivedAt) {
            application.archivedAt = new Date();
        } else if (!archived) {
            application.archivedAt = undefined;
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${archived ? 'archived' : 'unarchived'} successfully`,
            data: application
        });
    } catch (error) {
        console.error('Archive application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Add task to application
// @route   POST /api/applications/:id/tasks
// @access  Private
router.post('/:id/tasks', [
    body('title')
        .notEmpty()
        .withMessage('Task title is required')
        .isLength({ max: 200 })
        .withMessage('Task title cannot exceed 200 characters'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Task description cannot exceed 1000 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
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

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.tasks.push(req.body);
        await application.save();

        res.status(201).json({
            success: true,
            message: 'Task added successfully',
            data: application.tasks[application.tasks.length - 1]
        });
    } catch (error) {
        console.error('Add task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update task
// @route   PUT /api/applications/:id/tasks/:taskId
// @access  Private
router.put('/:id/tasks/:taskId', async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const task = application.tasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                task[key] = req.body[key];
            }
        });

        if (req.body.completed && !task.completedAt) {
            task.completedAt = new Date();
        } else if (req.body.completed === false) {
            task.completedAt = undefined;
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Delete task
// @route   DELETE /api/applications/:id/tasks/:taskId
// @access  Private
router.delete('/:id/tasks/:taskId', async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.tasks.id(req.params.taskId).remove();
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Add timeline event
// @route   POST /api/applications/:id/timeline
// @access  Private
router.post('/:id/timeline', [
    body('type')
        .notEmpty()
        .isIn(['applied', 'interview_scheduled', 'interview_completed', 'test_sent', 'test_completed', 'offer_received', 'rejected', 'followed_up', 'status_updated', 'note_added']),
    body('title')
        .notEmpty()
        .withMessage('Timeline event title is required'),
    body('description')
        .optional()
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

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const { type, title, description, metadata } = req.body;

        await application.addTimelineEvent(type, title, description, metadata);

        const newEvent = application.timeline[application.timeline.length - 1];

        res.status(201).json({
            success: true,
            message: 'Timeline event added successfully',
            data: newEvent
        });
    } catch (error) {
        console.error('Add timeline event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;