import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Briefcase, 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building,
  MapPin,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AddApplicationDialog } from "@/components/AddApplicationDialog";
import { AppLayout } from "@/components/AppLayout";

import { applicationsAPI, analyticsAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface JobApplication {
  _id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'in_review' | 'interview' | 'technical_test' | 'offer' | 'rejected' | 'withdrawn' | 'ghosted';
  applicationDate: string;
  jobDetails?: {
    url?: string;
  };
  notes?: string;
  location?: 'on_campus' | 'off_campus';
  daysSinceApplication?: number;
}

const statusIcons = {
  applied: Clock,
  in_review: AlertCircle,
  interview: Users,
  technical_test: Target,
  offer: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
  ghosted: AlertCircle,
};

const statusColors = {
  applied: "text-blue-500",
  in_review: "text-yellow-500",
  interview: "text-purple-500",
  technical_test: "text-orange-500",
  offer: "text-green-500",
  rejected: "text-red-500",
  withdrawn: "text-gray-500",
  ghosted: "text-red-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ModernDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Fetch applications with filters
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['applications', filterStatus, searchTerm, currentPage],
    queryFn: () => applicationsAPI.getApplications({
      status: filterStatus === 'all' ? undefined : filterStatus,
      search: searchTerm || undefined,
      page: currentPage,
      limit: 20,
    }),
  });

  // Fetch analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsAPI.getOverview(),
  });

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: applicationsAPI.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Application added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add application');
    },
  });

  const applications = applicationsData?.data || [];
  const stats = applicationsData?.stats || {
    total: 0, applied: 0, inReview: 0, interview: 0,
    technicalTest: 0, offer: 0, rejected: 0, withdrawn: 0, ghosted: 0
  };

  const handleAddApplication = (newApp: Omit<JobApplication, '_id'>) => {
    const applicationData = {
      jobTitle: newApp.jobTitle,
      company: newApp.company,
      status: newApp.status,
      applicationDate: newApp.applicationDate,
      jobDetails: {
        url: newApp.jobDetails?.url
      },
      notes: newApp.notes,
      location: newApp.location
    };
    createApplicationMutation.mutate(applicationData);
  };

  const getDisplayName = () => {
    if (user?.profile.firstName) {
      return user.profile.firstName;
    }
    return user?.username || 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <motion.h1 
              className="text-display-2 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getGreeting()}, {getDisplayName()}! 👋
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Let's track your job application journey
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AddApplicationDialog onAdd={handleAddApplication}>
                <Button size="lg" variant="secondary" className="interactive-button">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Application
                </Button>
              </AddApplicationDialog>
            </motion.div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "Total Applications", value: stats.total, icon: Briefcase, color: "text-primary" },
            { label: "In Review", value: stats.inReview, icon: AlertCircle, color: "text-yellow-500" },
            { label: "Interviews", value: stats.interview, icon: Users, color: "text-purple-500" },
            { label: "Offers", value: stats.offer, icon: CheckCircle, color: "text-green-500" },
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="glass-card interactive-card border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-primary/10", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-subtle border-0"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] glass-subtle border-0">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="technical_test">Technical Test</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Applications Grid */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {applications.map((application, index) => {
                  const StatusIcon = statusIcons[application.status];
                  const statusColor = statusColors[application.status];
                  
                  return (
                    <motion.div
                      key={application._id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card interactive-card border-0 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                              <Badge 
                                variant="secondary" 
                                className={cn("capitalize", statusColor)}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {application.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {application.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(application.applicationDate).toLocaleDateString()}
                              </div>
                              {application.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {application.location.replace('_', ' ')}
                                </div>
                              )}
                            </div>
                            
                            {application.notes && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {application.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {application.jobDetails?.url && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={application.jobDetails.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {applications.length === 0 && !isLoading && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">Get started by adding your first job application</p>
                  <AddApplicationDialog onAdd={handleAddApplication}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Application
                    </Button>
                  </AddApplicationDialog>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card border-0 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.total > 0 ? (stats.offer / stats.total) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Rate</span>
                      <span className="font-medium">
                        {stats.total > 0 ? Math.round(((stats.inReview + stats.interview + stats.offer) / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.total > 0 ? ((stats.inReview + stats.interview + stats.offer) / stats.total) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass-card border-0 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">{app.company}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}