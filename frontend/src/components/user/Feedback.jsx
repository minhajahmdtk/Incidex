import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedbackDetails, setFeedbackDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [error, setError] = useState("");

  // GET CASE DETAILS
  useEffect(() => {
    const getCaseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/cases/${id}`
        );

        setCaseDetails(response.data.case);

        if (response.data.case.currentStatus !== "Resolved") {
          setError(
            "Feedback can be submitted only for resolved cases"
          );
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load case details";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getCaseDetails();
  }, [id]);

  // SUBMIT FEEDBACK
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!feedbackDetails.trim()) {
      setError("Feedback details are required");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post(
        `/feedback/${id}`,
        {
          feedbackDetails: feedbackDetails.trim(),
        }
      );

      toast.success(response.data.message);

      setFeedbackDetails("");

      navigate("/user/cases");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to submit feedback";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Feedback
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Share your feedback about the resolved case.
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

              <p className="text-sm text-slate-500">
                Loading case details...
              </p>
            </div>
          )}

          {/* CONTENT */}
          {!loading && (
            <div className="max-w-3xl">

              {/* CASE INFORMATION */}
              {caseDetails && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle
                      size={20}
                      className="text-green-600"
                    />

                    <h2 className="text-base font-semibold text-slate-900">
                      Resolved Case
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Case ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {caseDetails.caseId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Crime Category
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {caseDetails.crimeCategory}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Incident Location
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {caseDetails.incidentLocation}
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm text-red-700">
                    {error}
                  </p>

                </div>
              )}

              {/* FEEDBACK FORM */}
              {!error &&
                caseDetails?.currentStatus === "Resolved" && (
                  <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Share Your Feedback
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Tell us about your experience with the
                        case resolution.
                      </p>
                    </div>

                    {/* FEEDBACK */}
                    <div>
                      <label
                        htmlFor="feedbackDetails"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Feedback
                      </label>

                      <textarea
                        id="feedbackDetails"
                        name="feedbackDetails"
                        value={feedbackDetails}
                        onChange={(event) =>
                          setFeedbackDetails(event.target.value)
                        }
                        placeholder="Enter your feedback..."
                        rows={6}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                          error
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-blue-500"
                        }`}
                      />

                      <div className="mt-2 flex justify-between">
                        <p className="text-xs text-slate-500">
                          Please provide your honest feedback.
                        </p>

                        <p className="text-xs text-slate-500">
                          {feedbackDetails.length} characters
                        </p>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/user/cases")
                        }
                        className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting
                          ? "Submitting..."
                          : "Submit Feedback"}
                      </button>

                    </div>

                  </form>
                )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feedback;