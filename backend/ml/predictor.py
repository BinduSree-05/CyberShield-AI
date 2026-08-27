import os
import joblib
from urllib.parse import urlparse


# ============================================================
# CyberShield AI - URL Prediction Engine
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "phishing_model.pkl"
)


# ============================================================
# LOAD MACHINE LEARNING MODEL
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# KNOWN LEGITIMATE DOMAINS
#
# These domains are used to reduce false positives for
# well-known legitimate websites.
#
# The ML model is still used for unknown domains.
# ============================================================

TRUSTED_DOMAINS = {
    "google.com",
    "youtube.com",
    "microsoft.com",
    "github.com",
    "wikipedia.org",
    "amazon.com",
    "apple.com",
    "linkedin.com",
    "instagram.com",
    "facebook.com",
    "reddit.com",
    "stackoverflow.com",
    "mozilla.org",
    "python.org",
    "openai.com",
}


# ============================================================
# SUSPICIOUS SECURITY KEYWORDS
# ============================================================

SUSPICIOUS_KEYWORDS = {
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
    "authenticate",
}


# ============================================================
# EXTRACT HOSTNAME
# ============================================================

def get_hostname(url):

    try:

        parsed = urlparse(url)

        hostname = parsed.hostname or ""

        return hostname.lower().strip()

    except Exception:

        return ""


# ============================================================
# NORMALIZE DOMAIN
# ============================================================

def get_root_domain(url):

    hostname = get_hostname(url)

    if hostname.startswith("www."):

        hostname = hostname[4:]

    return hostname


# ============================================================
# CHECK TRUSTED DOMAIN
# ============================================================

def is_trusted_domain(url):

    domain = get_root_domain(url)

    if not domain:

        return False

    return domain in TRUSTED_DOMAINS


# ============================================================
# CHECK SUSPICIOUS PATH / QUERY
# ============================================================

def has_suspicious_path(url):

    try:

        parsed = urlparse(url)

        path = parsed.path or ""

        query = parsed.query or ""

        combined = (
            path +
            "?" +
            query
        ).lower()

        for keyword in SUSPICIOUS_KEYWORDS:

            if keyword in combined:

                return True

        return False

    except Exception:

        return False


# ============================================================
# CALCULATE ML RISK
# ============================================================

def calculate_ml_risk(prediction, confidence):

    prediction = prediction.lower()

    # Benign prediction
    if prediction == "benign":

        return 0

    # Phishing
    if prediction == "phishing":

        return 70

    # Defacement
    if prediction == "defacement":

        return 80

    # Malware
    if prediction == "malware":

        return 90

    return 50


# ============================================================
# MACHINE LEARNING PREDICTION
# ============================================================

def predict_url(url):

    url = str(url).strip()

    # --------------------------------------------------------
    # Empty URL
    # --------------------------------------------------------

    if not url:

        return {
            "prediction": "Unknown",
            "confidence": 0.0,
            "ml_risk": 0,
            "class_probabilities": {},
            "source": "validation"
        }


    # --------------------------------------------------------
    # Check trusted domain
    # --------------------------------------------------------

    trusted = is_trusted_domain(url)

    suspicious_path = has_suspicious_path(url)


    # --------------------------------------------------------
    # Known legitimate domain
    #
    # Example:
    #
    # https://www.youtube.com/watch?v=...
    #
    # is treated as benign because:
    #
    # 1. youtube.com is trusted
    # 2. the path/query contains no suspicious keyword
    #
    # This prevents the ML model from incorrectly calling
    # normal YouTube URLs phishing.
    # --------------------------------------------------------

    if trusted and not suspicious_path:

        return {

            "prediction": "Benign",

            "confidence": 99.0,

            "ml_risk": 0,

            "class_probabilities": {},

            "source": "trusted-domain"

        }


    # --------------------------------------------------------
    # Run machine learning model
    # --------------------------------------------------------

    try:

        prediction_value = model.predict([url])[0]

        probabilities = model.predict_proba([url])[0]

        classes = model.classes_


        # ----------------------------------------------------
        # Convert class probabilities to readable dictionary
        # ----------------------------------------------------

        class_probabilities = {}

        for class_value, probability in zip(
            classes,
            probabilities
        ):

            class_name = str(class_value).lower()

            class_probabilities[class_name] = round(
                float(probability) * 100,
                2
            )


        # ----------------------------------------------------
        # Find highest probability
        # ----------------------------------------------------

        max_probability = max(probabilities)

        confidence = round(
            float(max_probability) * 100,
            2
        )


        # ----------------------------------------------------
        # Convert model class to readable label
        # ----------------------------------------------------

        prediction_map = {

            "benign": "Benign",

            "phishing": "Phishing",

            "defacement": "Defacement",

            "malware": "Malware"

        }


        raw_prediction = str(
            prediction_value
        ).lower()


        prediction = prediction_map.get(
            raw_prediction,
            raw_prediction.capitalize()
        )


        # ----------------------------------------------------
        # Calculate ML risk
        # ----------------------------------------------------

        ml_risk = calculate_ml_risk(
            prediction,
            confidence
        )


        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {

            "prediction": prediction,

            "confidence": confidence,

            "ml_risk": ml_risk,

            "class_probabilities": class_probabilities,

            "source": "machine-learning"

        }


    except Exception as error:

        print(
            "ML prediction error:",
            error
        )

        return {

            "prediction": "Unknown",

            "confidence": 0.0,

            "ml_risk": 0,

            "class_probabilities": {},

            "source": "ml-error"

        }