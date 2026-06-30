import ApplicationRow
from "./ApplicationRow";

function ApplicationTable({
  applications,
  processingId,
  handleStatusUpdate,
}) {
  return (
    <div
      className="
        overflow-x-auto
      "
    >
      <table
        className="
          w-full
          border-collapse
        "
      >
        <thead>
          <tr
            className="
              border-b
              border-white/10
            "
          >
            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Applicant
            </th>

            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Program
            </th>

            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Status
            </th>

            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {applications.map(
            (app) => (
              <ApplicationRow
                key={app._id}
                app={app}
                processingId={
                  processingId
                }
                handleStatusUpdate={
                  handleStatusUpdate
                }
              />
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;