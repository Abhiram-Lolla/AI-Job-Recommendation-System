from pymongo import MongoClient
print("Checking mongo")
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    print(client.server_info())
except Exception as e:
    print(e)
