import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time exchange rates from ExchangeRate-API
  const fetchExchangeRates = useCallback(async (baseCurrency: string) => {
    setIsLoading(true);
    try {
      // Note: In a production app, you should use a backend service to securely store and manage API keys
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/${baseCurrency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      if (data.result === 'error') {
        throw new Error(data['error-type'] || 'Unknown error');
      }
      
      // In case of API limit reached, fallback to mock data
      if (data.result === 'error' && data['error-type'] === 'invalid-key') {
        console.warn('Using mock data due to API key limitation');
        return getMockRates(baseCurrency);
      }
      
      return data.conversion_rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      toast.error('Failed to fetch real-time rates. Using mock data.');
      return getMockRates(baseCurrency);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock rates for development
  const getMockRates = (baseCurrency: string) => {
    const baseRates: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.25,
      AED: 3.67,
      SGD: 1.35,
      MYR: 4.69,
    };
    
    const rates: Record<string, number> = {};
    const baseRate = baseRates[baseCurrency] || 1;
    
    Object.entries(baseRates).forEach(([currency, rate]) => {
      rates[currency] = rate / baseRate;
    });
    
    return rates;
  };

  // Fetch exchange rates when component mounts or base currency changes
  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchExchangeRates(fromCurrency);
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleTimeString());
    };
    
    fetchRates();
    
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fromCurrency, fetchExchangeRates]);
  
  // Calculate conversion when rates or inputs change
  useEffect(() => {
    if (exchangeRates && fromCurrency && toCurrency) {
      const rate = exchangeRates[toCurrency] || 1;
      setConvertedAmount(amount * rate);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const rates = await fetchExchangeRates(fromCurrency);
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleTimeString());
      toast.success('Exchange rates updated');
    } catch (error) {
      toast.error('Failed to refresh rates');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);
  const currentRate = exchangeRates ? exchangeRates[toCurrency] || 1 : 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Currency Converter</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            Last updated: {lastUpdated}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="pl-3 pr-24 py-6 text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{fromCurrencyData?.code}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2 flex justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handleSwap}
              disabled={isLoading}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="col-span-5">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">
            {amount.toLocaleString()} {fromCurrency} =
          </div>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              `${(convertedAmount || 0).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} ${toCurrency}`
            )}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            1 {fromCurrency} = {currentRate.toFixed(6)} {toCurrency}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            1 {toCurrency} = {(1 / currentRate).toFixed(6)} {fromCurrency}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
