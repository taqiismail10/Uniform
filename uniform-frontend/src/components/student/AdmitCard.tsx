import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getEligibleInstitutions, type EligibleInstitution } from '@/api/studentExplore'

import type { MyApplication } from '@/api/studentApplications'
import type { User } from '@/context/student/AuthContext'

interface AdmitCardProps {
  app: MyApplication
  student: User
  institutionLogoUrl?: string
  pdfPreview?: boolean
  autoDownload?: boolean
}

export default function AdmitCard({ app, student, institutionLogoUrl, pdfPreview = false, autoDownload = false }: AdmitCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [resolvedLogo, setResolvedLogo] = useState<string | null>(
    institutionLogoUrl || app?.institution?.logoUrl || null
  )
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const getApiOrigin = () => {
    const API_URL = ((import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) || 'http://localhost:5000/api'
    return API_URL.replace(/\/api\/?$/, '')
  }
  const API_ORIGIN = useMemo(() => getApiOrigin(), [])
  const appLogoUrl = app?.institution?.logoUrl || null

  // Keep resolvedLogo in sync when logo props arrive later
  useEffect(() => {
    if (institutionLogoUrl) {
      setResolvedLogo(institutionLogoUrl)
    } else if (appLogoUrl) {
      setResolvedLogo(appLogoUrl)
    }
  }, [institutionLogoUrl, appLogoUrl])

  useEffect(() => {
    if (institutionLogoUrl || app?.institution?.logoUrl) return
    const normalize = (s?: string | null) => (s || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ') // remove parentheses content
      .replace(/[^a-z0-9]+/g, ' ') // non-alphanumerics to space
      .trim()
      .replace(/\s+/g, ' ')
      ; (async () => {
        try {
          const list = await getEligibleInstitutions()
          const target = normalize(app.institution?.name)
          let found: EligibleInstitution | undefined
          // exact normalized match by name
          found = list.find(i => normalize(i.name) === target)
          // startsWith / includes match
          if (!found) found = list.find(i => normalize(i.name).includes(target) || target.includes(normalize(i.name)))
          // shortName match
          if (!found) found = list.find(i => normalize(i.shortName) === target)
          // match by unit name when names don't align
          if (!found && app.unit?.name) {
            const unitNorm = normalize(app.unit.name)
            found = list.find(i => (i.units || []).some(u => normalize(u.name) === unitNorm))
          }
          if (found?.logoUrl) setResolvedLogo(found.logoUrl)
        } catch (e) { void e }
      })()
  }, [app, institutionLogoUrl])

  const safe = (v?: string | null) => (v && String(v).trim().length > 0 ? v : '-')
  const candidatePhoto = useMemo(() => {
    const fromProp = (student?.profile || '').trim()
    if (fromProp) return fromProp
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const cached = JSON.parse(raw)
        const fromCache = (cached?.profile || '').trim()
        if (fromCache) return fromCache
      }
    } catch (e) { void e }
    return '/logo.svg'
  }, [student.profile])
  const instLogo = useMemo<string>(() => {
    const raw = resolvedLogo
    if (!raw || raw.trim() === '') return '/logo.svg'
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw
    // Stitch with API origin if relative
    if (raw.startsWith('/')) return `${API_ORIGIN}${raw}`
    return `${API_ORIGIN}/${raw}`
  }, [resolvedLogo, API_ORIGIN])
  const isCorsAllowed = useCallback((src?: string | null) => {
    if (!src) return false
    try {
      const u = new URL(src, window.location.href)
      if (u.protocol === 'data:' || u.protocol === 'blob:') return true
      return u.origin === window.location.origin || u.origin === API_ORIGIN
    } catch {
      return false
    }
  }, [API_ORIGIN])
  const logoCrossOrigin = useMemo(() => isCorsAllowed(instLogo), [isCorsAllowed, instLogo])
  const photoCrossOrigin = useMemo(() => isCorsAllowed(candidatePhoto), [isCorsAllowed, candidatePhoto])

  const buildPdf = useCallback(async () => {
    const node = cardRef.current
    if (!node) throw new Error('Card not ready')
    const sameOrigin = window.location.origin
    // Measure for potential sizing, but let html2canvas handle element coordinates
    const rect = node.getBoundingClientRect()
    const cardW = Math.ceil(rect.width || node.scrollWidth || node.clientWidth)
    const cardH = Math.ceil(rect.height || node.scrollHeight || node.clientHeight)
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      foreignObjectRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      width: cardW,
      height: cardH,
      onclone: (clonedDoc) => {
        // 1) Sanitize colors to avoid html2canvas oklch() parse errors
        try {
          const style = clonedDoc.createElement('style')
          style.textContent = `
            html, body { background: #ffffff !important; color: #000000 !important; }
            * { color: #000000 !important; border-color: #000000 !important; box-shadow: none !important; }
            [data-admit-root] { background: #ffffff !important; color: #000000 !important; }
            [data-admit-root] * { color: #000000 !important; background: transparent !important; border-color: #000000 !important; box-shadow: none !important; filter: none !important; }
          `
          clonedDoc.head.appendChild(style)
        } catch (e) { void e }

        // 1b) Inline override every descendant to be extra safe
        try {
          const root = clonedDoc.querySelector('[data-admit-root]') as HTMLElement | null
          if (root) {
            const all: HTMLElement[] = [root, ...Array.from(root.querySelectorAll('*')) as HTMLElement[]]
            for (const el of all) {
              el.style.background = 'transparent'
              el.style.backgroundImage = 'none'
              el.style.backgroundColor = 'transparent'
              el.style.color = '#000'
              el.style.borderColor = '#000'
              el.style.boxShadow = 'none'
              el.style.outlineColor = '#000'
              el.style.caretColor = '#000'
              el.style.accentColor = '#000'
            }
          }
        } catch (e) { void e }

        // 2) Replace cross-origin images to safe local assets
        const imgs = clonedDoc.querySelectorAll('img[data-admit-image]') as NodeListOf<HTMLImageElement>
        imgs.forEach((img) => {
          try {
            const u = new URL(img.getAttribute('src') || '', window.location.href)
            const isData = u.protocol === 'data:' || u.protocol === 'blob:'
            if (!isData) {
              const allowed = (u.origin === sameOrigin) || (u.origin === API_ORIGIN)
              if (!allowed) {
                const kind = img.getAttribute('data-admit-image')
                if (kind === 'logo') img.src = '/logo.svg'
                else if (kind === 'photo') img.src = '/logo.svg'
              }
            }
          } catch (e) { void e }
        })
      }
    })
    const imgData = canvas.toDataURL('image/png')
    const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait' as const
    const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgW = canvas.width
    const imgH = canvas.height
    const scale = Math.min(pageWidth / imgW, pageHeight / imgH)
    const drawW = Math.floor(imgW * scale)
    const drawH = Math.floor(imgH * scale)
    const x = Math.floor((pageWidth - drawW) / 2)
    const y = Math.floor((pageHeight - drawH) / 2)
    pdf.addImage(imgData, 'PNG', x, y, drawW, drawH)
    return pdf
  }, [API_ORIGIN])

  const forceDownload = (href: string, filename: string) => {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const downloadPngFallback = async (filename: string) => {
    const node = cardRef.current
    if (!node) throw new Error('Card not ready')
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, foreignObjectRendering: true, backgroundColor: '#ffffff' })
    const dataUrl = canvas.toDataURL('image/png')
    forceDownload(dataUrl, filename.replace(/\.pdf$/i, '.png'))
  }

  const downloadPdf = async () => {
    try {
      // Warm-up images (only when CORS-allowed) to reduce html2canvas failures
      const warmups: Promise<any>[] = []
      if (isCorsAllowed(instLogo)) warmups.push(preloadImage(instLogo))
      if (isCorsAllowed(candidatePhoto)) warmups.push(preloadImage(candidatePhoto))
      if (warmups.length) await Promise.allSettled(warmups)
      const pdf = await buildPdf()
      const safeName = `${student.userName || 'Student'}_${app.unit?.name || 'Unit'}`.replace(/[^a-z0-9_-]+/gi, '_')
      pdf.save(`AdmitCard_${safeName}.pdf`)
      toast.success('Admit card downloaded')
    } catch (e) {
      console.error('PDF generation failed', e)
      const safeName = `${student.userName || 'Student'}_${app.unit?.name || 'Unit'}`.replace(/[^a-z0-9_-]+/gi, '_')
      // Fallback 1: if a preview blob URL exists, force download it
      if (pdfUrl) {
        try {
          forceDownload(pdfUrl, `AdmitCard_${safeName}.pdf`)
          toast.success('Downloaded preview PDF')
          return
        } catch (e2) { void e2 }
      }
      // Fallback 2: export raster image (PNG)
      try {
        await downloadPngFallback(`AdmitCard_${safeName}.pdf`)
        toast.success('Downloaded PNG as fallback')
        return
      } catch (e3) {
        console.error('PNG fallback failed', e3)
      }
      toast.error('Unable to download admit card. See console for details.')
    }
  }

  // Preload images to improve PDF reliability
  const preloadImage = async (src?: string | null) => {
    return new Promise<void>((resolve) => {
      if (!src) return resolve()
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = src
    })
  }

  // Preview generation removed per requirements (no preview UI)

  // Optional: auto trigger PDF download when requested
  useEffect(() => {
    if (!autoDownload) return
    const id = requestAnimationFrame(() => { downloadPdf().catch(() => void 0) })
    return () => cancelAnimationFrame(id)
  }, [autoDownload])

  return (
    <div className="w-full">
      {/* Print-only CSS: hides everything except the card and formats A4 */}
      <style
        dangerouslySetInnerHTML={{ __html: `
@media print {
  @page { size: A4; margin: 10mm; }
  html, body { background: #ffffff !important; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body * { visibility: hidden !important; }
  #admit-card-print, #admit-card-print * { visibility: visible !important; }
  #admit-card-print { position: absolute; inset: 0 auto auto 0; right: 0; margin: 0 auto; width: auto; max-width: 190mm; }
}
        ` }}
      />
      {/* Visible card (also used for PDF rasterization) */}
      <div
        ref={cardRef}
        className="bg-white border-2 border-black rounded-md p-0 max-w-[1200px] w-full mx-auto shadow-sm"
        data-admit-root
        id="admit-card-print"
      >
        {/* Header (black & white) */}
        <div className="bg-white text-black rounded-t-[5px] px-6 py-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-3">
            {/* Keep logo colorful. Use CORS only when allowed to avoid blocking image load. */}
            <img
              src={instLogo}
              alt="Institution Logo"
              {...(logoCrossOrigin ? { crossOrigin: 'anonymous' as const, referrerPolicy: 'no-referrer' as const } : {})}
              data-admit-image="logo"
              className="h-14 p-1 border rounded-sm"
            />
            <div>
              <div className="text-xl font-bold leading-tight">{safe(app.institution?.name)}</div>
              <div className="text-xs">Bangladesh</div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white text-black font-semibold px-3 py-1 rounded-sm border border-black">ADMIT CARD</div>
          </div>
        </div>

        {/* Top meta strip (keep concise – no SSC/HSC here) */}
        <div className="px-6 py-2 text-xs text-black border-b border-black flex flex-wrap items-center gap-x-6 gap-y-1 justify-between">
          <div>Application ID: <span className="font-medium">{app.id}</span></div>
          <div>Issued: <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-3 gap-4">
          {/* Candidate photo (left, keep colorful) */}
          <div className="col-span-1">
            <div className="border border-black rounded-sm p-2 flex items-center justify-center h-56">
              <img
                src={candidatePhoto}
                alt="Candidate"
                {...(photoCrossOrigin ? { crossOrigin: 'anonymous' as const, referrerPolicy: 'no-referrer' as const } : {})}
                data-admit-image="photo"
                className="h-full object-cover rounded-sm"
              />
            </div>
            <div className="mt-2 text-center text-xs text-gray-600">Candidate Photograph</div>
          </div>

          {/* Student Information (right) */}
          <div className="col-span-2 border border-black rounded-sm p-4 text-sm">
            <div className="grid grid-cols-3 gap-x-3 gap-y-1">
              <div className="text-black">Applicant Name</div>
              <div className="col-span-2 text-black font-medium">{safe(student.userName)}</div>

              <div className="text-black">Application ID</div>
              <div className="col-span-2 text-black">{app.id}</div>

              <div className="text-black">Program / Unit</div>
              <div className="col-span-2 text-black">{safe(app.unit?.name)}</div>

              <div className="text-black">Exam Path</div>
              <div className="col-span-2 text-black">{safe(student.examPath)}</div>

              <div className="text-black">Medium</div>
              <div className="col-span-2 text-black">{safe(student.medium)}</div>

              {student.examPath === 'NATIONAL' ? (
                <>
                  <div className="text-black">SSC Roll</div>
                  <div className="col-span-2 text-black">{safe(student.sscRoll)}</div>
                  <div className="text-black">SSC Registration</div>
                  <div className="col-span-2 text-black">{safe(student.sscRegistration)}</div>
                  <div className="text-black">SSC Board</div>
                  <div className="col-span-2 text-black">{safe(student.sscBoard)}</div>
                  <div className="text-black">SSC Year</div>
                  <div className="col-span-2 text-black">{safe(student.sscYear)}</div>

                  <div className="text-black">HSC Roll</div>
                  <div className="col-span-2 text-black">{safe(student.hscRoll)}</div>
                  <div className="text-black">HSC Registration</div>
                  <div className="col-span-2 text-black">{safe(student.hscRegistration)}</div>
                  <div className="text-black">HSC Board</div>
                  <div className="col-span-2 text-black">{safe(student.hscBoard)}</div>
                  <div className="text-black">HSC Year</div>
                  <div className="col-span-2 text-black">{safe(student.hscYear)}</div>
                </>
              ) : (
                <>
                  <div className="text-black">Dakhil Roll</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilRoll)}</div>
                  <div className="text-black">Dakhil Registration</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilRegistration)}</div>
                  <div className="text-black">Dakhil Board</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilBoard)}</div>
                  <div className="text-black">Dakhil Year</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilYear)}</div>

                  <div className="text-black">Alim Roll</div>
                  <div className="col-span-2 text-black">{safe(student.alimRoll)}</div>
                  <div className="text-black">Alim Registration</div>
                  <div className="col-span-2 text-black">{safe(student.alimRegistration)}</div>
                  <div className="text-black">Alim Board</div>
                  <div className="col-span-2 text-black">{safe(student.alimBoard)}</div>
                  <div className="text-black">Alim Year</div>
                  <div className="col-span-2 text-black">{safe(student.alimYear)}</div>
                </>
              )}

              <div className="text-black">Applied On</div>
              <div className="col-span-2 text-black">{new Date(app.appliedAt).toLocaleString()}</div>

              <div className="text-black">Approved On</div>
              <div className="col-span-2 text-black">{app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>

        {/* Exam details */}
        <div className="px-6 pb-2">
          <div className="border border-black rounded-sm p-4 text-sm">
            <div className="text-black font-medium mb-2">Exam Details</div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <div className="text-black text-xs">Seat No.</div>
                <div className="text-black">-</div>
              </div>
              <div>
                <div className="text-black text-xs">Exam Date</div>
                <div className="text-black">-</div>
              </div>
              <div>
                <div className="text-black text-xs">Exam Time</div>
                <div className="text-black">-</div>
              </div>
              <div>
                <div className="text-black text-xs">Center</div>
                <div className="text-black">-</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer signatures */}
        <div className="px-6 mt-4 grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="h-10"></div>
            <div className="border-t border-black inline-block px-8 text-sm text-black">Applicant's Signature</div>
          </div>
          <div className="text-center">
            <div className="h-10"></div>
            <div className="border-t border-black inline-block px-8 text-sm text-black">Authorized Signature</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-6 mt-4 mb-2 border border-black rounded-sm p-3">
          <div className="text-sm font-medium text-black mb-1">Instructions</div>
          <ul className="text-xs text-black list-disc list-inside space-y-1">
            <li>Bring this admit card and a valid photo ID on exam day.</li>
            <li>Electronic devices and notes are strictly prohibited inside the exam hall.</li>
            <li>Arrive at least 30 minutes before the scheduled time.</li>
          </ul>
        </div>

        {/* Branding */}
        <div className="pb-5 flex items-center justify-center gap-2 text-[10px] text-black">
          <img
            src="/logo.svg"
            alt="Uniform Logo"
            className="h-3 w-3 object-contain"
          />
          <span>Powered by Uniform</span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>
    </div>
  )
}
