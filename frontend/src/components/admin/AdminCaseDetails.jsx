import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ExternalLink,
  Download,
  AlertTriangle,
  Scale,
  Send,
  Clock,
} from "lucide-react";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminCaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newStatus, setNewStatus] = useState("");

  const [finalDetails, setFinalDetails] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");

  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fake-report fine and appeal state
  const [fakeReportReason, setFakeReportReason] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [fineUpdating, setFineUpdating] = useState(false);

  const [appealDecision, setAppealDecision] = useState("");
  const [appealUpdating, setAppealUpdating] = useState(false);

  // Refresh case data after fine or appeal actions
  const refreshCaseDetails = async () => {
    const response = await axiosInstance.get(`/admin/cases/${id}`);
    const data = response.data.case || response.data;

    setCaseData(data);
    return data;
  };

  useEffect(() => {
    let isMounted = true;

    axiosInstance
      .get(`/admin/cases/${id}`)
      .then((response) => {
        if (!isMounted) return;

        const data = response.data.case || response.data;

        setCaseData(data);

        if (data.currentStatus === "New") {
          setNewStatus("Acknowledged");
        } else if (data.currentStatus === "Acknowledged") {
          setNewStatus("In Progress");
        }

        setLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;

        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");
          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to load case details"
        );

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Update case status
  const updateStatus = () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    setUpdating(true);

    axiosInstance
      .patch(`/admin/cases/status/${id}`, {
        status: newStatus,
      })
      .then((response) => {
        toast.success(
          response.data.message ||
            "Case status updated successfully"
        );

        setCaseData((prev) => ({
          ...prev,
          currentStatus: newStatus,
        }));

        if (newStatus === "Acknowledged") {
          setNewStatus("In Progress");
        } else {
          setNewStatus("");
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to update case status"
        );
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // Resolve case
  const resolveCase = () => {
    if (!finalDetails.trim()) {
      toast.error("Final details are required");
      return;
    }

    if (!actionTaken.trim()) {
      toast.error("Action taken is required");
      return;
    }

    if (!resolutionDetails.trim()) {
      toast.error("Resolution details are required");
      return;
    }

    setUpdating(true);

    axiosInstance
      .patch(`/admin/cases/resolve/${id}`, {
        finalDetails: finalDetails.trim(),
        actionTaken: actionTaken.trim(),
        resolutionDetails: resolutionDetails.trim(),
      })
      .then((response) => {
        toast.success(
          response.data.message ||
            "Case resolved successfully"
        );

        setCaseData((prev) => ({
          ...prev,
          currentStatus: "Resolved",
          finalDetails: finalDetails.trim(),
          actionTaken: actionTaken.trim(),
          resolutionDetails: resolutionDetails.trim(),
        }));

        setFinalDetails("");
        setActionTaken("");
        setResolutionDetails("");
        setNewStatus("");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to resolve case"
        );
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // Download final case report
  const downloadFinalReport = () => {
    setDownloading(true);

    axiosInstance
      .get(`/admin/cases/pdf/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const pdfBlob = new Blob([response.data], {
          type: "application/pdf",
        });

        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");

        link.href = pdfUrl;
        link.download = `${caseData.caseId}-final-report.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(pdfUrl);

        toast.success("Final report downloaded successfully");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to download final report"
        );
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  // Record a fake-report decision and fine
  const markReportAsFake = async (event) => {
    event.preventDefault();

    if (!fakeReportReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    if (fakeReportReason.trim().length < 10) {
      toast.error("Please provide a more detailed reason.");
      return;
    }

    if (
      fineAmount === "" ||
      !Number.isFinite(Number(fineAmount)) ||
      Number(fineAmount) <= 0
    ) {
      toast.error("Please enter a valid fine amount.");
      return;
    }

    try {
      setFineUpdating(true);

      // Corrected URL to match caseRouter.js
      const response = await axiosInstance.patch(
        `/cases/admin/fake-report/${id}`,
        {
          reason: fakeReportReason.trim(),
          fineAmount: Number(fineAmount),
        }
      );

      toast.success(
        response.data.message || "Fine recorded successfully."
      );

      await refreshCaseDetails();

      setFakeReportReason("");
      setFineAmount("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to record the fine."
      );
    } finally {
      setFineUpdating(false);
    }
  };

  // Review the user's appeal
  const reviewAppeal = async (event) => {
    event.preventDefault();

    if (!appealDecision) {
      toast.error("Please select an appeal decision.");
      return;
    }

    try {
      setAppealUpdating(true);

      // Corrected URL to match caseRouter.js
      const response = await axiosInstance.patch(
        `/cases/admin/review-appeal/${id}`,
        {
          decision: appealDecision,
        }
      );

      toast.success(
        response.data.message ||
          "Appeal reviewed successfully."
      );

      await refreshCaseDetails();
      setAppealDecision("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to review the appeal."
      );
    } finally {
      setAppealUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]";
    }

    if (
      status === "Acknowledged" ||
      status === "Resolved"
    ) {
      return "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:bg-[#7FAF8A]/15 dark:text-[#9BC7A4]";
    }

    if (status === "In Progress") {
      return "bg-muted text-muted-foreground";
    }

    return "bg-muted text-muted-foreground";
  };

  const getFineBadgeClass = (status) => {
    if (
      status === "Approved" ||
      status === "Cancelled" ||
      status === "Appealed"
    ) {
      return "border-[#7FAF8A]/40 bg-[#7FAF8A]/15 text-[#5F8D6A] dark:text-[#9BC7A4]";
    }

    if (
      status === "Pending" ||
      status === "Rejected" ||
      status === "Upheld"
    ) {
      return "border-[#B94A48]/30 bg-[#B94A48]/10 text-[#B94A48] dark:border-[#D76562]/30 dark:bg-[#D76562]/10 dark:text-[#D76562]";
    }

    return "border-border bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[#B94A48] dark:border-t-[#D76562]" />

          <p className="text-sm text-muted-foreground">
            Loading case details...
          </p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Case not found.
          </p>

          <Link
            to="/admin/cases"
            className="text-sm font-medium text-[#B94A48] hover:underline dark:text-[#D76562]"
          >
            Back to Cases
          </Link>
        </div>
      </div>
    );
  }

  const user = caseData.userId || {};

  const canUpdateStatus =
    caseData.currentStatus === "New" ||
    caseData.currentStatus === "Acknowledged";

  const canResolve =
    caseData.currentStatus === "In Progress";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/admin/cases"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[#B94A48]"
          >
            <ArrowLeft size={17} />
            Back to Cases
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
                <FileText size={23} />
              </div>

              <div>
                <h1 className="bg-gradient-to-r from-[#B94A48] via-[#7FAF8A] to-[#555C64] bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                  Case Details
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {caseData.caseId}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                caseData.currentStatus
              )}`}
            >
              {caseData.currentStatus}
            </span>
          </div>
        </div>

        {/* 1. REPORTING USER */}
        <section className="rounded-2xl border border-border bg-card transition-colors duration-300">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              Reporting User
            </h2>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
                <User size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">
                  {user.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="break-all text-sm text-foreground">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>

            {caseData.currentStatus === "Resolved" && (
              <div className="border-t border-border pt-5">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Final Case Report
                </p>

                <button
                  type="button"
                  onClick={downloadFinalReport}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#7FAF8A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6F9D79] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={18} />
                  {downloading
                    ? "Downloading..."
                    : "Download Final Report"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. CASE INFORMATION */}
        <section className="mt-6 rounded-2xl border border-border bg-card transition-colors duration-300">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              Case Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Crime Category
              </p>
              <p className="font-medium text-foreground">
                {caseData.crimeCategory}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Report Date & Time
              </p>
              <p className="text-foreground">
                {(caseData.createdAt || caseData.reportDateTime)
                  ? new Date(
                      caseData.createdAt || caseData.reportDateTime
                    ).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Incident Description
              </p>
              <p className="leading-6 text-foreground">
                {caseData.description || caseData.incidentDescription || "N/A"}
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="mb-1 flex items-center gap-2">
                <MapPin
                  size={17}
                  className="text-[#B94A48] dark:text-[#D76562]"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  Incident Location
                </p>
              </div>

              <p className="text-foreground">
                {caseData.location || caseData.incidentLocation || "N/A"}
              </p>
            </div>

            {caseData.latitude != null &&
              caseData.longitude != null && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Map Location
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${caseData.latitude},${caseData.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B94A48] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#A33F3D] dark:bg-[#D76562] dark:hover:bg-[#C55451]"
                  >
                    <MapPin size={16} />
                    Open in Google Maps
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}
          </div>
        </section>

        {/* 3. UPDATE CASE STATUS */}
        {canUpdateStatus && (
          <section className="mt-6 rounded-2xl border border-border bg-card transition-colors duration-300">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold text-foreground">
                Update Case Status
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Move the case to the next stage.
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(event.target.value)
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                >
                  <option value="">Select next status</option>

                  {caseData.currentStatus === "New" && (
                    <option value="Acknowledged">
                      Acknowledged
                    </option>
                  )}

                  {caseData.currentStatus === "Acknowledged" && (
                    <option value="In Progress">In Progress</option>
                  )}
                </select>

                <button
                  type="button"
                  onClick={updateStatus}
                  disabled={updating}
                  className="inline-flex items-center justify-center rounded-lg bg-[#B94A48] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#A33F3D] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#D76562] dark:hover:bg-[#C55451]"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. RESOLVE CASE */}
        {canResolve && (
          <section className="mt-6 rounded-2xl border border-border bg-card transition-colors duration-300">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold text-foreground">
                Resolve Case
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter the final information before resolving the case.
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="finalDetails"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Final Details
                </label>
                <textarea
                  id="finalDetails"
                  value={finalDetails}
                  onChange={(event) =>
                    setFinalDetails(event.target.value)
                  }
                  rows={4}
                  placeholder="Enter final details"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                />
              </div>

              <div>
                <label
                  htmlFor="actionTaken"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Action Taken
                </label>
                <textarea
                  id="actionTaken"
                  value={actionTaken}
                  onChange={(event) =>
                    setActionTaken(event.target.value)
                  }
                  rows={4}
                  placeholder="Enter action taken"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                />
              </div>

              <div>
                <label
                  htmlFor="resolutionDetails"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Resolution Details
                </label>
                <textarea
                  id="resolutionDetails"
                  value={resolutionDetails}
                  onChange={(event) =>
                    setResolutionDetails(event.target.value)
                  }
                  rows={4}
                  placeholder="Enter resolution details"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                />
              </div>

              <button
                type="button"
                onClick={resolveCase}
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#7FAF8A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6F9D79] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle size={18} />
                {updating ? "Resolving..." : "Resolve Case"}
              </button>
            </div>
          </section>
        )}

        {/* 5. RESOLUTION INFORMATION */}
        {caseData.currentStatus === "Resolved" && (
          <section className="mt-6 rounded-2xl border border-border bg-card transition-colors duration-300">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold text-foreground">
                Resolution Information
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Final Details
                </p>
                <p className="leading-6 text-foreground">
                  {caseData.finalDetails || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Action Taken
                </p>
                <p className="leading-6 text-foreground">
                  {caseData.actionTaken || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Resolution Details
                </p>
                <p className="leading-6 text-foreground">
                  {caseData.resolutionDetails || "N/A"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. FAKE REPORT FINE & APPEAL - ALWAYS AT THE END */}
        <section className="mt-6 rounded-2xl border border-border bg-card transition-colors duration-300">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#B94A48]/10 p-3 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Fake Report Fine & Appeal
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Record a decision and review submitted appeals.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {!caseData.isFakeReport ? (
              <form
                onSubmit={markReportAsFake}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    Record a fake-report decision
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Review the available information before making
                    a decision. An unverified report alone does not
                    establish that a report was deliberately false.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="fakeReportReason"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Reason for the decision
                  </label>
                  <textarea
                    id="fakeReportReason"
                    value={fakeReportReason}
                    onChange={(event) =>
                      setFakeReportReason(event.target.value)
                    }
                    rows={4}
                    minLength={10}
                    maxLength={1000}
                    required
                    placeholder="Explain the grounds for determining that the report was deliberately false..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fineAmount"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Fine amount (₹)
                  </label>
                  <input
                    id="fineAmount"
                    type="number"
                    min="1"
                    step="1"
                    value={fineAmount}
                    onChange={(event) =>
                      setFineAmount(event.target.value)
                    }
                    required
                    placeholder="Enter fine amount"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={fineUpdating}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#B94A48] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#A33F3D] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#D76562] dark:hover:bg-[#C55451]"
                >
                  <AlertTriangle size={17} />
                  {fineUpdating ? "Saving..." : "Record Fine"}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-[#B94A48]/25 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={21}
                    className="mt-0.5 shrink-0 text-[#B94A48] dark:text-[#D76562]"
                  />

                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      Fine recorded
                    </h3>

                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Fine amount
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ₹
                      {Number(
                        caseData.fineAmount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Fine status
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getFineBadgeClass(
                        caseData.fineStatus
                      )}`}
                    >
                      {caseData.fineStatus || "None"}
                    </span>

                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Administrator's reason
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {caseData.fakeReportReason ||
                        "No reason provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* USER APPEAL DETAILS */}
            {caseData.isFakeReport && (
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#7FAF8A]/15 p-3 text-[#5F8D6A] dark:text-[#9BC7A4]">
                    <Scale size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      User Appeal
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Review the user's explanation and decide
                      whether to uphold or cancel the fine.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Appeal status
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getFineBadgeClass(
                      caseData.appealStatus
                    )}`}
                  >
                    {caseData.appealStatus || "Not Appealed"}
                  </span>

                  <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    User's appeal reason
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {caseData.appealReason ||
                      "No appeal submitted yet."}
                  </p>
                </div>

                {caseData.appealStatus === "Pending" && (
                  <form
                    onSubmit={reviewAppeal}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="appealDecision"
                        className="mb-2 block text-sm font-medium text-foreground"
                      >
                        Appeal decision
                      </label>

                      <select
                        id="appealDecision"
                        value={appealDecision}
                        onChange={(event) =>
                          setAppealDecision(event.target.value)
                        }
                        required
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]"
                      >
                        <option value="">Select decision</option>
                        <option value="Approved">
                          Approve appeal — cancel fine
                        </option>
                        <option value="Rejected">
                          Reject appeal — uphold fine
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={appealUpdating}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#7FAF8A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6F9D79] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {appealUpdating ? (
                        <Clock size={17} />
                      ) : (
                        <Send size={17} />
                      )}
                      {appealUpdating
                        ? "Submitting..."
                        : "Submit Appeal Decision"}
                    </button>
                  </form>
                )}

                {caseData.appealStatus === "Approved" && (
                  <div className="mt-5 rounded-xl border border-[#7FAF8A]/30 bg-[#7FAF8A]/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CheckCircle size={18} />
                      Appeal approved. The fine should be cancelled.
                    </p>
                  </div>
                )}

                {caseData.appealStatus === "Rejected" && (
                  <div className="mt-5 rounded-xl border border-[#B94A48]/30 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/10">
                    <p className="text-sm font-medium text-foreground">
                      Appeal rejected. The fine remains upheld.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCaseDetails;