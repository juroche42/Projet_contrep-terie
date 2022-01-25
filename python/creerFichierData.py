import string
import csv
import json

"""
Objectif : Créer un fichier qui contient un dico : key -> une écriture phonétique, value -> toutes ses orthographes possibles
Paramètres :
	-Entrée :
		fichierSrc : fichier source
		fichierDest : fichier destination
	-Sortie :
		aucun
"""
def creerFichierPhon(fichierSrc,fichierDest):
	file = open(fichierSrc, encoding="utf-8")
	read_file = csv.reader(file, delimiter=",")
	dicoPhon={}
	for ligne in read_file:
		if(ligne[1] in dicoPhon):
			dicoPhon[ligne[1]].append(ligne[0])
		else:
			dicoPhon[ligne[1]]=list()
			dicoPhon[ligne[1]].append(ligne[0])
	with open(fichierDest,'w') as file2:
		json.dump(dicoPhon,file2)



"""
Objectif : Créer un fichier qui contient un dico : key -> un mot, value -> toutes ses classes grammaticales possibles
Paramètres :
	-Entrée :
		fichierSrc : fichier source
		fichierDest : fichier destination
	-Sortie :
		aucun
"""
def creerFichierClassGramm(fichierSrc,fichierDest):
	file = open(fichierSrc, encoding="utf-8")
	read_file = csv.reader(file, delimiter=",")
	dicoClassGramm={}
	for ligne in read_file:
		if(ligne[0] in dicoClassGramm):
			dicoClassGramm[ligne[0]]=ligne[3][2:-2].replace('\'','').split(',')
		else:
			dicoClassGramm[ligne[0]]=ligne[3][2:-2].replace('\'','').split(',')
	with open(fichierDest,'w') as file2:
		json.dump(dicoClassGramm,file2)



langue="fr"
creerFichierClassGramm(f"data/{langue}/dico{langue.capitalize()}.csv",f"data/{langue}/dicoClassGramm{langue.capitalize()}.json")
creerFichierPhon(f"data/{langue}/dico{langue.capitalize()}.csv",f"data/{langue}/dicoPhoncom{langue.capitalize()}.json")