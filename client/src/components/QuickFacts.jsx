import PlaceholderText from './PlaceholderText';

/** Short definition list of key facts drawn from the profile. */
export default function QuickFacts({ profile, className = '' }) {
  const facts = [
    { label: 'Age', value: profile?.age != null ? `${profile.age}` : null, fallback: 'Age not added' },
    { label: 'Education', value: profile?.title, fallback: 'Education not added' },
    { label: 'Focus', value: profile?.headline, fallback: 'Focus not added' },
    { label: 'Based in', value: profile?.location, fallback: 'Location not added yet' },
  ];

  return (
    <dl className={`grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 ${className}`}>
      {facts.map((fact) => (
        <div key={fact.label} className="border-t border-line pt-3">
          <dt className="text-sm text-muted">{fact.label}</dt>
          <dd className="mt-1 font-medium">
            <PlaceholderText value={fact.value} fallback={fact.fallback} inline />
          </dd>
        </div>
      ))}
    </dl>
  );
}
