import { NextResponse } from 'next/server';
import { TZDate } from "@date-fns/tz";
import { randomNumber } from '@/lib/utils';

export async function GET() {
  // Get current date in Polish timezone
  const now = TZDate.tz("Europe/Warsaw");
  const data = [];

  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, "Europe/Warsaw");
    const consumption = randomNumber(0.5, 2.5); // Random consumption between 0.5-2.5 kWh
    const price = randomNumber(1.11, 1.21); // Random price between 1.11-1.21 PLN/kWh

    data.push({
      timestamp: timestamp.toISOString(),
      consumption: Number(consumption.toFixed(2)),
      price: Number(price.toFixed(2))
    });
  }

  return NextResponse.json(data);
}