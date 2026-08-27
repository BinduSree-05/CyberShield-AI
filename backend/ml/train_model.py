import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "phishing_model.pkl")


# ============================================================
# START
# ============================================================

print("=" * 70)
print("CyberShield AI - 4-Class URL Classification")
print("=" * 70)


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(DATASET_PATH)

print(
    f"Original dataset size: {len(df)}"
)


# ============================================================
# CLEAN DATA
# ============================================================

df = df[["url", "type"]].dropna()

df["url"] = df["url"].astype(str)

df["type"] = (
    df["type"]
    .astype(str)
    .str.lower()
    .str.strip()
)

df = df.drop_duplicates(
    subset=["url"]
)

print(
    f"After cleaning: {len(df)}"
)


# ============================================================
# SHOW CLASS DISTRIBUTION
# ============================================================

print("\nOriginal class distribution:")

print(
    df["type"].value_counts()
)


# ============================================================
# KEEP ONLY THE FOUR REQUIRED CLASSES
# ============================================================

valid_classes = [
    "benign",
    "phishing",
    "defacement",
    "malware"
]

df = df[
    df["type"].isin(valid_classes)
].copy()


# ============================================================
# BALANCE CLASSES
# ============================================================

print("\nBalancing classes...")

class_counts = df["type"].value_counts()

print("\nAvailable samples:")

print(class_counts)


sample_size = class_counts.min()

print(
    f"\nUsing {sample_size} URLs from each class."
)


balanced_parts = []

for class_name in valid_classes:

    class_data = df[
        df["type"] == class_name
    ]

    sampled = class_data.sample(
        n=sample_size,
        random_state=42
    )

    balanced_parts.append(
        sampled
    )


balanced_df = pd.concat(
    balanced_parts,
    ignore_index=True
)


balanced_df = balanced_df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


print(
    f"Balanced dataset size: {len(balanced_df)}"
)


print("\nBalanced distribution:")

print(
    balanced_df["type"].value_counts()
)


# ============================================================
# FEATURES AND LABELS
# ============================================================

X = balanced_df["url"]

y = balanced_df["type"]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y
)


print(
    f"\nTraining samples: {len(X_train)}"
)

print(
    f"Testing samples: {len(X_test)}"
)


# ============================================================
# MODEL
# ============================================================

model = Pipeline([

    (
        "tfidf",

        TfidfVectorizer(

            analyzer="char",

            ngram_range=(2, 5),

            min_df=2,

            max_features=50000,

            sublinear_tf=True
        )
    ),

    (
        "classifier",

        LogisticRegression(

            max_iter=500,

            class_weight="balanced",

            random_state=42
        )
    )
])


# ============================================================
# TRAIN
# ============================================================

print("\nTraining model...")

print(
    "This may take a few minutes..."
)


model.fit(
    X_train,
    y_train
)


print(
    "Training completed!"
)


# ============================================================
# EVALUATION
# ============================================================

print("\nEvaluating model...")


predictions = model.predict(
    X_test
)


accuracy = accuracy_score(
    y_test,
    predictions
)


print(
    f"\nAccuracy: {accuracy * 100:.2f}%"
)


print("\nClassification Report:")


print(
    classification_report(
        y_test,
        predictions,
        labels=valid_classes,
        target_names=[
            "Benign",
            "Phishing",
            "Defacement",
            "Malware"
        ]
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

print("\nSaving model...")


joblib.dump(
    model,
    MODEL_PATH
)


print(
    "\nModel saved successfully:"
)

print(
    MODEL_PATH
)


# ============================================================
# TEST IMPORTANT URLs
# ============================================================

print("\n" + "=" * 70)

print(
    "Testing model with sample URLs"
)

print("=" * 70)


test_urls = [

    "https://www.google.com",

    "https://www.youtube.com",

    "https://www.microsoft.com",

    "https://github.com",

    "https://www.wikipedia.org",

    "http://example.com",

    "br-icloud.com.br",

    "http://www.garage-pirenne.be/index.php?option=com_content&view=article&id=70&vsig70_0=15"

]


for url in test_urls:

    prediction = model.predict(
        [url]
    )[0]

    probabilities = model.predict_proba(
        [url]
    )[0]

    confidence = max(
        probabilities
    ) * 100

    print("\nURL:")

    print(url)

    print(
        f"Prediction : {prediction}"
    )

    print(
        f"Confidence : {confidence:.2f}%"
    )


print("\n" + "=" * 70)

print("Training and testing completed.")

print("=" * 70)