
// @ts-ignore: Deno-specific import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Deno-specific global
const MOLLIE_API_KEY = Deno.env.get('MOLLIE_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, description, redirectUrl, metadata } = await req.json()

    if (!MOLLIE_API_KEY) {
      throw new Error('MOLLIE_API_KEY is not set')
    }

    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: {
          currency: 'EUR',
          value: amount.toFixed(2),
        },
        description,
        redirectUrl,
        metadata,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create Mollie payment')
    }

    return new Response(
      JSON.stringify({ checkoutUrl: data._links.checkout.href, paymentId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
