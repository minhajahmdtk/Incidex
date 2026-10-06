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

  // UPDATE CASE STATUS
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

  // RESOLVE CASE
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

  // DOWNLOAD FINAL REPORT
  const downloadFinalReport = () => {
    setDownloading(true);

    axiosInstance
      .get(`/admin/cases/pdf/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const pdfBlob = new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );

        const pdfUrl =
          window.URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");

        link.href = pdfUrl;

        link.download =
          `${caseData.caseId}-final-report.pdf`;

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
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Acknowledged") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "In Progress") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Loading case details...
        </p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <p className="text-slate-600 mb-4">
            Case not found.
          </p>

          <Link
            to="/admin/cases"
            className="text-blue-600 hover:underline"
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">

          <Link
            to="/admin/cases"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={17} />
            Back to Cases
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Case Details
                </h1>

                <p className="text-sm text-slate-500">
                  {caseData.caseId}
                </p>

              </div>

            </div>

            {/* Current Status */}
            <span
              className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                caseData.currentStatus
              )}`}
            >
              {caseData.currentStatus}
            </span>

          </div>
        </div>

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Case Information */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Case Information
              </h2>

            </div>

            <div className="p-6 space-y-6">

              {/* Crime Category */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Crime Category
                </p>

                <p className="text-slate-900 font-medium">
                  {caseData.crimeCategory}
                </p>

              </div>

              {/* Incident Description */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Incident Description
                </p>

                <p className="text-slate-700 leading-6">
                  {caseData.incidentDescription}
                </p>

              </div>

              {/* Incident Location */}
              <div>

                <div className="flex items-center gap-2 mb-1">

                  <MapPin
                    size={17}
                    className="text-slate-500"
                  />

                  <p className="text-sm font-medium text-slate-500">
                    Incident Location
                  </p>

                </div>

                <p className="text-slate-700">
                  {caseData.incidentLocation}
                </p>

              </div>

              {/* Report Date */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Report Date & Time
                </p>

                <p className="text-slate-700">
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

              {/* Google Maps */}
              {caseData.latitude &&
                caseData.longitude && (
                  <div>

                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Location
                    </p>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${caseData.latitude},${caseData.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >

                      <MapPin size={16} />

                      Open in Google Maps

                      <ExternalLink size={15} />

                    </a>

                  </div>
                )}

            </div>
          </div>

          {/* Reporting User */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-fit">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Reporting User
              </h2>

            </div>

            <div className="p-6 space-y-5">

              {/* Name */}
              <div className="flex items-center gap-3">

                <div className="p-2 bg-slate-100 rounded-lg">
                  <User
                    size={18}
                    className="text-slate-600"
                  />
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Name
                  </p>

                  <p className="font-medium text-slate-900">
                    {user.name || "N/A"}
                  </p>

                </div>

              </div>

              {/* Email */}
              <div className="flex items-center gap-3">

                <div className="p-2 bg-slate-100 rounded-lg">
                  <Mail
                    size={18}
                    className="text-slate-600"
                  />
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="text-sm text-slate-700 break-all">
                    {user.email || "N/A"}
                  </p>

                </div>

              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">

                <div className="p-2 bg-slate-100 rounded-lg">
                  <Phone
                    size={18}
                    className="text-slate-600"
                  />
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="text-sm text-slate-700">
                    {user.phone || "N/A"}
                  </p>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Status Update */}
        {canUpdateStatus && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Update Case Status
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Move the case to the next stage.
              </p>

            </div>

            <div className="p-6">

              <div className="flex flex-col sm:flex-row gap-3">

                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value)
                  }
                  className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "Update Status"}
                </button>

              </div>

            </div>
          </div>
        )}

        {/* Resolve Case */}
        {canResolve && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Resolve Case
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter the final information before resolving
                the case.
              </p>

            </div>

            <div className="p-6 space-y-5">

              {/* Final Details */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Final Details
                </label>

                <textarea
                  value={finalDetails}
                  onChange={(e) =>
                    setFinalDetails(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter final details"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />

              </div>

              {/* Action Taken */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Taken
                </label>

                <textarea
                  value={actionTaken}
                  onChange={(e) =>
                    setActionTaken(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter action taken"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />

              </div>

              {/* Resolution Details */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resolution Details
                </label>

                <textarea
                  value={resolutionDetails}
                  onChange={(e) =>
                    setResolutionDetails(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter resolution details"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />

              </div>

              {/* Resolve Button */}
              <button
                type="button"
                onClick={resolveCase}
                disabled={updating}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >

                <CheckCircle size={18} />

                {updating
                  ? "Resolving..."
                  : "Resolve Case"}

              </button>

            </div>
          </div>
        )}

        {/* Resolution Information */}
        {caseData.currentStatus === "Resolved" && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Resolution Information
              </h2>

            </div>

            <div className="p-6 space-y-5">

              {/* Final Details */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Final Details
                </p>

                <p className="text-slate-700">
                  {caseData.finalDetails || "N/A"}
                </p>

              </div>

              {/* Action Taken */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Action Taken
                </p>

                <p className="text-slate-700">
                  {caseData.actionTaken || "N/A"}
                </p>

              </div>

              {/* Resolution Details */}
              <div>

                <p className="text-sm font-medium text-slate-500 mb-1">
                  Resolution Details
                </p>

                <p className="text-slate-700">
                  {caseData.resolutionDetails || "N/A"}
                </p>

              </div>

            </div>
          </div>
        )}

        {/* Final Case Report */}
        {caseData.currentStatus === "Resolved" && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="px-6 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Final Case Report
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Download the final report for this resolved
                case.
              </p>

            </div>

            <div className="p-6">

              <button
                type="button"
                onClick={downloadFinalReport}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >

                <Download size={18} />

                {downloading
                  ? "Downloading..."
                  : "Download Final Report"}

              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCaseDetails;