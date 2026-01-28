interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // 1) any type used - should be string 
	const getPriority = (blockchain?: string): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances?.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance?.blockchain);

		   return balancePriority > -99 && balance?.amount > 0 ? true : false;
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else {
		    return 1;
		  }
    });
  }, [balances]);

  const formattedBalances = (sortedBalances || []).map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance?.amount?.toFixed()
    }
  })

  // 7) should have null checking like this -  (sortedBalances | []).map
  const rows = (sortedBalances || []).map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedBalances}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}