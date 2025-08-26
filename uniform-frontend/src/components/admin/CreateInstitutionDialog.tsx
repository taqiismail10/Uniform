// uniform-frontend/src/components/admin/CreateInstitutionDialog.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin/adminApi';
import { Plus } from 'lucide-react';

// Predefined categories for the dropdown
const INSTITUTION_CATEGORIES = [
  'Public',
  'Private',
  'Engineering',
  'Medical',
  'Science & Technology',
  'Agriculture',
  'Arts & Humanities',
  'Business',
  'Law',
  'Education',
  'Vocational',
  'Community College',
  'Research Institute'
];

// Define a proper type for the payload
interface CreateInstitutionPayload {
  name: string;
  categoryName?: string;
}

interface CreateInstitutionDialogProps {
  onInstitutionCreated: () => void;
}

export function CreateInstitutionDialog({ onInstitutionCreated }: CreateInstitutionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState({
    name: '',
    categoryName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateInstitution = async () => {
    if (!newInstitution.name.trim()) {
      toast.error('Institution name is required');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create properly typed payload
      const payload: CreateInstitutionPayload = {
        name: newInstitution.name,
      };

      // Only add categoryName if it's provided
      if (newInstitution.categoryName.trim()) {
        payload.categoryName = newInstitution.categoryName;
      }

      await adminApi.createInstitution(payload);

      toast.success('Institution created successfully');
      setIsOpen(false);
      setNewInstitution({
        name: '',
        categoryName: ''
      });
      onInstitutionCreated();
    } catch (error) {
      toast.error('Failed to create institution');
      console.error('Error creating institution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      setNewInstitution({
        name: '',
        categoryName: ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Institution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Institution</DialogTitle>
          <DialogDescription>
            Add a new educational institution to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newInstitution.name}
              onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
              className="col-span-3"
              placeholder="Enter institution name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={newInstitution.categoryName}
              onValueChange={(value) => setNewInstitution({ ...newInstitution, categoryName: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {INSTITUTION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateInstitution} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}