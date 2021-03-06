import sys
import json
import os
from filtre import *
from fonc_aide_son import *
from fonc_aide_lettre import *

sys.stdout.reconfigure(encoding='utf-8')

def aideContrepetrie(historique):
	with open('data/config.json') as diconfig_:
		diconfig = json.load(diconfig_)


	# boucle "tant que" pour le recommencer aide avec un autre mot.
	continuer = 1
	while continuer == 1:
		clear()
		if historique != [] :
			print("historique : \n")
		for i in range(len(historique)):
			print(i+1," : ",historique[i],"\n")
		Linput = input("Mot : ")
		if Linput in ["1","2","3","4","5"]:
			if historique[int(Linput)-1] is not None:
				mot =  historique[int(Linput)-1]
			else :
				print("\nL'entrée n'est pas valide")
				continue
		else :
			mot = Linput
			mot = mot.lower()
			if mot in historique :
				historique.remove(mot)
			historique.insert(0,mot)
			if len(historique) == 6:
				historique.pop(-1)
		
		if "/" in mot :
			testeur = quadruplRapide(mot)
			if testeur :
				continue
			else :
				break
		
		# case rech sur une lettre
		# ou   rech sur une syllabe

		listeDeMotCop = [] #contient les contrepétries du mot entré
		clear()
		choix = set(range(9))
		print("""Voulez-vous faire une recherche sur :
			1- une lettre
			2- un  son
			3- plusieurs lettres
			4- plusieurs sons
			5- 2 lettres -> 1 lettre
			6- 1 lettre -> 2 lettres
			7- recherche personnalisée lettre
			8- recherche personnalisée son
			0- quitter l'aide""")

		while True:
			try:
				selection = int(input(""))
			except:
				print("\nVous n'avez pas saisi un chiffre")
				continue
			if selection in choix:
				break
			else:
				print("\nL'entrée n'est pas valide, réessayez")

			

		# selection des différents mode de l'aide
		if selection == 0:
			continuer = 0
			break
	# -------------------------------------------------------------------------------
		elif selection == 1:
			clear()
			print("Recherche des contrepétries possibles ...")
			#listeDeMotCop = aideLettreSubs(mot)
			dico = 'word'
			x=1
			y=1
			listeDeMotCop = aide(mot,x,y,dico)
	# -------------------------------------------------------------------------------

		elif selection == 2:
			clear()
			print("Recherche des contrepétries possibles ...\n")
			dico = 'phon'
			x=1
			y=1
			listeDeMotCop = aide(mot,x,y,dico)
			# cas où le mot rentré par l'utilisateur n'est pas dans le lexique
			if listeDeMotCop == 0:
				continue
	# -------------------------------------------------------------------------------

		elif selection == 3:
			clear()
			print(f"Recherche des échanges possibles sur les différentes tranches :")
			print("\nChargement en cours...\n")

			sliceCorr = aideSyllSubs(mot) #récupère le dico qui a pour clé les lettres à changer et comme valeur tous les mots obtenus
			# si les tranches n'avait pas de correspondance:
			if isinstance(sliceCorr, bool):
				clear()
				print("Ce mot n'est pas dans notre lexique, nous ne pouvons pas trouver son phonème.\n")
				continue
			else:
				while(True):
					syllOrigine = affiNbCorrTranche(sliceCorr)
					if syllOrigine == 0:
						return 0
					elif syllOrigine == -1:
						clear()
						break

					selectMot = affiPageParPage(sliceCorr[syllOrigine], syllOrigine, mot)
					if selectMot == 0:
						return 0
					elif selectMot == -1:
						clear()
						break
					elif isinstance(selectMot, str):
						break
				if syllOrigine == -1 or selectMot == -1:
					continue
	# -------------------------------------------------------------------------------

		elif selection == 4:
			clear()
			print(f"Recherche des échanges possibles sur les différentes tranches :")
			print("\nChargement en cours...\n")

			sliceCorr = aideMultiSonSubs(mot)

			# si les tranches n'avait pas de correspondance:
			if isinstance(sliceCorr, bool):
				clear()
				print("Ce mot n'est pas dans notre lexique, nous ne pouvons pas trouver son phonème.\n")
				continue
			else:

				while(True):
					syllOrigine = affiNbCorrTranche2(sliceCorr)
					if syllOrigine == 0:
						return 0
					elif syllOrigine == -1:
						clear()
						break

					selectMot = affiPageParPage2(sliceCorr[syllOrigine], syllOrigine, mot)
					if selectMot == 0:
						return 0
					elif selectMot == -1:
						clear()
						break
					elif isinstance(selectMot, str):
						break
				if syllOrigine == -1 or selectMot == -1:
					continue
	# -------------------------------------------------------------------------------

		elif selection == 5:
			clear()
			print("Recherche des contrepétries possibles ...")
			#listeDeMotCop = aide2Lettre1Lettre(mot) # listeDeMotCop[nvMot][doublelettre][lettre2]
			dico = 'word'
			listeDeMotCop = aide(mot,2,1,dico)
	# -------------------------------------------------------------------------------

		elif selection == 6:
			clear()
			print("Recherche des contrepétries possibles ...")
			#listeDeMotCop = aide1Lettre2Lettre(mot) # listeDeMotCop[nvMot][ancienne lettre][lettre2+3]
			dico = 'word'
			x=1
			y=2
			listeDeMotCop = aide(mot,x,y,dico)

	#--------------------------------------------------------------------------------

		elif selection == 7:
			x = int(input("longueur de la syllabe enlevée : "))
			y = int(input("longueur de la syllabe ajoutée : "))
			print("Recherche des contrepétries possibles ...")
			dico = 'word'
			listeDeMotCop = aide(mot,x,y,dico)
				

	#--------------------------------------------------------------------------------

		elif selection == 8:
			x = int(input("longueur de la syllabe enlevée : "))
			y = int(input("longueur de la syllabe ajoutée : "))
			print("Recherche des contrepétries possibles ...")
			dico = 'phon'
			listeDeMotCop = aide(mot,x,y,dico)

	# -------------------------------------------------------------------------------
		#if selection == 1 or selection == 2 or selection == 5 or selection == 6 or selection == 7:
			"""
			# affichage des premiers resultats
			for i in enumerate(listeDeMotCop): #i[0] -> index, i[1][1] -> ancienne lettre, i[1][2] -> nouvelle lettre, i[1][0] -> nouveau mot
				tmp = i[1][2] if i[1][2] != "" else chr(32)
				if selection == 1 or selection == 5 or selection == 6 or selection == 7:
					print(f" {i[0]+1}   {i[1][1]} - {tmp}    {i[1][0]}")
				else:
					if (i[0]+1)<10:
						print(f"{i[0]+1}   {i[1][1]} - {tmp}    {i[1][0]} ex : {i[1][3]}")
					else:
						print(f"{i[0]+1}  {i[1][1]} - {tmp}    {i[1][0]} ex : {i[1][3]}")
			"""
		selectMot = None
		boucle = True
		while(boucle):
			try:
				selectMot = int(input(
					"\n0 = quitter l'aide,-1 revenir au début de l'aide, -2 changer la recherche \nou numéro de l'échange qui vous intéresse : \n"))
			except:
				print("\nVous n'avez pas saisi un chiffre")
				continue
			if selectMot == 0:
				continuer = 0
				break
			elif selectMot == -1:
				clear()
				continuer = -1
				boucle = False
			elif selectMot == -2:
				if dico == 'word' :
					dico = 'phon'
				else :
					dico = 'word'
				listeDeMotCop = aide(mot,x,y,dico)
			elif selectMot <= len(listeDeMotCop) and selectMot > 0: #evite les erreurs de segmentations
				boucle = False
			else:
				print("\nL'entrée n'est pas valide, réessayez")

		if continuer == -1:
			continuer = 1
			continue
		elif continuer == 0:
			continue

#-------------------------------------------------------
		"""
		elif selection == 8:
			for i in enumerate(listeDeMotCop): #i[0] -> index, i[1][1] -> ancienne lettre, i[1][2] -> nouvelle lettre, i[1][0] -> nouveau mot
				tmp = i[1][2] if i[1][2] != "" else chr(32)
				if selection == 1 or selection == 5 or selection == 6 or selection == 7:
					print(f" {i[0]+1}   {i[1][1]} - {tmp}    {i[1][0]}")
				else:
					if (i[0]+1)<10:
						print(f"{i[0]+1}   {i[1][1]} - {tmp}    {i[1][0]} ex : {i[1][3]}")
					else:
						print(f"{i[0]+1}  {i[1][1]} - {tmp}    {i[1][0]} ex : {i[1][3]}")

			selectMot = None
			boucle = True
			while(boucle):
				try:
					selectMot = int(input(
						"\n0 = quitter l'aide,-1 revenir au début de l'aide, -2 rechercher par phonèmes \nou numéro de l'échange qui vous intéresse : \n"))
				except:
					print("\nVous n'avez pas saisi un chiffre")
					continue

				if selectMot == 0:
					continuer = 0
					break
				elif selectMot == -1:
					clear()
					continuer = -1
					boucle = False
				elif selectMot == -2:
					
					clear()
				elif selectMot <= len(listeDeMotCop) and selectMot > 0: #evite les erreurs de segmentations
					boucle = False
				else:
					print("\nL'entrée n'est pas valide, réessayez")

			if continuer == -1:
				continuer = 1
				continue
			elif continuer == 0:
				continue
			"""
		

#----------------------------------------------------

		# affichage affiné sur contrepetrie choisie
		if selection == 1 or selection == 5 or selection == 6 or selection == 7:

			listeAffichage, compteur, diconfig = aideLettreRechDicoGeneral(selectMot, listeDeMotCop)

			# en cas de liste vide, affichant qu'aucune possibilité n'est trouvé
			if listeAffichage != []:
				# ici enlever if(filtregrammaticale) ->listeAffichage =  f('listeAffichage')
				if (diconfig["FiltreGrammatical"] == "Oui"):
					listeAffichage = GramFiltre(listeAffichage, mot)
				continuer = affiRechLettre(listeAffichage, compteur, mot)
			else:
				print("Aucune correspondance trouvée")

		elif selection == 2:
			(listeAffichage, compteur, diconfig) = aideSonRechDico(selectMot, listeDeMotCop)

			# en cas de liste vide, affichant qu'aucune possibilité n'est trouvé
			if listeAffichage != []:
				if (diconfig["FiltreGrammatical"] == "Oui"):
					listeAffichage = GramFiltre(listeAffichage, mot)
				# ici enlever if(filtregrammaticale) ->listeAffichage =  f('listeAffichage')

				continuer = affiRechSon(listeAffichage, compteur, mot)
			else:
				print("Aucune correspondance trouvée")

		elif selection == 3:
			(listeAffichage, compteur, diconfig) = aideSyllRechDico(mot, selectMot, syllOrigine)
			if (diconfig["FiltreGrammatical"] == "Oui"):
				listeAffichage = GramFiltre(listeAffichage, mot)
			# ici enlever if(filtregrammaticale) ->listeAffichage =  f('listeAffichage')
			continuer = affiRechLettre(listeAffichage, compteur, mot)

		elif selection == 4:

			(listeAffichage, compteur, diconfig) = aideMultiSonRechDico(mot, selectMot, syllOrigine)

			if (diconfig["FiltreGrammatical"] == "Oui"):
				listeAffichage = GramFiltre(listeAffichage, mot)
			# ici enlever if(filtregrammaticale) ->listeAffichage =  f('listeAffichage')
			continuer = affiRechSon(listeAffichage, compteur, mot)

		elif selection == 8:
			listeAffichage, compteur, diconfig = aideSonRechDico(selectMot, listeDeMotCop)
			# ici enlever if(filtregrammaticale) ->listeAffichage =  f('listeAffichage')
			if (diconfig["FiltreGrammatical"] == "Oui"):
				listeAffichage = GramFiltre(listeAffichage, mot)
			continuer = affiRechSon(listeAffichage, compteur, mot)

		

	return historique
