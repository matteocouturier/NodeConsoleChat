const express = require("express");
const socket = require("socket.io");
//Port du serveur
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`The server started on port ${PORT}`);

});
var fs = require('fs')
//récupération du fichier log
let logger = fs.createWriteStream('log/connexion.log', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

//récupération du fichier stats
let rawdata = fs.readFileSync('stats/stats.json');
let stats = JSON.parse(rawdata);

//tableau des utilisateurs connectés
let ListUser = [];
//socket start
const io = socket(server);

io.on("connection", function (socket) {


    //quand un nouvel utilisateur se connecte
    socket.on("newuser", function (data) {
        var statconn = true;
        for (var key in ListUser) { //on vérifie si le nom d'utilisateur n'est pas déjà pris
            if(ListUser[key].toLowerCase() == data.name.toLowerCase()){ //on transforme les 2 chaines en minuscule pour les comparer
                statconn = false;
                break;
            }
        }
        if(statconn == true){ //si le pseudo n'est pas déjà pris
            if(data.name != null) { //et qu'il n'est pas nul
                ListUser[socket.id] = data.name; //on l'inscrit dans la liste des utilisateurs connectés
                stats.totalConnexion++; //on augmente le nombre de connexion dans les stats de 1
                savestats(); // on sauvegarde les stats
                var address = socket.handshake.address; //on récupère l'adresse ip de la personne qui se connecte
                var dateFormat = require("dateformat");
                var now = new Date(); // on récupère la date
                logger.write("[LOG] "+dateFormat(now, 'yyyy/mm/dd HH:MM:ss')+" => Connected from "+address+" as '"+data.name+"'\n") // on écrit la connexion dans les log
                io.emit('userconnected', {name: data.name}); //on envoie à tous les utilisateurs l'information qu'un nouvel utilisateur s'est connecté
            }
        }
        else{
            socket.emit('error', {message:'Username already take please retry'}); //si utilisateur déjà pris, on envoie une erreur
        }

    });
    //quand un utilisateur se déconnecte
    socket.on("disconnect", function () {
        if(ListUser[socket.id] != undefined) { //on vérifie qu'il était présent dans la liste des utilisateurs connectés
            var address = socket.handshake.address;//on récupère son ip
            var dateFormat = require("dateformat");
            var now = new Date();//on récupère la date
            logger.write("[LOG] "+dateFormat(now, 'yyyy/mm/dd HH:MM:ss')+" => Disconnect from "+address+" as '"+ListUser[socket.id]+"'\n") // on écrit dans les log la déconnexion
            io.emit('userdisconnected', {name: ListUser[socket.id]}); //on envoie à tous les utilisateurs connectés qu'un utilisateur s'est déconnecté
            delete ListUser[socket.id]; //on le supprime de la liste des utilisateurs connectés
        }
    });
    //quand un utilisateur envoie un message
    socket.on("message", function (data) {
        if(data.messagewrite.substr(0, 1) == '/'){ //on vérifie si le message est une commande grâce au /
            commande = data.messagewrite.substr(1).split('\n')[0]; // on supprime le /
            commande = commande.replace(/\s+/g, ""); // on supprime les espaces si il y en a
            switch (commande) {
                case "help": //si commande help
                    //on renvoie la liste des commandes disponibles
                    socket.emit('alert',{alert:'\n/help => list of available commands \n/list => list of connected users \n/stats => give some statistics'});
                    break;
                case "list": // si commande list
                    var listuser = '';
                    for (var key in ListUser) {
                        listuser+= ListUser[key]+',';

                    }
                    //on renvoie la liste des utilisateurs connectés
                    socket.emit('RepListUser',{result:listuser.substring(0, listuser.length - 1)});
                    break;
                case "stats": // si commande stats
                    //on envoie les statistiques
                    socket.emit('alert',{alert:
                            "Statistiques : \n Total of connections: "+stats.totalConnexion+
                            "\n Number of messages per user: "+JSON.stringify(stats.numbersUsersMessage)+
                            "\n Total of messages sent: "+stats.TotalOfMessages});
                    break;
                default: // si commande reçue est inexistante
                    //on envoie à l'utilisateur que sa commande n'est pas disponible
                    socket.emit('alert',{alert:"la commande "+commande+" n'existe pas"});

            }
        }
        else{//si c'est un vrai message

            //on incrémente dans les stats de message par utilisateur
            if(stats.numbersUsersMessage[data.name] !== undefined){
                stats.numbersUsersMessage[data.name]++;
            }
            else{
                stats.numbersUsersMessage[data.name] = 1;
            }
            //on incrémente dans les stats du nombre total de messages
            stats.TotalOfMessages++;
            //on sauvegarde les stats
            savestats();
            //on envoie à tous les utilisateurs le message
            io.emit('newmessage', data);
        }
    });
});

//fonction de sauvegarde des stats
function savestats(){
    //on transforme en string l'objet stats
    let statsjson = JSON.stringify(stats);
    //on écrit le string (json) dans le fichier stats
    fs.writeFile('stats/stats.json',statsjson, function (err) {
        if (err) throw err;
    });
}
