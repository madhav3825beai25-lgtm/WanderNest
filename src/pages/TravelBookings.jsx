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
        const quote = await call(`/api/travel/${booking._id}/quote`);
        if (!quote.eligible) throw new Error('Cancellation is not available for this booking.');
        if (!window.confirm(`Cancel this booking (both flight legs if round trip)? Estimated refund: ${quote.percentage}% (${money(quote.refundAmountPaise)}). The travel reservation is simulated; Razorpay Test Mode refunds may be processed.`)) return;
        await call(`/api/travel/${booking._id}/cancel`, { method: 'PATCH' });
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
  async function pdf(booking, doc) {
    try {
      const response = await fetch(`${API}/api/documents/travel/${booking._id}/${doc}`, { headers: { Authorization: `Bearer ${token() || ''}` } });
      if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'PDF download failed.'); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `WanderNest-${doc}-${booking.reference}.pdf`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) { setMessage(error.message); }
  }
  return <main className="travel-shell"><section className="travel-hero"><div className="travel-container"><div className="travel-hero-top"><span className="travel-kicker">YOUR JOURNEYS, ALL IN ONE PLACE</span><Link className="travel-hero-link" to="/flights">Explore flights ↗</Link></div><h1>My travel bookings</h1><p>Manage flight, train and cab reservations, documents, cancellations and refunds.</p></div></section><div className="travel-container travel-content"><section className="travel-search-card"><div className="travel-section-head" style={{ marginBottom: 0 }}><div><span className="travel-eyebrow">BOOKING OVERVIEW</span><h2 style={{ marginBottom: 4 }}>{loading ? 'Loading bookings...' : `${list.length} travel booking${list.length === 1 ? '' : 's'}`}</h2><p>PDF invoices and travel documents are available on each booking.</p></div><button className="travel-outline" onClick={load}>Refresh bookings ↻</button></div></section>{message && <div className="travel-alert" role="alert">{message}</div>}<section className="travel-listing">{!loading && !list.length && <div className="travel-empty-bookings"><span style={{ fontSize: 44 }}>🧳</span><strong>{message ? 'Bookings could not be loaded' : 'Your next adventure starts here'}</strong><p>{message ? 'Please log in and refresh the page.' : 'Your flight, train and cab bookings will appear here.'}</p><Link to="/flights">Explore journeys →</Link></div>}<div className="travel-bookings-grid">{list.map((booking) => <article className="travel-booking" key={booking._id}><div className="travel-booking-header"><span className="travel-booking-type">{booking.kind === 'flight' ? '✈ FLIGHT' : booking.kind === 'train' ? '🚆 TRAIN' : '🚕 CAB'} · {booking.reference}</span><span className={`travel-booking-status ${booking.status}`}>{booking.status}</span></div><h2>{booking.fromCity} → {booking.toCity}{booking.tripType==='roundtrip'?' → '+booking.fromCity:''}</h2>{booking.tripType==='roundtrip' && <div className="wn-leg-info"><strong>⇄ Round Trip · Both journeys in one booking</strong><span>✈ Onward: {booking.provider} · {new Date(booking.travelDate).toLocaleDateString('en-IN')} · {booking.travelTime} · {booking.travelClass}</span><span>✈ Return: {booking.returnProvider} · {new Date(booking.returnDate).toLocaleDateString('en-IN')} · {booking.returnTravelTime} · {booking.returnTravelClass}</span><small>Cancellation applies to both legs together; refunds follow the earliest departure date.</small></div>}<div className="travel-booking-meta"><span>📅 {new Date(booking.travelDate).toLocaleString('en-IN')}</span><span>🏷 {booking.provider}</span><span>Payment: {booking.paymentStatus}</span></div><div className="travel-booking-amount">{money(booking.amountPaise)}</div>{booking.status === 'cancelled' && <div className="travel-booking-refund">Refund: <strong>{booking.refundStatus}</strong> · {money(booking.refundAmountPaise)} · {booking.refundPercentage || 0}% {booking.razorpayRefundId ? `· ${booking.razorpayRefundId}` : ''}</div>}<div className="travel-actions"><button onClick={() => pdf(booking, 'invoice')}>↓ Invoice PDF</button>{booking.status === 'confirmed' && <button onClick={() => pdf(booking, 'ticket')}>↓ Demo ticket PDF</button>}{booking.status === 'cancelled' && <button onClick={() => pdf(booking, 'cancellation')}>↓ Cancellation receipt</button>}{booking.status === 'pending' && booking.paymentStatus !== 'paid' && <button disabled={!!busy} onClick={() => action(booking, 'pay')}>Pay now</button>}{booking.status !== 'cancelled' && <button className="danger" disabled={!!busy} onClick={() => action(booking, 'cancel')}>Cancel booking</button>}{booking.razorpayRefundId && booking.refundStatus !== 'processed' && <button disabled={!!busy} onClick={() => action(booking, 'refund')}>Check refund status</button>}</div></article>)}</div></section><div className="travel-footer-link"><Link to="/flights">Explore more journeys →</Link></div></div></main>;
}
