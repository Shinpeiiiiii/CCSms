import { Search } from 'lucide-react';

const ApplicationToolbar = ({ search, setSearch }) => {
  return (
    <div className="relative w-full md:w-80 shadow-sm rounded-xl">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search by name, email, or application no..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400 transition-all duration-150"
      />
    </div>
  );
};

export default ApplicationToolbar;