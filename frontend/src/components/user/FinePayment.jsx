import { useState } from "react";
import {
  Wallet,
  ShieldCheck,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../axiosInterceptor";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptUrl =
      "https://checkout.razorpay.com/v1/checkout.js";

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");

    script.src = scriptUrl;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const FinePayment = ({ caseItem, onUpdate }) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  if (!caseItem) return null;

  const {
    caseId,
    isFakeReport,
    fineAmount,
    fineStatus,
    appealStatus,
  } = caseItem;

  const canPayFine =
    isFakeReport === true &&
    appealStatus === "Rejected" &&
    fineStatus === "Upheld";

  const isPaid = fineStatus === "Paid";

  // PAY FINE USING RAZORPAY
  const payFine = async () => {
    if (paymentLoading) return;

    if (!canPayFine) {
      toast.error("This fine is not currently eligible for payment.");
      return;
    }

    if (
      !Number.isFinite(Number(fineAmount)) ||
      Number(fineAmount) <= 0
    ) {
      toast.error("The fine amount is invalid.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentStatus("idle");

      // STEP 1: LOAD RAZORPAY CHECKOUT
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        toast.error(
          "Unable to load Razorpay Checkout. Please check your internet connection."
        );
        setPaymentLoading(false);
        return;
      }

      // STEP 2: CREATE PAYMENT ORDER
      // Backend expects the case's human-readable caseId.
      const orderResponse = await axiosInstance.post(
        `/cases/pay-fine/${encodeURIComponent(caseId)}`
      );

      const {
        keyId,
        orderId,
        amount,
        currency,
      } = orderResponse.data;

      if (!keyId || !orderId || !amount || !currency) {
        throw new Error(
          "The server returned incomplete payment order details."
        );
      }

      // STEP 3: OPEN RAZORPAY CHECKOUT
      const options = {
        key: keyId,
        amount,
        currency,
        name: "INCIDEX",
        description: `Fine payment for case ${caseId}`,
        order_id: orderId,

        prefill: {},

        notes: {
          caseId,
        },

        theme: {
          color: "#B94A48",
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            toast.info("Payment window closed.");
          },
        },

        // STEP 4: VERIFY PAYMENT THROUGH THE BACKEND
        handler: async (paymentResponse) => {
          try {
            const verificationResponse = await axiosInstance.post(
              `/cases/verify-fine-payment/${encodeURIComponent(caseId)}`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }
            );

            if (
              verificationResponse.data.fineStatus !== "Paid"
            ) {
              setPaymentStatus("error");

              toast.error(
                "Payment is not yet confirmed. Please check your fine status before trying again."
              );

              return;
            }

            setPaymentStatus("success");

            toast.success(
              verificationResponse.data.message ||
                "Fine payment verified successfully."
            );

            // Refresh case information from the parent.
            if (onUpdate) {
              await onUpdate();
            }
          } catch (error) {
            setPaymentStatus("error");

            toast.error(
              error.response?.data?.message ||
                "Payment verification failed. Check your payment status before retrying."
            );
          } finally {
            setPaymentLoading(false);
          }
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setPaymentLoading(false);
        setPaymentStatus("error");

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      checkout.open();
    } catch (error) {
      setPaymentLoading(false);
      setPaymentStatus("error");

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to start the payment. Please try again."
      );
    }
  };

  return (
    <div className="rounded-2xl border border-[#B94A48]/20 bg-card p-5 shadow-sm transition-colors duration-300 sm:p-6">
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]">
          <Wallet size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            Fine Payment
          </h3>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Secure online payment for your INCIDEX case.
          </p>
        </div>

        {isPaid && (
          <CheckCircle
            size={22}
            className="shrink-0 text-[#7FAF8A]"
          />
        )}
      </div>

      {/* PAYMENT DETAILS */}
      <div className="mt-5 rounded-xl border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Case ID
        </p>

        <p className="mt-1 font-semibold text-foreground">
          {caseId || "N/A"}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            Fine amount
          </span>

          <span className="text-2xl font-bold text-foreground">
            ₹{Number(fineAmount || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">
            Payment status
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              isPaid
                ? "border-[#7FAF8A]/40 bg-[#7FAF8A]/15 text-[#5F8D6A] dark:text-[#9BC7A4]"
                : canPayFine
                  ? "border-[#B94A48]/30 bg-[#B94A48]/10 text-[#B94A48] dark:text-[#D76562]"
                  : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {fineStatus || "Unknown"}
          </span>
        </div>
      </div>

      {/* PAID CONFIRMATION */}
      {isPaid && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#7FAF8A]/30 bg-[#7FAF8A]/10 p-4">
          <CheckCircle
            size={21}
            className="mt-0.5 shrink-0 text-[#5F8D6A] dark:text-[#9BC7A4]"
          />

          <div>
            <h4 className="font-semibold text-foreground">
              Payment completed
            </h4>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your fine payment has been verified by the server.
              No further payment is required for this fine.
            </p>
          </div>
        </div>
      )}

      {/* ELIGIBLE FOR PAYMENT */}
      {!isPaid && canPayFine && (
        <>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#B94A48]/20 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/5">
            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0 text-[#B94A48] dark:text-[#D76562]"
            />

            <div>
              <h4 className="font-semibold text-foreground">
                Fine payment required
              </h4>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your appeal was rejected and the fine was upheld.
                You can now proceed with online payment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={payFine}
            disabled={paymentLoading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B94A48] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#A6403E] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#D76562] dark:hover:bg-[#C65350]"
          >
            {paymentLoading ? (
              <>
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
                Processing...
              </>
            ) : (
              <>
                <Wallet size={19} />
                Pay ₹{Number(fineAmount || 0).toLocaleString("en-IN")}
              </>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck
              size={15}
              className="shrink-0 text-[#7FAF8A]"
            />
            Secure checkout powered by Razorpay
          </div>
        </>
      )}

      {/* OTHER FINE STATUSES */}
      {!isPaid && !canPayFine && (
        <p className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
          Online payment becomes available after an appeal is rejected
          and the fine is upheld.
        </p>
      )}

      {/* VERIFICATION ERROR */}
      {paymentStatus === "error" && (
        <div className="mt-4 rounded-xl border border-[#B94A48]/20 bg-[#B94A48]/5 p-3 dark:bg-[#D76562]/5">
          <p className="text-sm leading-5 text-foreground">
            We could not confirm the payment. If money was deducted,
            check the payment status before attempting another payment.
          </p>
        </div>
      )}

      {/* VERIFICATION SUCCESS */}
      {paymentStatus === "success" && !isPaid && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#7FAF8A]/30 bg-[#7FAF8A]/10 p-3">
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0 text-[#5F8D6A]"
          />

          <p className="text-sm leading-5 text-foreground">
            Payment verified. Refreshing your case details.
          </p>
        </div>
      )}
    </div>
  );
};

export default FinePayment;
