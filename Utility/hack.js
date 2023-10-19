/** @param {NS} ns */

//Automates the management process of hacking a server.

export async function main(ns) {
    var server = ns.args[0];
    var securityThresh = ns.getServerMinSecurityLevel(server) + 5;
    var moneyThresh = ns.getServerMaxMoney(server)*0.75;
    
    
      while(true){
        if (ns.getServerSecurityLevel(server) > securityThresh) {
                await ns.weaken(server);
            } else if (ns.getServerMoneyAvailable(server) < moneyThresh) {
                await ns.grow(server);
            } else {
                await ns.hack(server);
            }
      }
    }
    
    