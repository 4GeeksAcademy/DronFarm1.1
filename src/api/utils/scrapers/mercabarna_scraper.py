import requests
from bs4 import BeautifulSoup
from datetime import datetime


def scrape_mercabarna():
    url = "https://www.mercabarna.es/es/precios-del-dia"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    resultados = []

    # Encontrar tabla de frutas
    # Puedes afinar esto por clase, id o sección si hay varias
    tabla = soup.find('table')
    if not tabla:
        print("No se encontró la tabla.")
        return []

    for fila in tabla.find_all("tr")[1:]:  # Saltar encabezado
        columnas = fila.find_all("td")
        if len(columnas) >= 5:
            producto = columnas[0].get_text(strip=True)
            categoria = columnas[1].get_text(strip=True)
            origen = columnas[2].get_text(strip=True)
            precio_min = columnas[3].get_text(strip=True).replace(",", ".")
            precio_max = columnas[4].get_text(strip=True).replace(",", ".")

            if "melocotón" in producto.lower():  # Filtrar solo melocotón para pruebas
                resultados.append({
                    "producto": producto,
                    "categoria": categoria,
                    "origen": origen,
                    "precio_min": float(precio_min),
                    "precio_max": float(precio_max),
                    "fecha": datetime.today().date()
                })

    return resultados


# Probar el scraper
if __name__ == "__main__":
    datos = scrape_mercabarna()
    for item in datos:
        print(item)
