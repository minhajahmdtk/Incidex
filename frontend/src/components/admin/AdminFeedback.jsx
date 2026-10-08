import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MessageSquare,
  User,
  Mail,
  Phone,
  FileText,
  Eye,
  Trash2,
  X,
} from "lucide-react";

import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminFeedback = () => {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ==================================================
  // GET FEEDBACK
  // ==================================================

  useEffect(() => {
    axiosInstance
      .get("/admin/feedback")
      .then((response) => {
        setFeedback(
          response.data.feedback ||
            response.data ||
            []
        );

        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to load feedback"
        );

        setLoading(false);
      });
  }, [navigate]);

  // ==================================================
  // OPEN DELETE CONFIRMATION
  // ==================================================

  const openDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  // ==================================================
  // CLOSE DELETE CONFIRMATION
  // ==================================================

  const closeDeleteConfirmation = () => {
    if (deletingId) {
      return;
    }

    setShowDeleteConfirm(false);
  };

  // ==================================================
  // DELETE FEEDBACK
  // ==================================================

  const deleteFeedback = () => {
    if (!selectedFeedback?._id) {
      return;
    }

    const id = selectedFeedback._id;

    setDeletingId(id);

    axiosInstance
      .delete(`/admin/feedback/${id}`)
      .then((response) => {
        setFeedback((prev) =>
          prev.filter((item) => item._id !== id)
        );

        setSelectedFeedback(null);
        setShowDeleteConfirm(false);

        toast.success(
          response.data.message ||
            "Feedback deleted successfully"
        );
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to delete feedback"
        );
      })
      .finally(() => {
        setDeletingId("");
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              to="/admin/dashboard"
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                duration-200
                hover:text-[#B94A48]
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

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
                <MessageSquare size={23} />
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
                  Feedback
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  View feedback submitted by users
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              TOTAL FEEDBACK
          ================================================== */}

          <div
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-5
              py-4
              transition-colors
              duration-300
            "
          >
            <p className="text-xs font-medium text-muted-foreground">
              Total Feedback
            </p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {feedback.length}
            </p>
          </div>

        </div>

        {/* ==================================================
            FEEDBACK CARD
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-colors
            duration-300
          "
        >

          {/* Card Header */}

          <div className="border-b border-border px-6 py-5">

            <h2 className="text-lg font-semibold text-foreground">
              User Feedback
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Feedback submitted for resolved cases
            </p>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center p-10">

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
                  "
                />

                <p className="text-sm text-muted-foreground">
                  Loading feedback...
                </p>

              </div>

            </div>

          ) : feedback.length === 0 ? (

            /* ==================================================
                EMPTY STATE
            ================================================== */

            <div className="flex min-h-[300px] items-center justify-center p-10">

              <div className="text-center">

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-muted
                    text-muted-foreground
                  "
                >
                  <MessageSquare size={25} />
                </div>

                <p className="text-sm font-medium text-foreground">
                  No feedback has been submitted yet.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Feedback from resolved cases will appear here.
                </p>

              </div>

            </div>

          ) : (

            /* ==================================================
                FEEDBACK TABLE
            ================================================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[720px]">

                <thead>

                  <tr className="border-b border-border bg-muted/40">

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      User Name
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Phone
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Case ID
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {feedback.map((item) => (

                    <tr
                      key={item._id}
                      className="
                        border-b
                        border-border
                        transition-colors
                        duration-200
                        hover:bg-muted/40
                      "
                    >

                      {/* USER NAME */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#B94A48]/10
                              text-[#B94A48]
                              dark:bg-[#D76562]/10
                              dark:text-[#D76562]
                            "
                          >
                            <User size={17} />
                          </div>

                          <p className="font-medium text-foreground">
                            {item.userId?.name || "N/A"}
                          </p>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">

                          <Phone size={16} />

                          {item.userId?.phone || "N/A"}

                        </div>

                      </td>

                      {/* CASE ID */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-muted-foreground"
                          />

                          <span className="font-medium text-foreground">
                            {item.caseId?.caseId || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* VIEW */}

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFeedback(item)
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#B94A48]
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-[#A33F3D]
                            hover:shadow-md
                          "
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

      {/* ==================================================
          VIEW FEEDBACK MODAL
      ================================================== */}

      {selectedFeedback && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              border
              border-border
              bg-card
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border
                px-6
                py-5
              "
            >

              <div>

                <h2 className="text-xl font-semibold text-foreground">
                  Feedback Details
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedFeedback.caseId?.caseId || "N/A"}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="
                  rounded-lg
                  p-2
                  text-muted-foreground
                  transition-colors
                  duration-200
                  hover:bg-muted
                  hover:text-foreground
                "
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-6 p-6">

              {/* USER INFORMATION */}

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-muted/40
                  p-5
                "
              >

                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  User Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Name
                    </p>

                    <div className="flex items-center gap-2">

                      <User
                        size={16}
                        className="text-muted-foreground"
                      />

                      <p className="text-sm font-medium text-foreground">
                        {selectedFeedback.userId?.name ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                  <div>

                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Phone
                    </p>

                    <div className="flex items-center gap-2">

                      <Phone
                        size={16}
                        className="text-muted-foreground"
                      />

                      <p className="text-sm text-foreground">
                        {selectedFeedback.userId?.phone ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                  <div className="sm:col-span-2">

                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Email
                    </p>

                    <div className="flex items-center gap-2">

                      <Mail
                        size={16}
                        className="text-muted-foreground"
                      />

                      <p className="break-all text-sm text-foreground">
                        {selectedFeedback.userId?.email ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* CASE INFORMATION */}

              <div>

                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Case Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Case ID
                    </p>

                    <p className="text-sm font-medium text-foreground">
                      {selectedFeedback.caseId?.caseId ||
                        "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Crime Category
                    </p>

                    <p className="text-sm text-foreground">
                      {selectedFeedback.caseId
                        ?.crimeCategory || "N/A"}
                    </p>

                  </div>

                </div>

              </div>

              {/* FEEDBACK */}

              <div>

                <p className="mb-2 text-sm font-semibold text-foreground">
                  Feedback
                </p>

                <div
                  className="
                    rounded-xl
                    border
                    border-border
                    bg-muted/40
                    p-4
                  "
                >

                  <p className="text-sm leading-6 text-foreground">
                    {selectedFeedback.feedbackDetails ||
                      "No feedback details"}
                  </p>

                </div>

              </div>

              {/* SUBMITTED DATE */}

              <div>

                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Submitted Date & Time
                </p>

                <p className="text-sm text-foreground">
                  {selectedFeedback.submittedDateTime
                    ? new Date(
                        selectedFeedback.submittedDateTime
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

            </div>

            {/* MODAL FOOTER */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-border
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="
                  rounded-lg
                  border
                  border-border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-foreground
                  transition-colors
                  duration-200
                  hover:bg-muted
                "
              >
                Close
              </button>

              <button
                type="button"
                onClick={openDeleteConfirmation}
                disabled={
                  deletingId === selectedFeedback._id
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#B94A48]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#A33F3D]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <Trash2 size={16} />

                Delete Feedback

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {showDeleteConfirm && selectedFeedback && (

        <div
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-2xl
            "
          >

            <div className="flex items-start gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <Trash2 size={20} />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-foreground">
                  Delete Feedback?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Are you sure you want to delete this feedback?
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={Boolean(deletingId)}
                className="
                  rounded-lg
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-foreground
                  transition-colors
                  duration-200
                  hover:bg-muted
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteFeedback}
                disabled={Boolean(deletingId)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#B94A48]
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#A33F3D]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <Trash2 size={16} />

                {deletingId
                  ? "Deleting..."
                  : "Delete Feedback"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminFeedback;