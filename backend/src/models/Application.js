import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Task title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Task description cannot exceed 1000 characters']
    },
    dueDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    completedAt: Date
}, {
    timestamps: true
});

const timelineEventSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['applied', 'interview_scheduled', 'interview_completed', 'test_sent', 'test_completed', 'offer_received', 'rejected', 'followed_up', 'status_updated', 'note_added'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [200, 'Job title cannot exceed 200 characters']
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    status: {
        type: String,
        enum: ['applied', 'in_review', 'interview', 'technical_test', 'offer', 'rejected', 'withdrawn', 'ghosted'],
        default: 'applied'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    jobDetails: {
        url: {
            type: String,
            match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
        },
        description: {
            type: String,
            maxlength: [5000, 'Job description cannot exceed 5000 characters']
        },
        requirements: [String],
        salary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            },
            type: {
                type: String,
                enum: ['hourly', 'monthly', 'yearly'],
                default: 'yearly'
            }
        },
        location: String,
        workMode: {
            type: String,
            enum: ['remote', 'onsite', 'hybrid']
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
        }
    },
    applicationSource: {
        type: String,
        enum: ['company_website', 'linkedin', 'indeed', 'glassdoor', 'referral', 'recruiter', 'job_board', 'other'],
        default: 'other'
    },
    contactPerson: {
        name: String,
        email: String,
        phone: String,
        role: String,
        linkedinUrl: String
    },
    resumeUsed: {
        version: String,
        url: String,
        notes: String
    },
    coverLetter: {
        used: {
            type: Boolean,
            default: false
        },
        customized: {
            type: Boolean,
            default: false
        },
        url: String
    },
    followUps: [{
        date: {
            type: Date,
            default: Date.now
        },
        method: {
            type: String,
            enum: ['email', 'phone', 'linkedin', 'in_person', 'other']
        },
        response: {
            type: Boolean,
            default: false
        },
        notes: String
    }],
    interviews: [{
        type: {
            type: String,
            enum: ['phone', 'video', 'in_person', 'technical', 'hr', 'panel', 'final']
        },
        scheduledDate: Date,
        completedDate: Date,
        duration: Number, // in minutes
        interviewers: [String],
        notes: String,
        feedback: String,
        result: {
            type: String,
            enum: ['pending', 'passed', 'failed', 'waiting']
        }
    }],
    tasks: [taskSchema],
    timeline: [timelineEventSchema],
    notes: {
        type: String,
        maxlength: [5000, 'Notes cannot exceed 5000 characters']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    responseDate: Date,
    rejectionReason: String,
    offerDetails: {
        salary: {
            amount: Number,
            currency: {
                type: String,
                default: 'USD'
            },
            type: {
                type: String,
                enum: ['hourly', 'monthly', 'yearly'],
                default: 'yearly'
            }
        },
        benefits: [String],
        startDate: Date,
        responseDeadline: Date,
        negotiable: {
            type: Boolean,
            default: true
        },
        accepted: Boolean,
        declinedReason: String
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    archivedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for response time (days between application and first response)
applicationSchema.virtual('responseTime').get(function () {
    if (this.responseDate && this.applicationDate) {
        const diffTime = Math.abs(this.responseDate - this.applicationDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Virtual for days since application
applicationSchema.virtual('daysSinceApplication').get(function () {
    const diffTime = Math.abs(new Date() - this.applicationDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for overdue tasks
applicationSchema.virtual('overdueTasks').get(function () {
    const now = new Date();
    return this.tasks.filter(task =>
        !task.completed &&
        task.dueDate &&
        task.dueDate < now
    );
});

// Indexes for performance
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, applicationDate: -1 });
applicationSchema.index({ user: 1, company: 1 });
applicationSchema.index({ user: 1, jobTitle: 'text', company: 'text' });

// Pre-save middleware to update timeline
applicationSchema.pre('save', function (next) {
    // Add timeline event for status changes
    if (this.isModified('status') && !this.isNew) {
        this.timeline.push({
            type: 'status_updated',
            title: `Status changed to ${this.status}`,
            description: `Application status updated to ${this.status}`,
            date: new Date()
        });
    }

    // Update responseDate when status changes from 'applied'
    if (this.isModified('status') && this.status !== 'applied' && !this.responseDate) {
        this.responseDate = new Date();
    }

    // Archive date when archived
    if (this.isModified('isArchived') && this.isArchived && !this.archivedAt) {
        this.archivedAt = new Date();
    }

    next();
});

// Instance method to add timeline event
applicationSchema.methods.addTimelineEvent = function (type, title, description, metadata = {}) {
    this.timeline.push({
        type,
        title,
        description,
        metadata,
        date: new Date()
    });
    return this.save();
};

// Instance method to complete task
applicationSchema.methods.completeTask = function (taskId) {
    const task = this.tasks.id(taskId);
    if (task) {
        task.completed = true;
        task.completedAt = new Date();
        return this.save();
    }
    throw new Error('Task not found');
};

// Static method to get applications with stats
applicationSchema.statics.getApplicationsWithStats = function (userId, filters = {}) {
    const pipeline = [
        { $match: { user: new mongoose.Types.ObjectId(userId), ...filters } },
        {
            $facet: {
                applications: [
                    { $sort: { applicationDate: -1 } },
                    { $limit: 50 }
                ],
                stats: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            applied: { $sum: { $cond: [{ $eq: ['$status', 'applied'] }, 1, 0] } },
                            inReview: { $sum: { $cond: [{ $eq: ['$status', 'in_review'] }, 1, 0] } },
                            interview: { $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] } },
                            offer: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
                            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                            ghosted: { $sum: { $cond: [{ $eq: ['$status', 'ghosted'] }, 1, 0] } }
                        }
                    }
                ]
            }
        }
    ];

    return this.aggregate(pipeline);
};

export default mongoose.model('Application', applicationSchema);