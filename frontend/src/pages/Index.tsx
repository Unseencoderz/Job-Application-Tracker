import { useState } from "react";
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
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  url?: string;
  notes?: string;
}

const mockApplications: JobApplication[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    status: 'interview',
    appliedDate: '2024-01-15',
    url: 'https://techcorp.com/careers',
    notes: 'Great company culture, focusing on React and TypeScript'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'applied',
    appliedDate: '2024-01-20',
    url: 'https://startupxyz.com/jobs',
    notes: 'Early stage startup, equity opportunity'
  },
  {
    id: '3',
    title: 'Software Engineer',
    company: 'BigTech Inc',
    status: 'offer',
    appliedDate: '2024-01-10',
    notes: 'Received offer! Competitive salary and benefits'
  },
  {
    id: '4',
    title: 'React Developer',
    company: 'MediaCompany',
    status: 'rejected',
    appliedDate: '2024-01-05',
    notes: 'Good interview experience but went with another candidate'
  }
];

const Index = () => {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  const handleAddApplication = (newApp: Omit<JobApplication, 'id'>) => {
    const id = (applications.length + 1).toString();
    setApplications(prev => [...prev, { ...newApp, id }]);
  };

  const handleStatusChange = (id: string, status: JobApplication['status']) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status } : app)
    );
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit application:', id);
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
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
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
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
            value={stats.applied + stats.interview}
            description="Applied + Interview"
            icon={TrendingUp}
            variant="warning"
          />
          <StatsCard
            title="Offers Received"
            value={stats.offers}
            description="Success rate: {stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0}%"
            icon={Briefcase}
            variant="success"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats.total > 0 ? Math.round(((stats.interview + stats.offers + stats.rejected) / stats.total) * 100) : 0}%`}
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
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApplications.length > 0 ? (
                filteredApplications.map(application => (
                  <JobCard
                    key={application.id}
                    application={application}
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

export default Index;
