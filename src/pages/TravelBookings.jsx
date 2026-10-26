import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Travel.css';
import '../styles/RoundTrip.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = () => sessionStorage.getItem('wandernest_token');
const money = (paise) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(paise || 0) / 100);
async function call(path, options = {}) {
  const response = await fetch(API + path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token() || ''}`, ...(options.headers || {}) } });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || 'Request failed');
  return data;
}
export default function TravelBookings() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelQuote, setCancelQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const load = async () => {
    if (!token()) { setMessage('Please log in to view your travel bookings.'); setLoading(false); return; }
    try { const data = await call('/api/travel/mine'); setList(data.bookings || []); setMessage(''); }
    catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  async function action(booking, what) {
    try {
      setBusy(booking._id); setMessage('');
      if (what === 'cancel') {
        setBookingToCancel(booking);
        setCancelQuote(null);
        setCancelError('');
        setQuoteLoading(true);
        try {
          const quote = await call(`/api/travel/${booking._id}/quote`);
          setCancelQuote(quote);
        } catch (error) {
          setCancelError(error.message);
        } finally {
          setQuoteLoading(false);
        }
        return;
      } else if (what === 'refund') {
        await call(`/api/travel/${booking._id}/refund-status`);
      } else if (what === 'pay') {
        const data = await call(`/api/travel/${booking._id}/order`, { method: 'POST' });
        if (!window.Razorpay) throw new Error('Razorpay checkout is unavailable.');
        new window.Razorpay({ key: data.keyId, order_id: data.order.id, amount: data.order.amount, currency: 'INR', name: 'WanderNest', description: 'Travel booking · Test Mode', handler: async (payment) => { try { await call(`/api/travel/${booking._id}/verify`, { method: 'POST', body: JSON.stringify(payment) }); await load(); } catch (error) { setMessage(error.message); } } }).open();
      }
      await load();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(''); }
  }
  async function confirmCancellation() {
    if (!bookingToCancel || !cancelQuote?.eligible || busy) return;
    try {
      setBusy(bookingToCancel._id);
      setCancelError('');
      await call(`/api/travel/${bookingToCancel._id}/cancel`, {
        method: 'PATCH'
      });
      setBookingToCancel(null);
      setCancelQuote(null);
      await load();
    } catch (error) {
      setCancelError(error.message);
    } finally {
      setBusy('');
    }
  }

  async function pdf(booking, doc) {
    try {
      const response = await fetch(`${API}/api/documents/travel/${booking._id}/${doc}`, { headers: { Authorization: `Bearer ${token() || ''}` } });
      if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'PDF download failed.'); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `WanderNest-${doc}-${booking.reference}.pdf`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) { setMessage(error.message); }
  }
  return <main className="travel-shell"><section className="travel-hero"><div className="travel-container"><div className="travel-hero-top"><span className="travel-kicker">YOUR JOURNEYS, ALL IN ONE PLACE</span><Link className="travel-hero-link" to="/flights">Explore flights ↗</Link></div><h1>My travel bookings</h1><p>Manage flight, train and cab reservations, documents, cancellations and refunds.</p></div></section><div className="travel-container travel-content"><section className="travel-search-card"><div className="travel-section-head" style={{ marginBottom: 0 }}><div><span className="travel-eyebrow">BOOKING OVERVIEW</span><h2 style={{ marginBottom: 4 }}>{loading ? 'Loading bookings...' : `${list.length} travel booking${list.length === 1 ? '' : 's'}`}</h2><p>PDF invoices and travel documents are available on each booking.</p></div><button className="travel-outline" onClick={load}>Refresh bookings ↻</button></div></section>{message && <div className="travel-alert" role="alert">{message}</div>}<section className="travel-listing">{!loading && !list.length && <div className="travel-empty-bookings"><span style={{ fontSize: 44 }}>🧳</span><strong>{message ? 'Bookings could not be loaded' : 'Your next adventure starts here'}</strong><p>{message ? 'Please log in and refresh the page.' : 'Your flight, train and cab bookings will appear here.'}</p><Link to="/flights">Explore journeys →</Link></div>}<div className="travel-bookings-grid">{list.map((booking) => <article className="travel-booking" key={booking._id}><div className="travel-booking-header"><span className="travel-booking-type">{booking.kind === 'flight' ? '✈ FLIGHT' : booking.kind === 'train' ? '🚆 TRAIN' : '🚕 CAB'} · {booking.reference}</span><span className={`travel-booking-status ${booking.status}`}>{booking.status}</span></div><h2>{booking.fromCity} → {booking.toCity}{booking.tripType==='roundtrip'?' → '+booking.fromCity:''}</h2>{booking.tripType==='roundtrip' && <div className="wn-leg-info"><strong>⇄ Round Trip · Both journeys in one booking</strong><span>✈ Onward: {booking.provider} · {new Date(booking.travelDate).toLocaleDateString('en-IN')} · {booking.travelTime} · {booking.travelClass}</span><span>✈ Return: {booking.returnProvider} · {new Date(booking.returnDate).toLocaleDateString('en-IN')} · {booking.returnTravelTime} · {booking.returnTravelClass}</span><small>Cancellation applies to both legs together; refunds follow the earliest departure date.</small></div>}<div className="travel-booking-meta"><span>📅 {new Date(booking.travelDate).toLocaleString('en-IN')}</span><span>🏷 {booking.provider}</span><span>Payment: {booking.paymentStatus}</span></div><div className="travel-booking-amount">{money(booking.amountPaise)}</div>{booking.status === 'cancelled' && <div className="travel-booking-refund">Refund: <strong>{booking.refundStatus}</strong> · {money(booking.refundAmountPaise)} · {booking.refundPercentage || 0}% {booking.razorpayRefundId ? `· ${booking.razorpayRefundId}` : ''}</div>}<div className="travel-actions"><button onClick={() => pdf(booking, 'invoice')}>↓ Invoice PDF</button>{booking.status === 'confirmed' && <button onClick={() => pdf(booking, 'ticket')}>↓ Demo ticket PDF</button>}{booking.status === 'cancelled' && <button onClick={() => pdf(booking, 'cancellation')}>↓ Cancellation receipt</button>}{booking.status === 'pending' && booking.paymentStatus !== 'paid' && <button disabled={!!busy} onClick={() => action(booking, 'pay')}>Pay now</button>}{booking.status !== 'cancelled' && <button className="danger" disabled={!!busy} onClick={() => action(booking, 'cancel')}>Cancel booking</button>}{booking.razorpayRefundId && booking.refundStatus !== 'processed' && <button disabled={!!busy} onClick={() => action(booking, 'refund')}>Check refund status</button>}</div></article>)}</div></section><div className="travel-footer-link"><Link to="/flights">Explore more journeys →</Link></div></div>
    {bookingToCancel && (
      <div role="presentation" style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.68)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20
      }}>
        <div role="dialog" aria-modal="true"
          aria-labelledby="travel-cancel-title"
          style={{
            background: '#fff', borderRadius: 20,
            padding: 28, width: '100%', maxWidth: 480,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 70px rgba(0,0,0,.25)'
          }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: '#fee2e2', color: '#dc2626',
            display: 'grid', placeItems: 'center',
            fontSize: 26, marginBottom: 16
          }}>!</div>
          <h2 id="travel-cancel-title"
            style={{margin: '0 0 8px', color: '#0f172a'}}>
            Cancel this booking?
          </h2>
          <p style={{color: '#64748b', marginTop: 0}}>
            Booking <strong>#{bookingToCancel.reference}</strong>
          </p>

          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 14, padding: 16, marginBottom: 16
          }}>
            <strong style={{color: '#0f172a'}}>
              Cancellation details
            </strong>
            <p style={{color: '#475569', fontSize: 14, lineHeight: 1.6}}>
              {bookingToCancel.fromCity} ? {bookingToCancel.toCity}
              {bookingToCancel.tripType === 'roundtrip'
                ? ' ? ' + bookingToCancel.fromCity : ''}
            </p>
            {bookingToCancel.tripType === 'roundtrip' && (
              <p style={{color: '#b45309', fontSize: 13}}>
                Both flight legs will be cancelled together.
              </p>
            )}
            <p style={{color: '#64748b', fontSize: 13, marginBottom: 0}}>
              Refund eligibility and amount are calculated by the
              booking server. This is a demo travel reservation;
              Razorpay payments use Test Mode.
            </p>
          </div>

          {quoteLoading && (
            <p>Checking cancellation eligibility and refund estimate...</p>
          )}

          {!quoteLoading && cancelQuote && (
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: 14, padding: 16
            }}>
              <p style={{margin: '0 0 10px'}}>
                Eligibility: <strong>
                  {cancelQuote.eligible ? 'Allowed' : 'Not allowed'}
                </strong>
              </p>
              <p style={{margin: '0 0 10px'}}>
                Refund percentage: <strong>
                  {cancelQuote.percentage ?? 0}%
                </strong>
              </p>
              <p style={{margin: 0}}>
                Estimated refund: <strong>
                  {money(cancelQuote.refundAmountPaise)}
                </strong>
              </p>
              {cancelQuote.message && (
                <p style={{fontSize: 13, color: '#475569'}}>
                  {cancelQuote.message}
                </p>
              )}
            </div>
          )}

          {cancelError && (
            <p role="alert" style={{
              color: '#dc2626', fontWeight: 600, marginTop: 14
            }}>{cancelError}</p>
          )}

          <div style={{
            display: 'flex', gap: 12,
            justifyContent: 'flex-end', marginTop: 24,
            flexWrap: 'wrap'
          }}>
            <button type="button"
              disabled={!!busy}
              onClick={() => {
                setBookingToCancel(null);
                setCancelQuote(null);
                setCancelError('');
              }}
              style={{
                border: '1px solid #cbd5e1', background: '#fff',
                color: '#0f172a', borderRadius: 10,
                padding: '11px 16px', cursor: 'pointer'
              }}>
              Keep Booking
            </button>
            <button type="button"
              disabled={!!busy || quoteLoading || !cancelQuote?.eligible}
              onClick={confirmCancellation}
              style={{
                border: 0, borderRadius: 10,
                padding: '11px 16px', color: '#fff',
                fontWeight: 700,
                background: cancelQuote?.eligible
                  ? '#dc2626' : '#94a3b8',
                cursor: cancelQuote?.eligible ? 'pointer' : 'not-allowed'
              }}>
              {busy ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    )}
  </main>;
}
