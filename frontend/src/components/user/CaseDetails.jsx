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
        return `
          border-[#B94A48]/30
          bg-[#B94A48]/10
          text-[#B94A48]
          dark:border-[#D76562]/30
          dark:bg-[#D76562]/10
          dark:text-[#D76562]
        `;

      case "Acknowledged":
        return `
          border-[#7FAF8A]/30
          bg-[#7FAF8A]/15
          text-[#5F8D6A]
          dark:border-[#91BD9C]/30
          dark:bg-[#91BD9C]/10
          dark:text-[#9BC7A4]
        `;

      case "In Progress":
        return `
          border-border
          bg-muted
          text-muted-foreground
        `;

      case "Resolved":
        return `
          border-[#7FAF8A]/30
          bg-[#7FAF8A]/15
          text-[#5F8D6A]
          dark:border-[#91BD9C]/30
          dark:bg-[#91BD9C]/10
          dark:text-[#9BC7A4]
        `;

      default:
        return `
          border-border
          bg-muted
          text-muted-foreground
        `;
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
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />

        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
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
        </main>
      </div>
    );
  }

  // Error
  if (errorMessage || !caseData) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />

        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div
              className="
                rounded-2xl
                border
                border-[#B94A48]/30
                bg-[#B94A48]/5
                p-6
                dark:border-[#D76562]/30
                dark:bg-[#D76562]/10
              "
            >
              <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
                {errorMessage || "Case details not found"}
              </p>

              <button
                type="button"
                onClick={() => navigate("/user/cases")}
                className="
                  mt-4
                  rounded-lg
                  bg-primary
                  px-4
                  py-2
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
                "
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/user/cases")}
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                duration-200
                hover:text-[#B94A48]
                dark:hover:text-[#D76562]
              "
            >
              <ArrowLeft size={17} />
              Back to My Cases
            </button>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
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
                        sm:text-3xl
                      "
                    >
                      Case Details
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                      View the details and status history of your reported case.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                {/* DOWNLOAD FINAL REPORT */}

                {caseData.currentStatus === "Resolved" && (
                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-primary
                      px-4
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
                    "
                  >
                    <Download size={17} />
                    Download Final Report
                  </button>
                )}

                {/* GIVE FEEDBACK */}

                {caseData.currentStatus === "Resolved" && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/user/feedback/${caseData.caseId}`
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-border
                      bg-background
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-foreground
                      transition-all
                      duration-200
                      hover:border-[#B94A48]
                      hover:bg-[#B94A48]/5
                      hover:text-[#B94A48]
                      dark:hover:border-[#D76562]
                      dark:hover:bg-[#D76562]/10
                      dark:hover:text-[#D76562]
                    "
                  >
                    <MessageSquare size={17} />
                    Give Feedback
                  </button>
                )}

                {/* STATUS */}

                <div
                  className={`
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    ${getStatusStyle(
                      caseData.currentStatus
                    )}
                  `}
                >
                  {getStatusIcon(caseData.currentStatus)}
                  {caseData.currentStatus}
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              CASE INFORMATION
          ================================================== */}

          <div
            className="
              mb-6
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-sm
              transition-colors
              duration-300
            "
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Case Information
                </h2>

                <p className="text-sm text-muted-foreground">
                  Incident report details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* CASE ID */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Case ID
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {caseData.caseId}
                </p>
              </div>

              {/* CRIME CATEGORY */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Crime Category
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {caseData.crimeCategory}
                </p>
              </div>

              {/* REPORT DATE */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reported Date & Time
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                  <Calendar
                    size={16}
                    className="text-muted-foreground"
                  />

                  {formatDate(caseData.reportDateTime)}
                </div>
              </div>

              {/* LOCATION */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Incident Location
                </p>

                <div className="mt-1 flex items-start gap-2 text-sm text-foreground">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />

                  <span>
                    {caseData.incidentLocation}
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Incident Description
                </p>

                <p
                  className="
                    mt-2
                    rounded-xl
                    border
                    border-border
                    bg-muted/40
                    p-4
                    text-sm
                    leading-6
                    text-foreground
                  "
                >
                  {caseData.incidentDescription}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              MAP
          ================================================== */}

          {caseData.latitude !== null &&
            caseData.latitude !== undefined &&
            caseData.longitude !== null &&
            caseData.longitude !== undefined && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-6
                  shadow-sm
                  transition-colors
                  duration-300
                "
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Incident Location
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Location selected when the incident was reported.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
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

          {/* ==================================================
              STATUS HISTORY
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-sm
              transition-colors
              duration-300
            "
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Status History
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Track how your case status has changed.
              </p>
            </div>

            {history.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-muted/40
                  p-6
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-muted
                    text-muted-foreground
                  "
                >
                  <Clock size={20} />
                </div>

                <p className="text-sm text-muted-foreground">
                  No status history available.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {history.map((item, index) => (
                  <div
                    key={
                      item._id ||
                      `${item.status}-${index}`
                    }
                    className="flex gap-4"
                  >
                    {/* TIMELINE ICON */}

                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          ${getStatusStyle(item.status)}
                        `}
                      >
                        {getStatusIcon(item.status)}
                      </div>

                      {index !== history.length - 1 && (
                        <div className="mt-2 h-full min-h-8 w-px bg-border" />
                      )}
                    </div>

                    {/* TIMELINE CONTENT */}

                    <div className="pb-2">
                      <p className="text-sm font-semibold text-foreground">
                        {item.status}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
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