var zoneErreur = document.getElementById('errors');
zoneErreur.style.display = "none";
zoneErreur.innerText = "";

function displayerrorwhitechar(){
    zoneErreur.innerText = "Le corps du texte ne peut pas être vide";
    zoneErreur.style.display = "block";
}

function displayerrortoolong(limite){
    zoneErreur.innerText = "Le message ne doit pas dépasser " + limite + " caractères";
    zoneErreur.style.display = "block";
}

function hideerrors(){
    zoneErreur.innerText = "";
    zoneErreur.style.display = "none";
}