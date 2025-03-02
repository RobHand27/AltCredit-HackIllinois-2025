from pyspark.sql import SparkSession

print("Initializing Spark...")

spark = SparkSession.builder.master("local[1]")  # Use only 1 core
spark = spark.config("spark.driver.host", "127.0.0.1")  # Force local loopback
spark = spark.config("spark.executor.memory", "1g")  # Limit memory usage
spark = spark.appName("TestSession")
spark = spark.getOrCreate()

print("Spark Initialized!")