import React from 'react'

const SingleAssignModal = ({
  showAssignModal,
  selectedStudent,
  onClose,
  targetSectionId,
  setTargetSectionId,
  loadingSections,
  filteredSections,
  errorMsg,
  assigning,
  handleAssignSection
}) => {
  if (!showAssignModal || !selectedStudent) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-5">
      <div className="w-full max-w-[480px] bg-[rgba(10,15,30,0.95)] border border-white/10 rounded-[20px] p-7 shadow-2xl font-['Inter']">
        <h3 className="font-['Sora'] font-bold text-lg text-slate-100 mb-3">
          Assign Class Section
        </h3>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 mb-5">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider m-0 mb-1">Student</p>
          <p className="text-slate-100 text-base font-semibold mb-3">
            {[selectedStudent.firstName, selectedStudent.middleName, selectedStudent.lastName].filter(Boolean).join(' ')}
          </p>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider m-0 mb-1">Academic Program</p>
          <p className="text-indigo-400 text-sm font-medium">
            {selectedStudent.program?.programName || selectedStudent.degreeProgram || 'No Program Assigned'}
          </p>
        </div>

        {loadingSections ? (
          <div className="py-[30px] text-center text-slate-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"
              className="animate-spin block mx-auto mb-3">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Fetching active sections...
          </div>
        ) : (
          <div>
            <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
              Select Section
            </label>
            <select
              value={targetSectionId}
              onChange={e => setTargetSectionId(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-[10px] px-3.5 py-2.5 text-slate-100 text-sm font-['Inter'] outline-none"
            >
              <option value="" disabled>-- Choose a Section --</option>
              {filteredSections.map(sec => (
                <option key={sec._id} value={sec._id} style={{ background: '#0A0F1E', color: '#E2E8F0' }}>
                  {sec.sectionCode} - {sec.sectionName} (Year Level: {sec.yearLevel})
                </option>
              ))}
            </select>

            {filteredSections.length === 0 && (
              <div className="flex gap-2 bg-red-500/06 border border-red-500/15 rounded-[10px] p-3 mt-3.5">
                <span className="text-base">⚠️</span>
                <p className="text-red-300 text-xs m-0 leading-normal">
                  No active sections exist for this student's program ({selectedStudent.program?.programName || selectedStudent.degreeProgram}).
                  Please verify curriculum sections.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/08 border border-red-500/20 rounded-[10px] px-3.5 py-2.5 mt-3.5">
                <p className="text-red-300 text-xs m-0">{errorMsg}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-7">
              <button
                type="button"
                onClick={onClose}
                className="bg-white/5 text-slate-400 border border-white/10 px-[18px] py-2 rounded-[10px] font-semibold text-sm cursor-pointer transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSection}
                disabled={!targetSectionId || assigning}
                className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none px-6 py-2 rounded-[10px] font-semibold text-sm cursor-pointer shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Assign Section'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleAssignModal
