import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DataPoint {
  time: string;
  price: number;
}

export function SPTracker() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [changePercent, setChangePercent] = useState<number>(0);

  // Simulate S&P 500 data (in production, you'd fetch from a real API)
  useEffect(() => {
    // Initialize with base price around 4,500
    const basePrice = 4500;
    const now = new Date();
    
    // Generate initial historical data (last 30 points)
    const initialData: DataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const randomChange = (Math.random() - 0.5) * 20;
      const price = basePrice + randomChange + (Math.random() - 0.5) * 10;
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        price: Math.round(price * 100) / 100,
      });
    }
    
    setData(initialData);
    setCurrentPrice(initialData[initialData.length - 1].price);

    // Update every 5 seconds with new data
    const interval = setInterval(() => {
      const now = new Date();
      
      setData(prev => {
        const lastPrice = prev.length > 0 ? prev[prev.length - 1].price : basePrice;
        
        // Simulate realistic price movement
        const volatility = 0.0005; // 0.05% volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility * lastPrice;
        const newPrice = Math.round((lastPrice + randomChange) * 100) / 100;
        
        const newPoint: DataPoint = {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice,
        };

        const updated = [...prev, newPoint];
        // Keep only last 30 points
        if (updated.length > 30) {
          updated.shift();
        }
        
        // Update current price and calculate change
        setCurrentPrice(newPrice);
        
        if (updated.length > 0) {
          const firstPrice = updated[0].price;
          const priceChange = newPrice - firstPrice;
          const percentChange = (priceChange / firstPrice) * 100;
          setChange(priceChange);
          setChangePercent(percentChange);
        }
        
        return updated;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  const chartConfig = {
    price: {
      label: "S&P 500",
      color: change >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
    },
  };

  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">S&P 500 Live</CardTitle>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold tabular-nums">
          ${currentPrice.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <div className="text-xs text-muted-foreground text-center mt-2">
          Updates every 5 seconds • Last 30 minutes
        </div>
      </CardContent>
    </Card>
  );
}
