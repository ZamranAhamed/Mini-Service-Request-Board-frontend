"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createJob } from "../services/api";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  location: "",
  contactName: "",
  contactEmail: "",
};

const requiredFields = [
  ["title", "Title is required."],
  ["description", "Description is required."],
  ["category", "Category is required."],
  ["location", "Location is required."],
  ["contactName", "Contact name is required."],
  ["contactEmail", "Contact email is required."],
];

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-500/20";

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
      {message}
    </p>
  );
}

export default function JobForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    requiredFields.forEach(([field, message]) => {
      if (!formData[field].trim()) {
        nextErrors[field] = message;
      }
    });

    if (
      formData.contactEmail.trim() &&
      !emailPattern.test(formData.contactEmail)
    ) {
      nextErrors.contactEmail = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await createJob(formData);
      toast.success("Job created successfully.");
      router.push("/");
    } catch {
      toast.error("Unable to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Website landing page redesign"
              className={inputClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service request, scope, and any important details."
              className={`${inputClass} resize-none leading-6`}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Design"
                className={inputClass}
              />
              <FieldError message={errors.category} />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Colombo or Remote"
                className={inputClass}
              />
              <FieldError message={errors.location} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                Contact Name
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="e.g. Jane Smith"
                className={inputClass}
              />
              <FieldError message={errors.contactName} />
            </div>

            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                Contact Email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="name@example.com"
                className={inputClass}
              />
              <FieldError message={errors.contactEmail} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-950 dark:disabled:bg-blue-900 sm:w-auto"
          >
            {submitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Posting...
              </>
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
