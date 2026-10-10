import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../axiosInterceptor";
import FinePayment from "./FinePayment";

const FakeReportFine = ({ caseItem, onUpdate }) => {
  const [appealReason, setAppealReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!caseItem) return null;

  const {
    caseId,
    isFakeReport,
    fakeReportReason,
    fineAmount,
    fineStatus = "None",
    appealStatus = "Not Appealed",
  } = caseItem;

  // SUBMIT APPEAL
  const submitAppeal = async (event) => {
    event.preventDefault();

    if (appealReason.trim().length < 10) {
      toast.error("Please enter at least 10 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        `/cases/appeal/${caseId}`,
        {
          appealReason: appealReason.trim(),
        }
      );

      toast.success(
        response.data.message || "Appeal submitted successfully."
      );

      setAppealReason("");

      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit appeal."
      );
    } finally {
      setLoading(false);
    }
  };

  // BADGE STYLE
  const getBadgeStyle = (status) => {
    switch (status) {
      case "Pending":
        return "border-[#B94A48]/30 bg-[#B94A48]/10 text-[#B94A48] dark:border-[#D76562]/30 dark:bg-[#D76562]/10 dark:text-[#D76562]";

      case "Appealed":
      case "Approved":
      case "Cancelled":
      case "Paid":
        return "border-[#7FAF8A]/40 bg-[#7FAF8A]/15 text-[#5F8D6A] dark:text-[#9BC7A4]";

      case "Rejected":
      case "Upheld":
        return "border-[#B94A48]/30 bg-[#B94A48]/10 text-[#B94A48] dark:text-[#D76562]";

      default:
        return "border-border bg-muted text-muted-foreground";
    }
  };

  // NO FAKE REPORT FINE
  if (!isFakeReport) {
    return (
      <div className="rounded-2xl border border-[#7FAF8A]/30 bg-card p-5 shadow-sm transition-colors duration-300">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#7FAF8A]/15 p-3 text-[#5F8D6A] dark:text-[#9BC7A4]">
            <CheckCircle size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              No fake-report fine recorded
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              No fake-report fine has been recorded for case{" "}
              {caseId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* FINE DETAILS */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors duration-300 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-xl bg-[#B94A48]/10 p-3 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
            <AlertTriangle size={23} />
          </div>

          <div className="min-w-0">
            <h2 className="bg-gradient-to-r from-[#B94A48] via-[#7FAF8A] to-[#555C64] bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              Fine &amp; Appeal Details
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Case ID: {caseId}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Fine amount
            </p>

            <p className="mt-2 text-2xl font-bold text-foreground">
              ₹{Number(fineAmount || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Fine status
            </p>

            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                fineStatus
              )}`}
            >
              {fineStatus}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText
              size={17}
              className="text-[#B94A48] dark:text-[#D76562]"
            />
            Administrator's reason
          </h3>

          <div className="mt-3 rounded-xl border border-border bg-background p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {fakeReportReason || "No reason has been provided."}
            </p>
          </div>
        </div>
      </div>

      {/* APPEAL REVIEW */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors duration-300 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#7FAF8A]/15 p-3 text-[#5F8D6A] dark:text-[#9BC7A4]">
            <Scale size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              Appeal review
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Track the status of your appeal.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getBadgeStyle(
              appealStatus
            )}`}
          >
            Appeal: {appealStatus}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getBadgeStyle(
              fineStatus
            )}`}
          >
            Fine: {fineStatus}
          </span>
        </div>

        {appealStatus === "Approved" && (
          <div className="mt-5 rounded-xl border border-[#7FAF8A]/30 bg-[#7FAF8A]/10 p-4">
            <p className="text-sm leading-6 text-foreground">
              Your appeal was approved. The fine has been cancelled.
            </p>
          </div>
        )}

        {appealStatus === "Rejected" && (
          <div className="mt-5 rounded-xl border border-[#B94A48]/30 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/10">
            <p className="text-sm leading-6 text-foreground">
              Your appeal was rejected. The fine remains upheld.
            </p>
          </div>
        )}

        {appealStatus === "Pending" && (
          <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={17} />
              Your appeal is awaiting administrator review.
            </p>
          </div>
        )}

        {/* SEPARATE FINE PAYMENT COMPONENT */}
        {appealStatus === "Rejected" &&
          fineStatus === "Upheld" && (
            <div className="mt-6">
              <FinePayment
                caseItem={caseItem}
                onUpdate={onUpdate}
              />
            </div>
          )}

        {/* PAID CONFIRMATION */}
        {fineStatus === "Paid" && (
          <div className="mt-5 rounded-xl border border-[#7FAF8A]/30 bg-[#7FAF8A]/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-[#5F8D6A] dark:text-[#9BC7A4]"
              />

              <div>
                <h4 className="font-semibold text-foreground">
                  Fine payment completed
                </h4>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Your payment has been verified by the server.
                  No further payment is required for this fine.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT APPEAL */}
        {appealStatus === "Not Appealed" &&
          fineStatus === "Pending" && (
            <form onSubmit={submitAppeal} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor={`appealReason-${caseId}`}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Reason for appeal
                </label>

                <textarea
                  id={`appealReason-${caseId}`}
                  value={appealReason}
                  onChange={(event) =>
                    setAppealReason(event.target.value)
                  }
                  rows={4}
                  maxLength={1000}
                  required
                  minLength={10}
                  placeholder="Explain why you believe the report was incorrectly classified..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                />

                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {appealReason.length}/1000
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B94A48] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#A6403E] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#D76562] dark:hover:bg-[#C65350]"
              >
                <Send size={16} />
                {loading ? "Submitting..." : "Submit Appeal"}
              </button>
            </form>
          )}

        {appealStatus === "Not Appealed" &&
          fineStatus !== "Pending" && (
            <p className="mt-5 text-sm text-muted-foreground">
              An appeal cannot be submitted at the current fine status.
            </p>
          )}
      </div>
    </section>
  );
};

export default FakeReportFine;
