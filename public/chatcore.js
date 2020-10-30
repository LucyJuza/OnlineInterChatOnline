// NoeJuza - OnlineInerChat 2020-2021 - chatcore.js
// contient les fonctions et les logiques d'interactions nécessaires
// au fonctionnement de la page dynamique de chatroom.
//-----------------------------------------------------------------------------------------------------------------
// Déclaration des variables
var maxCharsPseudo = 30;
var maxSizemsg = 300;
var titrePage = document.title;        // Titre de la page
var nochan = titrePage.substring(23);  // rouve le N° de chan dans lequel l'utilisateur se trouve
var messages = document.getElementById('messages'); // Récupération du <ul> qui contient les messages
//-----------------------------------------------------------------------------------------------------------------
//Fonctions
function stripHtml(html){              // permets de récupérer le "texte pur" d'une chaine de caractères contenant du markup html
	// Création elément temporaire
	var temporalDivElement = document.createElement("div");
	// Init
	temporalDivElement.innerHTML = html;
	// renvoie le bon texte
	return temporalDivElement.textContent || temporalDivElement.innerText || "";
};
function bottom() { // Défile jusqu'au bas du chat
	$('#zoneAffichage').scrollTop($('#messages').height());
	$('body').scrollTop($('#zoneAffichage').height());
};
function sendgoodsocket() { // envoie le bon socket de déconnexion
	socket.emit('deco',nochan);
};
//-----------------------------------------------------------------------------------------------------------------
// Logique d'interaction des sockets
var socket = io();
window.onbeforeunload = sendgoodsocket;
// submit text message without reload/refresh the page
$('form').submit(function(e){
	e.preventDefault(); // prevents page reloading
	var flagbon = false;
	var msg = $('#txt').val();
	if (/\S/.test(msg) && msg.length <= maxSizemsg) { 
																	/* Empêche les messages à corps vide et
																	   teste si la chaîne n'est pas trop longue */
		if (/<\/?[a-z][\s\S]*>/i.test(msg)) {
			msg = stripHtml(msg);
			if ( !(/\S/.test(msg)) )
			{
				flagbon = false;
				displayerrorwhitechar();
				bottom();
			}
			else
			{
				flagbon = true;
			}
		}
		else
		{
			flagbon = true;
			hideerrors();
		}
	}
	else if (msg.length > maxSizemsg)   // Si le message est trop long
	{
		flagbon = false;
		displayerrortoolong(maxSizemsg);
		bottom();
	}
	else                                // Si le message est vide ou ne contiens que des "<br>"
	{
		flagbon = false;
		displayerrorwhitechar();
		bottom();
	}

	if (flagbon)
	{
		if (checkforCommands(msg))
		{
			socket.emit('chat_message', msg, nochan);
		}
	}
	$('#txt').val('');
	bottom();	//Scroll vers le bas auto
	return false;
});

// Regarde si le message entré est une des commandes définies
function checkforCommands(msg){
	var flag = true;
	switch (msg){
		case "/nick":		// /nick permets de changer son pseudo
			flag = false
			document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			var newUserName = defineValidUserName();	// Appel de la fonction de définition du pseudo
			socket.emit('usernameChanged', newUserName,nochan);   // envoi du socket "username" avec le nom choisi et le n° du salon
		break;
	}
	return flag
}
// Si le socket chat_message suivi du n° de salon est reçu, ajoute le message à la liste de messages et scrolle vers le bas;
socket.on('chat_message' + nochan, function(sender,msg){
	var li = document.createElement('li');	// Création de l'élément dans lequel le message sera stocké
	var p = document.createElement('p');	// création de la ligne
	p.classList.add("text-break");			// Ajout de la classe qui permets le retour a la ligne quand message trop long
	p.innerHTML = '<strong>' + sender + ': </strong> ';	// Ajout de la personne qui a envoyé le message
	p.innerHTML +=  stripHtml(msg);						// Dans le cas ou il resterait du html dans le message, on l'enlève
	li.append(p);
	messages.append(li);
	bottom();	//Scroll vers le bas auto
});

// Reçois le scoket is_online suivi du n° de salon qui indique qu'un user s'est connecté à ce channel
socket.on('is_online' + nochan, function(username) {
	$('#messages').append($('<li id="connect">').html(username));
	bottom();	//Scroll vers le bas auto
});

// Reçois socket "is_down" suivi du n° de salon ce qui veut dire que quelqu'un s'est déconnecté du salon
socket.on('is_down' + nochan, function(username) {
	$('#messages').append($('<li id="disconnect">').html(username));
	bottom();	//Scroll vers le bas auto
});
//-----------------------------------------------------------------------------------------------------------------
// Gestion du Pseudo choisi par l'utilisateur
var userCookied=getCookie("username"); // On récupère le cookie username
if(userCookied == "" || userCookied.substring(0,1) != "「") // Teste si le cookie existe
{
	var username = defineValidUserName();
}
else{
	var username = userCookied;	// Si le cookie existe -> le username est le nom dans le cookie
	alert("Re " + username + "! Tu peux changer ton pseudo en écrivant \"/nick\" dans le chat");
}
socket.emit('username', username,nochan);   // envoi du socket "username" avec le nom choisi et le n° du salon

function defineValidUserName(){	// Permets de faire différents tests et de définir un nom "vide" le cas échéant

	var username = prompt('Quel pseudo souhaitez-vous utiliser ?'); // "prompt de la question"
	if (username == null) {         // Test de si l'utilisateur a appuyé sur "cancel"
		username = "";
	}
	if (/\S/.test(username) && username.length < maxCharsPseudo)	// Teste si le username n'est pas juste un whitechar et n'est pas trop long
	{
		if (!(/<\/?[a-z][\s\S]*>/i.test(username))) {		// Teste si le username contient du markup html
			username = "「 " + username + " 」";
		}
		else   // si le pseudo choisi contiens de l'html
		{
			username = "「 " + stripHtml(username) + " 」"; // Récupère le contenu du html, sans la mise en forme et le définit comme pseudo
		}
	}
	else    // si le nom d'utilisateur est vide ou contient plus de x caractères
	{
		username = "「      」";    // nom d'utilisateur "vide"
	}
	if (username != "「      」")	// si le nom d'utilisateur n'est pas un nom d'utilisateur vide
	{
		setCookie("username",username,5)	// On crée un cookie du nom d'utilisateur valable pour 10 jours
	}
	return username;

}
//----------------------------------------------------------------------------------------------------------------
// Cookies
function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}