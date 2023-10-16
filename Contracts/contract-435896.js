```Given the following string containing only digits, return an array with all possible valid IP address combinations that can be created from the string:

20424725075

Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is not a valid IP.

Examples:

25525511135 -> ["255.255.11.135", "255.255.111.35"]
1938718066 -> ["193.87.180.66"]```

function ipCombinations(address){
    let result = [];
    let n = address.length;
    if (n < 4 || n > 12) {
        return result;
    }
    let dfs = (index, path) => {
        if (index === n) {
            if (path.length === 4) {
                result.push(path.join('.'));
            }
            return;
        }
        if (path.length > 4) {
            return;
        }
        for (let i = index; i < n; i++) {
            let str = address.substring(index, i + 1);
            if (str.length > 1 && str[0] === '0') {
                return;
            }
            if (parseInt(str) > 255) {
                return;
            }
            path.push(str);
            dfs(i + 1, path);
            path.pop();
        }
    };
    dfs(0, []);
    return result;
}

export async function main(ns) {
    let address = await ns.prompt('IP Address Combinations Function, What is the number?',  { type: "text" });
    let result = [];
    result = ipCombinations(address);
    ns.tprint(result);
}

