import express from 'express';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get application analytics overview
// @route   GET /api/analytics/overview
// @access  Private
router.get('/overview', async (req, res) => {
    try {
        const userId = req.user._id;

        // Get overall stats
        const overallStats = await Application.aggregate([
            { $match: { user: userId } },
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
                    ghosted: { $sum: { $cond: [{ $eq: ['$status', 'ghosted'] }, 1, 0] } },
                    avgResponseTime: {
                        $avg: {
                            $cond: [
                                { $and: [{ $ne: ['$responseDate', null] }, { $ne: ['$applicationDate', null] }] },
                                { $divide: [{ $subtract: ['$responseDate', '$applicationDate'] }, 1000 * 60 * 60 * 24] },
                                null
                            ]
                        }
                    }
                }
            }
        ]);

        // Get applications by month (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const applicationsByMonth = await Application.aggregate([
            {
                $match: {
                    user: userId,
                    applicationDate: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$applicationDate' },
                        month: { $month: '$applicationDate' }
                    },
                    count: { $sum: 1 },
                    offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
                    interviews: { $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Get top companies applied to
        const topCompanies = await Application.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$company',
                    count: { $sum: 1 },
                    offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
                    interviews: { $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get status distribution
        const statusDistribution = await Application.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get response rate by application source
        const responseBySource = await Application.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$applicationSource',
                    total: { $sum: 1 },
                    responses: {
                        $sum: {
                            $cond: [
                                { $ne: ['$responseDate', null] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    responseRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$responses', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { responseRate: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: overallStats[0] || {
                    total: 0, applied: 0, inReview: 0, interview: 0,
                    technicalTest: 0, offer: 0, rejected: 0, withdrawn: 0, ghosted: 0,
                    avgResponseTime: 0
                },
                applicationsByMonth,
                topCompanies,
                statusDistribution,
                responseBySource
            }
        });
    } catch (error) {
        console.error('Get analytics overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get weekly application stats
// @route   GET /api/analytics/weekly
// @access  Private
router.get('/weekly', async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyStats = await Application.aggregate([
            {
                $match: {
                    user: userId,
                    applicationDate: { $gte: weekAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$applicationDate'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get user's weekly target
        const user = req.user;
        const weeklyTarget = user.profile?.goals?.weeklyApplicationTarget || 25;

        // Calculate total applications this week
        const totalThisWeek = weeklyStats.reduce((sum, day) => sum + day.count, 0);

        res.status(200).json({
            success: true,
            data: {
                dailyApplications: weeklyStats,
                totalThisWeek,
                weeklyTarget,
                progress: Math.round((totalThisWeek / weeklyTarget) * 100)
            }
        });
    } catch (error) {
        console.error('Get weekly analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
router.get('/performance', async (req, res) => {
    try {
        const userId = req.user._id;

        // Calculate success rates
        const performanceMetrics = await Application.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['interview', 'offer']] },
                                1,
                                0
                            ]
                        }
                    },
                    offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
                    responses: {
                        $sum: {
                            $cond: [
                                { $ne: ['$responseDate', null] },
                                1,
                                0
                            ]
                        }
                    },
                    avgDaysSinceApplication: {
                        $avg: {
                            $divide: [
                                { $subtract: [new Date(), '$applicationDate'] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    interviewRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$interviews', '$total'] }, 100] },
                            0
                        ]
                    },
                    offerRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$offers', '$total'] }, 100] },
                            0
                        ]
                    },
                    responseRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$responses', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            }
        ]);

        // Get best performing job types
        const jobTypePerformance = await Application.aggregate([
            { $match: { user: userId, 'jobDetails.jobType': { $exists: true } } },
            {
                $group: {
                    _id: '$jobDetails.jobType',
                    total: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['interview', 'offer']] },
                                1,
                                0
                            ]
                        }
                    },
                    offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    interviewRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$interviews', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { interviewRate: -1 } }
        ]);

        // Get work mode performance
        const workModePerformance = await Application.aggregate([
            { $match: { user: userId, 'jobDetails.workMode': { $exists: true } } },
            {
                $group: {
                    _id: '$jobDetails.workMode',
                    total: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['interview', 'offer']] },
                                1,
                                0
                            ]
                        }
                    },
                    offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    interviewRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$interviews', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { interviewRate: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                metrics: performanceMetrics[0] || {
                    total: 0, interviews: 0, offers: 0, responses: 0,
                    interviewRate: 0, offerRate: 0, responseRate: 0,
                    avgDaysSinceApplication: 0
                },
                jobTypePerformance,
                workModePerformance
            }
        });
    } catch (error) {
        console.error('Get performance analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get upcoming tasks and deadlines
// @route   GET /api/analytics/tasks
// @access  Private
router.get('/tasks', async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Get applications with upcoming tasks
        const upcomingTasks = await Application.aggregate([
            { $match: { user: userId } },
            { $unwind: '$tasks' },
            {
                $match: {
                    'tasks.completed': false,
                    'tasks.dueDate': { $exists: true, $lte: weekFromNow }
                }
            },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'application'
                }
            },
            { $unwind: '$application' },
            {
                $project: {
                    _id: '$tasks._id',
                    title: '$tasks.title',
                    description: '$tasks.description',
                    dueDate: '$tasks.dueDate',
                    priority: '$tasks.priority',
                    application: {
                        _id: '$application._id',
                        jobTitle: '$application.jobTitle',
                        company: '$application.company',
                        status: '$application.status'
                    },
                    isOverdue: { $lt: ['$tasks.dueDate', now] }
                }
            },
            { $sort: { dueDate: 1 } }
        ]);

        // Get task statistics
        const taskStats = await Application.aggregate([
            { $match: { user: userId } },
            { $unwind: '$tasks' },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: ['$tasks.completed', 1, 0] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$tasks.completed', false] },
                                        { $lt: ['$tasks.dueDate', now] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    dueThisWeek: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$tasks.completed', false] },
                                        { $gte: ['$tasks.dueDate', now] },
                                        { $lte: ['$tasks.dueDate', weekFromNow] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                upcomingTasks,
                stats: taskStats[0] || {
                    total: 0,
                    completed: 0,
                    overdue: 0,
                    dueThisWeek: 0
                }
            }
        });
    } catch (error) {
        console.error('Get task analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get recent activity timeline
// @route   GET /api/analytics/activity
// @access  Private
router.get('/activity', async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 20 } = req.query;

        // Get recent timeline events across all applications
        const recentActivity = await Application.aggregate([
            { $match: { user: userId } },
            { $unwind: '$timeline' },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'application'
                }
            },
            { $unwind: '$application' },
            {
                $project: {
                    _id: '$timeline._id',
                    type: '$timeline.type',
                    title: '$timeline.title',
                    description: '$timeline.description',
                    date: '$timeline.date',
                    metadata: '$timeline.metadata',
                    application: {
                        _id: '$application._id',
                        jobTitle: '$application.jobTitle',
                        company: '$application.company',
                        status: '$application.status'
                    }
                }
            },
            { $sort: { date: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({
            success: true,
            data: recentActivity
        });
    } catch (error) {
        console.error('Get activity analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;