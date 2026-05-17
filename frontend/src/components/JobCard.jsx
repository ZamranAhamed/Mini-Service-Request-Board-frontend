import Link from "next/link";

const statusStyles = {
  Open: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-300",
  "In Progress":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/50 dark:text-amber-300",
  Closed:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300",
};

export default function JobCard({ job }) {
  const createdDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
  const statusClass =
    statusStyles[job?.status] ||
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 dark:hover:shadow-blue-950/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {job?.category || "Uncategorized"}
          </p>
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-slate-950 dark:text-white">
            {job?.title}
          </h2>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {job?.status || "N/A"}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Location
          </p>
          <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
            {job?.location || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Created
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">
            {createdDate}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={`/jobs/${job?._id || job?.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-950"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
