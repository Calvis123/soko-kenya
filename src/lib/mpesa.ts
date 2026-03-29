import { formatPhoneForMpesa } from "@/lib/utils";

type MpesaRequest = {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
};

export async function initiateStkPush(payload: MpesaRequest) {
  const shortcode = process.env.MPESA_SHORTCODE ?? "174379";

  return {
    merchantRequestId: `mock-merchant-${Date.now()}`,
    checkoutRequestId: `ws_CO_${Date.now()}`,
    responseCode: "0",
    responseDescription: "Mock STK push queued",
    customerMessage: `STK push prepared for ${formatPhoneForMpesa(payload.phoneNumber)} using shortcode ${shortcode}`,
  };
}
