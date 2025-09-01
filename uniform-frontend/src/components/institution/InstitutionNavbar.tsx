import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/admin/useAuth'
import { useEffect, useState } from 'react'
import { getInstitutionAdminProfile } from '@/api/institutionAdmin'
import { getMyInstitution } from '@/api/institutionAdmin'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Menu, LayoutDashboard, User, Settings, LogOut, Mail, Clock, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InstitutionNavbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [lastLogin, setLastLogin] = useState<string | null>(null)
  const [openLogout, setOpenLogout] = useState(false)
  const [openSheet, setOpenSheet] = useState(false)
  const [institution, setInstitution] = useState<{ institutionId: string; name: string; shortName?: string | null; logoUrl?: string | null } | null>(null)

  const cleanupRadixArtifacts = () => {
    try {
      document.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.removeAttribute('aria-hidden'))
      // Some environments may use inert
      document.querySelectorAll('[inert]').forEach((el) => el.removeAttribute('inert'))
      // Ensure body has pointer events enabled
      if (document.body && document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = ''
      }
    } catch { void 0 }
  }

  useEffect(() => {
    (async () => {
      try {
        const p = await getInstitutionAdminProfile()
        setLastLogin(p.lastLogin ?? null)
        try {
          const inst = await getMyInstitution()
          setInstitution(inst)
        } catch { void 0 }
      } catch { void 0 }
    })()
  }, [])

  const shortName = (() => {
    const s = institution?.shortName?.trim()
    if (s) return s
    const name = institution?.name?.trim()
    if (!name) return 'Institution'
    const paren = name.match(/\(([^)]+)\)/)
    if (paren?.[1]) return paren[1]
    const words = name.split(/\s+/).filter(Boolean)
    const initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase()
    return initials.length >= 2 ? initials : name
  })()

  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Brand: logo (left) + short name (center-left) on mobile */}
            <Link to="/institution/dashboard" className="flex items-center gap-2">
              <div className='w-12 h-12 flex items-center justify-center rounded-full p-1 shadow-sm'>
                <img
                  src={institution?.logoUrl || '/logo.svg'}
                  alt="Institution Logo"
                  className="h-8 w-8 object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 truncate max-w-[50vw]">
                {shortName}
              </span>
            </Link>
            {/* Mobile menu */}
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <button className="md:hidden ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[70%] p-0">
                <div className="h-14 px-4 border-b border-gray-200 flex items-center gap-2">
                  <img src={institution?.logoUrl || '/logo.svg'} alt="Logo" className="h-6 w-6 rounded-sm object-cover" />
                  <span className="text-xl font-bold text-gray-900">{shortName}</span>
                </div>
                <nav className="px-2 py-3 text-sm">
                  <button onClick={() => navigate({ to: '/institution/dashboard' })} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button onClick={() => navigate({ to: '/institution/profile' })} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button onClick={() => navigate({ to: '/institution/units' })} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <LayoutDashboard className="h-4 w-4" />
                    Units
                  </button>
                  <button onClick={() => navigate({ to: '/institution/applications' })} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <LayoutDashboard className="h-4 w-4" />
                    Applications
                  </button>
                  <button onClick={() => navigate({ to: '/institution/settings' })} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-800 hover:bg-gray-100"
                    onClick={() => { setOpenSheet(false); setTimeout(() => setOpenLogout(true), 100) }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>


            {/* Desktop nav */}
            <nav className="ml-6 hidden md:flex items-center gap-4 text-sm">
              <Link to="/institution/dashboard" className="text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/institution/units" className="text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Units
              </Link>
              <Link to="/institution/applications" className="text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Applications
              </Link>
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:inline-flex items-center gap-2 rounded-full focus:outline-none">
                  <Avatar className="h-12 w-12 border-1 border-gray-300 shadow-sm p-1">
                    <AvatarImage src={institution?.logoUrl || '/logo.svg'} alt="Institution" />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                      <Building className="h-5 w-5 text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 border border-gray-200">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-900 text-xs truncate">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{user?.email ?? 'Institution Admin'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last login: {lastLogin ? new Date(lastLogin).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                {/* Stats moved to dashboard */}
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate({ to: '/institution/settings' })} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setTimeout(() => setOpenLogout(true), 0)
                  }}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout dialog */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>Are you sure you want to log out of your institution admin account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-gray-800 border-gray-300 hover:bg-gray-100"
              onClick={() => setOpenLogout(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white hover:bg-black/90"
              onClick={() => {
                setOpenLogout(false)
                // Allow the dialog to close and Radix to cleanup focus/aria state before navigation
                setTimeout(() => {
                  cleanupRadixArtifacts()
                  logout()
                  navigate({ to: '/institution/institutionLogin', replace: true })
                  // Run cleanup again on next tick post-navigation
                  setTimeout(() => cleanupRadixArtifacts(), 0)
                }, 50)
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
