const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN!;

export async function sanityMutate(mutations: Record<string, unknown>[]) {
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );

  if (!res.ok) {
    throw new Error(`Sanity mutation failed: ${res.statusText}`);
  }

  return res.json();
}

export async function sanityQuery<T = unknown>(query: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`);
  url.searchParams.set("query", query);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, `"${value}"`);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.result;
}
