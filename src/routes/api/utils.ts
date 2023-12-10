import { CLIENT, CONNECT_STR } from '$env/static/private';
import { BlobServiceClient } from '@azure/storage-blob';
import { error } from '@sveltejs/kit';

const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECT_STR);
const containerClient = blobServiceClient.getContainerClient(CLIENT);

export async function readFile(blobName: string) {
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const blobResponse = await blobClient.download();
  return blobResponse.readableStreamBody;
}

export async function updateFile(blobName: string, buffer: ArrayBuffer, contentType: string) {
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType } });
}

export function authorize(headers: Headers, slug: string) {
  const { userRoles } = JSON.parse(atob(headers.get('authorization').split(' ')[1]));
  const role = slug.replace('-', '_');
  if (!userRoles.includes(role)) throw error(401, 'Not authorized to access this resource');
}
