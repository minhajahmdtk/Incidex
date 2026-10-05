import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Download,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const CaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Get case details and status history
  useEffect(() => {
    const getCaseDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const caseResponse = await axiosInstance.get(
          `/cases/${id}`
        );

        const historyResponse = await axiosInstance.get(
          `/cases/history/${id}`
        );

        setCaseData(caseResponse.data.case);
        setHistory(historyResponse.data.history || []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load case details";

        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getCaseDetails();
  }, [id]);

  // Download final PDF report
  const downloadPdf = async () => {
    try {
      const response = await axiosInstance.get(
        `/cases/pdf/${caseData.caseId}`,
        {
          responseType: "blob",
        }
      );

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
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to download final report";

      toast.error(message);
    }
  };

  // Status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Acknowledged":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={17} />;

      case "In Progress":
        return <Clock size={17} />;

      case "Acknowledged":
        return <AlertCircle size={17} />;

      default:
        return <FileText size={17} />;
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="min-h-screen lg:ml-72">
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                Loading case details...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error
  if (errorMessage || !caseData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="min-h-screen lg:ml-72">
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-600">
                {errorMessage || "Case details not found"}
              </p>

              <button
                type="button"
                onClick={() => navigate("/user/cases")}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Back to My Cases
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/user/cases")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back to My Cases
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Case Details
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View the details and status history of your reported case.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                {/* Download Final Report */}
                {caseData.currentStatus === "Resolved" && (
                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    <Download size={17} />
                    Download Final Report
                  </button>
                )}

                {/* Give Feedback Button */}
                {caseData.currentStatus === "Resolved" && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/user/feedback/${caseData.caseId}`
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <MessageSquare size={17} />
                    Give Feedback
                  </button>
                )}

                {/* Status */}
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getStatusStyle(
                    caseData.currentStatus
                  )}`}
                >
                  {getStatusIcon(caseData.currentStatus)}
                  {caseData.currentStatus}
                </div>

              </div>
            </div>
          </div>

          {/* Case Information */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Case Information
                </h2>

                <p className="text-sm text-slate-500">
                  Incident report details
                </p>
              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Case ID */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Case ID
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {caseData.caseId}
                </p>
              </div>

              {/* Crime Category */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Crime Category
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {caseData.crimeCategory}
                </p>
              </div>

              {/* Report Date */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reported Date & Time
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                  <Calendar
                    size={16}
                    className="text-slate-400"
                  />
                  {formatDate(caseData.reportDateTime)}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Incident Location
                </p>

                <div className="mt-1 flex items-start gap-2 text-sm text-slate-700">
                  <MapPin
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-slate-400"
                  />

                  <span>
                    {caseData.incidentLocation}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Incident Description
                </p>

                <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {caseData.incidentDescription}
                </p>
              </div>

            </div>
          </div>

          {/* Map */}
          {caseData.latitude !== null &&
            caseData.latitude !== undefined &&
            caseData.longitude !== null &&
            caseData.longitude !== undefined && (
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Incident Location
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Location selected when the incident was reported.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">

                  <MapContainer
                    center={[
                      caseData.latitude,
                      caseData.longitude,
                    ]}
                    zoom={16}
                    scrollWheelZoom={true}
                    className="h-80 w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                      position={[
                        caseData.latitude,
                        caseData.longitude,
                      ]}
                    />
                  </MapContainer>

                </div>
              </div>
            )}

          {/* Status History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Status History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track how your case status has changed.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No status history available.
                </p>
              </div>
            ) : (
              <div className="space-y-5">

                {history.map((item, index) => (
                  <div
                    key={item._id || `${item.status}-${index}`}
                    className="flex gap-4"
                  >

                    {/* Timeline Icon */}
                    <div className="flex flex-col items-center">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                      </div>

                      {index !== history.length - 1 && (
                        <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                      )}

                    </div>

                    {/* Timeline Content */}
                    <div className="pb-2">

                      <p className="text-sm font-semibold text-slate-900">
                        {item.status}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(item.updatedDateTime)}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
};

export default CaseDetails;