// NoeJuza - OnlineInerChat 2020-2021 - chaterrors.js
// Contient l'affichage des erreurs de l'utilisateur par rapport au chat
// (méthodes appelées par chatcore.js)
//-----------------------------------------------------------------------------------------------------------------
// Variables
var zoneErreur = document.getElementById('errors'); // Récupération du div qui s'occupe de l'affichage d'erreurs
//-----------------------------------------------------------------------------------------------------------------
zoneErreur.style.display = "none";                  // On rends la zone d'affichage 
                                                    // invisible une fois que la page a entièrement 
                                                    // fini de charger et a passé Le choix du nom d'utilisateur
zoneErreur.innerText = "";                          // Puisqu'aucune erreur n'a été détectée à ce moment
                                                    // On ne mets rien dans la zone d'erreur

function displayerrorwhitechar(){                   // Quand un message est vide
    zoneErreur.innerText = "Le corps du texte ne peut pas être vide";
    zoneErreur.style.display = "block";
}

function displayerrortoolong(limite){               // Quand un message dépasse une certaine limie
    zoneErreur.innerText = "Le message ne doit pas dépasser " + limite + " caractères";
    zoneErreur.style.display = "block";
}

function hideerrors(){                              // Cache la zone d'erreur après l'avoir vidée
    zoneErreur.innerText = "";
    zoneErreur.style.display = "none";
}