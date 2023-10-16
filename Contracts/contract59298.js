```You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

5,166,118,128,52,172,77,119,145,175,178,2,98,39,43,68,15,146,159,116,25,131,177,75,193,175,144,180,164,71,170,93,192,19,171,169,108,79,35,57,77,114,179,145,182,117,40

Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0

Algorithmic Trading III```

function maxProfit(prices) {
  let n = prices.length;
  if (n < 2) {
    return 0;
  }

  let dp1 = new Array(n).fill(0);
  let dp2 = new Array(n).fill(0);

  let minPrice = prices[0];
  for (let i = 1; i < n; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    dp1[i] = Math.max(dp1[i - 1], prices[i] - minPrice);
  }

  let maxPrice = prices[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    maxPrice = Math.max(maxPrice, prices[i]);
    dp2[i] = Math.max(dp2[i + 1], maxPrice - prices[i]);
  }

  let maxProfit = 0;
  for (let i = 0; i < n; i++) {
    maxProfit = Math.max(maxProfit, dp1[i] + dp2[i]);
  }

  return maxProfit;
}




export async function main(ns) {
  ns.getScriptLogs("contract59298.js");
  let prices = [5, 166, 118, 128, 52, 172, 77, 119, 145, 175, 178, 2, 98, 39, 43, 68, 15, 146, 159, 116, 25, 131, 177, 75, 193, 175, 144, 180, 164, 71, 170, 93, 192, 19, 171, 169, 108, 79, 35, 57, 77, 114, 179, 145, 182, 117, 40];
  let profit = 0
  profit = maxProfit(prices)
  ns.tprint(profit);
}

