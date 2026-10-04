import { FolderGit2, Globe, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { hasRealValue } from '../utils/placeholder';
import PlaceholderText from './PlaceholderText';

/** Lists how to reach Owen. Missing values show as marked placeholders. */
export default function ContactDetails({ profile }) {
  const rows = [
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email,
      href: hasRealValue(profile?.email) ? `mailto:${profile.email}` : null,
      fallback: 'Email address not added yet',
    },
    { icon: MapPin, label: 'Location', value: profile?.location, fallback: 'Location not added yet' },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone,
      href: hasRealValue(profile?.phone) ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : null,
      fallback: 'Phone number not added yet',
    },
    {
      icon: UserRound,
      label: 'LinkedIn',
      value: profile?.linkedin_url,
      href: profile?.linkedin_url,
      fallback: 'LinkedIn profile not added yet',
    },
    {
      icon: FolderGit2,
      label: 'GitHub',
      value: profile?.github_url,
      href: profile?.github_url,
      fallback: 'GitHub profile not added yet',
    },
    ...(profile?.website_url
      ? [{ icon: Globe, label: 'Website', value: profile.website_url, href: profile.website_url }]
      : []),
  ];

  const display = (value) => value?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <ul className="divide-y divide-line border-y border-line">
      {rows.map(({ icon: Icon, label, value, href, fallback }) => (
        <li key={label} className="flex items-start gap-4 py-4">
          <Icon className="mt-1 size-[1.1rem] shrink-0 text-copper" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm text-muted">{label}</p>
            {href ? (
              <a
                href={href}
                className="font-medium break-words hover:text-copper"
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {display(value)}
              </a>
            ) : (
              <PlaceholderText value={value} fallback={fallback} inline className="font-medium" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
