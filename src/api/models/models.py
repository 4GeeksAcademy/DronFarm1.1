from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, DateTime, Date, Time, ForeignKey, Enum, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, time as dt_time, date as dt_date
from enum import Enum as PyEnum
from datetime import datetime, timedelta
import uuid
from sqlalchemy.dialects.postgresql import JSON


db = SQLAlchemy()

# ENUM PARA ESTADO DE CITAS


class AppointmentStatus(PyEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

# MODELO DE USUARIO


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    lastname: Mapped[str] = mapped_column(String(100), nullable=False)
    dni: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    rolId: Mapped[int] = mapped_column(Integer, default=2)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    # Relaciones
    fields = relationship("Field", backref="user",
                          cascade="all, delete-orphan")
    reports = relationship("Report", backref="user",
                           cascade="all, delete-orphan")
    quotes = relationship("Quote", backref="user",
                          cascade="all, delete-orphan")
    appointments = relationship(
        "Appointment", backref="user", cascade="all, delete-orphan")

    def __init__(self, name, lastname, dni, email, password, rolId=2):
        self.name = name
        self.lastname = lastname
        self.dni = dni
        self.email = email
        self.set_password(password)
        self.rolId = rolId

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "dni": self.dni,
            "email": self.email,
            "rolId": self.rolId,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.id} - {self.email}>"

# MODELO DE PARCELA


class Field(db.Model):
    __tablename__ = "fields"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    area: Mapped[float] = mapped_column(Float)
    crop: Mapped[str] = mapped_column(String(100))
    street: Mapped[str] = mapped_column(String(100))
    number: Mapped[str] = mapped_column(String(10))
    postal_code: Mapped[str] = mapped_column(String(10))
    city: Mapped[str] = mapped_column(String(100))
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    # 👇 ❇️ Riki * Nuevo campo para coordenadas GPS
    coordinates: Mapped[str] = mapped_column(String(50), nullable=True)
    geometry = db.Column(JSON, nullable=True)
    # ------------------------ #

    # Relaciones
    images = relationship("Image", backref="field", cascade="all, delete-orphan")
    reports = relationship("Report", backref="field", cascade="all, delete-orphan")
    quotes = relationship("Quote", backref="field", cascade="all, delete-orphan")
    appointments = relationship("Appointment", backref="field", cascade="all, delete-orphan")

    def serialize_field(self):
        return {
            "id": self.id,
            "name": self.name,
            "area": self.area,
            "crop": self.crop,
            "street": self.street,
            "number": self.number,
            "postal_code": self.postal_code,
            "city": self.city,
            "user_id": self.user_id,
            "coordinates": self.coordinates,
            "geometry": self.geometry
        }

    def __repr__(self):
        return f"<Field {self.id} - {self.name}>"

# MODELO DE IMAGEN


class Image(db.Model):
    __tablename__ = "images"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    upload_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    field_id: Mapped[int] = mapped_column(
        ForeignKey("fields.id"), nullable=False)

    def serialize_image(self):
        return {
            "id": self.id,
            "file_name": self.file_name,
            "url": self.url,
            "upload_date": self.upload_date.isoformat(),
            "field_id": self.field_id
        }

    def __repr__(self):
        return f"<Image {self.id} - {self.file_name}>"

# MODELO DE INFORME


class Report(db.Model):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    field_id: Mapped[int] = mapped_column(
        ForeignKey("fields.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=True)

    def serialize_report(self):
        return {
            "id": self.id,
            "title": self.title,
            "file_name": self.file_name,
            "url": self.url,
            "description": self.description,
            "date": self.date.isoformat(),
            "field_id": self.field_id,
            "user_id": self.user_id
        }

    def __repr__(self):
        return f"<Report {self.id} - {self.file_name}>"

# MODELO DE PRESUPUESTO


class Quote(db.Model):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cost: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    field_id: Mapped[int] = mapped_column(
        ForeignKey("fields.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=True)

    def serialize_quote(self):
        return {
            "id": self.id,
            "cost": self.cost,
            "description": self.description,
            "field_id": self.field_id,
            "user_id": self.user_id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M") if self.created_at else None
        }

    def __repr__(self):
        return f"<Quote {self.id} - ${self.cost}>"

# MODELO DE CITA


class Appointment(db.Model):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[dt_date] = mapped_column(Date, nullable=False)
    time: Mapped[dt_time] = mapped_column(Time, nullable=False)
    field_id: Mapped[int] = mapped_column(
        ForeignKey("fields.id"), nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)

    def serialize_appointment(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "time": self.time.strftime("%H:%M:%S"),
            "field_id": self.field_id,
            "status": self.status.value,
            "user_id": self.user_id
        }

    def __repr__(self):
        return f"<Appointment {self.id} - {self.date} {self.time}>"


class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    expiration: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user = relationship("User", backref="reset_tokens")

    def __init__(self, user_id: int):
        self.token = str(uuid.uuid4())
        self.user_id = user_id
        self.expiration = datetime.utcnow() + timedelta(hours=1)
        self.used = False

    def serialize(self):
        return {
            "token": self.token,
            "user_id": self.user_id,
            "expiration": self.expiration.isoformat(),
            "used": self.used
        }

    def __repr__(self):
        return f"<PasswordResetToken {self.id} - {self.token}>"


# MODELO DE PRECIO DE PRODUCTOS AGRÍCOLAS

class ProductPrice(db.Model):
    __tablename__ = "product_prices"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    origin: Mapped[str] = mapped_column(String(100), nullable=True)
    min_price: Mapped[float] = mapped_column(Float, nullable=True)
    max_price: Mapped[float] = mapped_column(Float, nullable=True)
    market: Mapped[str] = mapped_column(String(100), default="Mercabarna")
    date: Mapped[Date] = mapped_column(Date, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product,
            "category": self.category,
            "origin": self.origin,
            "min_price": self.min_price,
            "max_price": self.max_price,
            "market": self.market,
            "date": self.date.isoformat(),
        }

    def __repr__(self):
        return f"<ProductPrice {self.product} - {self.date}>"
