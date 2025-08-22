import { NextResponse } from 'next/server';
import { TZDate } from "@date-fns/tz";

export async function GET() {
  // Get current date in Polish timezone
  const now = TZDate.tz("Europe/Warsaw");
  const data = [];

  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, "Europe/Warsaw");
    const consumption = Math.random() * 2 + 0.5; // Random consumption between 0.5-2.5 kWh
    const price = Math.random() * 0.2 + 0.6; // Random price between 0.6-0.8 PLN/kWh

    data.push({
      timestamp: timestamp.toISOString(),
      consumption: Number(consumption.toFixed(2)),
      price: Number(price.toFixed(2))
    });
  }

  return NextResponse.json(data);
}