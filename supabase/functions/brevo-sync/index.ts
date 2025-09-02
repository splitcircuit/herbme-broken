import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

interface SubscriberPayload {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  source?: string | null;
  tags?: string[] | null;
}

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const BREVO_LIST_ID = Deno.env.get("BREVO_LIST_ID")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function unauthorized(msg = "Unauthorized") {
  return new Response(JSON.stringify({ error: msg }), { 
    status: 401, 
    headers: { "content-type": "application/json", ...corsHeaders } 
  });
}

function badRequest(msg: string) {
  return new Response(JSON.stringify({ error: msg }), { 
    status: 400, 
    headers: { "content-type": "application/json", ...corsHeaders } 
  });
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  // Auth via header
  const sig = req.headers.get("x-webhook-secret") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!sig || sig !== WEBHOOK_SECRET) {
    console.error("Unauthorized request:", { sig, expected: WEBHOOK_SECRET });
    return unauthorized();
  }

  let body: any;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid JSON body:", error);
    return badRequest("Invalid JSON body");
  }

  console.log("Received payload:", body);

  // Handle both direct API calls and Supabase DB webhook payloads
  const sub: SubscriberPayload | undefined =
    body?.record // Supabase DB webhook format
      ? {
          email: body.record.email,
          first_name: body.record.first_name ?? undefined,
          last_name: body.record.last_name ?? undefined,
          source: body.record.source ?? undefined,
          tags: body.record.tags ?? undefined,
        }
      : {
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
          source: body.source,
          tags: body.tags,
        };

  if (!sub || !sub.email) {
    console.error("Missing subscriber email:", sub);
    return badRequest("Missing subscriber email");
  }

  // Build Brevo payload
  const brevoPayload = {
    email: sub.email,
    listIds: [Number(BREVO_LIST_ID)],
    updateEnabled: true, // upsert behavior
    attributes: {
      FIRSTNAME: sub.first_name ?? "",
      LASTNAME: sub.last_name ?? "",
      SOURCE: sub.source ?? "HerbMe Site",
    },
  } as Record<string, unknown>;

  // Map tags to custom attribute
  if (sub.tags && Array.isArray(sub.tags) && sub.tags.length > 0) {
    (brevoPayload.attributes as any).TAGS = sub.tags.join(',');
  }

  console.log("Sending to Brevo:", brevoPayload);

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "accept": "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(brevoPayload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Brevo error:", res.status, data);
      return new Response(JSON.stringify({ ok: false, status: res.status, data }), {
        status: 502,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }

    console.log("Brevo success:", data);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Network/Unexpected error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);