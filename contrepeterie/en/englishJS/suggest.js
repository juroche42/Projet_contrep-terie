var dic=[];
var dicMot=[];
var dicPhon=[];
var affichResultat=[];
var saveTuple=[];
//Ces variables globales sont essentielles pour certaines fonctions de notre site, notamment pour garder des resultats en memoire


//const orange = '#FFA600';
//const green = '#28a745';

function handleFileSelect(evt) {
	
    var file = evt.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
      	dic.push(results);
      	console.log(dic);
      	splitdicSelector()
      }
    });
    
  }

  $(document).ready(function(){
$("#csv-file").change(handleFileSelect);
});

  function splitdicSelector(){
	for(let i=0; i<dic[0]['data'].length; i++){
  		dicMot.push(dic[0]['data'][i][0]);
		dicPhon.push(dic[0]['data'][i][1]);	
  	}
  	console.log("Affichage du dictionaire de mots");
  	console.log(dicMot);
  	console.log("Affichage du dictionaire de sons");
  	console.log(dicPhon);
}

function loadSuggestion(){
	//ajoute un event listener qui déclenche afficheStats() lorsque l'utilisateur change
	//les valeurs des champs x et y (contrepétries d'un nombre x et y de lettres interchangées)
	afficheStats(); //appelle aussi la fonction au chargement du dico
	document.getElementById('choixDeX').addEventListener('input', afficheStats);
	document.getElementById('choixDeY').addEventListener('input', afficheStats);
	

	//ajoute un event listener qui déclenche afficheLoadStats() lorsque l'utilisateur clique sur un des boutons.
	//l'icone de chargement sera cachée au moment de l'affichage des résultats (voir fonction choixMotCompatible dans le cas du click sur gen1)
	//(voir fonction aideLettreRechDico dans le cas du click sur gen2)
	document.getElementById('gen').addEventListener('mousedown', affichLoadStats);
	document.getElementById('gen2').addEventListener('mousedown', affichLoadStats);

	document.getElementById('chargement').innerHTML = '<div class="loading"></div>';

	Papa.parse(pathToDictionnary, {
    download: true,
    step: function(row) {
    	dic.push(row);
      	
    },
    complete: function() {
    	document.getElementById('chargement').innerHTML = '<div id="wrapper"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg></div>';
		document.getElementById('chargement').style.backgroundColor="beige";
		document.getElementById('loadSugg').disabled=true;
        console.log("All done!");
        console.log(dic);
        console.log("Appel de split dic");
        splitdic(dic);

    }
  });
}

function splitdic(){
    for(let i=0; i<dic.length; i++){
  		dicMot.push(dic[i]['data'][0]);
		dicPhon.push(dic[i]['data'][1]);	
  	}
  	console.log("Affichage du dictionaire de mots");
  	console.log(dicMot);
  	console.log("Affichage du dictionaire de sons");
  	console.log(dicPhon);
}

//Fonction qui permet de savoir si un mot donné est contenu dans un dictionnaire donné
function motExiste(mot, dic){
	if(dic.includes(mot))
		return true;
	return false;
}

//-----------------------------------------------------------------------------------
//--------------------------------document.getElementById('choixDeY').addEventListener('input', afficheStats);---------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
/*
-----------------------------FONCTIONNEMENT GLOBAL SIMPLIFIE -----------------------------------
au click de l'utilisateur sur "Lancer la recherche" : redirigeLettreOuPhoneme() => controle le choix de l'utilisateur sur les lettres et phonemes
	appel de : aideMultiLettre(x, y) => trouve la liste des mots compatibles
		appel de : choixMotCompatible(motSave,listeMotCompatible) => crée les boutons mot saisi - mot compatibles
		affichage des boutons mot saisi - mot compatibles
		au click appel de aideLettreRechDico(mot1, mot2) => trouve la difference de lettre entre le couple de mot
			appel de chercheMotDico(lettreMot1,lettreMot2,saveX,saveY,resMot1,resMot2); => cherche les 2 mots manquants pour former le groupe de 4 mots
			affichage des resultats


*/

//redirige vers l'exécution de aideLettreSubs() ou aidePhonemeSubs() selon si
//l'utilisateur a sélectionné choixLettre ou choixPhoneme
//Cette fonction sera modifiée au niveau de la partie recupération des x et y
function redirigeLettreOuPhoneme() {


	var x=document.getElementById('choixDeX').value;
	var y=document.getElementById('choixDeY').value;
	
	afficheStats();

	if (document.getElementById('choixLettre').value == 'true')
	{
		
		if (x == "" || y == "")
		{
			if (x == "" && y == "") {
				document.getElementById("choixDeX").value = 1;
				document.getElementById("choixDeY").value = 1;
			}
			else if (x == "")
				document.getElementById("choixDeY").value
			else if(y == "")
				document.getElementById("choixDeX").value = 1;
			x = document.getElementById("choixDeX").value;
			y = document.getElementById("choixDeY").value;
			aideMultiLettre(x,y);
        }
		else
			aideMultiLettre(x, y);
	}
	else //l'utilisateur a choisi les phonèmes
	{
		
		if (x == "" || y == "")
		{
			if (x == "" && y == "") {
				document.getElementById("choixDeX").value = 1;
				document.getElementById("choixDeY").value = 1;
			}
			else if (x == "")
				document.getElementById("choixDeY").value
			else if(y == "")
				document.getElementById("choixDeX").value = 1;
			x = document.getElementById("choixDeX").value;
			y = document.getElementById("choixDeY").value;
			aideMultiPhon(x,y);
        }
		else
			aideMultiPhon(x, y);
	}
}


//Cette fonction permet de donner à l'utilisateur une idée du temps des recherches qu'il execute
//elle est exécuté lors du click sur "Lancer la recherche" et "Lancer la recherche sur 2 mots"
function afficheStats() {
	var text="";
	var x=document.getElementById('choixDeX').value;
	var y=document.getElementById('choixDeY').value;
	var min=document.getElementById('choixLongueurMin').value;
	var max=document.getElementById('choixLongueurMax').value;

	var tExec = document.getElementById('tempsExecution');
	var divStatsToHide = document.getElementById('divStatsToHide');

	divStatsToHide.style.visibility = "visible";

	//En fonction du nombre de lettres à échanger, on determine si la requete est rapide ou non
	if (y>4 || x > 12 || max > 10) {
		divStatsToHide.style.backgroundColor = 'black';
		text='enormous   time ∞';
		tExec.innerText="Execution time: " + text;
	}
	else if (x>7 || y>3) {
		divStatsToHide.style.backgroundColor = 'darkred';
		text='very   slow at least 60 sec';
		tExec.innerText="Time : " + text;
	}
	else if ((x>=4 || y>=2) && (x<=7 || y<=3)) {
		divStatsToHide.style.backgroundColor = 'orange';
		text='lent   10 to 60 sec';
		tExec.innerText="Execution time: " + text;
	}
	else {
		divStatsToHide.style.backgroundColor = 'green';
		text='fast   2 to 10 sec';
		tExec.innerText="Execution time: " + text;
	}
}


//idem que afficheStats1, mais elle observe plus de paramètres et 
//est exécuté lors du click sur un couple de mots afin d'afficher les 4 mots
function afficheStats2() {
	var text="";
	var x=document.getElementById('choixDeX').value;
	var y=document.getElementById('choixDeY').value;
	var min=document.getElementById('choixLongueurMin').value;
	var max=document.getElementById('choixLongueurMax').value;

	var tExec = document.getElementById('tempsExecution');
	var divStatsToHide = document.getElementById('divStatsToHide');

	divStatsToHide.style.visibility = "visible";

	//En fonction du nombre de lettres à échanger, on determine si la requete est rapide ou non
	if(max >8 || y>4) {
		divStatsToHide.style.backgroundColor = 'black';
		text='enormous   time : ∞';
		tExec.innerText="Execution time: " + text;
	}
	else if (x>7 || y>3 || (max <=8 && max >6)){
		divStatsToHide.style.backgroundColor = 'darkred';
		text='very slow   at least 60 sec';
		tExec.innerText="Time : " + text;
	}
	else if ((x>=4 || y>=2) && (x<=7 || y<=3) ||  max==6) {
		divStatsToHide.style.backgroundColor = 'orange';
		text='slow   10 to 60 sec';
		tExec.innerText="Execution time: " + text;
	}
	else {
		divStatsToHide.style.backgroundColor = 'green';
		text='fast   2 to 10 sec';
		tExec.innerText="Execution time: " + text;
	}
}



//Fonction d'affichage des informations du processeur utilisé pour determiner le temps des requetes (voir afficheStats() )
function afficheInfoProc() {
	if (document.getElementById('pInfoProc').style.visibility == "collapse")
		document.getElementById('pInfoProc').style.visibility = "visible";
	else
	document.getElementById('pInfoProc').style.visibility = "collapse";
}

//affiche l'icone de chargement dans le panneau des Stats
function affichLoadStats() {
	document.getElementById('loadingStats').style.visibility = "visible";
}

/*
Objectif: Renvoie un couple de x lettre(s) à partir de l'index index dans le mot mot
Paramètres:
-Entrée :
mot: mot sur lequel on va récupérer le couple
x: nombre de lettres pour le couple
index: à partir de qu'elle lettre
	- Sortie :
Renvoie un tuple de la forme: boolean, couple.
*/

function recupCouple(mot, x, index) {
	if (x > 1) {
		if ((index + 1) === mot.length)
			return ['false', '']

	}
	return ['true', mot.substr(index, x)];
}

/*
Objectif : Renvoie une liste des couples possibles de lettres à partir de l'alphabet
Paramètres :
	-Entrée :
		-y : nombre lettres pour la combinaison
		-a : chaîne contenant la combinaison (utile pour la récursivité, vide au premier appel)
		-liste : liste des réponses (utile pour la récursivité, vide au premier appel)
	-Sortie :
		-listeCouple : liste des réponses

Exemple : Si je désire récupérer tous les couples de 2 lettres possibiles à partir de l'alphabet, j'utilise cette fonction qui me retournera une liste qui contiendra : aa,ab,ac,ad,...,zz.
*/

function recupCoupleLettre(y, a, liste, alphabet) {
	listeCouple = liste;
	for (let i = 0; i < alphabet.length; i++)
		{
		var l = alphabet[i]
			if (y == 1)
				listeCouple.push(a + l);
			else
			listeCouple = recupCoupleLettre(y - 1, a + l , listeCouple,alphabet);
	}
	return listeCouple
}
/*
//Remplace une partie de mot par nvpartie, depuis indexDebut et pendant longueur charactères
function replaceBetween(mot, nvPartie, indexDebut, longueur) {
	console.log(mot.substring(0, indexDebut) + nvPartie + mot.substring(indexDebut, mot.lenght).substring(longueur, mot.lenght));// doit pouvoir être simplifié
};
*/
String.prototype.replacerAvecIndex = function (index, x, string) {
	if (index < 0)
		return string
	if (index > this.length)
		return this.substring(0) + string;
	return this.substring(0,index-(x-1)) + string + this.substring(index+1,this.length);
};

//Cette fonction lance la recherche des contrepeteries suite au click de l'utilisateur sur le couple de mot de son choix (=recherche des 4 mots)
function updateBtn() {
	let mo = document.getElementById('mot').value;
	mot=mo.toLowerCase(); //On recuperer en minuscule le mot saisi au clavier
	var iButton = $(this).val();

	if(document.getElementById('choixPhoneme').value == 'false')
		aideLettreRechDico(mot,iButton);
	if(document.getElementById('choixPhoneme').value == 'true')
		aidePhonemRechDico(mot,iButton);


}



//Cette fonction permet de creer les couples mot - mot compatibles sous la forme de boutons
function choixMotCompatible(motSave,listeMotCompatible) {
	document.getElementById('loadingStats').style.visibility = "collapse";
	document.getElementById("bRetour").setAttribute("class","collapse mt-3");
	//Nous comparons par rapport à 1 car nous envoyons un tableau[1] depuis le html
	//Sans cela, des pb d'initialisation peuvent apparaitre
	
	if(listeMotCompatible.length>1) { //Sert uniquement à sauvegarder la liste en memoire pour le bouton retour
		saveTuple = listeMotCompatible;
	}
	if(listeMotCompatible.length==1) {
		listeMotCompatible=saveTuple;
	}
	var element = document.getElementById("div1");
	while (element.firstChild){
		element.removeChild(element.firstChild);
	}

	//if(listeMotCompatible.length == 0) saveTuple = [];

	for (var i = 0; i < listeMotCompatible.length; i++) { //Pour chaque mot compatible on crée un bouton mot - mot compatible
			let button = document.createElement("button");
			button.innerText =motSave+" - " + listeMotCompatible[i];
			button.value =listeMotCompatible[i];
			document.getElementById("div1").append(button);
			button.addEventListener('click', updateBtn);
			button.addEventListener('mousedown', affichLoadStats);
			button.addEventListener('mousedown', afficheStats2);//au click pour trouver les 4 mots
	}
}

//Changement des valeurs des éléments choixLettre et choixPhoneme selon la sélection de l'utilisateur
function choixLettre() {
	if (document.getElementById('choixLettre').value == 'false')
	{
		document.getElementById('choixLettre').value = 'true';
		document.getElementById('choixPhoneme').value = 'false';
		document.getElementById('pSelectLettrePhon').innerHTML = 'Sélectionné : Lettres';
		document.getElementById("h3textToChange").innerText = "Nombre de lettres à échanger :";
		saveTuple = [];
    }
}

function choixPhoneme() {
	if (document.getElementById('choixPhoneme').value == 'false')
	{
		document.getElementById('choixPhoneme').value = 'true';
		document.getElementById('choixLettre').value = 'false';
		document.getElementById('pSelectLettrePhon').innerHTML = 'Sélectionné : Phonèmes';
		document.getElementById("h3textToChange").innerText = "Nombre de phonèmes à échanger :";
		saveTuple = [];
    }
}

//Cette fonction permet de trouver les 2 mots manquant pour constituer les 4 mots à partir du mot saisi et du mot compatible
function chercheMotDico(lettre1,lettre2,x,y,resMot1,resMot2) {
	var diffXY = x - y;
	var longueurMax= document.getElementById("choixLongueurMax").value
	var longueurMin= document.getElementById("choixLongueurMin").value
	for(let i=0;i<dicMot.length;i++){ //Pour chaque mots du dico
		let mot1=dicMot[i]; //On prend le ieme mot du dico
		lg1=mot1.length;
		longueur1=lg1-diffXY; //Variable pour determiner les longueurs des mots à trouver quand le nombre de lettre à remplacer change
		longueur1plus=lg1+diffXY;
		let posLettre1=mot1.indexOf(lettre1); //On regarde ou la lettre1 est dans ce mot

		if(posLettre1 != -1 && mot1.length<= longueurMax && mot1.length >= longueurMin) { //Si la lettre1 est presente dans le mot 1 du dico + respecte les conditions de longueur
			for(let j=0;j<dicMot.length;j++){ //Pour chaque mot du dico
				let mot2=dicMot[j]; //On prend le premier mot
				lg2=mot2.length;
				longueur2moins=lg2-diffXY;//Variable pour determiner les longueurs des mots à trouver quand le nombre de lettre à remplacer change
				longueur2plus=lg2+diffXY;

				if (diffXY ==0 ) { //Si on remplace i par i lettres
					//Rentre ici : testé
					if (mot1.length == mot2.length && mot1 != mot2) { //Si les 2 mots sont de meme longueur et ne sont pas les memes
						var lettreCommune = 0;
						for (let k=0;k<mot1.length;k++) { //Pour chaque lettre du mot1 on compte les lettres communes avec le mot 2

							if (mot1[k] == mot2[k]){ //Si la lettre au meme index entre les 2 mots est identique :
								lettreCommune++; //On incremente cette variable
							}
						}
						var posLettre2=mot2.indexOf(lettre2);//On regarde ou la lettre1 est dans ce mot
						if(posLettre2 != -1) { //Si la lettre2 est presente dans le mot 2 du dico
							if (posLettre1 == posLettre2 && lettreCommune == mot1.length-1 ) { //On regarde si les deux mots ont la lettre1 et la lettre2 au meme endroit
								resMot1.push(mot1); //Et on regarde si le mot2 a toutes ses autres lettres differentes du mot grace a "LettreCommune"
								resMot2.push(mot2);//Si c'est le cas on ajoute les 2 mots dans les tableaux respectifs
								console.log("trouve");
								break;
							}
						}
					}6
				}
				if (diffXY > 0 ) { //Si on remplace i+x par i lettres
					//Rentre ici : testé
					if (longueur1 == mot2.length) { //Si le premier mot fait x lettres et le deuxieme fait x lettres de moins
						var lettreCommune = 0;
						var posLettre2=mot2.indexOf(lettre2);//On regarde ou la lettre1 est dans ce mot
						if(posLettre2 != -1 && posLettre1 == posLettre2) {
							mot1test=mot1.replace(lettre1,"") //On garde uniquement les lettres qui ne sont pas a echanger entre les 2 mots
							mot2test=mot2.replace(lettre2,"")
							for (let k=0;k<mot1test.length;k++) { //Pour chaque lettre du mot1 sans ses lettres à echanger

								if (mot1test[k] == mot2test[k]){ //Si la lettre au meme index entre les 2 mots est identique :
									lettreCommune++; //On incremente cette variable
								}
							}
								if (lettreCommune == mot1test.length) { //On regarde le mot1 et le mot2 ont toutes leurs lettres en commun à part les lettres à echanger
									resMot1.push(mot1);
									resMot2.push(mot2);//Si c'est le cas on ajoute les 2 mots dans les tableaux respectifs
									break;
								}
						}
					}
				}
				if (diffXY < 0 ) {//Si on remplace i par i+y lettres
					if (mot1.length == longueur2plus) { //Si le premier mot fait x lettres et le deuxieme fait y lettres de plus
						var lettreCommune = 0;
						var posLettre2=mot2.indexOf(lettre2);//Meme principe que juste au dessus
						if(posLettre2 != -1 && posLettre1 == posLettre2) {
							mot1test=mot1.replace(lettre1,"")
							mot2test=mot2.replace(lettre2,"")
							for (let k=0;k<mot1test.length;k++) {

								if (mot1test[k] == mot2test[k]){
									lettreCommune++;
								}
							}
							if (lettreCommune == mot1test.length) {
								resMot1.push(mot1);
								resMot2.push(mot2);
								console.log("trouve");
								break;
							}
						}
					}
				}

			}
		}
	}
	console.log("Mot 1 : " + resMot1);
	console.log("mot 2 : " + resMot2);
}

//Fonction qui va trouver la difference de lettres entre deux mots, essentiel pour permettre de trouver le groupe de 4 mots
function aideLettreRechDico(mot1, mot2) {
	document.getElementById('loadingStats').style.visibility = "collapse";

	document.getElementById("bRetour").setAttribute("class","mt-3");
	affichResultat=[]
	x=document.getElementById("choixDeX").value;
	y=document.getElementById("choixDeY").value;
	var lettreMot1 = "";
	var lettreMot2 = "";
	let saveX = x;
	let saveY = y;
	for (let i=0; i<mot1.length; i++) { //Pour chaque lettre du mot 1 (mot saisi)

		if (mot1[i] != mot2[i]) { //Si la lettre au meme indice n'est pas la meme sur les 2 mots
			let saveI = i;

			for(x; x>0; x--){
				lettreMot1 = lettreMot1 + mot1[i]; //On stock les lettres qui changent
				i++;
			}
			i = saveI;
			for(y; y>0; y--){
				lettreMot2 = lettreMot2 + mot2[i]; //On stock les lettres qui changent
				i++;
			}
			break;
		}
	}
	console.log("lettres1 " + lettreMot1)
	console.log("lettres2 " + lettreMot2)
	var resMot1=[]; //on crée 2 tableaux pour accueuillir tous les mots qui vont etre trouvés
	var resMot2=[];
	chercheMotDico(lettreMot1,lettreMot2,saveX,saveY,resMot1,resMot2);//fonction pour trouver les 4 mots
	document.getElementById("loadingStats").style.visibility="collapse";
	//On prepare l'affichage des 4 mots un à un
	for (let j = 0; j <resMot1.length ; j++) { //Pour chaque mot de resMot1
		if(mot1 != resMot1[j]) {
		affichResultat.push('<div class="card p-2 shadow-sm" style="width: 18rem;">'+ mot1 + ' - ' + resMot2[j] + '</div>'  ); //On ajoute dans une variable globale
		affichResultat.push('<div class="card p-2 shadow-sm" style="width: 18rem;">' + mot2 + ' - ' + resMot1[j] +'</div>');//Le mot saisi - le mot avec la lettre du mot2
		affichResultat.push('<hr width="50">');        //Le mot 2 (compatible) - le mot avec la lettre du mot1
		}
	}
	affichageMot(affichResultat);
}



//Fonction qui affiche les groupes de 4 mots
function affichageMot(l){
	var element = document.getElementById("div1");
	while (element.firstChild){
  		element.removeChild(element.firstChild);
	}
	for(var i=0; i<l.length; i++){
		let par = document.createElement('p');
		par.innerHTML=l[i];
		document.getElementById('div1').append(par);
	}
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------


String.prototype.replaceAt = function(index, replacement) {
	if (index >= this.length) {
		return this.valueOf();
	}

	var chars = this.split('');
	chars[index] = replacement;
	return chars.join('');
}






