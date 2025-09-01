import { useEffect, useState } from 'react'
import { getEligibleInstitutions, type EligibleInstitution } from '@/api/studentExplore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function UniversitiesSection() {
  const [rows, setRows] = useState<EligibleInstitution[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    (async () => {
      const data = await getEligibleInstitutions()
      setRows(data)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Institution</h2>
        <p className="mt-1 text-gray-600">Showing eligible units based on your profile</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading eligible universities...</div>
      ) : rows.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No eligible units found. Update your profile to see more options.</div>
      ) : (
        <Card className="border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ownership</TableHead>
                <TableHead>Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((inst) => (
                <>
                  <TableRow key={inst.institutionId} className="cursor-pointer" onClick={() => setExpanded((e) => ({ ...e, [inst.institutionId]: !e[inst.institutionId] }))}>
                    <TableCell className="w-8">
                      {expanded[inst.institutionId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">{inst.name}{inst.shortName ? ` (${inst.shortName})` : ''}</TableCell>
                    <TableCell>
                      {inst.website ? (
                        <a className="text-black hover:underline" href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`} target="_blank" rel="noreferrer">{inst.website}</a>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-gray-700">{inst.type ?? '—'}</TableCell>
                    <TableCell className="text-gray-700">{inst.ownership ?? '—'}</TableCell>
                    <TableCell className="text-gray-700">{inst.units?.length ?? 0}</TableCell>
                  </TableRow>
                  {expanded[inst.institutionId] && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        {(!inst.units || inst.units.length === 0) ? (
                          <div className="text-gray-600">No eligible units.</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {inst.units.map((u) => (
                              <div key={u.unitId} className="border border-gray-200 rounded-md p-3">
                                <div className="font-medium text-gray-900">{u.name}</div>
                                {u.description ? (
                                  <div className="text-sm text-gray-700 mt-1 line-clamp-2">{u.description}</div>
                                ) : null}
                                <div className="text-xs text-gray-600 mt-2">
                                  Deadline: {u.applicationDeadline ? new Date(u.applicationDeadline).toLocaleString() : '—'}
                                </div>
                                <div className="mt-2">
                                  <Button className="bg-gray-900 hover:bg-gray-800" size="sm">Apply</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
