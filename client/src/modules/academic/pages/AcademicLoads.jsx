import { useEffect, useState } from 'react';
import { Eye, Layers, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

import { getStudents } from '@/modules/students/services/student.service';
import {
  generateAcademicLoad,
  getStudentLoad,
} from '../services/academicLoadService';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const AcademicLoads = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();

      // only students with assigned sections
      setStudents(data.filter((s) => s.section));
    } catch (error) {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleGenerate = async (studentId) => {
    try {
      await generateAcademicLoad(studentId);

      toast.success('Academic load generated.');

      loadStudents();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to generate load.'
      );
    }
  };

  const handleViewLoad = async (studentId) => {
    try {
      const data = await getStudentLoad(studentId);
      setSelectedLoad(data);
    } catch (error) {
      toast.error('Failed to load subjects.');
    }
  };

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Academic Loads
        </h1>
        <p className="text-gray-600">
          Generate and manage student academic loads.
        </p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Student No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Load Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-4 py-3 font-medium">
                      {student.studentNumber}
                    </td>

                    <td className="px-4 py-3">
                      {student.firstName} {student.lastName}
                    </td>

                    <td className="px-4 py-3">
                      {student.program?.programName}
                    </td>

                    <td className="px-4 py-3">
                      {student.section?.sectionCode}
                    </td>

                    <td className="px-4 py-3">
                      {student.loadGenerated ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                          Generated ({student.subjectCount})
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
                          Not Generated
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {student.loadGenerated ? (
                          <>
                            <button
                              onClick={() => handleViewLoad(student._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                            >
                              <Eye size={16} />
                              View
                            </button>

                            <button
                              onClick={() => handleGenerate(student._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                            >
                              <RotateCcw size={16} />
                              Regenerate
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGenerate(student._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                          >
                            <Layers size={16} />
                            Generate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Load Modal */}
      {selectedLoad && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                Student Academic Load
              </h2>

              <button
                onClick={() => setSelectedLoad(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                      Subject Code
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                      Description
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold uppercase">
                      Units
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold uppercase">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {selectedLoad.map((item) => (
                    <tr key={item._id}>
                      <td className="px-3 py-2 font-medium">
                        {item.subject?.subjectCode}
                      </td>

                      <td className="px-3 py-2">
                        {item.subject?.descriptiveTitle}
                      </td>

                      <td className="px-3 py-2 text-center">
                        {item.units}
                      </td>

                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AcademicLoads;
