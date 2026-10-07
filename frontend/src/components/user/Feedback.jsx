import { useEffect, useState } from "react";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
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

  // CLOSE DIALOG
  const handleClose = () => {
    navigate(`/user/cases/${id}`);
  };

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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* BACKGROUND CONTENT */}
      <main className="min-h-[calc(100vh-72px)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <MessageSquare
              size={32}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <h1 className="text-xl font-semibold text-foreground">
              Feedback
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Feedback dialog is open.
            </p>
          </div>
        </div>
      </main>

      {/* DIALOG OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">

        {/* DIALOG */}
        <div
          className="
            relative
            w-full
            max-w-lg
            max-h-[90vh]
            overflow-y-auto
            rounded-2xl
            border
            border-border
            bg-card
            shadow-2xl
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >

          {/* DIALOG HEADER */}
          <div className="flex items-start justify-between border-b border-border px-6 py-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <MessageSquare
                  size={20}
                  className="text-foreground"
                />
              </div>

              <div>
                <h1
                  id="feedback-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Share Your Feedback
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us about your experience with the case
                  resolution.
                </p>
              </div>

            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={handleClose}
              className="
                rounded-lg
                p-2
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-muted
                hover:text-foreground
              "
              aria-label="Close feedback dialog"
              title="Close"
            >
              <X size={19} />
            </button>

          </div>

          {/* DIALOG CONTENT */}
          <div className="px-6 py-5">

            {/* LOADING */}
            {loading && (
              <div className="py-12 text-center">

                <div
                  className="
                    mx-auto
                    mb-4
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-4
                    border-border
                    border-t-[#B94A48]
                    dark:border-t-[#D76562]
                  "
                />

                <p className="text-sm text-muted-foreground">
                  Loading case details...
                </p>

              </div>
            )}

            {/* CONTENT */}
            {!loading && (
              <>
                {/* CASE INFORMATION */}
                {caseDetails && (
                  <div className="mb-5 rounded-xl border border-border bg-muted/40 p-4">

                    <div className="mb-4 flex items-center gap-2">

                      <CheckCircle
                        size={18}
                        className="text-emerald-600 dark:text-emerald-400"
                      />

                      <h2 className="text-sm font-semibold text-foreground">
                        Resolved Case
                      </h2>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Case ID
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {caseDetails.caseId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Crime Category
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {caseDetails.crimeCategory}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Incident Location
                        </p>

                        <p className="mt-1 text-sm text-foreground">
                          {caseDetails.incidentLocation}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {/* ERROR */}
                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">

                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                    />

                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>

                  </div>
                )}

                {/* FEEDBACK FORM */}
                {!error &&
                  caseDetails?.currentStatus === "Resolved" && (
                    <form onSubmit={handleSubmit}>

                      {/* FEEDBACK FIELD */}
                      <div>

                        <label
                          htmlFor="feedbackDetails"
                          className="mb-2 block text-sm font-medium text-foreground"
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
                          autoFocus
                          className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-border
                            bg-background
                            px-4
                            py-3
                            text-sm
                            text-foreground
                            outline-none
                            transition
                            placeholder:text-muted-foreground
                            focus:border-[#B94A48]
                            dark:focus:border-[#D76562]
                          "
                        />

                        <div className="mt-2 flex items-center justify-between">

                          <p className="text-xs text-muted-foreground">
                            Please provide your honest feedback.
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {feedbackDetails.length} characters
                          </p>

                        </div>

                      </div>

                      {/* BUTTONS */}
                      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        {/* CANCEL */}
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={submitting}
                          className="
                            rounded-lg
                            border
                            border-border
                            bg-background
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-foreground
                            transition-all
                            duration-200
                            hover:bg-muted
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          Cancel
                        </button>

                        {/* SUBMIT */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="
                            rounded-lg
                            bg-[#151A21]
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition-all
                            duration-200
                            hover:bg-[#343A40]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            dark:bg-[#E5E7EB]
                            dark:text-[#151A21]
                            dark:hover:bg-white
                          "
                        >
                          {submitting
                            ? "Submitting..."
                            : "Submit Feedback"}
                        </button>

                      </div>

                    </form>
                  )}

              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Feedback;