function EnrollmentFilters({
  search,
  setSearch,
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    "all",
    "pending",
    "accepted",
    "rejected",
  ];

  return (
    <div
      className="
        mb-7
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
      "
    >
      {/* Search */}
      <div
        className="
          relative
          w-full
          max-w-sm
        "
      >
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2.5
            text-sm
            text-slate-100
            placeholder:text-slate-500
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500/40
          "
        />
      </div>

      {/* Tabs */}
      <div
        className="
          flex
          gap-2
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              capitalize
              transition-colors

              ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EnrollmentFilters;