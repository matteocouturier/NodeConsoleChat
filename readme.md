# Chat IRC Node JS
***
Pour ce projet j'ai décidé d'utiliser principalement la librairie __Socket.io__ 
qui permet de créer des serveurs et clients sockets en __node.js__.

Il est principalement constitué de 2 fichiers : <br>
Un fichier servers.js qui va créer un serveur.<br>
Un fichier client.js qui va créer un client.<br>

Les stats sont stockées dans un fichier json dans le dossier stats/stats.json.<br>

Si vous voulez séparer le client du serveur :<br>
Le script client.js est dépendant du dossier config/<br>
Le script server.js est dépendant des dossiers log/ et stats/.<br>
## Installation
```
$ git clone https://github.com/waveghost42/NodeConsoleChat
$ cd NodeConsoleChat
```
### Installation des dépendances
```
npm install
```
***


***
## Lancer le serveur
Avant de lancer le serveur, il faut modifier le fichier server.js.<br>
 A la ligne 4 se trouve le port qui sera utilisé par le serveur (Si cette étape n'est pas réalisée, le port par défaut est le port 5000).
<br>La commande suivante est uniquement réalisable sous les distributions Linux et permet de modifier ce fichier. Si vous n'êtes pas sous Linux, il faut le modifier manuellement. 
```
$ sudo nano server.js
```

Cela va ouvrir le fichier et vous aurez juste à modifier la ligne 4.
```
3| //Port du serveur
4| const PORT = 5000;
```
Une fois la modification faite, si vous avez utilisé nano, pressez Ctrl+X puis Y pour accepter d'enregitrer puis appuyez sur la touche entrée.<br>

Vous pouvez maintenant lancer le serveur.
```
$ node server.js
```
La réponse suivante devra être affichée.
```
root@server:~/NodeConsoleChat $ node server.js
The server started on port 5000
```
***
## Lancer le client
Avant de lancer le client, il faut modifier le fichier config situé dans le dossier config/config.ini.

La commande suivante permet encore une fois d'ouvrir le fichier sous Linux.
```
$ sudo nano config/config.ini
```
Cela va ouvrir le fichier et vous aurez juste à le modifier avec l'ip et le port du serveur souhaité. <br>

Par défaut : 
```
[SERVER]
ip = "127.0.0.1"
port = "5000"
```
Une fois la modification faite, si vous avez utilisé nano, pressez Ctrl+X puis Y pour accepter d'enregitrer puis appuyez sur la touche entrée.<br>

Vous pouvez maintenant lancer le client.
```
$ node client.js
```
La réponse suivante devra être affichée.<br>
```

root@server:~/NodeConsoleChat $ node client.js
What is your name?

```
Il vous suffira de rentrer votre pseudo (attention, le pseudo doit avoir entre 1 et 20 caractères).
```
What is your name? Mattéo
...Connecting to the server...
Successfully Connected to http://127.0.0.1:5000 !
[You joined the chat server]
```
Lorsque un utilisateur se connecte/déconnecte du serveur ce message apparaîtra.
```
[Mattéo is connected]
[Mattéo is disconnected]
```
***
## Utilisation
### Ecrire un message
Pour écrire un message, il faut simplement écrire dans le terminal.

Les messages des autres utilisateurs s'affichent sous cette forme :
```
What is your name? TestUser
...Connecting to the server...
Successfully Connected to http://127.0.0.1:5000 !
[You joined the chat server]
Mattéo: Salut !
```
##Les commandes
### /help
Si vous rentrez la commande /help, vous aurez la liste des commandes disponibles.
```
/help

/help => list of available commands 
/list => list of connected users
/stats => give some statistics

```
### /list
Si vous rentrez la commande /list, vous aurez la liste des utilisateurs connectés au serveur.
```
/list
List of logged in users: Mattéo,TestUser
```
### /stats
Si vous rentrez la commande /stats, vous aurez quelques statistiques concernant le serveur.
```
/stats

Statistiques :
 Total of connections: 2
 Number of messages per user: {"Mattéo":42,"TestUser":34}
 Total of messages sent: 76
```
***
## Les logs
les logs sont inscrits dans le fichier log/connexion.log et sont présentés sous cette forme : 
```
[LOG] 2021/07/22 12:51:47 => Connected from ::ffff:127.0.0.1 as 'Mattéo'
[LOG] 2021/07/22 12:54:29 => Connected from ::ffff:127.0.0.1 as 'TestUser'
[LOG] 2021/07/22 13:00:30 => Disconnect from ::ffff:127.0.0.1 as 'TestUser'
```
***
## Connexion extérieur
Pour pouvoir se connecter depuis n'importe quel endroit, il faut ouvrir le port de l'accès internet ou se situe le serveur.<br>
Il faut ensuite modifier le fichier config.ini du client pour qu'il se connecte sur la bonne ip avec le bon port. <br>
