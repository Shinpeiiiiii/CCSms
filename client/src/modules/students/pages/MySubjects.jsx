import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { toast } from 'react-toastify';

import { getMySubjects } from '../services/studentSubjectService';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const MySubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSubjects = async () => {
    try {
      setLoading(true);

      const data = await getMySubjects();

      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load subjects.');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    const keyword = search.toLowerCase();

    return subjects.filter((item) => {
      const code =
        item.subject?.subjectCode?.toLowerCase() || '';

      const title =
        item.subject?.subjectName?.toLowerCase() || '';

      return (
        code.includes(keyword) ||
        title.includes(keyword)
      );
    });
  }, [subjects, search]);

  const totalUnits = useMemo(() => {
    return filteredSubjects.reduce(
      (sum, item) => sum + (item.units || 0),
      0
    );
  }, [filteredSubjects]);

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Subjects
          </h1>
          <p className="text-gray-600">
            View your enrolled subjects for the current enrollment period.
          </p>
        </div>

        <div className="bg-white border rounded-xl px-4 py-3 min-w-[180px]">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalUnits}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by subject code or title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading subjects...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <BookOpen className="mx-auto mb-3" size={40} />
            <p>No subjects found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Subject Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Descriptive Title
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Units
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Year Level
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSubjects.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.subject?.subjectCode}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.subject?.subjectName}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.units}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.yearLevel}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default MySubjects;
