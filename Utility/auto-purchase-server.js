//A script to auto purchase a server and upgrade them

export async function main(ns) {

    var target = ns.args[0];
    var homeServ = "home";
    var pRam = 8;
    var servPrefix = "pserv-";

    var maxRam = ns.getPurchasedServerMaxRam();
    var maxServers = ns.getPurchasedServerLimit();

    var virus = "hack.js";
    var virusRam = ns.getScriptRam(virus);

    function canPurchaseServer() {
        return ns.getServerMoneyAvailable(homeServ) > ns.getPurchasedServerCost(pRam);
    }

    function killVirus(server) {
        if (ns.scriptRunning(virus, server)) {
            ns.scriptKill(virus, server);
        }
    }

    async function copyAndRunVirus(server) {
        ns.print("Copying and running virus on " + server);
        await ns.scp(virus, server);
        killVirus(server);
        var maxThreads = Math.floor(pRam / virusRam);
        ns.exec(virus, server, maxThreads, target);
    }
    
    function shutdownServer(server) {
        killVirus(server);
        ns.deleteServer(server);
    }

    async function upgradeServer(server) {
        var sRam = ns.getServerMaxRam(server);
        if (sRam < pRam) {
            while(!canPurchaseServer()) {
                await ns.sleep(10000);
            }
            shutdownServer(server);
            ns.purchaseServer(server, pRam);
        }
        await copyAndRunVirus(server);
    }

    async function autoUpgradeServers() {
        var i = 0;
        while(i < maxServers) {
            var server = servPrefix + i;
            if (ns.serverExists(server)) {
                ns.print ("Upgrading server " + server + " to " + pRam + "GB");
                await upgradeServer(server);
                ++i;
            } else if (canPurchaseServer()) {
                ns.print ("Purchasing server " + server + " with " + pRam + "GB");
                ns.purchaseServer(server, pRam);
                await copyAndRunVirus(server);
                ++i;
            }
        }
    }

    while(true) {
        await autoUpgradeServers();
        if (pRam === maxRam) {
            break;
        }
        // move up to next tier
        var newRam = pRam * 2;
        if (newRam > maxRam) {
            newRam = maxRam;
        } else {
            pRam = newRam;
        }
    }
}
