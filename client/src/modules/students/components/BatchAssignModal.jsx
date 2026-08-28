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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-5">
      <div className="w-full max-w-[520px] bg-white border border-gray-200 p-6 shadow-lg">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Batch Section Assignment
        </h3>

        <div className="bg-gray-50 border border-gray-200 p-3.5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider m-0">
              Selected Students ({selectedStudentsList.length})
            </p>
            {programIds.length > 1 && (
              <span className="text-amber-600 text-xs font-semibold">
                ⚠️ Multiple programs selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
            {selectedStudentsList.map(st => (
              <span key={st._id} className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 text-sm font-medium">
                {[st.firstName, st.lastName].filter(Boolean).join(' ')}
                {st.program?.programCode && <span className="opacity-60 ml-1">({st.program.programCode})</span>}
              </span>
            ))}
          </div>
        </div>

        {loadingSections ? (
          <div className="py-6 text-center text-gray-500 text-sm">
            Fetching available sections...
          </div>
        ) : (
          <div>
            <label className="block text-gray-600 text-[11px] font-semibold tracking-wider uppercase mb-2">
              Target Section
            </label>
            <select
              value={batchTargetSectionId}
              onChange={e => setBatchTargetSectionId(e.target.value)}
              className="w-full border border-gray-200 bg-white px-3 py-2.5 text-gray-700 text-sm outline-none transition-colors focus:border-gray-900"
            >
              <option value="" disabled>-- Select Section for Batch Assignment --</option>
              {(filteredBatchSections.length > 0 ? filteredBatchSections : sections).map(sec => (
                <option key={sec._id} value={sec._id}>
                  {sec.sectionCode} - {sec.sectionName} (Program: {sec.curriculum?.program?.programCode || 'N/A'}, Yr: {sec.yearLevel})
                </option>
              ))}
            </select>

            {batchSuccessMsg && (
              <div className="bg-green-50 border border-green-200 px-3.5 py-2.5 mt-3.5">
                <p className="text-green-700 text-sm font-semibold m-0">✓ {batchSuccessMsg}</p>
              </div>
            )}

            {batchErrorMsg && (
              <div className="bg-red-50 border border-red-200 px-3.5 py-2.5 mt-3.5">
                <p className="text-red-600 text-xs m-0">{batchErrorMsg}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-7">
              <button
                type="button"
                onClick={onClose}
                disabled={batchAssigning}
                className="bg-white text-gray-600 border border-gray-200 px-4 py-2 font-semibold text-sm cursor-pointer transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchAssignSection}
                disabled={!batchTargetSectionId || batchAssigning}
                className="bg-gray-900 text-white border border-gray-900 px-6 py-2 font-semibold text-sm cursor-pointer transition-colors hover:bg-gray-800 disabled:opacity-50"
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
