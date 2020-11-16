import sys

def tipo_numero(nums):
    # Comprueba cada numero e informa del tipo a que corresponde
    for i in nums:
        try:
            i = int(i)
        except ValueError:
            print (i, "no es un valor valido")
            continue
        count =  1
        suma = 0
        while (count<i):
            if (i%count == 0):
                suma += count
            count += 1
        if (suma>(i)):
            # Numero abundante, aquel que la suma de los divisores propios es
            # mayor que el numero
            print (i, "es numero es abundante")
        elif (suma<(i)):
            # Numero defectivo, aquel que la suma de los divisores propios es
            # menor que el numero 
            print (i, " es numero es defectivo")
        else:
            # Numero perfecto, aquel que es igual a la suma de sus divisores
            # propios positivos, excluyendose a si mismo
            print (i, " es numero es perfecto")
        
if __name__ == '__main__':
    tipo_numero (sys.argv[1:])
