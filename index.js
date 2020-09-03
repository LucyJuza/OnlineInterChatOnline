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
var dt = new Date();          // Création d'un objet de type "Date" pour les logs
const io = require("socket.io").listen(server);   // Intégration du module Socket.io
var path = require("path");                       // Intégration du module "Path
app.use(express.static("public"));              // Définition du répertoire dans lequel trouver les fichiers a envoyer à l'utilisateur
app.use(favicon(path.join(__dirname + "/public/favicon.ico"))); // Utilisation d'une icone pour le site

// Actions effectuées quand l'utilisateur essaie d'atteindre la racine du site
app.get("/", function(req, res) {

  // Récupération de l'ip de l'utilisateur sous forme lisible
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){                              // teste si il y’a un ou plusieurs proxy
    var list = ipAddr.split(",");           // Sépare proxy1,proxy2,etc…,ipUser
    ipAddr = list[list.length-1];           // Récupère l’IP originale de l’utilisateur
  } else {
    ipAddr = req.connection.remoteAddress;  // Si pas de proxy -> Récupère simplement l’ip
  }
  reqipbase = String(ipAddr);
  reqiplist = reqipbase.split(":");           // Sépare l'ip reçue au niveau des ":"
  reqip = reqiplist[(reqiplist.length -1)];   // On récupère seulement la dernière partie
  // Partie logging de la connexion
  console.log(reqip);
  if (String(ipAddr) == "::1" || String(ipAddr) == "::ffff:127.0.0.1") {    // Test si l'ip est celle du localhost
    logger.log("info",String("le localhost s'est connecté à " + `${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`));
  }
  else
  {
    logger.log("info",String(reqip + " s'est connecté à " + `${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
  ));
  }
  
  res.sendFile(path.join(__dirname + "/public/chatroom.html")); // envoi de l'interface web à l'utilisateur
});

/* LOGGING */
console.log(`Our app is running on port ${ port }`); // écriture dans les logs CLI que l'application tourne sur le port "x"
const { createLogger, format, transports } = require('winston'); // Définition de l'utilisation de winston (permets de simplifier les logs)

const logger = createLogger({       //Création d'un objet de log de winston 
  level: 'info',            // Sort des logs dit "d'info" servant à donner des informations
  exitOnError: false,
  format: format.json(),    // Formatage en json pour la lisibilité
  transports: [
    new transports.File({ filename: __dirname + `/logs/MesLogsConnexion.log` }), // Choix du fichier dans lequel c'est stocké
  ],
});

module.exports = logger;  // Mise en fonctionnement du logger

const loggerUsername = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.File({ filename: __dirname + `/logs/MesLogsUserNames.log` }),
  ],
});

module.exports = loggerUsername;

// Partie de gestion des sockets
io.sockets.on('connection', function(socket) { // quand le socket est crée
    socket.on('username', function(username) { // quand l'utilisateur a défini son pseudo
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' a rejoint le salon</i>');

        if (reqip != null || reqip != "") { // Teste si l'ip a été récupérée, en cas de bug de sync, renvoie le même message sans ip de l'utilisateur
          switch (reqip) {                  /* Switchcase pour savoir si c'est le localhost ou une ip distante qui essaie d'accéder au serveur. 
                                               Switchcase utilisé pour sa vitesse comparé à un if else (if else imbriqués trop = pas bien)*/
            case "1" || "127.0.0.1":
              loggerUsername.log("info",String( `${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}` + " le localhost a choisi " + username + " comme nom d'utilisateur"));
              break;
          
            default:
              loggerUsername.log("info",String( `${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}` + " " + reqip  + " a choisi " + username + " comme nom d'utilisateur"));
              break;
          }
        }
        else
        {
          loggerUsername.log("info",String( `${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}` + " Un utilisateur a commencé à utiliser " + username + " comme nom d'utilisateur"));
        }
    });

    socket.on('disconnect', function(username) {  // quand un utilisateur se déconnecte.
        io.emit('is_online', '🔴 <i>' + socket.username + ' a quitté le salon</i>');
    })

    socket.on('chat_message', function(message) { // quand le serveur reçoit un message
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});