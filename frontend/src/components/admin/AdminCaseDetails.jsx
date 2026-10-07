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

  useEffect(() => {
    axiosInstance
      .get(`/admin/cases/${id}`)
      .then((response) => {
        const data = response.data.case || response.data;

        setCaseData(data);

        if (data.currentStatus === "New") {
          setNewStatus("Acknowledged");
        }

        if (data.currentStatus === "Acknowledged") {
          setNewStatus("In Progress");
        }

        setLoading(false);
      })
      .catch((error) => {
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
  }, [id, navigate]);

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

        toast.success(
          "Final report downloaded successfully"
        );
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

  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]";
    }

    if (status === "Acknowledged") {
      return "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:bg-[#7FAF8A]/15 dark:text-[#9BC7A4]";
    }

    if (status === "In Progress") {
      return "bg-muted text-muted-foreground";
    }

    if (status === "Resolved") {
      return "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:bg-[#7FAF8A]/15 dark:text-[#9BC7A4]";
    }

    return "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
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
            className="
              text-sm
              font-medium
              text-[#B94A48]
              hover:underline
              dark:text-[#D76562]
            "
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
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-muted-foreground
              transition-colors
              hover:text-[#B94A48]
            "
          >
            <ArrowLeft size={17} />
            Back to Cases
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
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
                <FileText size={23} />
              </div>

              <div>
                <h1
                  className="
                    bg-gradient-to-r
                    from-[#B94A48]
                    via-[#7FAF8A]
                    to-[#555C64]
                    bg-clip-text
                    text-2xl
                    font-bold
                    tracking-tight
                    text-transparent
                  "
                >
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

        {/* CASE INFORMATION - TOP */}
        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            transition-colors
            duration-300
          "
        >
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
                {caseData.reportDateTime
                  ? new Date(
                      caseData.reportDateTime
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
                {caseData.incidentDescription}
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
                {caseData.incidentLocation}
              </p>
            </div>

            {caseData.latitude &&
              caseData.longitude && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Location
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${caseData.latitude},${caseData.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#B94A48]
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition-colors
                      hover:bg-[#A33F3D]
                      dark:bg-[#D76562]
                      dark:hover:bg-[#C55451]
                    "
                  >
                    <MapPin size={16} />
                    Open in Google Maps
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}
          </div>
        </div>

        {/* UPDATE CASE STATUS */}
        {canUpdateStatus && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-border
              bg-card
              transition-colors
              duration-300
            "
          >
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
                  onChange={(e) =>
                    setNewStatus(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    px-3
                    py-2.5
                    text-sm
                    text-foreground
                    outline-none
                    transition-colors
                    focus:border-[#B94A48]
                    focus:ring-1
                    focus:ring-[#B94A48]
                    dark:focus:border-[#D76562]
                    dark:focus:ring-[#D76562]
                  "
                >
                  <option value="">
                    Select next status
                  </option>

                  {caseData.currentStatus === "New" && (
                    <option value="Acknowledged">
                      Acknowledged
                    </option>
                  )}

                  {caseData.currentStatus ===
                    "Acknowledged" && (
                    <option value="In Progress">
                      In Progress
                    </option>
                  )}
                </select>

                <button
                  type="button"
                  onClick={updateStatus}
                  disabled={updating}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#B94A48]
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-[#A33F3D]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:bg-[#D76562]
                    dark:hover:bg-[#C55451]
                  "
                >
                  {updating
                    ? "Updating..."
                    : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPORTING USER + DOWNLOAD */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-border
            bg-card
            transition-colors
            duration-300
          "
        >
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              Reporting User
            </h2>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <User size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Name
                </p>

                <p className="font-medium text-foreground">
                  {user.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="break-all text-sm text-foreground">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="text-sm text-foreground">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* DOWNLOAD FINAL REPORT */}
            {caseData.currentStatus === "Resolved" && (
              <div className="border-t border-border pt-5">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Final Case Report
                </p>

                <button
                  type="button"
                  onClick={downloadFinalReport}
                  disabled={downloading}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#B94A48]
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-[#A33F3D]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:bg-[#D76562]
                    dark:hover:bg-[#C55451]
                  "
                >
                  <Download size={18} />

                  {downloading
                    ? "Downloading..."
                    : "Download Final Report"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RESOLVE CASE */}
        {canResolve && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-border
              bg-card
              transition-colors
              duration-300
            "
          >
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
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Final Details
                </label>

                <textarea
                  value={finalDetails}
                  onChange={(e) =>
                    setFinalDetails(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter final details"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    px-3
                    py-2.5
                    text-sm
                    text-foreground
                    outline-none
                    transition-colors
                    placeholder:text-muted-foreground
                    focus:border-[#B94A48]
                    focus:ring-1
                    focus:ring-[#B94A48]
                    dark:focus:border-[#D76562]
                    dark:focus:ring-[#D76562]
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Action Taken
                </label>

                <textarea
                  value={actionTaken}
                  onChange={(e) =>
                    setActionTaken(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter action taken"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    px-3
                    py-2.5
                    text-sm
                    text-foreground
                    outline-none
                    transition-colors
                    placeholder:text-muted-foreground
                    focus:border-[#B94A48]
                    focus:ring-1
                    focus:ring-[#B94A48]
                    dark:focus:border-[#D76562]
                    dark:focus:ring-[#D76562]
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Resolution Details
                </label>

                <textarea
                  value={resolutionDetails}
                  onChange={(e) =>
                    setResolutionDetails(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter resolution details"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    px-3
                    py-2.5
                    text-sm
                    text-foreground
                    outline-none
                    transition-colors
                    placeholder:text-muted-foreground
                    focus:border-[#B94A48]
                    focus:ring-1
                    focus:ring-[#B94A48]
                    dark:focus:border-[#D76562]
                    dark:focus:ring-[#D76562]
                  "
                />
              </div>

              <button
                type="button"
                onClick={resolveCase}
                disabled={updating}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#7FAF8A]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-[#6F9D79]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <CheckCircle size={18} />

                {updating
                  ? "Resolving..."
                  : "Resolve Case"}
              </button>
            </div>
          </div>
        )}

        {/* RESOLUTION INFORMATION */}
        {caseData.currentStatus === "Resolved" && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-border
              bg-card
              transition-colors
              duration-300
            "
          >
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
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCaseDetails;