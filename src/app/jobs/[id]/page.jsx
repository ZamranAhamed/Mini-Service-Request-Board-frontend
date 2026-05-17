"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ThemeToggle from "../../../components/ThemeToggle";
import { deleteJob, getJobById, updateJobStatus } from "../../../services/api";

const statusOptions = ["Open", "In Progress", "Closed"];
const statusStyles = {
  Open: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-300",
  "In Progress":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/50 dark:text-amber-300",
  Closed:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300",
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);
        const jobData = response.data?.job || response.data;

        setJob(jobData);
        setStatus(jobData?.status || "");
      } catch {
        setError("Unable to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    try {
      setUpdating(true);
      const response = await updateJobStatus(id, status);
      const updatedJob = response.data?.job || response.data;

      setJob((currentJob) => ({
        ...currentJob,
        ...updatedJob,
        status,
      }));
      toast.success("Job updated successfully.");
      router.push("/");
    } catch {
      toast.error("Unable to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await deleteJob(id);
      toast.success("Job deleted successfully.");
      router.push("/");
    } catch {
      toast.error("Unable to delete job. Please try again.");
      setDeleting(false);
    }
  };

  const createdDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleString()
    : "N/A";
  const statusClass =
    statusStyles[job?.status] ||
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Job Details
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              {job?.title || "Job Request"}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
            >
              Back to Jobs
            </Link>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900/70 dark:bg-red-950/40">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Unable to show this job
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {job && !loading && !error && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                    {job.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {job.description}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
                >
                  {job.status || "N/A"}
                </span>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Category" value={job.category} />
              <DetailItem label="Location" value={job.location} />
              <DetailItem label="Contact Name" value={job.contactName} />
              <DetailItem label="Contact Email" value={job.contactEmail} />
              <DetailItem label="Status" value={job.status} />
              <DetailItem label="Created At" value={createdDate} />
            </dl>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                Manage Request
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update the job status or remove this request.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-950 dark:disabled:bg-blue-900"
                >
                  {updating ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-offset-slate-950 dark:disabled:bg-red-900"
                >
                  {deleting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Job"
                  )}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-medium text-slate-900 dark:text-slate-100">
        {value || "N/A"}
      </dd>
    </div>
  );
}
