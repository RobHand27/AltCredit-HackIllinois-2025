import os, shutil
from pyspark.sql import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml import Pipeline

# Define the feature categories
CATEGORIES = ["Utility Bills", "Phone Bills", "Rent Payments", "Subscriptions", "Others"]
OFFICIAL_DOCS = [
    "International Credit Report",
    "Record of Income W2",
    "Record of Insurance payments",
    "Deed to Property (House or Car)"
]
TIKTOK_FIELDS = ["followers", "following", "likes", "videos", "verified", "private"]

def aggregate_cash_flow(cash_flow):
    """
    Aggregate cash flow entries by summing amounts per category.
    Normalizes category names for Utility Bills, Phone Bills, Rent Payments, and Subscriptions.
    All non-matching entries are aggregated into 'Others'.
    """
    agg = {cat: 0.0 for cat in CATEGORIES}
    for entry in cash_flow:
        cat = entry.get("category", "").strip().lower()
        amount = float(entry.get("amount", 0))
        if cat in ["utility bill", "utility bills"]:
            agg["Utility Bills"] += amount
        elif cat in ["phone bill", "phone bills"]:
            agg["Phone Bills"] += amount
        elif cat in ["rent payment", "rent payments"]:
            agg["Rent Payments"] += amount
        elif cat in ["subscription", "subscriptions"]:
            agg["Subscriptions"] += amount
        else:
            agg["Others"] += amount
    return agg

async def train_model(db):
    # Fetch applications from the users collection (assuming that's where the data lives)
    apps_cursor = db.find({})
    apps = await apps_cursor.to_list(length=1000)
    if not apps:
        raise Exception("No application data found")
    spark = SparkSession.builder.appName("CreditAppTraining").getOrCreate()
    rows = []
    for app in apps:
        # Convert the application_history text to a numeric label:
        # "1" means the loan was paid back, otherwise it's 0.
        label_str = str(app.get("application_history", "0")).strip()
        if label_str == '-1':
            continue
        label = 1 if label_str == "1" else 0
        # Aggregate cash flow data into 5 numeric features
        cash_flow = app.get("cash_flow", [])
        agg = aggregate_cash_flow(cash_flow)
        
        # Convert official_documents into 5 binary features: 1 if present, else 0
        docs = app.get("official_documents", [])
        unique_docs = {doc for doc in docs if doc != "Others"}
        
        # Extract TikTok data, ensuring missing values default to 0
        digital_footprint = app.get("digital_footprint", {})
        if isinstance(digital_footprint, list):
            digital_footprint = {}  # Convert empty list to empty dict to avoid errors

        tiktok = digital_footprint.get("tiktok", {})
        tiktok_features = [
            int(tiktok.get("followers", 0)),
            int(tiktok.get("following", 0)),
            int(tiktok.get("likes", 0)),
            int(tiktok.get("videos", 0)),
            int(tiktok.get("verified", False)),  # Convert boolean to 1/0
            int(tiktok.get("private", False)),   # Convert boolean to 1/0
        ]

        # Combine aggregated cash flow, official document, and TikTok features, then append label.
        row = [float(agg.get(cat, 0)) for cat in CATEGORIES] + \
        [1 if doc in unique_docs else 0 for doc in OFFICIAL_DOCS] + \
        [float(tiktok) for tiktok in tiktok_features] + \
        [float(label)]
        rows.append(tuple(row))

    # Set up the DataFrame with feature columns and label column.
    columns = CATEGORIES + OFFICIAL_DOCS + TIKTOK_FIELDS + ["label"]
    df = spark.createDataFrame(rows, columns)

    # Assemble the features and train the Random Forest model.
    assembler = VectorAssembler(inputCols=CATEGORIES + OFFICIAL_DOCS + TIKTOK_FIELDS, outputCol="features")
    rf = RandomForestClassifier(featuresCol="features", labelCol="label")
    pipeline = Pipeline(stages=[assembler, rf])
    model = pipeline.fit(df)
    model_path = "credit_rf_model"
    if os.path.exists(model_path):
        shutil.rmtree(model_path)
    model.save(model_path)
    spark.stop()

    return model_path