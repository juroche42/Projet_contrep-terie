import string
import numpy as np

def fonction (y, a):
	listeMot = []
	for l in list(string.ascii_lowercase):
		if y == 1:
			print(f"{a+l}")
		else:
			fonction(y-1, a+l)

fonction(3,'')

