import folium

coords = [
    [57.1618, 65.4970],
    [57.1628, 65.4998],
    [57.1634, 65.5017]
]

m = folium.Map(location=coords[0], zoom_start=17)
folium.PolyLine(coords, color="blue", weight=5).add_to(m)

# Автоматическая подгонка карты под весь маршрут
m.fit_bounds(coords)

m.save("temp_map.html")
print("✅ Карта сохранена с охватом всего маршрута.")