'use client';

import { useEffect } from 'react';

export function ClientExtensionCleanup() {
  useEffect(() => {
    try {
      const origSet = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (name, value) {
        if (name === 'bis_skin_checked') return;
        return origSet.apply(this, [name, value]);
      };
      document.querySelectorAll('[bis_skin_checked]').forEach((el) => {
        el.removeAttribute('bis_skin_checked');
      });
    } catch {}
  }, []);

  return null;
}

