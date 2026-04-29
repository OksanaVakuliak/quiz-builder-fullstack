import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'http://localhost:3000';
const SITE_NAME = 'Quiz Builder';

type OpenGraphType = 'website' | 'article';

interface CreatePageMetadataInput {
  title: string;
  description: string;
  path: string;
  type?: OpenGraphType;
}

const normalizeSiteUrl = (rawValue: string | undefined): string => {
  if (!rawValue || rawValue.trim().length === 0) {
    return DEFAULT_SITE_URL;
  }

  const trimmed = rawValue.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, '');
};

const normalizePath = (path: string): string => {
  if (path.startsWith('/')) {
    return path;
  }

  return `/${path}`;
};

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const appMetadataBase = new URL(siteUrl);

export const createPageMetadata = ({
  title,
  description,
  path,
  type = 'website',
}: CreatePageMetadataInput): Metadata => {
  const normalizedPath = normalizePath(path);

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: normalizedPath,
      locale: 'uk_UA',
      type,
    },
  };
};
