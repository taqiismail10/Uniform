// uniform-frontend/src/components/admin/InstitutionManagement.tsx
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin/adminApi';
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { CreateInstitutionDialog } from './CreateInstitutionDialog';
import { InstitutionListTable, type InstitutionWithCategory } from './InstitutionListTable';

export function InstitutionManagement() {
  const [institutions, setInstitutions] = useState<InstitutionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<'name' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<InstitutionWithCategory | null>(null);

  // Memoized fetchInstitutions function
  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getInstitutions(
        currentPage,
        itemsPerPage,
        searchTerm
      );
      setInstitutions(response.institutions);
      setTotalItems(response.total);
    } catch (error) {
      toast.error('Failed to load institutions');
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const handleDeleteInstitution = async () => {
    if (!institutionToDelete) return;

    try {
      await adminApi.deleteInstitution(institutionToDelete.institutionId);
      toast.success('Institution deleted successfully');
      setIsDeleteDialogOpen(false);
      setInstitutionToDelete(null);
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to delete institution');
      console.error('Error deleting institution:', error);
    }
  };

  const openDeleteDialog = (institution: InstitutionWithCategory) => {
    setInstitutionToDelete(institution);
    setIsDeleteDialogOpen(true);
  };

  const handleEditInstitution = (institution: InstitutionWithCategory) => {
    // Placeholder for edit functionality
    toast.info(`Edit functionality for ${institution.name} not implemented yet`);
  };

  const handleSort = (field: 'name' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Function to get category badge color based on category name
  const getCategoryBadgeColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'public':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-purple-100 text-purple-800';
      case 'engineering':
        return 'bg-green-100 text-green-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'science & technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'agriculture':
        return 'bg-yellow-100 text-yellow-800';
      case 'arts & humanities':
        return 'bg-pink-100 text-pink-800';
      case 'business':
        return 'bg-orange-100 text-orange-800';
      case 'law':
        return 'bg-gray-100 text-gray-800';
      case 'education':
        return 'bg-teal-100 text-teal-800';
      case 'vocational':
        return 'bg-amber-100 text-amber-800';
      case 'community college':
        return 'bg-lime-100 text-lime-800';
      case 'research institute':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Institution Management</h1>
          <p className="text-gray-500">Manage educational institutions</p>
        </div>
        <CreateInstitutionDialog onInstitutionCreated={fetchInstitutions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institutions List</CardTitle>
          <CardDescription>View and manage all institutions in the system</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search institutions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InstitutionListTable
            institutions={institutions}
            loading={loading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={openDeleteDialog}
            onEdit={handleEditInstitution}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Showing {institutions.length} of {totalItems} institutions
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this institution? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {institutionToDelete && (
            <div className="py-4">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-8 w-8 text-gray-500" />
                <div>
                  <h3 className="font-medium">{institutionToDelete.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {format(new Date(institutionToDelete.createdAt), 'MMM dd, yyyy')}
                  </p>
                  {institutionToDelete.InstitutionCategory && (
                    <div className="mt-1">
                      <Badge className={getCategoryBadgeColor(institutionToDelete.InstitutionCategory.name)}>
                        {institutionToDelete.InstitutionCategory.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Deleting this institution will also remove all associated data including units, admins, and applications.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInstitution}>
              Delete Institution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}