from datetime import datetime
from zoneinfo import ZoneInfo
from . import db


class Scan(db.Model):
    __tablename__ = "scans"

    id = db.Column(db.Integer, primary_key=True)

    url = db.Column(
        db.String(500),
        nullable=False
    )

    score = db.Column(
        db.Integer,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False
    )

    ml_prediction = db.Column(
        db.String(50),
        nullable=True
    )

    reasons = db.Column(
        db.Text,
        nullable=False
    )

    scanned_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(ZoneInfo("Asia/Kolkata"))
    )