# 👇 ❇️ Riki for the group success 11 Abril 👊

# routes/quote_routes.py (COMPLETO)
from flask import Blueprint, jsonify, request, render_template, send_file
from api.models.models import db, Quote, User, Field
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta
from services.pricing_service import calculate_quote
from weasyprint import HTML
from services.email_service import send_quote_email
import base64
from flask import current_app


import tempfile
import os

print("✅ quote_routes CARGADO")

quote = Blueprint('quote_routes', __name__, template_folder='../templates')

# POST /presupuesto (Crear nuevo presupuesto)


@quote.route('/presupuesto', methods=['POST'])
def create_quote():
    print("📥 Recibida petición en /presupuesto")
    try:
        data = request.get_json()
        print("DEBUG POST DATA:", data)
        required_fields = ['hectares', 'cropType',
                           'services', 'frequency', 'field_id', 'user_id']

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Campos faltantes"}), 400

        # Calcular presupuesto
        quote_data = calculate_quote(
            hectareas=data['hectares'],
            tipo_cultivo=data['cropType'],
            servicio="fotogrametria",  # TODO: adaptar si hay varios servicios
            periodicidad=data['frequency']
        )

        # Guardar en base de datos
        new_quote = Quote(
            cost=quote_data["total"],
            description=f"{data['cropType']} | {data['frequency']} | Servicios: {', '.join(data['services'])}",
            field_id=data['field_id'],
            user_id=data['user_id'],
            created_at=datetime.utcnow()
        )

        db.session.add(new_quote)
        db.session.commit()

        return jsonify({
            "id": new_quote.id,
            "total": quote_data["total"],
            "precio_unitario": quote_data["precio_por_hectarea"],
            "valido_hasta": quote_data["valido_hasta"],
            "details": new_quote.description
        }), 201

    except Exception as e:
        print("❌ ERROR EN POST /presupuesto:", str(e))
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Enviar presupuesto


@quote.route('/enviar-presupuesto', methods=['POST'])
def enviar_presupuesto():
    try:
        data = request.get_json()
        destinatario = data.get("email")
        quote_html_preview = data.get("quoteDataHtml")

        # Formatear fechas
        fecha_hoy = datetime.today().strftime("%d/%m/%Y")
        valid_until_format = datetime.strptime(
            data.get("validUntil"), "%Y-%m-%d").strftime("%d/%m/%Y")

        # ✅ Convertir el logo en base64
        logo_path = os.path.join(
            current_app.root_path, "static", "img", "Logo_DronFarm_Oficial_sinmarco.png")

        with open(logo_path, "rb") as logo_file:
            logo_base64 = base64.b64encode(logo_file.read()).decode("utf-8")

        # Datos para el PDF
        pdf_data = {
            "user": data.get("user"),
            "field": data.get("field"),
            "cropType": data.get("cropType"),
            "hectares": data.get("hectares"),
            "services": data.get("services"),
            "frequency": data.get("frequency"),
            "price_per_hectare": data.get("pricePerHectare"),
            "total": data.get("total"),
        }

        rendered_pdf_html = render_template(
            "presupuesto_bonito.html",
            fecha_hoy=fecha_hoy,
            valid_until=valid_until_format,
            logo_base64=logo_base64,
            **pdf_data
        )

        # Generar PDF temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            HTML(string=rendered_pdf_html).write_pdf(f.name)
            pdf_path = f.name

        # Enviar correo con PDF adjunto
        send_quote_email(
            destinatario=destinatario,
            asunto="Presupuesto DroneFarm (PDF incluido) 🚀",
            cuerpo=quote_html_preview,
            adjunto_path=pdf_path
        )

        # Eliminar PDF temporal
        os.remove(pdf_path)

        return jsonify({"msg": "Correo enviado con PDF adjunto"}), 200

    except Exception as e:
        print("❌ ERROR EN /enviar-presupuesto:", str(e))
        return jsonify({"error": str(e)}), 500

# GET /presupuesto/<id> (Obtener presupuesto específico)


@quote.route('/presupuesto/<int:id>', methods=['GET'])
def get_quote(id):
    try:
        quote = Quote.query.options(joinedload(
            Quote.user), joinedload(Quote.field)).get(id)
        if not quote:
            return jsonify({"error": "Presupuesto no encontrado"}), 404

        return jsonify({
            "id": quote.id,
            "cost": quote.cost,
            "user": f"{quote.user.name} {quote.user.lastname}",
            "field": quote.field.name,
            "created_at": quote.created_at.isoformat(),
            "description": quote.description
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quote.route('/test-crear-presupuesto', methods=['GET'])
def crear_presupuesto_para_prueba():
    try:
        user = User.query.get(1)
        field = Field.query.get(1)
        if not user or not field:
            return jsonify({"error": "Usuario o parcela no existen"}), 400

        total = 123.45
        new_quote = Quote(
            cost=total,
            description="olivo | mensual | Servicios: fotogrametria",
            field_id=field.id,
            user_id=user.id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_quote)
        db.session.commit()

        return jsonify({
            "id": new_quote.id,
            "mensaje": "Presupuesto de prueba creado correctamente"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# GET /presupuesto/<id>/pdf (Generar y devolver el PDF)
@quote.route('/presupuesto/<int:id>/pdf', methods=['GET'])
def generate_pdf(id):
    try:
        quote = Quote.query.options(joinedload(
            Quote.user), joinedload(Quote.field)).get(id)
        if not quote:
            return jsonify({"error": "Presupuesto no encontrado"}), 404

        # Simulación de desglose a partir de description
        data = {
            "user": f"{quote.user.name} {quote.user.lastname}",
            "field": quote.field.name,
            "cropType": quote.description.split(" | ")[0],
            "frequency": quote.description.split(" | ")[1],
            "services": quote.description.split(" | ")[2].replace("Servicios: ", ""),
            "hectares": quote.field.area,  # Ajusta según tu modelo
            "price_per_hectare": round(quote.cost / quote.field.area, 2),
            "total": quote.cost,
            "valid_until": (quote.created_at + timedelta(days=30)).strftime("%Y-%m-%d")
        }

        html = render_template("presupuesto.html", **data)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            HTML(string=html).write_pdf(f.name)
            return send_file(f.name, as_attachment=True, download_name="presupuesto_dronfarm.pdf")

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quote.route('/usuario/<int:user_id>/presupuestos', methods=['GET'])
def get_user_quotes(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        quotes = Quote.query.filter_by(user_id=user_id).order_by(
            Quote.created_at.desc()).all()

        result = []
        for quote in quotes:
            result.append({
                "id": quote.id,
                "cost": quote.cost,
                "description": quote.description,
                "created_at": quote.created_at.strftime("%Y-%m-%d %H:%M"),
                "field": quote.field.name if quote.field else None
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quote.route("/presupuestos/<int:quote_id>/pdf", methods=["GET"])
def get_quote_pdf(quote_id):
    try:
        quote = Quote.query.get(quote_id)
        if not quote:
            return jsonify({"error": "Presupuesto no encontrado"}), 404

        # Ruta donde guardas tus PDFs
        pdf_folder = os.path.join(os.getcwd(), "pdfs")
        pdf_path = os.path.join(pdf_folder, f"presupuesto_{quote_id}.pdf")

        # Si el archivo no existe, genera uno falso para probar (luego se reemplaza con generación real)
        if not os.path.exists(pdf_path):
            with open(pdf_path, "w") as f:
                f.write(f"Presupuesto #{quote_id} - Simulación de PDF")

        return send_file(pdf_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quote.route('/descargar-pdf', methods=['POST'])
def descargar_presupuesto_pdf():
    try:
        data = request.get_json()

        # Formatear fechas
        fecha_hoy = datetime.today().strftime("%d/%m/%Y")
        valid_until_format = datetime.strptime(
            data.get("valid_until"), "%Y-%m-%d").strftime("%d/%m/%Y")

        # Convertir logo a base64
        logo_path = os.path.join(
            current_app.root_path, "static", "img", "Logo_DronFarm_Oficial_sinmarco.png")

        with open(logo_path, "rb") as logo_file:
            logo_base64 = base64.b64encode(logo_file.read()).decode("utf-8")

        rendered_pdf_html = render_template(
            "presupuesto_bonito.html",
            fecha_hoy=fecha_hoy,
            valid_until=valid_until_format,
            logo_base64=logo_base64,
            user=data.get("user"),
            field=data.get("field"),
            cropType=data.get("cropType"),
            hectares=data.get("hectares"),
            services=data.get("services"),
            frequency=data.get("frequency"),
            price_per_hectare=data.get("price_per_hectare"),
            total=data.get("total")
        )

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            HTML(string=rendered_pdf_html).write_pdf(f.name)
            return send_file(
                f.name,
                as_attachment=True,
                download_name=f"presupuesto_{data.get('user').replace(' ', '_')}.pdf"
            )

    except Exception as e:
        print("❌ ERROR en /descargar-pdf:", str(e))
        return jsonify({"error": str(e)}), 500
