import { useAuthStore } from '@/stores/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe,
  Edit,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.profile.avatar} />
                  <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{getDisplayName()}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile.bio && (
                  <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2 pt-2">
                  {user.profile.githubUrl && (
                    <a 
                      href={user.profile.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  
                  {user.profile.linkedinUrl && (
                    <a 
                      href={user.profile.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  
                  {user.profile.portfolioUrl && (
                    <a 
                      href={user.profile.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            {user.profile.skills && user.profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Preferences */}
            {user.profile.jobPreferences && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.profile.jobPreferences.jobTypes && user.profile.jobPreferences.jobTypes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Preferred Job Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.jobPreferences.jobTypes.map((type, index) => (
                          <Badge key={index} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user.profile.jobPreferences.workMode && user.profile.jobPreferences.workMode.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Work Mode Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.jobPreferences.workMode.map((mode, index) => (
                          <Badge key={index} variant="outline">
                            {mode}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Goals */}
            {user.profile.goals && (
              <Card>
                <CardHeader>
                  <CardTitle>Application Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Daily Target:</span>
                    <span className="font-medium">{user.profile.goals.dailyApplicationTarget} applications</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Target:</span>
                    <span className="font-medium">{user.profile.goals.weeklyApplicationTarget} applications</span>
                  </div>
                  {user.profile.goals.targetRole && (
                    <div className="flex justify-between">
                      <span>Target Role:</span>
                      <span className="font-medium">{user.profile.goals.targetRole}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;