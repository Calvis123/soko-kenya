import { NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    amount: number;
    phoneNumber: string;
    accountReference: string;
    transactionDesc: string;
  };

  const response = await initiateStkPush(body);
  return NextResponse.json(response);
}
