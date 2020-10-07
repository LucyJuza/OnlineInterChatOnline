// NoeJuza - OnlineInerChat 2020-2021 - index.js
// Contient le fonctionnement du backend
// ainsi que les logiques d'interactions
// du routage et des sockets
//-----------------------------------------------------------------------------------------------------------------
// Déclaration variables / constantes
const express = require("express");       // Utilisation du module "Express"
const app = express();                    // Le serveur utilise express
const http = require("http").Server(app); // Création du serveur http pour traiter les requêtes
var favicon = require('serve-favicon');   // Déclaration de la favicon.
let port = process.env.PORT;              // Détermination du port utilisé (Heroku définit un port par défaut)
if (port == null || port == "") {
  port = 9001;                            // Si projet local -> pas de port définit par heroku, donc initialiser un port
}
var reqipbase;        // Ip de l'utilisateur sous forme "brute"
var reqiplist;        // Ip de l'utilisateur sous forme de liste
var reqip;            // Ip de l'utilisateur sous forme lisible facilement
var server = app.listen(port);                  // Définition de l'écoute du serveur sur le bon port
const io = require("socket.io").listen(server);   // Intégration du module Socket.io
var path = require("path");                       // Intégration du module "Path
app.use(express.static("public"));              // Définition du répertoire dans lequel trouver les fichiers a envoyer à l'utilisateur
app.use(favicon(path.join(__dirname + "/public/favicon.ico"))); // Utilisation d'une icone pour le site
//-----------------------------------------------------------------------------------------------------------------
//Fonctions et logique d'interaction de routage

/*Fonction qui permets l'optimisation du code et qui évite les copiés-collés*/
function renderchatnox(req,res,nodechat) { // permets d'éviter du copier collé de code sur le render des chats et le log des connexion
  logconnection(req,nodechat);  // Logging de la connexion à la sale
  res.render(path.join(__dirname + "/public/chatroom.ejs"),{'title' : 'OnlineInterChat - Salon ' + nodechat}); // envoi de l'interface web à l'utilisateur
}

// Actions effectuées quand l'utilisateur essaie d'atteindre une page
app.get("/", function(req,res) {
  res.render(path.join(__dirname + "/public/index.ejs")); // Envoi de l'interface à l'utilisateur
})

// Gestion dynamique des chats
app.get('/chatroom-:id([0-9]+)', function(req, res) {  
  var url = req.url;                  // Url à laquelle l'ulisateur essaie de se connecter
  var chatroomid = url.substring(10); // Récupération du "n° de channel"
  renderchatnox(req,res,chatroomid);  //Appel de la fonction précédement définie pour permettre l'affichage de l'interface
});

//-----------------------------------------------------------------------------------------------------------------
// Partie de gestion des logs
console.log(`L'aplication es démarrée sur le port: ${ port }`); // écriture dans les logs CLI que l'application tourne sur le port "x"

// Fonction appellée pour logger une connexion à un salon.
function logconnection(req) {
  // Récupération de l'ip de l'utilisateur sous forme lisible
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){                              // teste si il y’a un ou plusieurs proxy
    var list = ipAddr.split(",");           // Sépare proxy1,proxy2,etc…,ipUser
    ipAddr = list[list.length-1];           // Récupère l’IP originale de l’utilisateur
  } else {
    ipAddr = req.connection.remoteAddress;  // Si pas de proxy -> Récupère simplement l’ip
  }
  reqipbase = String(ipAddr);               // Transfer de l'adresse illisible humainement vers une variable déclarée préalablement
  reqiplist = reqipbase.split(":");           // Sépare l'ip reçue au niveau des ":"
  reqip = reqiplist[(reqiplist.length -1)];   // On récupère seulement la dernière partie
  // Partie logging de la connexion
  console.log("Nouvelle connexion au serveur depuis: " + reqip); // Permets d'écrire que quelqu'un s'est connecté au site dans la console.
}
//-----------------------------------------------------------------------------------------------------------------
// Partie de gestion des sockets

io.sockets.on('connection', function(socket) { // quand le socket est crée
    // Sockets de, connexion, déconnection et d'envoi de message
    socket.on('username', function(username,nochan) { // quand l'utilisateur a défini son pseudo
        socket.username = username;
        io.emit('is_online' + nochan, '🔵 <i>' + socket.username + ' a rejoint le salon</i>');
    });

    socket.on('deco', function(nochan) {  // quand un utilisateur se déconnecte.
        io.emit('is_down' + nochan, '🔴 <i>' + socket.username + ' a quitté le salon</i>');
    })

    socket.on('chat_message', function(message,nochan) { // quand le serveur reçoit un message
        io.emit('chat_message' + nochan, socket.username , message );
    });
  });
//-----------------------------------------------------------------------------------------------------------------