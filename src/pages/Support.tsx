import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Upload, Send, Check, AlertCircle } from 'lucide-react';
import { useSupportRequests } from '@/hooks/useData';
import toast from 'react-hot-toast';

const AMOUNTS = ['₹10', '₹20', '₹50', '₹100', '₹200', '₹500'];

const Support: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submitRequest } = useSupportRequests();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed.');
      return;
    }
    setQrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setQrPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim()) {
      toast.error('Please enter an amount');
      return;
    }
    setSubmitting(true);
    try {
      // In production with Firebase: upload QR image and submit
      // For now, simulate submission
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
      toast.success('Request submitted! Payment happens externally.');
    } catch {
      toast.error('Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-container py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="p-6 rounded-full mb-6" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <Check size={48} style={{ color: '#10b981' }} />
          </div>
          <h1 className="section-title">Request Sent!</h1>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Your support request has been submitted. You'll receive payment details to complete the transfer externally.
          </p>
          <button onClick={() => { setSubmitted(false); setAmount(''); setMessage(''); setQrFile(null); setQrPreview(''); }} className="btn-secondary">
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">Support Jay</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Heart size={28} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Request a Payment</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Fill in the details below to submit a support/payment request. Payment happens outside the app.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. ₹100"
                className="input-field"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {AMOUNTS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: amount === a ? 'var(--color-accent)' : 'var(--color-surface-2)',
                      color: amount === a ? 'white' : 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Your QR Code (optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-xl border-2 border-dashed transition-all"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}
              >
                {qrPreview ? (
                  <img src={qrPreview} alt="QR Preview" className="w-32 h-32 object-contain mx-auto rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <Upload size={32} />
                    <p className="text-sm">Upload your QR image</p>
                  </div>
                )}
              </button>
              {qrFile && (
                <button
                  type="button"
                  onClick={() => { setQrFile(null); setQrPreview(''); }}
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
              Payment is handled externally. This form is for requesting payment details only.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Support;