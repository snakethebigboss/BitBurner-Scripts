```
How many different distinct ways can the number 141 be written as a sum of integers contained in the set:

[2,4,9,12,13,14,17,18,20,21,22]?

You may use each integer in the set zero or more times.

Total Ways to Sum  II```


function totalWaysToSum(numbers, target) {
    let n = numbers.length;
    let dp = new Array(target + 1).fill(0);
    dp[0] = 1;
    for (let i = 0; i < n; i++) {
        for (let j = numbers[i]; j <= target; j++) {
        dp[j] += dp[j - numbers[i]];
        }
    }
    return dp[target];
    }

export async function main(ns) {
    let numbers = [2, 4, 9, 12, 13, 14, 17, 18, 20, 21, 22];
    let target = 141;
    let ways = 0;
    ways = totalWaysToSum(numbers, target);
    ns.tprint(ways);
}

