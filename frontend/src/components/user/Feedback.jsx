
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
  const [feedbackAlreadySubmitted, setFeedbackAlreadySubmitted] =
    useState(false);

  // GET CASE DETAILS
  useEffect(() => {
    const getCaseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/cases/${id}`);

        setCaseDetails(response.data.case);

        if (response.data.case.feedbackSubmitted) {
          setFeedbackAlreadySubmitted(true);
          setError(
            "Feedback has already been submitted for this case"
          );
        } else if (
          response.data.case.currentStatus !== "Resolved"
        ) {
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

    if (feedbackAlreadySubmitted) {
      setError("Feedback has already been submitted for this case");
      return;
    }

    if (caseDetails?.currentStatus !== "Resolved") {
      setError(
        "Feedback can be submitted only for resolved cases"
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post(`/feedback/${id}`, {
        feedbackDetails: feedbackDetails.trim(),
      });

      toast.success(response.data.message);

      setFeedbackDetails("");
      setFeedbackAlreadySubmitted(true);

      navigate("/user/cases");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to submit feedback";

      setError(message);
      toast.error(message);

      if (
        message.toLowerCase().includes("already been submitted")
      ) {
        setFeedbackAlreadySubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* BACKGROUND CONTENT */}
      <main className="min-h-[calc(100vh-72px)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <div
              className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-[#B94A48]/10
                text-[#B94A48]
                dark:bg-[#D76562]/10
                dark:text-[#D76562]
              "
            >
              <MessageSquare size={23} />
            </div>

            <h1
              className="
                bg-gradient-to-r
                from-[#B94A48]
                via-[#7FAF8A]
                to-[#555C64]
                bg-clip-text
                text-xl
                font-bold
                text-transparent
              "
            >
              Feedback
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Feedback dialog is open.
            </p>
          </div>
        </div>
      </main>

      {/* DIALOG OVERLAY */}
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          px-4
          py-6
          backdrop-blur-sm
        "
      >
        {/* DIALOG */}
        <div
          className="
            relative
            max-h-[90vh]
            w-full
            max-w-lg
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
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <MessageSquare size={20} />
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
                    border-2
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
                  <div
                    className="
                      mb-5
                      rounded-xl
                      border
                      border-border
                      bg-muted/40
                      p-4
                    "
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle
                        size={18}
                        className="text-[#7FAF8A]"
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
                  <div
                    className="
                      mb-5
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-[#B94A48]/30
                      bg-[#B94A48]/5
                      p-4
                      dark:border-[#D76562]/30
                      dark:bg-[#D76562]/10
                    "
                  >
                    <AlertCircle
                      size={19}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#B94A48]
                        dark:text-[#D76562]
                      "
                    />

                    <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
                      {error}
                    </p>
                  </div>
                )}

                {/* FEEDBACK FORM */}
                {!error &&
                  !feedbackAlreadySubmitted &&
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
                            transition-all
                            placeholder:text-muted-foreground
                            focus:border-[#B94A48]
                            focus:ring-2
                            focus:ring-[#B94A48]/10
                            dark:focus:border-[#D76562]
                            dark:focus:ring-[#D76562]/10
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
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-primary
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-primary-foreground
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-primary
                            hover:text-primary-foreground
                            hover:shadow-md
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            disabled:hover:translate-y-0
                            disabled:hover:shadow-sm
                          "
                        >
                          {submitting ? (
                            <>
                              <span
                                className="
                                  h-4
                                  w-4
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-primary-foreground/30
                                  border-t-primary-foreground
                                "
                              />
                              Submitting...
                            </>
                          ) : (
                            "Submit Feedback"
                          )}
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
