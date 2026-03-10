import React, { useEffect, useMemo, useState } from 'react';
import { isHttpUrl, sanitizeUrl } from '../../utils/sanitizeUrl';

type Props = {
  src?: unknown;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  imgClassName?: string;
};

const LogoAvatar: React.FC<Props> = ({ src, alt, fallback, className, imgClassName }) => {
  const cleaned = useMemo(() => sanitizeUrl(src), [src]);
  const candidates = useMemo(() => {
    if (!isHttpUrl(cleaned)) return [];
    const base = cleaned.split('?')[0];
    return base && base !== cleaned ? [cleaned, base] : [cleaned];
  }, [cleaned]);

  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [cleaned]);

  const current = candidates[index];

  return (
    <div className={className}>
      {!failed && current ? (
        <img
          src={current}
          alt={alt}
          className={imgClassName || 'w-full h-full object-cover'}
          onError={() => {
            if (index + 1 < candidates.length) {
              setIndex(index + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      ) : (
        fallback
      )}
    </div>
  );
};

export default LogoAvatar;

