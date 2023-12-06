from datetime import date

from fastapi import APIRouter, Depends, Response, UploadFile

from .crud import read_file, update_file
from .validators import authorized

router = APIRouter()


@router.get("/{slug}/data.xlsx")
def data_get(slug: str, auth=Depends(authorized)):
    media, media_type = read_file(f"{slug}/data.xlsx")
    return Response(media, media_type=media_type)


@router.put("/{slug}/data.xlsx")
def data_put(slug: str, file: UploadFile, auth=Depends(authorized)):
    today = date.today().isoformat()
    update_file(f"{slug}/data.xlsx", file)
    update_file(f"{slug}/data/data_{today}.xlsx", file)
    return {"detail": "Data uploaded"}


@router.get("/{slug}/form.xlsx")
def form_get(slug: str, auth=Depends(authorized)):
    media, media_type = read_file(f"{slug}/form.xlsx")
    return Response(media, media_type=media_type)


@router.get("/{slug}/areas.geojson")
def areas_get(slug: str, auth=Depends(authorized)):
    media, media_type = read_file(f"{slug}/areas.geojson")
    return Response(media, media_type=media_type)
