
const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

const {
  calculateBookingPrice,
} = require("../services/bookingPricing");

const { policy } = require("../services/cancellationPolicy");
const { client } = require("../services/razorpayClient");

const router = express.Router();

const valid = (id) => mongoose.isValidObjectId(id);
const oid = (id) => new mongoose.Types.ObjectId(id);

const err = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

const unwrap = (result) => result?.value || result;

async function raw(id, user) {
  return Booking.collection.findOne({
    _id: oid(id),
    user: oid(user),
  });
}

// ======================================
// GET MY BOOKINGS
// ======================================

router.get("/", auth, async (req, res, next) => {
  try {
    if (!valid(req.user?.id)) {
      return err(res, 401, "Invalid session");
    }

    const bookings = await Booking.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
});

// ======================================
// CREATE BOOKING
// ======================================

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      destination,
      bookingType,
      packageName,
      hotelId,
      duration,
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
      payment,
      coupon,
      reference,
    } = req.body || {};

    if (!valid(req.user?.id)) {
      return err(res, 401, "Invalid session");
    }

    if (
      ![name, email, phone, destination, reference].every(
        (value) =>
          typeof value === "string" && value.trim()
      ) ||
      !checkIn ||
      !checkOut
    ) {
      return err(
        res,
        400,
        "Required booking details missing"
      );
    }

    if (
      ![
        "UPI",
        "Credit/Debit Card",
        "Net Banking",
        "Cash on Arrival",
      ].includes(payment)
    ) {
      return err(res, 400, "Invalid payment method");
    }

    let pricing;

    try {
      pricing = calculateBookingPrice({
        bookingType,
        destination,
        packageName,
        hotelId,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        coupon,
      });
    } catch (error) {
      return err(
        res,
        400,
        error.message || "Invalid booking"
      );
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start
    ) {
      return err(res, 400, "Invalid dates");
    }

    const booking = await Booking.create({
      user: oid(req.user.id),

      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),

      destination: pricing.destination,
      bookingType,

      packageName: pricing.packageName,
      hotel: pricing.hotel,
      hotelId: pricing.hotelId,

      duration:
        typeof duration === "string"
          ? duration.trim()
          : "",

      checkIn: start,
      checkOut: end,

      rooms: Number(rooms),
      adults: Number(adults),
      children: Number(children || 0),

      payment,
      coupon: pricing.coupon,
      reference: reference.trim(),

      nights: pricing.nights,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      taxes: pricing.taxes,
      total: pricing.total,

      pricingVerified: pricing.pricingVerified,
      verifiedAmountPaise:
        pricing.verifiedAmountPaise,

      paymentStatus: "unpaid",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking saved with verified pricing.",
      booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return err(
        res,
        409,
        "Booking reference already exists"
      );
    }

    next(error);
  }
});

// ======================================
// CANCELLATION QUOTE
// ======================================

router.get(
  "/:bookingId/cancellation-quote",
  auth,
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const user = req.user?.id;

      if (!valid(bookingId) || !valid(user)) {
        return err(
          res,
          400,
          "Invalid booking or session"
        );
      }

      const booking = await raw(bookingId, user);

      if (!booking) {
        return err(res, 404, "Booking not found");
      }

      const amount =
        booking.paymentStatus === "paid" &&
        Number.isSafeInteger(
          booking.verifiedAmountPaise
        )
          ? booking.verifiedAmountPaise
          : 0;

      const quote = policy(
        booking.checkIn,
        amount
      );

      const canRequestCancellation =
        quote.eligible &&
        ["pending", "confirmed"].includes(
          booking.status
        ) &&
        (
          !booking.cancellationStatus ||
          booking.cancellationStatus === "none"
        );

      return res.json({
        success: true,
        quote: {
          ...quote,
          eligible: canRequestCancellation,
        },
        canRequestCancellation,
        notice:
          "Estimate only. Final refund depends on verified Razorpay payment.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// ======================================
// CANCEL BOOKING
// ======================================

router.patch(
  "/:bookingId/cancel",
  auth,
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const user = req.user?.id;

      if (!valid(bookingId) || !valid(user)) {
        return err(
          res,
          400,
          "Invalid booking or session"
        );
      }

      const booking = await raw(bookingId, user);

      if (!booking) {
        return err(res, 404, "Booking not found");
      }

      if (booking.status === "cancelled") {
        return err(res, 409, "Already cancelled");
      }

      const quote = policy(booking.checkIn, 0);

      if (!quote.eligible) {
        return err(
          res,
          409,
          "Check-in date has passed"
        );
      }

      // Exclusive cancellation claim.
      const claimed = unwrap(
        await Booking.collection.findOneAndUpdate(
          {
            _id: oid(bookingId),
            user: oid(user),
            status: {
              $in: ["pending", "confirmed"],
            },
            cancellationStatus: {
              $in: [null, "none"],
            },
          },
          {
            $set: {
              cancellationStatus: "processing",
              cancellationStartedAt: new Date(),
              refundStatus: "not_started",
            },
          },
          {
            returnDocument: "after",
          }
        )
      );

      if (!claimed?._id) {
        return err(
          res,
          409,
          "Cancellation or payment state changed. Refresh bookings."
        );
      }

      const review = async (message) => {
        await Booking.collection.updateOne(
          {
            _id: oid(bookingId),
            cancellationStatus: "processing",
          },
          {
            $set: {
              cancellationStatus:
                "review_required",
              refundStatus: "review_required",
              refundError: message,
            },
          }
        );

        return err(
          res,
          409,
          message +
            " Manual reconciliation required; no automatic retry."
        );
      };

      const release = async (message) => {
        await Booking.collection.updateOne(
          {
            _id: oid(bookingId),
            cancellationStatus: "processing",
          },
          {
            $set: {
              cancellationStatus: "none",
              refundStatus: "not_applicable",
              refundError: "",
            },
          }
        );

        return err(res, 409, message);
      };

      try {
        let payment = null;

        if (claimed.razorpayOrderId) {
          const razorpay = client();

          const order = await razorpay.orders.fetch(
            claimed.razorpayOrderId
          );

          if (
            order.currency !== "INR" ||
            order.amount !==
              claimed.verifiedAmountPaise
          ) {
            return review(
              "Razorpay order amount mismatch."
            );
          }

          const result =
            await razorpay.orders.fetchPayments(
              claimed.razorpayOrderId
            );

          const payments = result.items || [];

          if (result.count > payments.length) {
            return review(
              "Payment list incomplete."
            );
          }

          if (
            payments.some((item) =>
              [
                "authorized",
                "created",
                "pending",
              ].includes(item.status)
            )
          ) {
            return release(
              "Payment is still in progress. Try after settlement."
            );
          }

          const captured = payments.filter(
            (item) =>
              item.status === "captured" ||
              item.status === "refunded"
          );

          if (captured.length > 1) {
            return review(
              "Multiple captured payments found."
            );
          }

          if (captured.length === 1) {
            payment =
              await razorpay.payments.fetch(
                captured[0].id
              );

            if (
              payment.order_id !==
                claimed.razorpayOrderId ||
              payment.currency !== "INR" ||
              payment.amount !==
                claimed.verifiedAmountPaise
            ) {
              return review(
                "Captured payment mismatch."
              );
            }

            if (payment.status !== "captured") {
              return review(
                "Payment already refunded or changed; review required."
              );
            }

            if (payment.amount_refunded > 0) {
              return review(
                "Existing refund detected; review required."
              );
            }
          }

          if (!payment && order.amount_paid > 0) {
            return review(
              "Order shows a payment not found in payment list."
            );
          }
        } else if (
          claimed.razorpayPaymentId ||
          [
            "paid",
            "refunded",
            "partially_refunded",
          ].includes(claimed.paymentStatus)
        ) {
          return review(
            "Payment record exists without a Razorpay order."
          );
        }

        const finalQuote = policy(
          claimed.checkIn,
          payment ? payment.amount : 0
        );

        if (!finalQuote.eligible) {
          return release(
            "Check-in date has passed."
          );
        }

        const base = {
          cancellationPolicyVersion:
            finalQuote.version,
          refundPercentage:
            finalQuote.refundPercentage,
          refundAmountPaise:
            finalQuote.refundAmountPaise,
          razorpayPaymentId:
            payment?.id ||
            claimed.razorpayPaymentId ||
            "",
          refundError: "",
        };

        // No payment or zero-refund cancellation.
        if (
          !payment ||
          finalQuote.refundAmountPaise === 0
        ) {
          const updated = unwrap(
            await Booking.collection.findOneAndUpdate(
              {
                _id: oid(bookingId),
                cancellationStatus: "processing",
              },
              {
                $set: {
                  ...base,
                  status: "cancelled",
                  cancelledAt: new Date(),
                  cancellationStatus:
                    "completed",
                  refundStatus:
                    "not_applicable",
                  ...(payment
                    ? {
                        paymentStatus: "paid",
                        paidAt:
                          claimed.paidAt ||
                          new Date(),
                      }
                    : {}),
                },
              },
              {
                returnDocument: "after",
              }
            )
          );

          return res.json({
            success: true,
            message:
              "Booking cancelled. No refund is due under this policy.",
            booking: updated,
          });
        }

        // Save refund intent before external API call.
        await Booking.collection.updateOne(
          {
            _id: oid(bookingId),
            cancellationStatus: "processing",
          },
          {
            $set: {
              ...base,
              refundStatus:
                "review_required",
              paymentStatus: "paid",
              paidAt:
                claimed.paidAt ||
                new Date(),
            },
          }
        );

        let refund;

        try {
          refund = await client().payments.refund(
            payment.id,
            {
              amount:
                finalQuote.refundAmountPaise,
              speed: "normal",
              notes: {
                bookingId: String(bookingId),
                policy: finalQuote.version,
              },
            }
          );
        } catch (error) {
          return review(
            "Refund API result uncertain. Check Razorpay dashboard before retrying."
          );
        }

        if (
          !refund?.id ||
          refund.payment_id !== payment.id ||
          refund.amount !==
            finalQuote.refundAmountPaise
        ) {
          return review(
            "Refund response mismatch."
          );
        }

        const processed =
          refund.status === "processed";

        const updated = unwrap(
          await Booking.collection.findOneAndUpdate(
            {
              _id: oid(bookingId),
              cancellationStatus: "processing",
            },
            {
              $set: {
                status: "cancelled",
                cancelledAt: new Date(),
                cancellationStatus:
                  "completed",
                refundStatus: processed
                  ? "processed"
                  : "pending",
                razorpayRefundId: refund.id,
                refundProcessedAt: processed
                  ? new Date()
                  : null,
                paymentStatus: processed
                  ? finalQuote.refundAmountPaise ===
                    payment.amount
                    ? "refunded"
                    : "partially_refunded"
                  : "paid",
              },
            },
            {
              returnDocument: "after",
            }
          )
        );

        return res.json({
          success: true,
          message:
            "Booking cancelled; Razorpay refund request recorded.",
          booking: updated,
        });
      } catch (error) {
        return review(
          "Payment reconciliation failed. Check Razorpay and retry only after manual review."
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// ======================================
// CHECK RAZORPAY REFUND STATUS
// GET /api/bookings/:bookingId/refund-status
// ======================================

router.get(
  "/:bookingId/refund-status",
  auth,
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const user = req.user?.id;

      if (!valid(bookingId) || !valid(user)) {
        return err(
          res,
          400,
          "Invalid booking or session."
        );
      }

      const booking = await raw(bookingId, user);

      if (!booking) {
        return err(
          res,
          404,
          "Booking not found."
        );
      }

      if (booking.status !== "cancelled") {
        return err(
          res,
          409,
          "Booking is not cancelled."
        );
      }

      if (
        !booking.razorpayRefundId ||
        !booking.razorpayPaymentId
      ) {
        return err(
          res,
          409,
          "No Razorpay refund reference found. Manual reconciliation may be required."
        );
      }

      const razorpay = client();

      // Read-only Razorpay request.
      // This does NOT initiate another refund.
      const refund = await razorpay.refunds.fetch(
        booking.razorpayRefundId
      );

      if (
        refund.id !== booking.razorpayRefundId ||
        refund.payment_id !==
          booking.razorpayPaymentId ||
        refund.amount !==
          booking.refundAmountPaise
      ) {
        return err(
          res,
          409,
          "Refund details do not match this booking. Manual review required."
        );
      }

      const remoteStatus = String(
        refund.status || ""
      ).toLowerCase();

      let refundStatus;

      if (remoteStatus === "processed") {
        refundStatus = "processed";
      } else if (remoteStatus === "failed") {
        refundStatus = "failed";
      } else if (
        ["pending", "created", "processing"].includes(
          remoteStatus
        )
      ) {
        refundStatus = "pending";
      } else {
        return err(
          res,
          409,
          "Unknown Razorpay refund status. Manual review required."
        );
      }

      // Never downgrade a refund already marked
      // processed due to an older response.
      if (
        booking.refundStatus === "processed" &&
        refundStatus !== "processed"
      ) {
        return err(
          res,
          409,
          "Stored refund is already processed. Conflicting Razorpay status requires review."
        );
      }

      const update = {
        refundStatus,
      };

      if (refundStatus === "processed") {
        update.refundProcessedAt =
          booking.refundProcessedAt ||
          new Date();

        const fullRefund =
          booking.refundAmountPaise ===
          booking.verifiedAmountPaise;

        update.paymentStatus = fullRefund
          ? "refunded"
          : "partially_refunded";

        update.refundError = "";
      }

      if (refundStatus === "failed") {
        update.refundError =
          "Razorpay reported refund failure. Manual review required.";
      }

      const updated = unwrap(
        await Booking.collection.findOneAndUpdate(
          {
            _id: oid(bookingId),
            user: oid(user),
            status: "cancelled",
            razorpayRefundId: refund.id,
            razorpayPaymentId:
              refund.payment_id,
            refundAmountPaise:
              refund.amount,
            refundStatus: {
              $ne: "processed",
            },
          },
          {
            $set: update,
          },
          {
            returnDocument: "after",
          }
        )
      );

      // Another request might have updated the
      // refund while Razorpay was being queried.
      const latest =
        updated ||
        (await raw(bookingId, user));

      return res.json({
        success: true,
        message:
          latest.refundStatus === "processed"
            ? "Refund processed successfully."
            : latest.refundStatus === "failed"
            ? "Refund failed. Manual review required."
            : "Refund is still processing.",
        refundStatus: latest.refundStatus,
        booking: latest,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
