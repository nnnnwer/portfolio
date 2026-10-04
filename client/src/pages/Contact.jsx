import ContactDetails from '../components/ContactDetails';
import ContactForm from '../components/ContactForm';
import Container from '../components/Container';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useProfile } from '../hooks/useProfile';

export default function Contact() {
  const { data: profile, loading, error, slow, retry } = useProfile();

  useDocumentMeta({
    title: 'Contact',
    description: 'Send a message about roles, projects or collaboration.',
  });

  return (
    <>
      <PageHeader
        title="Contact"
        description="Hiring for a junior developer role, or want to talk about a project? Send a message and I'll reply by email."
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Other ways to reach me</h2>
          {loading && !profile && <LoadingState label="Loading contact details" slow={slow} className="py-4" />}
          {error && <ErrorState title="Couldn't load contact details" error={error} onRetry={retry} />}
          {profile && <ContactDetails profile={profile} />}
        </div>

        <section aria-labelledby="form-heading" className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h2 id="form-heading" className="mb-6 text-xl font-semibold">
            Send a message
          </h2>
          <ContactForm />
        </section>
      </Container>
    </>
  );
}
