// A script that utilizes DFS to find the node in the network you are looking for.

export async function main(ns) {
    var target = ns.args[0];
    var origin = ns.getHostname();

    var ignored = ["pserv"]

    function hasIgnoredString(text){
        return ignored.some(function (str){ return text.includes(str); });

    }

    //Use DFS to visit nodes in network until we find target server
    function getNetworkNodePairs() {
        var visited = {};
        var stack = [];
        stack.push(origin);
        var nodePairs = [];

        while (stack.length > 0) {
            var node = stack.pop();
            if (!visited[node]){
                if (node===target) {
                    break;
                }
                visited[node] = node;
                var neighbors = ns.scan(node);
                for (var i = 0; i < neighbors.length; i++) {
                    var child = neighbors[i];
                    if (hasIgnoredString(child) || visited[child]) {
                        continue;
                    }
                    stack.push(child);
                    var pair = {
                        parent: node,
                        current: child
                    }
                    nodePairs.push(pair);
                }
            }
        }
        return nodePairs;
    }

    function reconstructPath(nodes) {
        //for every node, map them to parent
        var parentMap = nodes.reduce(function (acc, node) {
            acc[node.current] = node.parent;
            return acc;
        }, {});

        ns.print("Target Found, reconstructing path");
        ns.print("Number of nodes in path: " + nodes.length);
        var path = [];
        var curNode = target;
        while (curNode !== origin) {
            path.push(curNode);
            ns.print("Adding server to path: " + curNode);
            var parent = parentMap[curNode];
            if (!parent) {
                break;
            }
            curNode = parent;

        }

        return path.reverse();

    }

    var nodes = getNetworkNodePairs();
    var path = reconstructPath(nodes);
    ns.tprint(path);

}