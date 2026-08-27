from urllib.parse import urlparse
import re

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "update", "secure",
    "bank", "paypal", "signin", "account",
    "confirm", "password"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".click", ".gq", ".tk",
    ".ml", ".cf"
]


def analyze_url(url):
    score = 0
    reasons = []

    parsed = urlparse(url)
    hostname = parsed.hostname or ""

    # HTTPS
    if parsed.scheme != "https":
        score += 20
        reasons.append("Website is not using HTTPS")
    else:
        reasons.append("HTTPS enabled")

    # URL Length
    if len(url) > 75:
        score += 15
        reasons.append("URL is unusually long")

    # IP Address
    if re.match(r"^(http://|https://)?(\d{1,3}\.){3}\d{1,3}", url):
        score += 30
        reasons.append("Uses an IP address instead of a domain")

    # Too many subdomains
    if hostname.count(".") >= 3:
        score += 15
        reasons.append("Too many subdomains")

    # Suspicious keywords
    lower = url.lower()

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in lower:
            score += 10
            reasons.append(f"Suspicious keyword detected: {keyword}")

    # @ symbol
    if "@" in url:
        score += 20
        reasons.append("Contains '@' symbol")

    # Encoded URL
    if "%" in url:
        score += 15
        reasons.append("Contains encoded characters")

    # Too many hyphens
    if hostname.count("-") >= 3:
        score += 10
        reasons.append("Too many hyphens in domain")

    # Too many digits
    digits = sum(c.isdigit() for c in hostname)

    if digits >= 6:
        score += 10
        reasons.append("Too many digits in domain")

    # Suspicious TLD
    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            score += 15
            reasons.append(f"Suspicious top-level domain: {tld}")

    # Final status
    if score < 20:
        status = "Safe"
    elif score < 50:
        status = "Suspicious"
    else:
        status = "Dangerous"

    return {
        "score": score,
        "status": status,
        "reasons": reasons
    }