// NoeJuza - OnlineInerChat 2020-2021 - navShower.js
// permets d'utiliser les liens "Afficher plus" et "Afficher moins"
// de la navBar
// (méthodes appelées par les <a></a> dans la liste navbar)
//-----------------------------------------------------------------------------------------------------------------
var showlesstext = document.getElementById('ShowLess'); // <a> qui contient "Afficher moins"
var showmoretext = document.getElementById('ShowMore'); // <a> qui contient "Afficher plus"
var list = document.getElementById('liste');            // Récupération du <ul> qui contient la liste de salons

showlesstext.style.display = "none";                    // rendre invisible "Afficher moins"
// fonction appelée par "Afficher plus", permets d'afficher 20 salons au lieu de 10
function ShowMore() {

  for (let index = 11; index <= 20; index++) {          // Boucle 'affichage
    let li = document.createElement('li');              // Création d'un <li>
    li.classList.add('nav-item');                       // Ajout d'une classe
    li.innerHTML = "<a class=\"nav-link\" href=\"/chatroom-" + index + "\">Salon de chat " +  index + "</a>";// Mise en place de l'html du <li>
    list.appendChild(li);                               // ajout de l'lément <li> à la liste
    $('#liste').find('#ShowLess').appendTo('#liste');   // Déplace "Afficher moins" à la fin de la liste
  }
  showmoretext.style.display = "none";                  // rendre invisible "Afficher plus"
  showlesstext.style.display = "block";                 // rendre visible "Afficher moins"
}
// fonction appelée par "Afficher moins", permets d'afficher 10 salons au lieu de 20
function ShowLess() {
  $('#liste').find('#ShowLess').appendTo('#ShowMore');  // Déplace "Afficher moins" après "Afficher plus"
  for (let index = 20; index > 10; index--) {           // Boucle de suppression
    let li = list.lastChild;                            // Récupération du dernier <li> de la liste
    list.removeChild(li);                               // Supression du <li> récupéré avant
  }
  showlesstext.style.display = "none";                  // rendre invisible "Afficher moins"
  showmoretext.style.display = "block";                 // rendre visible "Afficher plus"
}