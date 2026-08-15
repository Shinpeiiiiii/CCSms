import React from 'react'

const BatchAssignModal = ({
  showBatchAssignModal,
  onClose,
  selectedStudentsList,
  sections,
  loadingSections,
  batchTargetSectionId,
  setBatchTargetSectionId,
  batchAssigning,
  batchErrorMsg,
  batchSuccessMsg,
  handleBatchAssignSection
}) => {
  if (!showBatchAssignModal) return null

  const programIds = Array.from(
    new Set(
      selectedStudentsList
        .map(st => st.program?._id || st.program || st.degreeProgram)
        .filter(Boolean)
    )
  )

  const filteredBatchSections = sections.filter(sec => {
    if (programIds.length === 1) {
      const targetProg = programIds[0]
      const secProgId = sec.curriculum?.program?._id || sec.curriculum?.program
      const secProgName = sec.curriculum?.program?.programName || ''
      if (secProgId && secProgId === targetProg) return true
      if (secProgName && typeof targetProg === 'string' && secProgName.toLowerCase().includes(targetProg.toLowerCase())) return true
      return false
    }
    return true
  })

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md p-5">
      <div className="w-full max-w-[520px] bg-[rgba(10,15,30,0.95)] border border-white/10 rounded-[20px] p-7 shadow-2xl font-['Inter']">
        <h3 className="font-['Sora'] font-bold text-lg text-slate-100 mb-3">
          Batch Section Assignment
        </h3>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider m-0">
              Selected Students ({selectedStudentsList.length})
            </p>
            {programIds.length > 1 && (
              <span className="text-amber-400 text-xs font-semibold">
                ⚠️ Multiple programs selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
            {selectedStudentsList.map(st => (
              <span key={st._id} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full text-sm font-medium">
                {[st.firstName, st.lastName].filter(Boolean).join(' ')}
                {st.program?.programCode && <span className="opacity-70 ml-1">({st.program.programCode})</span>}
              </span>
            ))}
          </div>
        </div>

        {loadingSections ? (
          <div className="py-6 text-center text-slate-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"
              className="animate-spin block mx-auto mb-3">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Fetching available sections...
          </div>
        ) : (
          <div>
            <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
              Target Section
            </label>
            <select
              value={batchTargetSectionId}
              onChange={e => setBatchTargetSectionId(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-[10px] px-3.5 py-2.5 text-slate-100 text-sm font-['Inter'] outline-none"
            >
              <option value="" disabled>-- Select Section for Batch Assignment --</option>
              {(filteredBatchSections.length > 0 ? filteredBatchSections : sections).map(sec => (
                <option key={sec._id} value={sec._id} style={{ background: '#0A0F1E', color: '#E2E8F0' }}>
                  {sec.sectionCode} - {sec.sectionName} (Program: {sec.curriculum?.program?.programCode || 'N/A'}, Yr: {sec.yearLevel})
                </option>
              ))}
            </select>

            {batchSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[10px] px-3.5 py-2.5 mt-3.5">
                <p className="text-emerald-400 text-sm font-semibold m-0">✓ {batchSuccessMsg}</p>
              </div>
            )}

            {batchErrorMsg && (
              <div className="bg-red-500/08 border border-red-500/20 rounded-[10px] px-3.5 py-2.5 mt-3.5">
                <p className="text-red-300 text-xs m-0">{batchErrorMsg}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-7">
              <button
                type="button"
                onClick={onClose}
                disabled={batchAssigning}
                className="bg-white/5 text-slate-400 border border-white/10 px-[18px] py-2 rounded-[10px] font-semibold text-sm cursor-pointer transition-all hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchAssignSection}
                disabled={!batchTargetSectionId || batchAssigning}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none px-6 py-2 rounded-[10px] font-semibold text-sm cursor-pointer shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {batchAssigning ? 'Assigning...' : `Assign Section to ${selectedStudentsList.length} Student(s)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchAssignModal
