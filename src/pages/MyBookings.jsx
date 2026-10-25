import BookingPdfButtons from "../components/BookingPdfButtons";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MyBookings.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// ======================================
// HELPERS
// ======================================

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPaise(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "Not available";
  }

  return formatCurrency(Number(value) / 100);
}

function indiaDayNumber(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  const get = (type) =>
    Number(
      parts.find((part) => part.type === type)?.value
    );

  return Math.floor(
    Date.UTC(
      get("year"),
      get("month") - 1,
      get("day")
    ) / 86400000
  );
}

function getBookingSection(booking) {
  if (
    String(booking.status || "").toLowerCase() ===
    "cancelled"
  ) {
    return "cancelled";
  }

  const checkout = indiaDayNumber(booking.checkOut);
  const today = indiaDayNumber(new Date());

  if (
    checkout !== null &&
    today !== null &&
    checkout < today
  ) {
    return "completed";
  }

  return "upcoming";
}

function canCancelBooking(booking) {
  const status = String(
    booking.status || "pending"
  ).toLowerCase();

  const cancellationStatus = String(
    booking.cancellationStatus || "none"
  ).toLowerCase();

  const checkIn = indiaDayNumber(booking.checkIn);
  const today = indiaDayNumber(new Date());

  return (
    ["pending", "confirmed"].includes(status) &&
    cancellationStatus === "none" &&
    checkIn !== null &&
    today !== null &&
    checkIn >= today &&
    getBookingSection(booking) === "upcoming"
  );
}

function getRefundStatus(booking) {
  const status = String(
    booking.refundStatus || ""
  ).toLowerCase();

  const labels = {
    pending: "Refund Pending",
    processing: "Refund Processing",
    processed: "Refund Processed",
    failed: "Refund Failed",
    review_required: "Refund Needs Review",
    not_started: "Refund Not Started",
  };

  return labels[status] || null;
}

function getQuoteEligible(quote) {
  if (typeof quote?.eligible === "boolean") {
    return quote.eligible;
  }

  if (typeof quote?.canCancel === "boolean") {
    return quote.canCancel;
  }

  return false;
}

function getQuotePercentage(quote) {
  const value =
    quote?.refundPercentage ??
    quote?.refund?.percentage;

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return null;
  }

  return Number(value);
}

function getQuoteAmount(quote) {
  const value =
    quote?.refundAmountPaise ??
    quote?.refund?.amountPaise ??
    quote?.refund?.refundAmountPaise;

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return null;
  }

  return Number(value);
}

// ======================================
// CANCELLATION POLICY
// ======================================

function CancellationPolicy() {
  const rows = [
    ["7+ days before check-in", "100% refund"],
    ["3–6 days before check-in", "50% refund"],
    ["0–2 days before check-in", "No refund"],
    ["After check-in date", "Not allowed"],
  ];

  return (
    <div
      style={{
        padding: "18px",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        background: "#f8fafc",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px",
          color: "#0f172a",
          fontSize: "17px",
        }}
      >
        Cancellation Policy
      </h3>

      {rows.map(([days, refund]) => (
        <div
          key={days}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
            padding: "9px 0",
            borderBottom: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
        >
          <span style={{ color: "#475569" }}>
            {days}
          </span>

          <strong
            style={{
              color: "#0f172a",
              textAlign: "right",
            }}
          >
            {refund}
          </strong>
        </div>
      ))}

      <p
        style={{
          margin: "12px 0 0",
          fontSize: "12px",
          lineHeight: 1.6,
          color: "#64748b",
        }}
      >
        Refund calculations are verified by the
        backend. Razorpay refund processing may
        take additional time.
      </p>
    </div>
  );
}

// ======================================
// BOOKING CARD
// ======================================

function BookingCard({
  booking,
  section,
  onCancelClick,
  onCheckRefundStatus,
  cancellingId,
  checkingRefundId,
}) {
  const status = String(
    booking.status || "pending"
  ).toLowerCase();

  const displayStatus =
    section === "cancelled"
      ? "Cancelled"
      : section === "completed"
      ? "Completed"
      : booking.status || "Pending";

  const statusClass =
    section === "cancelled"
      ? "cancelled"
      : section === "completed"
      ? "completed"
      : status;

  const refundLabel = getRefundStatus(booking);

  const refundStatus = String(
    booking.refundStatus || ""
  ).toLowerCase();

  const cancellationStatus = String(
    booking.cancellationStatus || "none"
  ).toLowerCase();

  const canCheckRefund =
    section === "cancelled" &&
    Boolean(booking.razorpayRefundId) &&
    refundStatus !== "processed";

  const checkingThisRefund =
    checkingRefundId === booking._id;

  return (
    <article className="my-booking-card">
      <div className="my-booking-card-top">
        <div>
          <p className="my-booking-reference">
            Booking #{booking.reference}
          </p>

          <h2>
            {booking.packageName ||
              booking.hotel ||
              booking.destination}
          </h2>

          <p className="my-booking-destination">
            📍 {booking.destination}
          </p>
        </div>

        <span
          className={`my-booking-status status-${statusClass}`}
          style={
            section === "completed"
              ? {
                  background: "#e0f2fe",
                  color: "#075985",
                  borderColor: "#bae6fd",
                }
              : undefined
          }
        >
          {displayStatus}
        </span>
      </div>

      <div className="my-booking-details">
        <div>
          <span>Check-in</span>
          <strong>
            {formatDate(booking.checkIn)}
          </strong>
        </div>

        <div>
          <span>Check-out</span>
          <strong>
            {formatDate(booking.checkOut)}
          </strong>
        </div>

        <div>
          <span>Travelers</span>
          <strong>
            {Number(booking.adults || 0) +
              Number(booking.children || 0)}
          </strong>
        </div>

        <div>
          <span>Booking Type</span>
          <strong>
            {booking.bookingType || "Trip"}
          </strong>
        </div>
      </div>

      <div className="my-booking-card-bottom">
        <div>
          <span>Total Amount</span>
          <strong>
            {formatCurrency(booking.total)}
          </strong>
        </div>

        <div className="my-booking-payment">
          Payment method:{" "}
          {booking.payment || "Not available"}
        </div>
      </div>

      <p
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        Payment Status:{" "}
        <strong>
          {booking.paymentStatus || "unpaid"}
        </strong>
      </p>

      {/* REFUND DETAILS */}

      {refundLabel && (
        <div
          style={{
            marginTop: "14px",
            padding: "14px 16px",
            borderRadius: "12px",
            background:
              refundStatus === "processed"
                ? "#ecfdf5"
                : refundStatus === "failed" ||
                  refundStatus === "review_required"
                ? "#fef2f2"
                : "#eff6ff",
            color:
              refundStatus === "processed"
                ? "#047857"
                : refundStatus === "failed" ||
                  refundStatus === "review_required"
                ? "#b91c1c"
                : "#1e40af",
          }}
        >
          <strong>{refundLabel}</strong>

          {booking.refundAmountPaise !== null &&
            booking.refundAmountPaise !== undefined && (
              <p style={{ margin: "6px 0 0" }}>
                Refund amount:{" "}
                <strong>
                  {formatPaise(
                    booking.refundAmountPaise
                  )}
                </strong>
              </p>
            )}

          {booking.refundPercentage !== null &&
            booking.refundPercentage !== undefined && (
              <p style={{ margin: "6px 0 0" }}>
                Refund percentage:{" "}
                <strong>
                  {booking.refundPercentage}%
                </strong>
              </p>
            )}

          {booking.razorpayRefundId && (
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "12px",
                overflowWrap: "anywhere",
              }}
            >
              Refund ID: {booking.razorpayRefundId}
            </p>
          )}

          {canCheckRefund && (
            <button
              type="button"
              onClick={() =>
                onCheckRefundStatus(booking)
              }
              disabled={Boolean(
                checkingRefundId || cancellingId
              )}
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #2563eb",
                background: "white",
                color: "#2563eb",
                fontWeight: 600,
                cursor: checkingRefundId
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {checkingThisRefund
                ? "Checking Refund..."
                : "Check Refund Status"}
            </button>
          )}
        </div>
      )}

      {[
        "processing",
        "review_required",
      ].includes(cancellationStatus) && (
        <p
          style={{
            marginTop: "14px",
            color: "#92400e",
            fontWeight: 600,
          }}
        >
          Cancellation is processing or requires
          payment review.
        </p>
      )}

      {/* CANCEL BUTTON */}

      {section === "upcoming" &&
        canCancelBooking(booking) && (
          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              onClick={() =>
                onCancelClick(booking)
              }
              disabled={Boolean(
                cancellingId || checkingRefundId
              )}
              style={{
                padding: "11px 20px",
                borderRadius: "10px",
                border: "1px solid #dc2626",
                background: "white",
                color: "#dc2626",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel Booking
            </button>
          </div>
        )}

      {section === "completed" && (
        <p
          style={{
            marginTop: "14px",
            color: "#0369a1",
            fontWeight: 600,
          }}
        >
          ✓ This trip's check-out date has passed.
        </p>
      )}

      {section === "cancelled" && (
        <p
          style={{
            marginTop: "14px",
            color: "#dc2626",
            fontWeight: 600,
          }}
        >
          This booking has been cancelled.
        </p>
      )}
    <BookingPdfButtons booking={booking} />
    </article>
  );
}

// ======================================
// MAIN COMPONENT
// ======================================

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingToCancel, setBookingToCancel] =
    useState(null);

  const [cancellingId, setCancellingId] =
    useState(null);

  const [checkingRefundId, setCheckingRefundId] =
    useState(null);

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] =
    useState(false);
  const [quoteError, setQuoteError] =
    useState("");

  const [cancelError, setCancelError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(Date.now());

  // Refresh date-based booking sections.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // ======================================
  // AUTH HELPERS
  // ======================================

  function handleUnauthorized() {
    sessionStorage.removeItem(
      "wandernest_token"
    );

    sessionStorage.removeItem(
      "wandernest_user_name"
    );

    sessionStorage.removeItem(
      "wandernest_user_email"
    );

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/login", {
      replace: true,
      state: {
        from: "/my-bookings",
        message:
          "Your session has expired. Please log in again.",
      },
    });
  }

  async function requestJson(url, options = {}) {
    const token = sessionStorage.getItem(
      "wandernest_token"
    );

    if (!token) {
      handleUnauthorized();

      throw new Error(
        "Please log in again."
      );
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    if (
      !contentType.includes("application/json")
    ) {
      throw new Error(
        "The booking server returned an unexpected response."
      );
    }

    const data = await response.json();

    if (response.status === 401) {
      handleUnauthorized();

      throw new Error(
        "Please log in again."
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Request failed."
      );
    }

    return data;
  }

  // ======================================
  // LOAD BOOKINGS
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem(
          "wandernest_token"
        );

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response = await fetch(
          `${API_URL}/api/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        if (
          !contentType.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "The booking server returned an unexpected response."
          );
        }

        const data = await response.json();

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load bookings."
          );
        }

        if (!Array.isArray(data.bookings)) {
          throw new Error(
            "Invalid bookings response."
          );
        }

        setBookings(data.bookings);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof TypeError
            ? "Cannot connect to the booking server."
            : err.message
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => controller.abort();
  }, [navigate]);

  // ======================================
  // CHECK REFUND STATUS
  // ======================================

  async function handleCheckRefundStatus(booking) {
    if (checkingRefundId) return;

    try {
      setCheckingRefundId(booking._id);
      setActionError("");
      setSuccessMessage("");

      const data = await requestJson(
        `${API_URL}/api/bookings/${booking._id}/refund-status`
      );

      if (!data.booking) {
        throw new Error(
          "Refund status response did not include booking."
        );
      }

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? data.booking
            : item
        )
      );

      setSuccessMessage(
        data.message ||
          "Refund status updated successfully."
      );
    } catch (err) {
      setActionError(
        err instanceof TypeError
          ? "Cannot connect to the booking server."
          : err.message
      );
    } finally {
      setCheckingRefundId(null);
    }
  }

  // ======================================
  // OPEN CANCELLATION MODAL
  // ======================================

  async function openCancellationModal(booking) {
    setBookingToCancel(booking);
    setQuote(null);
    setQuoteError("");
    setCancelError("");
    setActionError("");
    setSuccessMessage("");
    setQuoteLoading(true);

    try {
      const data = await requestJson(
        `${API_URL}/api/bookings/${booking._id}/cancellation-quote`
      );

      const result =
        data.quote || data.policy || data;

      // Respect backend cancellation eligibility.
      setQuote({
        ...result,
        eligible:
          data.canRequestCancellation === false
            ? false
            : result.eligible,
      });
    } catch (err) {
      setQuoteError(
        err instanceof TypeError
          ? "Cannot connect to the booking server."
          : err.message
      );
    } finally {
      setQuoteLoading(false);
    }
  }

  // ======================================
  // CONFIRM CANCELLATION
  // ======================================

  async function handleCancelBooking() {
    if (
      !bookingToCancel ||
      cancellingId ||
      quoteLoading
    ) {
      return;
    }

    if (!getQuoteEligible(quote)) {
      setCancelError(
        "Cancellation is not available for this booking."
      );

      return;
    }

    const bookingId = bookingToCancel._id;

    try {
      setCancellingId(bookingId);
      setCancelError("");
      setActionError("");
      setSuccessMessage("");

      const data = await requestJson(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.booking) {
        setBookings((previous) =>
          previous.map((booking) =>
            booking._id === bookingId
              ? data.booking
              : booking
          )
        );
      } else {
        const refreshed = await requestJson(
          `${API_URL}/api/bookings`
        );

        if (Array.isArray(refreshed.bookings)) {
          setBookings(refreshed.bookings);
        }
      }

      setBookingToCancel(null);
      setQuote(null);

      setSuccessMessage(
        data.message ||
          "Booking cancellation submitted successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setCancelError(
        err instanceof TypeError
          ? "Cannot connect to the booking server. Refresh My Bookings before retrying."
          : err.message
      );
    } finally {
      setCancellingId(null);
    }
  }

  // ======================================
  // GROUP BOOKINGS
  // ======================================

  void currentTime;

  const upcomingBookings = bookings.filter(
    (booking) =>
      getBookingSection(booking) === "upcoming"
  );

  const completedBookings = bookings.filter(
    (booking) =>
      getBookingSection(booking) === "completed"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      getBookingSection(booking) === "cancelled"
  );

  // ======================================
  // RENDER SECTION
  // ======================================

  function renderSection(
    title,
    sectionBookings,
    section
  ) {
    return (
      <section
        style={{
          marginBottom: "36px",
        }}
        aria-label={title}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "12px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "23px",
              color: "#0f172a",
            }}
          >
            {title}
          </h2>

          <span
            style={{
              background: "#e2e8f0",
              color: "#334155",
              borderRadius: "999px",
              padding: "5px 12px",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            {sectionBookings.length}
          </span>
        </div>

        {sectionBookings.length === 0 ? (
          <p
            style={{
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0",
              padding: "18px",
              borderRadius: "12px",
              color: "#64748b",
            }}
          >
            {section === "upcoming"
              ? "No upcoming bookings."
              : section === "completed"
              ? "No completed trips yet."
              : "No cancelled bookings."}
          </p>
        ) : (
          <div className="my-bookings-list">
            {sectionBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                section={section}
                cancellingId={cancellingId}
                checkingRefundId={
                  checkingRefundId
                }
                onCancelClick={
                  openCancellationModal
                }
                onCheckRefundStatus={
                  handleCheckRefundStatus
                }
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  const quoteEligible =
    getQuoteEligible(quote);

  const quotePercentage =
    getQuotePercentage(quote);

  const quoteAmount =
    getQuoteAmount(quote);

  // ======================================
  // PAGE
  // ======================================

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-container">
        <div className="my-bookings-heading">
          <p className="my-bookings-eyebrow">
            YOUR TRAVEL PLANS
          </p>

          <h1>My Bookings</h1>

          <p>
            View your reservations, completed trips,
            cancelled bookings and refund status.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div
            role="status"
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#e8f7ee",
              color: "#17683c",
              fontWeight: 600,
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {/* ACTION ERROR */}

        {actionError && (
          <div
            role="alert"
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontWeight: 600,
            }}
          >
            {actionError}
          </div>
        )}

        {/* POLICY */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <CancellationPolicy />
        </div>

        {/* LOADING */}

        {loading && (
          <div className="my-bookings-message">
            Loading your bookings...
          </div>
        )}

        {/* LOADING ERROR */}

        {!loading && error && (
          <div
            className="my-bookings-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* EMPTY BOOKINGS */}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="my-bookings-empty">
              <div className="my-bookings-empty-icon">
                ✈️
              </div>

              <h2>No bookings yet</h2>

              <p>
                You haven't made any bookings yet.
                Start exploring your next destination.
              </p>

              <Link
                to="/packages"
                className="my-bookings-button"
              >
                Explore Packages
              </Link>
            </div>
          )}

        {/* BOOKING SECTIONS */}

        {!loading &&
          !error &&
          bookings.length > 0 && (
            <>
              {renderSection(
                "Upcoming Bookings",
                upcomingBookings,
                "upcoming"
              )}

              {renderSection(
                "Completed Bookings",
                completedBookings,
                "completed"
              )}

              {renderSection(
                "Cancelled Bookings",
                cancelledBookings,
                "cancelled"
              )}
            </>
          )}
      </div>

      {/* ==================================
          CANCELLATION MODAL
      ================================== */}

      {bookingToCancel && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "28px",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              id="cancel-booking-title"
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#0f172a",
              }}
            >
              Cancel this booking?
            </h2>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.6,
              }}
            >
              Booking{" "}
              <strong>
                #{bookingToCancel.reference}
              </strong>
            </p>

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <CancellationPolicy />
            </div>

            {/* QUOTE LOADING */}

            {quoteLoading && (
              <p
                style={{
                  color: "#475569",
                }}
              >
                Checking cancellation eligibility
                and refund estimate...
              </p>
            )}

            {/* QUOTE ERROR */}

            {quoteError && (
              <p
                role="alert"
                style={{
                  color: "#dc2626",
                  fontWeight: 600,
                }}
              >
                {quoteError}
              </p>
            )}

            {/* BACKEND QUOTE */}

            {!quoteLoading && quote && (
              <div
                style={{
                  background: "#eff6ff",
                  border:
                    "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                  }}
                >
                  Cancellation eligibility:{" "}
                  <strong>
                    {quoteEligible
                      ? "Allowed"
                      : "Not allowed"}
                  </strong>
                </p>

                {quotePercentage !== null && (
                  <p
                    style={{
                      margin: "0 0 8px",
                    }}
                  >
                    Refund percentage:{" "}
                    <strong>
                      {quotePercentage}%
                    </strong>
                  </p>
                )}

                {quoteAmount !== null && (
                  <p
                    style={{
                      margin: "0 0 8px",
                    }}
                  >
                    Estimated refund:{" "}
                    <strong>
                      {formatPaise(
                        quoteAmount
                      )}
                    </strong>
                  </p>
                )}

                {quote.message && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#475569",
                    }}
                  >
                    {quote.message}
                  </p>
                )}
              </div>
            )}

            {/* CANCEL ERROR */}

            {cancelError && (
              <p
                role="alert"
                style={{
                  color: "#dc2626",
                  fontWeight: 600,
                  marginTop: "14px",
                }}
              >
                {cancelError}
              </p>
            )}

            {/* ACTION BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setBookingToCancel(null);
                  setQuote(null);
                  setQuoteError("");
                  setCancelError("");
                }}
                disabled={Boolean(cancellingId)}
                style={{
                  padding: "11px 18px",
                  borderRadius: "10px",
                  border:
                    "1px solid #cbd5e1",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={
                  handleCancelBooking
                }
                disabled={
                  Boolean(cancellingId) ||
                  quoteLoading ||
                  !quoteEligible ||
                  Boolean(quoteError)
                }
                style={{
                  padding: "11px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: quoteEligible
                    ? "#dc2626"
                    : "#94a3b8",
                  color: "white",
                  fontWeight: 600,
                  cursor: quoteEligible
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                {cancellingId
                  ? "Cancelling..."
                  : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyBookings;
