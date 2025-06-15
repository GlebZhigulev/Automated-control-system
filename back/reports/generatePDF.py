from fpdf import FPDF
import os

class PDFReport(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("DejaVu", "", "DejaVuSans.ttf", uni=True)
        self.add_font("DejaVu", "B", "DejaVuSans-Bold.ttf", uni=True)

    def header(self):
        self.set_font("DejaVu", "B", 14)
        if self.page_no() == 1:
            self.cell(0, 10, "Отчет о полете №1", ln=True, align="C")
        else:
            self.cell(0, 10, "Список дефектов", ln=True, align="C")

    def flight_info(self, flight):
        self.ln(10)
        self.set_font("DejaVu", "", 12)
        self.cell(0, 10, f"Маршрут: {flight['route']}", ln=True)
        self.cell(0, 10, f"Оператор: {flight['operator']}", ln=True)
        self.cell(0, 10, f"Оператор: {flight['drone']}", ln=True)
        self.cell(0, 10, f"Дата выполнения: {flight['date']}", ln=True)
        self.cell(0, 10, f"Длительность: {flight['duration']}", ln=True)

    def add_map(self, path):
        if os.path.exists(path):
            self.set_font("DejaVu", "B", 12)
            self.cell(0, 10, "Карта маршрута:", ln=True)
            self.image(path, w=180)
            self.ln(5)

    def add_defect(self, defect):
        image_w = 90
        image_h = 90
        gap = 15
        block_total = image_h + gap + 10 + 8  # изображение + отступ + заголовок + подписи

    # Перенос страницы при нехватке места
        if self.get_y() + block_total > self.h - self.b_margin:
            self.add_page()

    # Заголовок
        self.set_font("DejaVu", "B", 12)
        self.cell(0, 10, f"Дефект (координаты: {defect['location']})", ln=True)

    # Подписи над изображениями
        self.set_font("DejaVu", "", 11)
        self.cell(image_w, 8, "Оригинальное изображение", border=0)
        self.cell(image_w, 8, "Маска дефекта", ln=True)

    # Вставка изображений
        y_img = self.get_y()
        self.image(defect["image"], x=10, y=y_img, w=image_w, h=image_h)
        self.image(defect["mask"], x=110, y=y_img, w=image_w, h=image_h)

    # Перейти ниже изображений
        self.set_y(y_img + image_h + gap)




def generate_pdf(output_path: str, flight_data: dict):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font("DejaVu", "", 12)

    # Добавим карту, если есть
    pdf.add_map("map.png")

    # Инфо и дефекты
    pdf.flight_info(flight_data)
    for defect in flight_data["defects"]:
        if os.path.exists(defect["image"]) and os.path.exists(defect["mask"]):
            pdf.add_defect(defect)

    pdf.output(output_path)
    print(f"✅ Отчет сохранен в: {output_path}")

# Пример использования
if __name__ == "__main__":
    flight_data = {
        "route": "Маршрут А",
        "operator": "Иванов И.И",
        "drone": "БПЛА-1",
        "date": "15.05.2025",
        "duration": "10 мин",
        "defects": [
            {
                "location": "57.1620, 65.4982",
                "image": "image1.jpg",
                "mask": "mask1.png"
            },
            {
                "location": "57.1629, 65.4998",
                "image": "image2.jpg",
                "mask": "mask2.png"
            }
        ]
    }

    generate_pdf("flight_report.pdf", flight_data)
