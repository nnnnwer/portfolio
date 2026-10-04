import { CircleCheck, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CONTACT_LIMITS } from '../constants/contact';
import { sendContactMessage } from '../services/contactService';
import { validateContact } from '../utils/validateContact';
import Button from './Button';
import ErrorState from './ErrorState';
import FormField from './FormField';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };
const SLOW_AFTER_MS = 5000;

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null);
  const [slow, setSlow] = useState(false);
  const successRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const update = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (touched[field]) setErrors(validateContact(next));
  };

  const markTouched = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateContact(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(found).length > 0) {
      const firstInvalid = ['name', 'email', 'subject', 'message'].find((f) => found[f]);
      formRef.current?.querySelector(`#${firstInvalid}`)?.focus();
      return;
    }

    setStatus('submitting');
    setSubmitError(null);
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    try {
      await sendContactMessage(values);
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
    } catch (error) {
      if (error?.details) setErrors(error.details);
      setSubmitError(error);
      setStatus('error');
    } finally {
      clearTimeout(slowTimer);
    }
  };

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rise-in rounded-xl border border-success/40 bg-surface p-8 focus:outline-none"
      >
        <CircleCheck className="size-8 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold">Message sent</h2>
        <p className="mt-2 max-w-[48ch] text-muted">
          Thanks for getting in touch. Your message has been delivered and I'll reply to the email address you
          provided.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const visibleError = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={submitting}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          onBlur={markTouched('name')}
          error={visibleError('name')}
          maxLength={CONTACT_LIMITS.name.max}
          required
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={update('email')}
          onBlur={markTouched('email')}
          error={visibleError('email')}
          maxLength={CONTACT_LIMITS.email.max}
          required
        />
      </div>

      <FormField
        id="subject"
        label="Subject"
        value={values.subject}
        onChange={update('subject')}
        onBlur={markTouched('subject')}
        error={visibleError('subject')}
        maxLength={CONTACT_LIMITS.subject.max}
        required
      />

      <FormField
        id="message"
        label="Message"
        as="textarea"
        rows={7}
        value={values.message}
        onChange={update('message')}
        onBlur={markTouched('message')}
        error={visibleError('message')}
        hint={`${values.message.length} / ${CONTACT_LIMITS.message.max}`}
        maxLength={CONTACT_LIMITS.message.max}
        required
      />

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update('website')}
        />
      </div>

      {status === 'error' && submitError && (
        <ErrorState title="Your message wasn't sent" error={submitError} />
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" icon={Send} disabled={submitting}>
          {submitting ? 'Sending message…' : 'Send message'}
        </Button>
        {submitting && slow && (
          <p role="status" className="text-sm text-muted">
            The server is starting up. This can take up to a minute.
          </p>
        )}
      </div>
    </form>
  );
}
