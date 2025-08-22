"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface EnergyData {
  timestamp: string;
  consumption: number;
  price: number;
}

interface EnergyDataPoint extends EnergyData { }

const chartConfig = {
  consumption: {
    label: "Energy Consumption (kWh)",
    color: "var(--chart-2)",
  },
};

interface EnergyDataTooltipProps {
  data: EnergyDataPoint;
  label: string;
}

function EnergyDataTooltip({ data, label }: EnergyDataTooltipProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-orange-500">Zużycie: {data.consumption.toFixed(1)} kWh</p>
      <p className="text-muted-foreground">Cena: {data.price.toFixed(2)} PLN/kWh</p>
      <p className="text-muted-foreground">
        Koszt: {(data.consumption * data.price).toFixed(2)} PLN
      </p>
    </div>
  );
}

export default function EnergyMonitor() {
  const [activeTab, setActiveTab] = useState('day');
  const [data, setData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (type: 'day' | 'month') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/energy-usage/${type}`);
      const result = await response.json<EnergyData[]>();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab as 'day' | 'month');
  }, [activeTab]);

  const formatXAxisLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    if (activeTab === 'day') {
      return date.toLocaleTimeString('pl', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      return date.toLocaleDateString('pl', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const chartData = data.map(item => ({
    ...item,
    label: formatXAxisLabel(item.timestamp)
  }));

  const totalConsumption = data.reduce((sum, item) => sum + item.consumption, 0);
  const averagePrice = data.length > 0 ? data.reduce((sum, item) => sum + item.price, 0) / data.length : 0;
  const totalCost = data.reduce((sum, item) => sum + (item.consumption * item.price), 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Monitor Zużycia Energii</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Całkowite Zużycie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsumption.toFixed(2)} kWh</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Średnia Cena</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePrice.toFixed(2)} PLN/kWh</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Całkowity Koszt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost.toFixed(2)} PLN</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="day">Dzień</TabsTrigger>
          <TabsTrigger value="month">Miesiąc</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Godzinowe Zużycie Energii</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    Ładowanie...
                  </div>
                ) : (
                  <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                      />
                      <YAxis
                        label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as EnergyDataPoint
                            return <EnergyDataTooltip data={data} label={label} />
                          }
                          return null
                        }}
                      />
                      <Bar
                        dataKey="consumption"
                        fill="var(--color-consumption)"
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dzienne Zużycie Energii</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    Ładowanie...
                  </div>
                ) : (
                  <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                      />
                      <YAxis
                        label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as EnergyDataPoint
                            return <EnergyDataTooltip data={data} label={label} />
                          }
                          return null
                        }}
                      />
                      <Bar
                        dataKey="consumption"
                        fill="var(--color-consumption)"
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}