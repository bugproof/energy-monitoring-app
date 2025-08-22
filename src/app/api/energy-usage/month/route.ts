import { randomNumber } from '@/lib/utils';
import { TZDate } from '@date-fns/tz';
import { NextResponse } from 'next/server';

export async function GET() {
  // Get current date in Polish timezone
  const today = TZDate.tz("Europe/Warsaw");
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();

  const data = [];

  for (let day = 1; day <= currentDay; day++) {
    const timestamp = new TZDate(year, month, day, 12, 0, 0, "Europe/Warsaw"); // Set to noon for each day
    const consumption = randomNumber(8, 35); // Random consumption between 8-35 kWh per day
    const price = randomNumber(1.11, 1.21); // Random price between 1.11-1.21 PLN/kWh

    data.push({
      timestamp: timestamp.toISOString(),
      consumption: Number(consumption.toFixed(2)),
      price: Number(price.toFixed(2))
    });
  }

  return NextResponse.json(data);
}