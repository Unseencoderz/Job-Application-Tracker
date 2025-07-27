import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Mail, 
  Shield,
  Palette,
  User,
  Globe
} from "lucide-react";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

interface SettingsDialogProps {
  children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const getThemeIcon = (themeValue: string) => {
    const option = themeOptions.find(opt => opt.value === themeValue);
    return option ? option.icon : Monitor;
  };

  const ThemeIcon = getThemeIcon(theme);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label className="text-base font-medium">Appearance</Label>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <ThemeIcon className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <Label className="text-base font-medium">Notifications</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your applications
                  </p>
                </div>
                <Switch defaultChecked={user?.preferences?.emailNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new opportunities
                  </p>
                </div>
                <Switch defaultChecked={user?.preferences?.pushNotifications} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy & Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <Label className="text-base font-medium">Privacy & Security</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile
                  </p>
                </div>
                <Badge variant="secondary">Public</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Download your application data
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <Label className="text-base font-medium">Account</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Account Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.emailVerified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                  {user?.emailVerified ? 'Active' : 'Pending'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}