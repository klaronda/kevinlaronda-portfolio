import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { contactData } = await req.json()

    // Initialize Resend client
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not found')
    }

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #111 0%, #333 100%); padding: 32px 24px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <div style="background: #ffffff; border-radius: 12px; padding: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: inline-flex; align-items: center; gap: 12px;">
                <img src="https://via.placeholder.com/32x32/111/ffffff?text=KL" alt="Kevin Laronda Logo" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px;" />
                <div style="text-align: left;">
                  <div style="color: #111; font-size: 18px; font-weight: 600; line-height: 1; margin: 0;">Kevin Laronda</div>
                  <div style="color: #666; font-size: 12px; line-height: 1; margin: 0; margin-top: 2px;">UX Design Strategist</div>
                </div>
              </div>
            </div>
            <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
            <p style="color: #999; margin: 0; font-size: 16px;">Someone has reached out through your portfolio</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            
            <!-- Contact Information -->
            <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #111;">
              <h2 style="color: #111; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Contact Information</h2>
              
              <div style="display: flex; margin-bottom: 16px;">
                <div style="width: 100px; color: #666; font-weight: 500; font-size: 14px;">Name:</div>
                <div style="color: #111; font-weight: 500;">${contactData.first_name} ${contactData.last_name}</div>
              </div>
              
              ${contactData.business ? `
              <div style="display: flex; margin-bottom: 16px;">
                <div style="width: 100px; color: #666; font-weight: 500; font-size: 14px;">Business:</div>
                <div style="color: #111; font-weight: 500;">${contactData.business}</div>
              </div>
              ` : ''}
              
              <div style="display: flex; margin-bottom: 16px;">
                <div style="width: 100px; color: #666; font-weight: 500; font-size: 14px;">Email:</div>
                <div><a href="mailto:${contactData.email}" style="color: #111; text-decoration: none; font-weight: 500; border-bottom: 1px solid #111;">${contactData.email}</a></div>
              </div>
              
              ${contactData.phone ? `
              <div style="display: flex; margin-bottom: 16px;">
                <div style="width: 100px; color: #666; font-weight: 500; font-size: 14px;">Phone:</div>
                <div><a href="tel:${contactData.phone}" style="color: #111; text-decoration: none; font-weight: 500; border-bottom: 1px solid #111;">${contactData.phone}</a></div>
              </div>
              ` : ''}
            </div>
            
            <!-- Message -->
            <div style="background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h2 style="color: #111; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Message</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 3px solid #111; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #333;">${contactData.message}</div>
            </div>
            
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px 24px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
              <strong>Kevin Laronda</strong> • UX Design Strategist
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              This message was sent from your portfolio contact form on ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kevin Laronda <onboarding@resend.dev>',
        to: ['klaronda@gmail.com'],
        subject: `New inquiry from ${contactData.first_name} ${contactData.last_name}${contactData.business ? ` at ${contactData.business}` : ''}`,
        html: emailHtml,
        reply_to: contactData.email,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorData}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResult.id,
        message: 'Email sent successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
