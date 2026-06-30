export function filterApplications(
  applications,
  search,
  activeTab
) {
  return applications.filter(
    (app) => {
      const matchesSearch =
        app.firstName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        app.lastName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        app.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesTab =
        activeTab === "all" ||
        app.status === activeTab;

      return (
        matchesSearch &&
        matchesTab
      );
    }
  );
}