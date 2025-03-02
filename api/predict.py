from pyspark.sql import SparkSession
from pyspark.ml.pipeline import PipelineModel

def predict_eligibility(user_data):
    # Setup Spark session
    spark = SparkSession.builder.appName("CreditAppPrediction").getOrCreate()

    # Constants for features
    CATEGORIES = ["Utility Bills", "Phone Bills", "Rent Payments", "Subscriptions", "Others"]
    OFFICIAL_DOCS = [
        "International Credit Report",
        "Record of Income W2",
        "Record of Insurance payments",
        "Deed to Property (House or Car)"
    ]
    TIKTOK_FIELDS = ["followers", "following", "likes", "videos", "verified", "private"]

    def aggregate_cash_flow(cash_flow):
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

    # Process cash_flow
    cash_flow = user_data.get("cash_flow", [])
    agg = aggregate_cash_flow(cash_flow)

    # Process official_documents into 4 binary features
    docs = user_data.get("official_documents", [])
    unique_docs = set(docs) if isinstance(docs, list) else set()  # Ensure it's a list
    doc_features = [1 if doc in unique_docs else 0 for doc in OFFICIAL_DOCS]

    # Ensure digital_footprint is a dictionary
    digital_footprint = user_data.get("digital_footprint", {})
    if isinstance(digital_footprint, list):
        digital_footprint = {}  # Convert empty list to empty dict to avoid errors

    # Process TikTok fields
    tiktok = digital_footprint.get("tiktok", {})
    if not isinstance(tiktok, dict):
        tiktok = {}  # Ensure it's a dictionary

    tiktok_features = [
        int(tiktok.get("followers", 0)),
        int(tiktok.get("following", 0)),
        int(tiktok.get("likes", 0)),
        int(tiktok.get("videos", 0)),
        int(tiktok.get("verified", False)),
        int(tiktok.get("private", False))
    ]

    # Combine features in same order as training: 5 cash flow + 4 docs + 6 TikTok = 15 features
    features = [agg.get(cat, 0) for cat in CATEGORIES] + doc_features + tiktok_features
    columns = CATEGORIES + OFFICIAL_DOCS + TIKTOK_FIELDS

    # Create a DataFrame with one row of features
    df = spark.createDataFrame([tuple(features)], columns)

    # Load the trained pipeline model
    model_path = "credit_rf_model"
    model = PipelineModel.load(model_path)

    # Predict eligibility
    predictions = model.transform(df)
    result = predictions.select("prediction").collect()[0]["prediction"]

    spark.stop()
    return result