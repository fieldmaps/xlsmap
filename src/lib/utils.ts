import { CONNECT_STR, CONTAINER } from '$env/static/private';
import { BlobServiceClient } from '@azure/storage-blob';
import { error } from '@sveltejs/kit';

function base64ToJSON(header: string) {
  const encoded = Buffer.from(header, 'base64');
  const decoded = encoded.toString('ascii');
  return JSON.parse(decoded);
}

function getContainerClient() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECT_STR);
  return blobServiceClient.getContainerClient(CONTAINER);
}

export function authorize(headers: Headers, slug: string) {
  const authorization = headers.get('x-ms-client-principal');
  const userRoles = authorization ? base64ToJSON(authorization).userRoles : [];
  const role = slug.replace('-', '_');
  if (!userRoles.includes(role)) throw error(401, 'Not authorized to access this resource');
}

export async function readFile(blobName: string) {
  const blobClient = getContainerClient().getBlockBlobClient(blobName);
  const blobResponse = await blobClient.download();
  return blobResponse.readableStreamBody;
}

export async function updateFile(blobName: string, buffer: ArrayBuffer, contentType: string) {
  const blobClient = getContainerClient().getBlockBlobClient(blobName);
  await blobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType } });
}
