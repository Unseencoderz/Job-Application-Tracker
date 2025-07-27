import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/JobCard";
import { StatsCard } from "@/components/StatsCard";
import { AddApplicationDialog } from "@/components/AddApplicationDialog";
import { 
  Briefcase, 
  Calendar, 
  Target, 
  TrendingUp, 
  Filter,
  Search,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { applicationsAPI, analyticsAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  daysSinceApplication?: number;
}

const Dashboard = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  // Fetch applications
  const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications', filterStatus, searchTerm, currentPage],
    queryFn: () => applicationsAPI.getApplications({
      status: filterStatus === 'all' ? undefined : filterStatus,
      search: searchTerm || undefined,
      page: currentPage,
      limit: 20
    }),
  });

  // Fetch analytics
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

  // Update application mutation
  const updateApplicationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      applicationsAPI.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Application updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update application');
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: applicationsAPI.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Application deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete application');
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
      notes: newApp.notes
    };
    createApplicationMutation.mutate(applicationData);
  };

  const handleStatusChange = (id: string, status: JobApplication['status']) => {
    updateApplicationMutation.mutate({ id, data: { status } });
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit application:', id);
  };

  const handleDelete = (id: string) => {
    deleteApplicationMutation.mutate(id);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getUserInitials = () => {
    if (user?.profile.firstName && user?.profile.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    return user?.username[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (user?.profile.firstName && user?.profile.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user?.username || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Job Tracker</h1>
                <p className="text-sm text-muted-foreground">Track your career progress</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile.avatar} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{getDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome back, {user?.profile.firstName || user?.username}!</h2>
          <p className="text-muted-foreground">Here's an overview of your job search progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            description="All time"
            icon={Target}
            variant="default"
          />
          <StatsCard
            title="In Progress"
            value={stats.applied + stats.inReview + stats.interview + stats.technicalTest}
            description="Applied + In Review + Interview"
            icon={TrendingUp}
            variant="warning"
          />
          <StatsCard
            title="Offers Received"
            value={stats.offer}
            description={`Success rate: ${stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0}%`}
            icon={Briefcase}
            variant="success"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats.total > 0 ? Math.round(((stats.interview + stats.offer + stats.rejected + stats.technicalTest) / stats.total) * 100) : 0}%`}
            description="Got responses"
            icon={Calendar}
            variant="default"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <AddApplicationDialog onAdd={handleAddApplication} />
          </div>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
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
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="ghosted">Ghosted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applicationsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-48 bg-muted/50 rounded-lg animate-pulse" />
                ))
              ) : applications.length > 0 ? (
                applications.map((application: JobApplication) => (
                  <JobCard
                    key={application._id}
                    application={{
                      id: application._id,
                      title: application.jobTitle,
                      company: application.company,
                      status: application.status,
                      appliedDate: application.applicationDate,
                      url: application.jobDetails?.url,
                      notes: application.notes
                    }}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? "Try adjusting your filters" 
                      : "Get started by adding your first job application"}
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <AddApplicationDialog onAdd={handleAddApplication} />
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {applicationsData?.pagination && applicationsData.pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {applicationsData.pagination.pages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={currentPage === applicationsData.pagination.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed insights and charts will be available here to help you track your job search progress.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;