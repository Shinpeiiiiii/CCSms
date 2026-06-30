import StatusBadge from "./StatusBadge";

function ApplicationRow({
  app,
  processingId,
  handleStatusUpdate,
}) {
  return (
    <tr
      className="
        border-b
        border-white/5
        hover:bg-white/[0.02]
        transition-colors
      "
    >
      {/* Applicant */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span
            className="
              text-sm
              font-semibold
              text-slate-100
            "
          >
            {app.firstName} {app.lastName}
          </span>

          <span
            className="
              text-xs
              text-slate-500
            "
          >
            {app.email}
          </span>
        </div>
      </td>

      {/* Program */}
      <td
        className="
          px-6
          py-4
          text-sm
          text-slate-300
        "
      >
        {app.program}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge
          status={app.status}
        />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        {app.status === "pending" ? (
          <div className="flex gap-2">

            <button
              onClick={() =>
                handleStatusUpdate(
                  app._id,
                  "accepted"
                )
              }
              disabled={
                processingId !== null
              }
              className="
                rounded-lg
                bg-gradient-to-r
                from-emerald-500
                to-emerald-600
                px-3.5
                py-1.5
                text-xs
                font-semibold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition-all
                duration-200
                hover:scale-105
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Accept
            </button>

            <button
              onClick={() =>
                handleStatusUpdate(
                  app._id,
                  "rejected"
                )
              }
              disabled={
                processingId !== null
              }
              className="
                rounded-lg
                border
                border-red-500/20
                bg-red-500/10
                px-3.5
                py-1.5
                text-xs
                font-semibold
                text-red-300
                transition-colors
                duration-200
                hover:bg-red-500/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Reject
            </button>

          </div>
        ) : (
          <span
            className="
              text-xs
              italic
              text-slate-500
            "
          >
            Processed
          </span>
        )}
      </td>
    </tr>
  );
}

export default ApplicationRow;