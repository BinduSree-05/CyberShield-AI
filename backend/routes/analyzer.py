from flask import Blueprint, request, jsonify
from urllib.parse import urlparse
import json

from models.scan import Scan
from models import db

from ml.predictor import predict_url


analyzer_bp = Blueprint("analyzer", __name__)


# ============================================================
# RULE-BASED URL ANALYSIS
# ============================================================

def analyze_rules(url):

    reasons = []
    score = 0

    url_lower = url.lower()

    parsed = urlparse(url)

    hostname = parsed.hostname or ""

    hostname = hostname.lower()

    # --------------------------------------------------------
    # HTTPS CHECK
    # --------------------------------------------------------

    if url_lower.startswith("https://"):

        reasons.append("HTTPS enabled")

    else:

        score += 10

        reasons.append("HTTPS is not enabled")


    # --------------------------------------------------------
    # SUSPICIOUS KEYWORDS
    # --------------------------------------------------------

    keywords = [

        "login",
        "signin",
        "verify",
        "verification",
        "secure",
        "account",
        "update",
        "password",
        "confirm",
        "bank",
        "wallet",
        "credential",
        "authenticate"

    ]


    found_keywords = []

    for keyword in keywords:

        if keyword in url_lower:

            found_keywords.append(keyword)


    if found_keywords:

        # Add 10 points for each suspicious keyword,
        # but limit this category to 30 points.

        keyword_score = min(
            len(found_keywords) * 10,
            30
        )

        score += keyword_score

        reasons.append(
            "Suspicious security-related keyword detected: "
            + ", ".join(found_keywords)
        )


    # --------------------------------------------------------
    # SUSPICIOUS TLD
    # --------------------------------------------------------

    suspicious_tlds = [

        ".xyz",
        ".top",
        ".click",
        ".tk",
        ".ml",
        ".ga",
        ".cf",
        ".gq"

    ]


    for tld in suspicious_tlds:

        if hostname.endswith(tld):

            score += 20

            reasons.append(
                f"Suspicious top-level domain detected: {tld}"
            )

            break


    # --------------------------------------------------------
    # IP ADDRESS INSTEAD OF DOMAIN
    # --------------------------------------------------------

    try:

        parts = hostname.split(".")

        if len(parts) == 4 and all(
            part.isdigit()
            for part in parts
        ):

            score += 20

            reasons.append(
                "URL uses an IP address instead of a domain"
            )

    except Exception:

        pass


    # --------------------------------------------------------
    # VERY LONG URL
    # --------------------------------------------------------

    if len(url) > 150:

        score += 10

        reasons.append(
            "Unusually long URL detected"
        )


    # --------------------------------------------------------
    # MULTIPLE SUBDOMAINS
    # --------------------------------------------------------

    if hostname.count(".") >= 3:

        score += 10

        reasons.append(
            "Multiple subdomains detected"
        )


    # --------------------------------------------------------
    # LIMIT RULE SCORE
    # --------------------------------------------------------

    score = min(score, 100)


    # --------------------------------------------------------
    # RULE STATUS
    # --------------------------------------------------------

    if score >= 60:

        status = "Dangerous"

    elif score >= 30:

        status = "Suspicious"

    else:

        status = "Safe"


    return score, status, reasons


# ============================================================
# COMBINE RULES + MACHINE LEARNING
# ============================================================

def combine_results(
    rule_score,
    rule_status,
    rule_reasons,
    ml_result
):

    ml_prediction = ml_result.get(
        "prediction",
        "Unknown"
    )

    ml_confidence = float(
        ml_result.get(
            "confidence",
            0
        )
    )

    ml_risk = int(
        ml_result.get(
            "ml_risk",
            0
        )
    )

    ml_source = ml_result.get(
        "source",
        "machine-learning"
    )


    # ========================================================
    # TRUSTED DOMAIN RESULT
    # ========================================================

    if ml_source == "trusted-domain":

        final_score = rule_score

        final_status = rule_status

        final_reasons = list(
            rule_reasons
        )

        return (
            final_score,
            final_status,
            final_reasons,
            ml_prediction,
            ml_confidence,
            ml_risk
        )


    # ========================================================
    # UNKNOWN / ML ERROR
    # ========================================================

    if ml_prediction == "Unknown":

        final_score = rule_score

        final_status = rule_status

        final_reasons = list(
            rule_reasons
        )

        final_reasons.append(
            "Machine-learning classification unavailable"
        )

        return (
            final_score,
            final_status,
            final_reasons,
            "Unknown",
            0,
            0
        )


    # ========================================================
    # NORMAL HYBRID ANALYSIS
    # ========================================================

    # Use the stronger signal between the rule engine
    # and machine-learning model.

    final_score = max(
        rule_score,
        ml_risk
    )


    # --------------------------------------------------------
    # Add ML finding
    # --------------------------------------------------------

    final_reasons = list(
        rule_reasons
    )


    # Don't add a negative ML finding for benign URLs.

    if ml_prediction != "Benign":

        final_reasons.append(

            f"ML classifier predicted "
            f"{ml_prediction} with "
            f"{ml_confidence:.2f}% confidence"

        )


    # --------------------------------------------------------
    # Determine final status
    # --------------------------------------------------------

    if final_score >= 60:

        final_status = "Dangerous"

    elif final_score >= 30:

        final_status = "Suspicious"

    else:

        final_status = "Safe"


    return (
        final_score,
        final_status,
        final_reasons,
        ml_prediction,
        ml_confidence,
        ml_risk
    )


# ============================================================
# ANALYZE URL API
# ============================================================

@analyzer_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    try:

        # ====================================================
        # GET REQUEST DATA
        # ====================================================

        data = request.get_json()


        if not data or "url" not in data:

            return jsonify({

                "success": False,

                "error": "URL is required"

            }), 400


        url = str(
            data["url"]
        ).strip()


        if not url:

            return jsonify({

                "success": False,

                "error": "URL cannot be empty"

            }), 400


        # ====================================================
        # ADD HTTPS IF PROTOCOL IS MISSING
        # ====================================================

        if not url.startswith(
            ("http://", "https://")
        ):

            url = "https://" + url


        # ====================================================
        # BASIC URL VALIDATION
        # ====================================================

        try:

            parsed = urlparse(url)

            if not parsed.hostname:

                return jsonify({

                    "success": False,

                    "error": "Invalid URL"

                }), 400

        except Exception:

            return jsonify({

                "success": False,

                "error": "Invalid URL"

            }), 400


        # ====================================================
        # RULE-BASED ANALYSIS
        # ====================================================

        (
            rule_score,
            rule_status,
            rule_reasons
        ) = analyze_rules(url)


        # ====================================================
        # MACHINE LEARNING ANALYSIS
        # ====================================================

        ml_result = predict_url(url)


        # Make sure the result is a dictionary.

        if not isinstance(
            ml_result,
            dict
        ):

            ml_result = {

                "prediction": str(
                    ml_result
                ),

                "confidence": 0,

                "ml_risk": 0,

                "source": "machine-learning"

            }


        # ====================================================
        # HYBRID RESULT
        # ====================================================

        (
            final_score,
            final_status,
            final_reasons,
            ml_prediction,
            ml_confidence,
            ml_risk
        ) = combine_results(

            rule_score,

            rule_status,

            rule_reasons,

            ml_result

        )


        # ====================================================
        # REMOVE DUPLICATE REASONS
        # ====================================================

        final_reasons = list(
            dict.fromkeys(
                final_reasons
            )
        )


        # ====================================================
        # SAVE SCAN TO DATABASE
        # ====================================================

        new_scan = Scan(

            url=url,

            score=final_score,

            status=final_status,

            ml_prediction=ml_prediction,

            reasons=json.dumps(
                final_reasons
            )

        )


        db.session.add(
            new_scan
        )

        db.session.commit()


        # ====================================================
        # API RESPONSE
        # ====================================================

        return jsonify({

            "success": True,

            "score": final_score,

            "status": final_status,

            "reasons": final_reasons,

            "ml_prediction": ml_prediction,

            "ml_confidence": ml_confidence,

            "ml_risk": ml_risk,

            "rule_score": rule_score,

            "rule_status": rule_status

        }), 200


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as error:

        db.session.rollback()

        print(
            "Analysis error:",
            error
        )

        return jsonify({

            "success": False,

            "error": "Analysis failed"

        }), 500