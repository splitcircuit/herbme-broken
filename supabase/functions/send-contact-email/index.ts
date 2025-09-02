import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { name, email, subject, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user agent and IP for logging
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown";

    // Store message in database
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        user_agent: userAgent,
        ip_address: ipAddress,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store message" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email notifications using Brevo
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email to business owner
    const ownerEmailData = {
      sender: { name: "HerbMe Contact Form", email: "noreply@herbme.com" },
      to: [{ email: "herbmecontact@gmail.com", name: "HerbMe Team" }],
      replyTo: { email: email, name: name },
      subject: `Contact Form: ${subject}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <small>
          <p><strong>User Agent:</strong> ${userAgent}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
        </small>
      `,
    };

    // Confirmation email to user
    const userEmailData = {
      sender: { name: "HerbMe", email: "noreply@herbme.com" },
      to: [{ email: email, name: name }],
      subject: "Thank you for contacting HerbMe",
      htmlContent: `
        <h2>Thank you for reaching out, ${name}!</h2>
        <p>We've received your message and will get back to you as soon as possible.</p>
        
        <h3>Your Message Summary:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <p>We typically respond within 24-48 hours during business days.</p>
        
        <p>Best regards,<br>
        The HerbMe Team</p>
      `,
    };

    // Send both emails
    const brevoResponses = await Promise.all([
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(ownerEmailData),
      }),
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(userEmailData),
      }),
    ]);

    // Check if emails were sent successfully
    const [ownerResponse, userResponse] = brevoResponses;
    
    if (!ownerResponse.ok) {
      const ownerError = await ownerResponse.text();
      console.error("Failed to send owner email:", ownerError);
    }
    
    if (!userResponse.ok) {
      const userError = await userResponse.text();
      console.error("Failed to send user confirmation email:", userError);
    }

    // Return success even if one email fails (message is still stored)
    const emailsSuccess = ownerResponse.ok && userResponse.ok;
    
    console.log("Contact form submission processed successfully", {
      name,
      email,
      subject,
      emailsSuccess,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!",
        emailsSent: emailsSuccess 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);