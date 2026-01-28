1.  line 20 - any type used - should be specific WalletBalance type

    const getPriority = (blockchain: any): number => {

2.  line 43 - lhsPriority not defined - should be balancePriority

3.  line 44 - incorrect logic - should be balance.amount > 0

    const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);

          if (lhsPriority > -99) {
             if (balance.amount <= 0) {
               return true;
             }
          }
          return false
        })

4.  line 56 - no fallback return / default return value

5.  line 60 - prices not used in this useMemo - should be only balances

6.  line 64 - formattedBalances unused - mapping logic missing

7.  line 64 - sortedBalances should have null checking like this - (sortedBalances | []).map

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
    ...balance,
    formatted: balance.amount.toFixed()
    }
    })

8.  line 72 - sortedBalances should have null checking like this - (sortedBalances | []).map

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
