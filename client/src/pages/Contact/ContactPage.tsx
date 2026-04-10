import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formState, setFormState] = useState<FormState>('idle');

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = t('contact.errors.nameRequired');
    if (!email.trim()) next.email = t('contact.errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('contact.errors.emailInvalid');
    if (!message.trim()) next.message = t('contact.errors.messageRequired');
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setFormState('submitting');
    await new Promise((res) => setTimeout(res, 800));
    setFormState('success');
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white focus:border-primary-500'
    }`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{t('contact.title')}</h1>
        <p className="mt-2 text-gray-500">{t('contact.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-green-200 bg-green-50 px-8 py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{t('contact.successTitle')}</h2>
            <p className="mt-2 text-gray-500">{t('contact.successMessage')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('contact.form.name')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={formState === 'submitting'}
                placeholder={t('contact.form.namePlaceholder')}
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('contact.form.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={formState === 'submitting'}
                placeholder={t('contact.form.emailPlaceholder')}
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={formState === 'submitting'}
                placeholder={t('contact.form.messagePlaceholder')}
                className={`${inputClass(errors.message)} resize-none`}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
            </div>

            {formState === 'error' && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {t('contact.errors.submitFailed')}
              </p>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {formState === 'submitting' ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {t('contact.form.sending')}
                </>
              ) : (
                t('contact.form.send')
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
