import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { getEligibleInstitutions, type EligibleInstitution } from '@/api/studentExplore'

import type { MyApplication } from '@/api/studentApplications'
import type { User } from '@/context/student/AuthContext'

interface AdmitCardProps {
  app: MyApplication
  student: User
  institutionLogoUrl?: string
  pdfPreview?: boolean
}

export default function AdmitCard({ app, student, institutionLogoUrl, pdfPreview = false }: AdmitCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [resolvedLogo, setResolvedLogo] = useState<string | null>(
    institutionLogoUrl || app?.institution?.logoUrl || null
  )
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

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
    } catch {}
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
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const imgs = clonedDoc.querySelectorAll('img[data-admit-image]') as NodeListOf<HTMLImageElement>
        imgs.forEach((img) => {
          try {
            const u = new URL(img.getAttribute('src') || '', window.location.href)
            const isData = u.protocol === 'data:' || u.protocol === 'blob:'
            if (!isData) {
              const allowed = (u.origin === sameOrigin) || (u.origin === API_ORIGIN)
              if (!allowed) {
                // Fallback to safe local logo for PDF if cross-origin image would taint canvas
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
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 24
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    if (imgHeight > pageHeight - margin * 2) {
      const scale = (pageHeight - margin * 2) / imgHeight
      const scaledWidth = imgWidth * scale
      const scaledHeight = imgHeight * scale
      const centerX = (pageWidth - scaledWidth) / 2
      const centerY = (pageHeight - scaledHeight) / 2
      pdf.addImage(imgData, 'PNG', centerX, centerY, scaledWidth, scaledHeight)
    } else {
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
    }
    return pdf
  }, [API_ORIGIN])

  const downloadPdf = async () => {
    try {
      const pdf = await buildPdf()
      const safeName = `${student.userName || 'Student'}_${app.unit?.name || 'Unit'}`.replace(/[^a-z0-9_-]+/gi, '_')
      pdf.save(`AdmitCard_${safeName}.pdf`)
    } catch (e) {
      console.error('PDF generation failed', e)
      // Fallback: if preview PDF exists, open in new tab for manual save
      if (pdfUrl) {
        try {
          window.open(pdfUrl, '_blank')
          return
        } catch (e2) { void e2 }
      }
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

  useEffect(() => {
    let url: string | null = null
    const make = async () => {
      if (!pdfPreview) return
      setGenerating(true)
      try {
        // Warm-up images
        await Promise.allSettled([preloadImage(instLogo), preloadImage(candidatePhoto)])
        const pdf = await buildPdf()
        const blob = pdf.output('blob') as Blob
        url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch (e) {
        console.error('PDF preview failed', e)
      } finally {
        setGenerating(false)
      }
    }
    // allow one frame for layout
    const id = requestAnimationFrame(() => { make() })
    return () => { cancelAnimationFrame(id); if (url) URL.revokeObjectURL(url) }
  }, [pdfPreview, instLogo, candidatePhoto, buildPdf])

  return (
    <div className="w-full">
      {/* Visible card (also used for PDF rasterization) */}
      <div
        ref={cardRef}
        className="bg-white border-2 border-black rounded-md p-0 max-w-[1200px] w-full mx-auto shadow-sm"
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

        {/* Top meta strip */}
        <div className="px-6 py-3 text-xs text-black border-b border-black flex flex-wrap items-center gap-x-6 gap-y-1 justify-between">
          <div>Application ID: <span className="font-medium">{app.id}</span></div>
          <div>Issued: <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
          {student?.sscRoll ? (
            <div>SSC Roll: <span className="font-medium">{safe(student.sscRoll)}</span></div>
          ) : null}
          {student?.hscRoll ? (
            <div>HSC Roll: <span className="font-medium">{safe(student.hscRoll)}</span></div>
          ) : null}
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Left details */}
          <div className="col-span-2 border border-black rounded-sm p-4 text-sm">
            <div className="grid grid-cols-3 gap-x-3 gap-y-2">
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
                  <div className="text-black">HSC Roll</div>
                  <div className="col-span-2 text-black">{safe(student.hscRoll)}</div>
                  <div className="text-black">SSC Board</div>
                  <div className="col-span-2 text-black">{safe(student.sscBoard)}</div>
                  <div className="text-black">HSC Board</div>
                  <div className="col-span-2 text-black">{safe(student.hscBoard)}</div>
                </>
              ) : (
                <>
                  <div className="text-black">Dakhil Roll</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilRoll)}</div>
                  <div className="text-black">Alim Roll</div>
                  <div className="col-span-2 text-black">{safe(student.alimRoll)}</div>
                  <div className="text-black">Dakhil Board</div>
                  <div className="col-span-2 text-black">{safe(student.dakhilBoard)}</div>
                  <div className="text-black">Alim Board</div>
                  <div className="col-span-2 text-black">{safe(student.alimBoard)}</div>
                </>
              )}

              <div className="text-black">Applied On</div>
              <div className="col-span-2 text-black">{new Date(app.appliedAt).toLocaleString()}</div>

              <div className="text-black">Approved On</div>
              <div className="col-span-2 text-black">{app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : '-'}</div>
            </div>
          </div>

          {/* Candidate photo (keep colorful) */}
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
            src={candidatePhoto}
            alt="Candidate"
            {...(photoCrossOrigin ? { crossOrigin: 'anonymous' as const, referrerPolicy: 'no-referrer' as const } : {})}
            className="h-3 w-3 rounded-sm object-cover"
          />
          <span>Powered by UniForm</span>
        </div>
      </div>

      {pdfPreview ? (
        <div className="mt-2">
          {generating ? (
            <div className="py-8 text-center text-gray-600">Preparing PDF...</div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-[80vh] border" />
          ) : (
            <div className="py-8 text-center text-gray-600">Preview unavailable. You can still download the PDF below.</div>
          )}
          <div className="mt-3 flex justify-center">
            <Button className="bg-black hover:bg-gray-800" onClick={downloadPdf}>Download PDF</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <Button className="bg-black hover:bg-gray-800" onClick={downloadPdf}>Download PDF</Button>
        </div>
      )}
    </div>
  )
}
