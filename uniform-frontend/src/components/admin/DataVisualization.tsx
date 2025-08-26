// uniform-frontend/src/components/admin/DataVisualization.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin/adminApi';
import type { Institution } from '@/types/admin';
import {
  Download,
  Printer,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export function DataVisualization() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last6months');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getInstitutions(); // Get institutions
      setInstitutions(response.institutions);
    } catch (error) {
      toast.error('Failed to load institutions');
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    toast.info('Export to CSV functionality to be implemented');
  };

  const handleExportExcel = () => {
    toast.info('Export to Excel functionality to be implemented');
  };

  const handlePrint = () => {
    toast.info('Print functionality to be implemented');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Visualization</h1>
        <p className="text-gray-500">Visual representation of system data and trends</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last6months">Last 6 months</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <BarChart3 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="donut">Donut Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {chartType === 'line' ? (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Institution Growth Over Time
                </>
              ) : chartType === 'pie' ? (
                <>
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Admin Distribution by Institution
                </>
              ) : chartType === 'donut' ? (
                <>
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Institution Category Distribution
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Application Trends
                </>
              )}
            </CardTitle>
            <CardDescription>
              {chartType === 'line' && 'Number of institutions created over time'}
              {chartType === 'pie' && 'Distribution of admins across institutions'}
              {chartType === 'donut' && 'Distribution of institutions by category'}
              {chartType === 'bar' && 'Number of applications per institution'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Charts not available</h3>
              <p className="text-gray-500">The backend does not currently support data visualization endpoints.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Stats not available</h3>
              <p className="text-gray-500">The backend does not currently support statistics endpoints.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institutions Data Table</CardTitle>
          <CardDescription>Detailed view of all institutions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">Loading institutions...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No institutions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    institutions.map((institution) => (
                      <TableRow key={institution.institutionId} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{institution.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {institution.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(institution.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
