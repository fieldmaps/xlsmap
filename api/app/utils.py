from os import getenv

from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

CONNECT_STR = getenv("CONNECT_STR", "")
CLIENT = getenv("CLIENT", "")

blob_service_client = BlobServiceClient.from_connection_string(CONNECT_STR)
container_client = blob_service_client.get_container_client(CLIENT)
