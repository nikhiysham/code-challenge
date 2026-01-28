import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";

interface Price {
  currency: string;
  price: number;
}

function App() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const response = await axios.get(
          "https://interview.switcheo.com/prices.json",
        );
        // Filter out currencies without prices and remove duplicates
        const priceMap = new Map<string, Price>();
        response.data.forEach((item: Price) => {
          if (item.price && !priceMap.has(item.currency)) {
            priceMap.set(item.currency, item);
          }
        });
        const uniquePrices = Array.from(priceMap.values());

        setPrices(uniquePrices);

        console.log("uniquePrices:", uniquePrices);
        if (uniquePrices.length > 0) {
          setFromCurrency(uniquePrices[0].currency);
          setToCurrency(uniquePrices[1]?.currency || uniquePrices[0].currency);
        }
      } catch (err) {
        setError("Failed to fetch prices");
      } finally {
        setIsLoading(false);
      }
    };
    getPrices();
  }, []);

  const calculateToAmount = (
    fromAmt: string,
    fromCurr: string,
    toCurr: string,
  ) => {
    if (!fromAmt || !fromCurr || !toCurr || fromCurr === toCurr) return "";

    const fromPrice = prices.find((p) => p.currency === fromCurr)?.price;
    const toPrice = prices.find((p) => p.currency === toCurr)?.price;
    if (!fromPrice || !toPrice) return "";

    const rate = toPrice / fromPrice;
    return (parseFloat(fromAmt) * rate).toFixed(2);
  };

  const fromAmountOnChanged = (val: string) => {
    setFromAmount(val);
    setToAmount(calculateToAmount(val, fromCurrency, toCurrency));
    setError("");
  };

  const fromCurrencyOnChanged = (val: string) => {
    setFromCurrency(val);
    setToAmount(calculateToAmount(fromAmount, val, toCurrency));
  };

  const toCurrencyOnChanged = (val: string) => {
    setToCurrency(val);
    setToAmount(calculateToAmount(fromAmount, fromCurrency, val));
  };

  const swapCurrency = () => {
    const curr = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(curr);
    const amt = fromAmount;
    setFromAmount(toAmount);
    setToAmount(amt);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Currency Swapper (For Test)
        </h1>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading rates...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Currency (From)
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative flex items-center gap-2 bg-gray-50 border border-gray-300 p-3">
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency}.svg`}
                    alt={fromCurrency}
                    className="w-6 h-6"
                    onLoad={(e) => (e.currentTarget.style.display = "block")}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => fromCurrencyOnChanged(e.target.value)}
                    className="w-full bg-transparent  text-gray-900"
                  >
                    {prices.map((p) => (
                      <option key={p.currency} value={p.currency}>
                        {p.currency}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => fromAmountOnChanged(e.target.value)}
                  placeholder="0.00"
                  className="w-1/2 bg-white border border-gray-300 text-gray-900 p-3"
                  step="any"
                />
              </div>
            </div>

            <div className="flex justify-center -my-2">
              <button
                type="button"
                onClick={swapCurrency}
                className="bg-blue-600 text-white p-3 rounded-full"
              >
                <ArrowUpDown size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Currency (To)
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative flex items-center gap-2 bg-gray-50 border border-gray-300  p-3">
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${toCurrency}.svg`}
                    alt={toCurrency}
                    className="w-6 h-6"
                    onLoad={(e) => (e.currentTarget.style.display = "block")}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) => toCurrencyOnChanged(e.target.value)}
                    className="w-full bg-transparent  text-gray-900"
                  >
                    {prices.map((p) => (
                      <option key={p.currency} value={p.currency}>
                        {p.currency}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0.00"
                  className="w-1/2 bg-gray-100 border border-gray-300 text-gray-500 p-3"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            {toAmount && fromAmount && (
              <div className="bg-blue-50 p-4 text-center rounded-lg">
                <p className="text-xs  font-medium mb-2">
                  Rate: 1 {fromCurrency} ={" "}
                  {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(2)}{" "}
                  {toCurrency}
                </p>
                {fromAmount}{" "}
                <span className="bg-yellow-50 px-2">{fromCurrency}</span> to{" "}
                {toAmount}{" "}
                <span className="bg-yellow-50 px-2">{toCurrency}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
