import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import UnitForm from '@/components/institution/UnitForm'
import { unitsApi } from '@/api/units'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/units/create')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <div className="max-w-5xl mx-auto py-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create Unit</h1>
        <Link to="/institution/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
      </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Unit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <UnitForm
              mode="create"
              submitLabel="Create Unit"
              submittingLabel="Creating..."
              onSubmit={(payload) => unitsApi.create(payload)}
              onSuccess={() => navigate({ to: '/institution/units' })}
            />
          </CardContent>
        </Card>
    </div>
  )
}

export default RouteComponent
