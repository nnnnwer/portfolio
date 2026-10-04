import Container from './Container';

export default function PageHeader({ title, description, children }) {
  return (
    <div className="border-b border-line print:hidden">
      <Container className="pt-14 pb-10 sm:pt-20 sm:pb-12">
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] font-semibold">{title}</h1>
        {description && <p className="mt-4 max-w-[60ch] text-lg text-muted">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </div>
  );
}
