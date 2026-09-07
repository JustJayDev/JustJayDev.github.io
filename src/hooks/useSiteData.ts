import { useCallback, useEffect, useState } from 'react';

// Free JSON storage via textdb.dev — no signup, no key.
const BLOB_URL = 'https://textdb.dev/api/data/jjdev-site-data-v1';

export interface GuestEntry {
  name: string;
  msg: string;
  date: string;
}
export interface SiteData {
  guestbook: GuestEntry[];
  visits: number;
  reactions: Record<string, number>;
}

const EMPTY: SiteData = { guestbook: [], visits: 0, reactions: {} };

function parse(text: string): SiteData {
  try {
    const json = JSON.parse(text.replace(/^value=/, ''));
    return { ...EMPTY, ...json, reactions: { ...json.reactions } };
  } catch {
    return EMPTY;
  }
}

export async function readSiteData(): Promise<SiteData> {
  const res = await fetch(BLOB_URL, { cache: 'no-store' });
  return parse(await res.text());
}

export async function writeSiteData(next: SiteData): Promise<void> {
  await fetch(BLOB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'value=' + encodeURIComponent(JSON.stringify(next)),
  });
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setData(await readSiteData());
      setFailed(false);
    } catch {
      setFailed(true);
    }
    setLoading(false);
  }, []);

  const save = useCallback(async (next: SiteData) => {
    setData(next);
    try {
      await writeSiteData(next);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, failed, refresh, save };
}

// Count one visit per browser session
let visitCounted = false;
export function countVisitOnce(onDone: (visits: number) => void) {
  if (visitCounted) return;
  visitCounted = true;
  (async () => {
    try {
      const cur = await readSiteData();
      const next = { ...cur, visits: (cur.visits || 0) + 1 };
      await writeSiteData(next);
      onDone(next.visits);
    } catch {
      /* offline — skip silently */
    }
  })();
}