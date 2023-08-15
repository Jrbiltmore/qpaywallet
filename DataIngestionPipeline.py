import os,json,logging
from datetime import datetime
from pymongo import MongoClient

class DataIngestionPipeline:
    def __init__(self,s,d,l):
        self.d,self.s,self.l=d,s,l
        self.setup_logging()
        self.c,self.db=MongoClient(s),self.c.data_ingestion_db

    def setup_logging(self):
        if not os.path.exists(self.l):os.makedirs(self.l)
        logging.basicConfig(filename=f"{self.l}/data_ingestion.log",level=logging.INFO,format="%(asctime)s - %(levelname)s - %(message)s")

    def ingest_data(self):
        try:
            with open(self.d,'r') as f:
                for e in json.load(f):self.store_data(self.process_data(e))
        except Exception as e:logging.error(f"Error ingesting data: {e}")

    def process_data(self,e):
        e['timestamp']=datetime.now()
        return e

    def store_data(self,d):self.db.data_collection.insert_one(d)

if __name__=="__main__":
    d,s,l="data.json","mongodb://localhost:27017/","logs"
    p=DataIngestionPipeline(d,s,l)
    p.ingest_data()
