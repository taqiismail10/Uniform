// uniform-frontend/src/components/admin/InstitutionListTable.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Building2, Trash2, Edit, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

// Extended type to include InstitutionCategory
export interface InstitutionWithCategory {
  institutionId: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  establishedYear?: number | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  InstitutionCategory?: {
    institutionCategoryId: string;
    name: string;
    description?: string | null;
  } | null;
}

interface InstitutionListTableProps {
  institutions: InstitutionWithCategory[];
  loading: boolean;
  sortField: 'name' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'name' | 'createdAt') => void;
  onDelete: (institution: InstitutionWithCategory) => void;
  onEdit: (institution: InstitutionWithCategory) => void;
}

export function InstitutionListTable({
  institutions,
  loading,
  onSort,
  onDelete,
  onEdit
}: InstitutionListTableProps) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        Loading institutions...
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead
              className="cursor-pointer flex items-center"
              onClick={() => onSort('name')}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead
              className="cursor-pointer flex items-center"
              onClick={() => onSort('createdAt')}
            >
              Created Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No institutions found
              </TableCell>
            </TableRow>
          ) : (
            institutions.map((institution) => (
              <TableRow key={institution.institutionId} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {institution.institutionId.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-gray-500" />
                    {institution.name}
                  </div>
                </TableCell>
                <TableCell>
                  {institution.InstitutionCategory?.name ? (
                    <Badge className={getCategoryBadgeColor(institution.InstitutionCategory.name)}>
                      {institution.InstitutionCategory.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Uncategorized</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(institution.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(institution)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(institution)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}