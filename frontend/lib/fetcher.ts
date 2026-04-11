/**
 * SWR global fetcher.
 * Throws on non-2xx responses so SWR's error state is populated correctly.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`API ${res.status}: ${res.statusText}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}
