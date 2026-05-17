"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayLogo from "../../assets/Day_Logo.png.png";
import globalTnaLogo from "../../assets/GTNA-LOGO.png";
import nightLogo from "../../assets/Night_Logo.png";
import JobCard from "../components/JobCard";
import ThemeToggle from "../components/ThemeToggle";
import { getJobs } from "../services/api";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {};

        if (selectedCategory) {
          filters.category = selectedCategory;
        }

        if (debouncedSearchTerm) {
          filters.search = debouncedSearchTerm;
        }

        const response = await getJobs(filters);
        const jobsData = Array.isArray(response.data)
          ? response.data
          : response.data?.jobs || [];

        setJobs(jobsData);
        setCategories((currentCategories) => {
          const nextCategories = jobsData
            .map((job) => job.category)
            .filter(Boolean);

          return Array.from(
            new Set([...currentCategories, ...nextCategories])
          ).sort();
        });
      } catch {
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCategory, debouncedSearchTerm]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                  <Image
                    src={dayLogo}
                    alt="Job Board logo"
                    fill
                    priority
                    sizes="(min-width: 640px) 80px, 64px"
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src={nightLogo}
                    alt="Job Board logo"
                    fill
                    priority
                    sizes="(min-width: 640px) 80px, 64px"
                    className="hidden object-contain dark:block"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    Service Requests
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    Job Board
                  </h1>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Browse current service requests, filter by category, and manage
                job postings from one clean workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ThemeToggle />
              <Link
                href="/jobs/new"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-950"
              >
                Post New Job
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                htmlFor="search"
              >
                Search jobs
              </label>
              <div className="relative mt-2">
                <input
                  id="search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title or description..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="lg:w-72">
              <label
                className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                htmlFor="category"
              >
                Filter by category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedCategory || debouncedSearchTerm
                ? `Showing jobs${selectedCategory ? ` in ${selectedCategory}` : ""}${
                    debouncedSearchTerm ? ` matching "${debouncedSearchTerm}"` : ""
                  }`
                : "Showing all available jobs"}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {jobs.length} Jobs
              </span>
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {categories.length} Categories
              </span>
            </div>
          </div>
        </section>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900/70 dark:bg-red-950/40">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              No jobs found
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try a different keyword or category, or post a new job request.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </section>
        )}

        <footer className="mt-10 border-t border-slate-200 py-6 dark:border-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                Mini Jobs
              </p>
              <p className="mt-1">
                Keeping service requests organized from first post to final fix.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="https://github.com/ZamranAhamed/Mini-Service-Request-Board.git"
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm dark:border-blue-900/70 dark:bg-blue-950/40 dark:hover:border-blue-800 dark:hover:bg-blue-950/70"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                Source Code
              </p>
              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
                View GitHub Repository
              </p>
            </a>
            <a
              href="https://www.globaltna.com/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              <div className="relative h-10 w-24 shrink-0">
                <Image
                  src={globalTnaLogo}
                  alt="GlobalTNA logo"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Company
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
                  Visit GlobalTNA
                </p>
              </div>
            </a>
          </div>

          <p className="mt-5 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            © 2026 MiniJobs - All rights reserved
          </p>
        </footer>
      </div>
    </main>
  );
}
