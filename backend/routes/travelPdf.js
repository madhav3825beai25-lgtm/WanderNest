const express = require('express');
const PDFDocument = require('pdfkit');

const Booking = require('../models/Booking');
const Travel = require('../models/TravelBooking');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

const COLORS = {
  navy: '#14243B',
  blue: '#2563EB',
  teal: '#0F766E',
  lightBlue: '#EFF6FF',
  lightTeal: '#F0FDFA',
  white: '#FFFFFF',
  text: '#172033',
  muted: '#64748B',
  border: '#E2E8F0',
  background: '#F8FAFC',
  green: '#15803D',
  red: '#B91C1C'
};

const PAGE_WIDTH = 595.28;
const LEFT = 44;
const RIGHT = 44;
const CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT;

function clean(value, fallback = '-') {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value)
    .replace(/\bDEMO\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || fallback;
}

function formatMoney(paise) {
  const amount = Number(paise || 0) / 100;

  return `INR ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return (
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date) + ' IST'
  );
}

function formatTime(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return (
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date) + ' IST'
  );
}

function getAmountPaise(booking, type) {
  if (type === 'travel') {
    return Number(booking.amountPaise || 0);
  }

  return Math.round(Number(booking.total || 0) * 100);
}

function getService(booking, type) {
  if (type === 'travel') {
    return clean(booking.kind).toUpperCase();
  }

  return clean(
    booking.bookingType || 'Hotel / Package'
  ).toUpperCase();
}

function getRoute(booking, type) {
  if (type === 'travel') {
    const from = clean(booking.fromCity);
    const to = clean(booking.toCity);

    return `${from} to ${to}`;
  }

  return clean(booking.destination);
}

function getPassengers(booking) {
  if (!Array.isArray(booking.passengers)) return [];

  return booking.passengers;
}

function drawHeader(doc, documentTitle, reference) {
  doc.rect(0, 0, PAGE_WIDTH, 118).fill(COLORS.navy);

  doc
    .fillColor(COLORS.white)
    .font('Helvetica-Bold')
    .fontSize(27)
    .text('WanderNest', LEFT, 29);

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#CBD5E1')
    .text('TRAVEL BOOKING & SERVICES', LEFT, 65);

  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(COLORS.white)
    .text(documentTitle, 340, 32, {
      width: 210,
      align: 'right'
    });

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#CBD5E1')
    .text(`REF: ${clean(reference)}`, 320, 57, {
      width: 230,
      align: 'right'
    });

  doc
    .rect(0, 118, PAGE_WIDTH, 5)
    .fill(COLORS.teal);
}

function drawSectionTitle(doc, title, y) {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.navy)
    .text(title.toUpperCase(), LEFT, y);

  doc
    .moveTo(LEFT, y + 20)
    .lineTo(PAGE_WIDTH - RIGHT, y + 20)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();

  return y + 34;
}

function drawLabelValue(doc, label, value, x, y, width = 230) {
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(label.toUpperCase(), x, y, {
      width
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(clean(value), x, y + 14, {
      width,
      height: 34
    });
}

function drawStatus(doc, booking, y) {
  const isPaid = booking.paymentStatus === 'paid';
  const isConfirmed = booking.status === 'confirmed';

  doc
    .roundedRect(LEFT, y, CONTENT_WIDTH, 58, 8)
    .fill(COLORS.lightTeal);

  drawLabelValue(
    doc,
    'Booking Status',
    clean(booking.status).toUpperCase(),
    LEFT + 17,
    y + 12,
    210
  );

  drawLabelValue(
    doc,
    'Payment Status',
    isPaid ? 'PAID' : clean(booking.paymentStatus).toUpperCase(),
    LEFT + 270,
    y + 12,
    180
  );

  doc
    .circle(LEFT + 240, y + 28, 5)
    .fill(isConfirmed ? COLORS.green : COLORS.muted);

  return y + 75;
}

function drawFooter(doc, pageLabel) {
  const y = 752;

  doc
    .moveTo(LEFT, y)
    .lineTo(PAGE_WIDTH - RIGHT, y)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(COLORS.navy)
    .text('WanderNest', LEFT, y + 11);

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(pageLabel, 300, y + 11, {
      width: 250,
      align: 'right'
    });

  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(
      'Simulated booking document. Not valid for actual travel or service fulfilment.',
      LEFT,
      y + 30,
      {
        width: CONTENT_WIDTH,
        align: 'center'
      }
    );
}

function drawTicket(doc, booking) {
  drawHeader(doc, 'E-TICKET', booking.reference);

  let y = 145;

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text('YOUR JOURNEY', LEFT, y);

  y += 22;

  doc
    .roundedRect(LEFT, y, CONTENT_WIDTH, 110, 10)
    .fill(COLORS.lightBlue);

  const from = clean(booking.fromCity);
  const to = clean(booking.toCity);

  doc
    .font('Helvetica-Bold')
    .fontSize(19)
    .fillColor(COLORS.navy)
    .text(from, LEFT + 18, y + 20, {
      width: 205
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(COLORS.blue)
    .text('TO', LEFT + 223, y + 26, {
      width: 55,
      align: 'center'
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(19)
    .fillColor(COLORS.navy)
    .text(to, LEFT + 287, y + 20, {
      width: 200,
      align: 'right'
    });

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `DEPARTURE: ${formatDateTime(booking.travelDate)}`,
      LEFT + 18,
      y + 73,
      {
        width: 460
      }
    );

  y += 131;

  y = drawStatus(doc, booking, y);

  y = drawSectionTitle(doc, 'Journey Information', y);

  drawLabelValue(
    doc,
    'Service',
    clean(booking.kind).toUpperCase(),
    LEFT,
    y
  );

  drawLabelValue(
    doc,
    'Provider',
    booking.provider,
    LEFT + 260,
    y
  );

  y += 53;

  drawLabelValue(
    doc,
    'Travel Class / Vehicle',
    booking.travelClass || booking.vehicle,
    LEFT,
    y
  );

  drawLabelValue(
    doc,
    'Booking Reference',
    booking.reference,
    LEFT + 260,
    y
  );

  y += 65;

  if (booking.tripType === 'roundtrip') {
    y = drawSectionTitle(doc, 'Return Journey', y);

    drawLabelValue(
      doc,
      'Return Route',
      `${clean(booking.returnFromCity)} to ${clean(booking.returnToCity)}`,
      LEFT,
      y
    );

    drawLabelValue(
      doc,
      'Return Provider',
      booking.returnProvider,
      LEFT + 260,
      y
    );

    y += 51;

    drawLabelValue(
      doc,
      'Return Departure',
      formatDateTime(booking.returnDate),
      LEFT,
      y
    );

    drawLabelValue(
      doc,
      'Return Class',
      booking.returnTravelClass,
      LEFT + 260,
      y
    );

    y += 65;
  }

  y = drawSectionTitle(doc, 'Passenger Details', y);

  const passengers = getPassengers(booking);

  if (!passengers.length) {
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.text)
      .text('Passenger details unavailable', LEFT, y);

    y += 25;
  } else {
    passengers.forEach((passenger, index) => {
      if (y > 690) return;

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(COLORS.text)
        .text(
          `${index + 1}. ${clean(passenger.name)} | Age: ${clean(passenger.age)} | ${clean(passenger.gender)}`,
          LEFT,
          y,
          {
            width: CONTENT_WIDTH
          }
        );

      y += 23;
    });
  }

  if (y < 680) {
    y += 12;

    doc
      .roundedRect(LEFT, y, CONTENT_WIDTH, 48, 7)
      .fill(COLORS.background);

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text('TOTAL AMOUNT PAID', LEFT + 14, y + 9);

    doc
      .font('Helvetica-Bold')
      .fontSize(17)
      .fillColor(COLORS.teal)
      .text(
        formatMoney(booking.amountPaise),
        LEFT + 240,
        y + 12,
        {
          width: 245,
          align: 'right'
        }
      );
  }

  drawFooter(doc, 'E-Ticket | Page 1');
}

function drawInvoice(doc, booking, type) {
  drawHeader(doc, 'PAYMENT INVOICE', booking.reference);

  let y = 145;

  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor(COLORS.navy)
    .text('INVOICE', LEFT, y);

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `Invoice No: INV-${clean(booking.reference)}`,
      320,
      y + 2,
      {
        width: 230,
        align: 'right'
      }
    );

  y += 42;

  doc
    .roundedRect(LEFT, y, CONTENT_WIDTH, 105, 8)
    .fill(COLORS.background);

  drawLabelValue(
    doc,
    'Invoice Date',
    formatDate(booking.createdAt),
    LEFT + 15,
    y + 14
  );

  drawLabelValue(
    doc,
    'Booking Reference',
    booking.reference,
    LEFT + 270,
    y + 14
  );

  drawLabelValue(
    doc,
    'Payment Status',
    booking.paymentStatus,
    LEFT + 15,
    y + 62
  );

  drawLabelValue(
    doc,
    'Service',
    getService(booking, type),
    LEFT + 270,
    y + 62
  );

  y += 127;

  y = drawSectionTitle(doc, 'Billed To', y);

  const passengers = getPassengers(booking);

  const customerName =
    type === 'travel'
      ? passengers.map(p => clean(p.name)).join(', ') || 'Customer'
      : clean(booking.name, 'Customer');

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.text)
    .text(customerName, LEFT, y, {
      width: CONTENT_WIDTH
    });

  y += 29;

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `Journey / Destination: ${getRoute(booking, type)}`,
      LEFT,
      y,
      {
        width: CONTENT_WIDTH
      }
    );

  y += 42;

  y = drawSectionTitle(doc, 'Invoice Particulars', y);

  doc
    .rect(LEFT, y, CONTENT_WIDTH, 32)
    .fill(COLORS.navy);

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(COLORS.white)
    .text('DESCRIPTION', LEFT + 12, y + 10);

  doc
    .text('AMOUNT', LEFT + 355, y + 10, {
      width: 135,
      align: 'right'
    });

  y += 32;

  const totalPaise = getAmountPaise(booking, type);

  const rows = [];

  if (
    type === 'travel' &&
    booking.tripType === 'roundtrip'
  ) {
    rows.push({
      label: `Onward Journey - ${clean(booking.provider)}`,
      amount: Number(booking.onwardAmountPaise || 0)
    });

    rows.push({
      label: `Return Journey - ${clean(booking.returnProvider)}`,
      amount: Number(booking.returnAmountPaise || 0)
    });
  } else {
    rows.push({
      label:
        type === 'travel'
          ? `${getService(booking, type)} Booking - ${clean(booking.provider)}`
          : `${getService(booking, type)} Reservation`,
      amount: totalPaise
    });
  }

  rows.forEach((row, index) => {
    doc
      .rect(LEFT, y, CONTENT_WIDTH, 45)
      .fill(index % 2 === 0 ? COLORS.background : COLORS.white);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(row.label, LEFT + 12, y + 13, {
        width: 325
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(formatMoney(row.amount), LEFT + 355, y + 13, {
        width: 135,
        align: 'right'
      });

    y += 45;
  });

  y += 19;

  doc
    .roundedRect(LEFT + 215, y, CONTENT_WIDTH - 215, 68, 8)
    .fill(COLORS.lightTeal);

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.navy)
    .text('GRAND TOTAL', LEFT + 230, y + 13);

  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor(COLORS.teal)
    .text(
      formatMoney(totalPaise),
      LEFT + 230,
      y + 33,
      {
        width: CONTENT_WIDTH - 250,
        align: 'right'
      }
    );

  y += 97;

  y = drawSectionTitle(doc, 'Payment Information', y);

  drawLabelValue(
    doc,
    'Payment Method',
    'Razorpay',
    LEFT,
    y
  );

  drawLabelValue(
    doc,
    'Transaction ID',
    booking.razorpayPaymentId || 'Not available',
    LEFT + 260,
    y
  );

  drawFooter(doc, 'Payment Invoice | Page 1');
}

function drawCancellation(doc, booking, type) {
  drawHeader(
    doc,
    'CANCELLATION RECEIPT',
    booking.reference
  );

  let y = 155;

  doc
    .roundedRect(LEFT, y, CONTENT_WIDTH, 76, 9)
    .fill('#FEF2F2');

  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor(COLORS.red)
    .text('BOOKING CANCELLED', LEFT + 18, y + 16);

  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(
      `Cancellation Date: ${formatDateTime(booking.cancelledAt)}`,
      LEFT + 18,
      y + 45
    );

  y += 105;

  y = drawSectionTitle(doc, 'Booking Information', y);

  drawLabelValue(
    doc,
    'Booking Reference',
    booking.reference,
    LEFT,
    y
  );

  drawLabelValue(
    doc,
    'Service',
    getService(booking, type),
    LEFT + 260,
    y
  );

  y += 55;

  drawLabelValue(
    doc,
    'Route / Destination',
    getRoute(booking, type),
    LEFT,
    y,
    460
  );

  y += 66;

  y = drawSectionTitle(doc, 'Refund Summary', y);

  const amountPaise = getAmountPaise(booking, type);
  const refundPaise = Number(booking.refundAmountPaise || 0);
  const retainedPaise = Math.max(0, amountPaise - refundPaise);

  const rows = [
    ['Original Booking Amount', formatMoney(amountPaise)],
    ['Refund Percentage', `${Number(booking.refundPercentage || 0)}%`],
    ['Refund Amount', formatMoney(refundPaise)],
    ['Non-refundable Amount', formatMoney(retainedPaise)],
    ['Refund Status', clean(booking.refundStatus)]
  ];

  rows.forEach(([label, value], index) => {
    doc
      .rect(LEFT, y, CONTENT_WIDTH, 42)
      .fill(index % 2 === 0 ? COLORS.background : COLORS.white);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(label, LEFT + 12, y + 13);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(value, LEFT + 280, y + 13, {
        width: 205,
        align: 'right'
      });

    y += 42;
  });

  y += 24;

  y = drawSectionTitle(doc, 'Refund Transaction', y);

  drawLabelValue(
    doc,
    'Razorpay Refund ID',
    booking.razorpayRefundId || 'Not available',
    LEFT,
    y,
    CONTENT_WIDTH
  );

  drawFooter(doc, 'Cancellation Receipt | Page 1');
}

router.get('/:type/:id/:document', auth, async (req, res, next) => {
  try {
    const { type, id, document } = req.params;

    if (
      !['booking', 'travel'].includes(type) ||
      !['invoice', 'ticket', 'cancellation'].includes(document)
    ) {
      return res.status(400).json({
        message: 'Invalid document'
      });
    }

    const Model = type === 'booking' ? Booking : Travel;

    const booking = await Model.findOne({
      _id: id,
      user: req.user.id
    }).lean();

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (
      document === 'cancellation' &&
      booking.status !== 'cancelled'
    ) {
      return res.status(409).json({
        message: 'Booking not cancelled'
      });
    }

    if (
      document === 'ticket' &&
      type === 'booking'
    ) {
      return res.status(400).json({
        message: 'Ticket only for travel services'
      });
    }

    if (
      document === 'ticket' &&
      booking.paymentStatus !== 'paid'
    ) {
      return res.status(409).json({
        message: 'Payment required'
      });
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 44,
      autoFirstPage: true
    });

    const reference = clean(booking.reference, 'BOOKING');

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="WanderNest-${document}-${reference}.pdf"`
    );

    doc.pipe(res);

    if (document === 'ticket') {
      drawTicket(doc, booking);
    } else if (document === 'invoice') {
      drawInvoice(doc, booking, type);
    } else {
      drawCancellation(doc, booking, type);
    }

    doc.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;