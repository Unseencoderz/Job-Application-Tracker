import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  User, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe,
  Plus,
  X,
  Target,
  Briefcase,
  Calendar,
  Upload,
  Camera
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";

interface EditProfileDialogProps {
  children?: React.ReactNode;
}

export function EditProfileDialog({ children }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    phoneNumber: user?.profile?.phoneNumber || '',
    linkedinUrl: user?.profile?.linkedinUrl || '',
    githubUrl: user?.profile?.githubUrl || '',
    portfolioUrl: user?.profile?.portfolioUrl || '',
    skills: user?.profile?.skills || [],
    experience: user?.profile?.experience || '',
    jobPreferences: {
      jobTypes: user?.profile?.jobPreferences?.jobTypes || [],
      workMode: user?.profile?.jobPreferences?.workMode || [],
      preferredRoles: user?.profile?.jobPreferences?.preferredRoles || [],
      salaryExpectation: {
        min: user?.profile?.jobPreferences?.salaryExpectation?.min || 0,
        max: user?.profile?.jobPreferences?.salaryExpectation?.max || 0,
        currency: user?.profile?.jobPreferences?.salaryExpectation?.currency || 'USD'
      }
    },
    goals: {
      dailyApplicationTarget: user?.profile?.goals?.dailyApplicationTarget || 5,
      weeklyApplicationTarget: user?.profile?.goals?.weeklyApplicationTarget || 20,
      targetRole: user?.profile?.goals?.targetRole || '',
      targetCompanies: user?.profile?.goals?.targetCompanies || []
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newTargetCompany, setNewTargetCompany] = useState('');

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      // Update the auth store with the new user data
      if (data.user) {
        const { setUser } = useAuthStore.getState();
        setUser(data.user);
      }
      toast.success('Profile updated successfully!');
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: userAPI.uploadAvatar,
    onSuccess: (data) => {
      // Update the auth store with the new user data
      if (data.user) {
        const { setUser } = useAuthStore.getState();
        setUser(data.user);
      }
      toast.success('Avatar updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Structure the data to match backend expectations
    const profileData = {
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.skills,
        experience: formData.experience,
        jobPreferences: formData.jobPreferences,
        goals: formData.goals
      }
    };
    
    updateProfileMutation.mutate(profileData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addTargetCompany = () => {
    if (newTargetCompany.trim() && !formData.goals.targetCompanies.includes(newTargetCompany.trim())) {
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          targetCompanies: [...prev.goals.targetCompanies, newTargetCompany.trim()]
        }
      }));
      setNewTargetCompany('');
    }
  };

  const removeTargetCompany = (companyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        targetCompanies: prev.goals.targetCompanies.filter(company => company !== companyToRemove)
      }
    }));
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    return user?.username[0]?.toUpperCase() || 'U';
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      uploadAvatarMutation.mutate(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <Label className="text-base font-medium">Basic Information</Label>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.profile?.avatar} />
                  <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                </Avatar>
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileInput}
                  disabled={uploadAvatarMutation.isPending}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Avatar'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="San Francisco, CA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Label className="text-base font-medium">Social Links</Label>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                <Input
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <Label className="text-base font-medium">Skills</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <Label className="text-base font-medium">Job Preferences</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Job Types</Label>
                <Select 
                  value={formData.jobPreferences.jobTypes[0] || ''} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    jobPreferences: {
                      ...prev.jobPreferences,
                      jobTypes: [value]
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select 
                  value={formData.jobPreferences.workMode[0] || ''} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    jobPreferences: {
                      ...prev.jobPreferences,
                      workMode: [value]
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Goals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label className="text-base font-medium">Application Goals</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyTarget">Daily Target</Label>
                <Input
                  id="dailyTarget"
                  type="number"
                  value={formData.goals.dailyApplicationTarget}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    goals: {
                      ...prev.goals,
                      dailyApplicationTarget: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weeklyTarget">Weekly Target</Label>
                <Input
                  id="weeklyTarget"
                  type="number"
                  value={formData.goals.weeklyApplicationTarget}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    goals: {
                      ...prev.goals,
                      weeklyApplicationTarget: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                value={formData.goals.targetRole}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  goals: {
                    ...prev.goals,
                    targetRole: e.target.value
                  }
                }))}
                placeholder="Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Companies</Label>
              <div className="flex gap-2">
                <Input
                  value={newTargetCompany}
                  onChange={(e) => setNewTargetCompany(e.target.value)}
                  placeholder="Add target company..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetCompany())}
                />
                <Button type="button" onClick={addTargetCompany} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.goals.targetCompanies.map((company, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {company}
                    <button
                      type="button"
                      onClick={() => removeTargetCompany(company)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}