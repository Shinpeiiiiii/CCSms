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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-5">
      <div className="w-full max-w-[480px] bg-white border border-gray-200 p-6 shadow-lg">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Assign Class Section
        </h3>

        <div className="bg-gray-50 border border-gray-200 p-3.5 mb-5">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider m-0 mb-1">Student</p>
          <p className="text-gray-900 text-sm font-semibold mb-3">
            {[selectedStudent.firstName, selectedStudent.middleName, selectedStudent.lastName].filter(Boolean).join(' ')}
          </p>
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider m-0 mb-1">Academic Program</p>
          <p className="text-gray-700 text-sm font-medium">
            {selectedStudent.program?.programName || selectedStudent.degreeProgram || 'No Program Assigned'}
          </p>
        </div>

        {loadingSections ? (
          <div className="py-[30px] text-center text-gray-500 text-sm">
            Fetching active sections...
          </div>
        ) : (
          <div>
            <label className="block text-gray-600 text-[11px] font-semibold tracking-wider uppercase mb-2">
              Select Section
            </label>
            <select
              value={targetSectionId}
              onChange={e => setTargetSectionId(e.target.value)}
              className="w-full border border-gray-200 bg-white px-3 py-2.5 text-gray-700 text-sm outline-none transition-colors focus:border-gray-900"
            >
              <option value="" disabled>-- Choose a Section --</option>
              {filteredSections.map(sec => (
                <option key={sec._id} value={sec._id}>
                  {sec.sectionCode} - {sec.sectionName} (Year Level: {sec.yearLevel})
                </option>
              ))}
            </select>

            {filteredSections.length === 0 && (
              <div className="flex gap-2 bg-red-50 border border-red-200 p-3 mt-3.5">
                <span className="text-sm">⚠️</span>
                <p className="text-red-600 text-xs m-0 leading-normal">
                  No active sections exist for this student's program ({selectedStudent.program?.programName || selectedStudent.degreeProgram}).
                  Please verify curriculum sections.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 px-3.5 py-2.5 mt-3.5">
                <p className="text-red-600 text-xs m-0">{errorMsg}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-7">
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-gray-600 border border-gray-200 px-4 py-2 font-semibold text-sm cursor-pointer transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSection}
                disabled={!targetSectionId || assigning}
                className="bg-gray-900 text-white border border-gray-900 px-6 py-2 font-semibold text-sm cursor-pointer transition-colors hover:bg-gray-800 disabled:opacity-50"
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
