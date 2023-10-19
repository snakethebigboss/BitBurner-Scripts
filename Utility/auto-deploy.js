//A Script to automatically deploy the hack scrip to networks.

export async function main(ns) {
    var target = ns.args[0];
    var cracks = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "relaySMTP.exe": ns.relaysmtp,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject,
    }

    var virus = "hack.js";
    var virusRam = ns.getScriptRam(virus);

    function getNumCracks(){
        return Object.keys(cracks).filter(function (file){
            return ns.fileExists(file, "home");
        }).length;
    }

    async function copyAndRunVirus(server){ // function to copy and run virus on server
        ns.print("Copying and running virus on " + server);
        await ns.scp(virus, server);

        if (!ns.hasRootAccess(server)){
            var requiredPorts = ns.getServerNumPortsRequired(server);
            if (requiredPorts > 0) {
                penetrate(server);
            }
            ns.print("Gaining root access to " + server);
            ns.nuke(server);
        }

        if (ns.scriptRunning(virus, server)){
            ns.scriptkill(virus, server);
        }

        var maxThreads = Math.floor(ns.getServerMaxRam(server) / virusRam);
        ns.exec(virus, server, maxThreads, target);
    }

    function getNetworkNodes(){ // dfs traversal to get the nodes in the network
        ns.print("Retreving all nodes in network");
        var visited = {};
        var stack = [];
        var origin = ns.getHostname();
        stack.push(origin);

        while (stack.length > 0){
            var node = stack.pop();
            if (!visited[node]){
                visited[node] = node;
                var neighbors = ns.scan(node);
                for (var i = 0; i < neighbors.length; i++){
                    var child = neighbors[i];
                    if (visited[child]) {
                        continue;
                    }
                    stack.push(child);
                }
            }
        }
        return Object.keys(visited);
    }

    function penetrate(server){ // function to penetrate a server with hack script
        ns.print ("Penetrating " + server);
        for (var file of Object.keys(cracks)){
            if (ns.fileExists(file, "home")){
                var runScript = cracks[file];
                runScript(server);
            }
        }
    }


    function canHack(server){ // checks if server can be hacked
        var numCracks = getNumCracks();
        var reqPorts = ns.getServerNumPortsRequired(server);
        var ramAvail = ns.getServerMaxRam(server);
        return numCracks >= reqPorts && ramAvail > virusRam;
    }

    function getTargetServers(){
        var networkNodes = getNetworkNodes(); //All nodes in network
        var targets = networkNodes.filter(function (node) { return canHack(node) }); //filters to ones that can hack
        // Add purchased servers
        let i = 0;
        var servPrefix = "pserv-";
        while (ns.serverExists(servPrefix + i)) {
            targets.push(servPrefix + i);
            i++;
        }
        return targets;
    }

    async function deployHacks(targets){ // function to deploy the virus to other servers
        ns.tprint("Gonna deploy virus to these servers " + targets);
        for (var serv of targets){
            await copyAndRunVirus(serv);
        }
    }

    var curTargets = [];
    var waitTime = 2000;

    while (true){
        var newTargets = getTargetServers(); //Potential Targets
        if(newTargets.length !== curTargets.length) { //if new targets found
            await deployHacks(newTargets); //deploy virus on new targets
            curTargets = newTargets; // resets curTargets
        }
        await ns.sleep(waitTime); // required to not crash game
    }
}     
