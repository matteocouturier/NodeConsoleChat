var readline = require('readline');
const chalk = require('chalk');
var rl = readline.createInterface(process.stdin, process.stdout);
let nickname = null;
var configIni = require('config.ini');

//localisation du fichier config où se trouve l'ip et le port du serveur
var  conf   = configIni.load('config/config.ini');
//on appelle la fonction start
console.clear();
start();

//fonction permettant de vérifier la conformité du nom avant de se connecter
function start() {


    rl.question("What is your name? ", function (answer) { //on demande le nom de l'utilisateur
        answer = answer.replace(/\s+/g, ""); //on enlève les espaces dans le nom
        if (answer.length <= 20 && answer.length > 0) { //si le nombre de caractères se situe entre 1 et 20
            nickname = answer; //on assigne le nom d'utilisateur
            rl.close();
            connect(); //connexion au socket
        } else {
            console.log(chalk.red("Your username does not meet the required criteria...")); //on dit que le nom d'utilisateur n'est pas conforme
            start();
        }

    });
}


function connect() {
    const repl = require('repl')
    const io = require("socket.io-client");
    const socket = io("http://"+conf.SERVER.ip+":"+conf.SERVER.port); // récupération des configs dans le fichier config + connexion au serveur

    console.log(chalk.red("...Connecting to the server..."));
    //quand l'utilisateur est connecté
    socket.on("connect", () => {
        console.log(chalk.green("Successfully Connected to "+"http://"+conf.SERVER.ip+":"+conf.SERVER.port+" !"));
        socket.emit('newuser', {name: nickname}); //on dit au serveur qu'on est un nouvel utilisateur
        //on start repl pour pouvoir envoyer des messages
        repl.start({
            prompt: '',
            eval: (cmd) => { //a chaque message envoyer
                if(cmd.split('\n')[0] != '') {
                    socket.emit('message', {name: nickname, messagewrite: cmd}); //on dit au serveur qu'on envoie un message
                }
            }
        });

    });
    //si il y a une erreur de connexion au serveur
    socket.on('connect_error', function(){
        console.log(chalk.red("[ERROR] => failed to connect to the server => "+"http://"+conf.SERVER.ip+":"+conf.SERVER.port));
        process.exit();//on arrête le processus de l'utilisateur
    });
    //quand le serveur nous envoie la liste des utilisateurs
    socket.on("RepListUser", (data) => {
       console.log("List of logged in users: " + chalk.cyan(data.result));
    });
    //quand le serveur nous envoie une erreur
    socket.on("error", (data) => {
        console.log(chalk.red('[ERROR] => '+data.message));
        process.exit();//on arrête le processus de l'utilisateur
    });
    //quand le serveur nous envoie une alerte
    socket.on("alert", (data) => {
        console.log(chalk.magenta(data.alert));
    });
    //quand le serveur se déconnecte
    socket.on("disconnect", (reason) => {
        console.log("Server disconnect, reason: "+reason);
        process.exit(); //on arrête le processus de l'utilisateur
    });
    //quand un nouvel utilisateur se connecte
    socket.on("userconnected", (data) => {
        if(data.name != nickname){ //si ce n'est pas l'utilsateur actuel
            console.log(chalk.yellow("["+data.name+" is connected]"));
        }
        else{
            console.log(chalk.yellow("[You joined the chat server]"));
        }

    });
    //quand le serveur nous dit qu'un utilisateur s'est déconnecté
    socket.on("userdisconnected", (data) => {
            console.log(chalk.yellow("[" + data.name + " is disconnected]"));
    });
    //quand le serveur nous envoie un nouveau message
    socket.on("newmessage", (data) => {
        if(data.name != nickname) { // si ce n'est pas l'utilisateur concerné
            console.log(chalk.cyan(data.name) + ": " + data.messagewrite.split('\n')[0]);
        }
    });
}

