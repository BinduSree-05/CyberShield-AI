from zoneinfo import ZoneInfo
from flask import Blueprint, jsonify
from models.scan import Scan
from models import db
import json


history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
def get_history():

    scans = Scan.query.order_by(
        Scan.id.desc()
    ).all()

    history = []

    for scan in scans:

        try:
            reasons = json.loads(scan.reasons) if scan.reasons else []
        except Exception:
            reasons = [scan.reasons] if scan.reasons else []

        history.append({
            "id": scan.id,
            "url": scan.url,
            "score": scan.score,
            "status": scan.status,
            "ml_prediction": scan.ml_prediction,
            "reasons": reasons,
            "date": (
                scan.scanned_at
                .replace(tzinfo=ZoneInfo("Asia/Kolkata"))
                .strftime("%d %b %Y, %I:%M %p")
                if scan.scanned_at
                else ""
            )
        })

    return jsonify(history), 200


@history_bp.route("/history", methods=["DELETE"])
def delete_history():

    try:

        Scan.query.delete()
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Scan history cleared successfully"
        }), 200

    except Exception as error:

        db.session.rollback()

        print("Clear history error:", error)

        return jsonify({
            "success": False,
            "message": "Could not clear history"
        }), 500