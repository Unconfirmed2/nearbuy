import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  role: 'admin' | 'merchant' | 'super_merchant' | 'store_user';
  storeIds: string[];
  inviterName: string;
  companyName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const { email, role, storeIds, inviterName, companyName }: InvitationRequest = await req.json();

    // Generate invitation token
    const { data: tokenData, error: tokenError } = await supabase.rpc('generate_invitation_token');
    
    if (tokenError) {
      throw new Error("Failed to generate invitation token");
    }

    const token = tokenData;

    // Create invitation record
    const { error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email,
        role,
        invited_by: user.id,
        merchant_id: user.id,
        store_ids: storeIds,
        token
      });

    if (inviteError) {
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    // Prepare email content
    const inviteUrl = `${supabaseUrl.replace('/rest/v1', '')}/merchant/accept-invitation?token=${token}`;
    
    let roleDescription = '';
    switch (role) {
      case 'admin':
        roleDescription = 'Administrator - Full system access';
        break;
      case 'super_merchant':
        roleDescription = 'Super Merchant - Access to all stores';
        break;
      case 'store_user':
        roleDescription = 'Store User - Access to specific stores';
        break;
      default:
        roleDescription = 'Merchant User';
    }

    const subject = `You've been invited to join ${companyName || 'our platform'}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Invitation to Join</h1>
        <p>Hello,</p>
        <p><strong>${inviterName}</strong> has invited you to join ${companyName || 'their organization'} as a <strong>${roleDescription}</strong>.</p>
        
        ${storeIds.length > 0 ? `
          <p>You will have access to the following store(s):</p>
          <ul>
            ${storeIds.map(id => `<li>Store ID: ${id}</li>`).join('')}
          </ul>
        ` : ''}
        
        <div style="margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        
        <p><small>This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.</small></p>
        <p><small>If the button doesn't work, copy and paste this link: ${inviteUrl}</small></p>
      </div>
    `;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Invitations <invitations@resend.dev>",
      to: [email],
      subject,
      html: htmlContent,
    });

    // Log email
    await supabase
      .from('email_logs')
      .insert({
        email_type: 'invitation',
        recipient_email: email,
        subject,
        status: emailResponse.error ? 'failed' : 'sent',
        error_message: emailResponse.error?.message,
        sent_at: emailResponse.error ? null : new Date().toISOString()
      });

    if (emailResponse.error) {
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        inviteUrl // Include for testing
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);