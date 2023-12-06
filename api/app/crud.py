from azure.storage.blob import ContentSettings
from fastapi import UploadFile

from .utils import container_client


def read_file(filename: str):
    blob_client = container_client.get_blob_client(filename)
    blob = blob_client.download_blob().readall()
    properties = blob_client.get_blob_properties()
    return (blob, properties.content_settings.content_type)


def update_file(filename: str, file: UploadFile):
    blob_client = container_client.get_blob_client(filename)
    contents = file.file.read()
    content_settings = ContentSettings(content_type=file.content_type)
    blob_client.upload_blob(contents, content_settings=content_settings, overwrite=True)
