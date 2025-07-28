
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'in_review' | 'interview' | 'technical_test' | 'offer' | 'rejected' | 'withdrawn' | 'ghosted';
  applicationDate: string;
  jobDetails?: {
    url?: string;
  };
  notes?: string;
  location?: 'on_campus' | 'off_campus';
}

interface AddApplicationDialogProps {
  onAdd: (application: Omit<JobApplication, 'id'>) => void;
}

export function AddApplicationDialog({ onAdd }: AddApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    status: 'applied' as const,
    applicationDate: new Date().toISOString().split('T')[0],
    jobDetails: {
      url: ''
    },
    notes: '',
    location: 'off_campus' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.company) return;
    
    onAdd({
      ...formData,
      jobDetails: formData.jobDetails?.url ? formData.jobDetails : undefined,
      notes: formData.notes || undefined,
      location: formData.location || undefined
    });
    
    // Reset form
    setFormData({
      jobTitle: '',
      company: '',
      status: 'applied',
      applicationDate: new Date().toISOString().split('T')[0],
      jobDetails: {
        url: ''
      },
      notes: '',
      location: 'off_campus'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
              placeholder="Software Engineer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Tech Corp"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Applied Date</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationDate: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location Type</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value as 'on_campus' | 'off_campus' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_campus">On Campus</SelectItem>
                <SelectItem value="off_campus">Off Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Job URL (Optional)</Label>
            <Input
              id="url"
              type="url"
              value={formData.jobDetails?.url || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                jobDetails: { 
                  ...prev.jobDetails, 
                  url: e.target.value 
                } 
              }))}
              placeholder="https://company.com/careers/job-123"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this application..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Application</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}