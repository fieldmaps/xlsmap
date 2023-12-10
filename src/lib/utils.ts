import { CONNECT_STR, CONTAINER } from '$env/static/private';
import { BlobServiceClient } from '@azure/storage-blob';
import { error } from '@sveltejs/kit';

function base64ToJSON(header: string) {
  const decoded = Buffer.from(header, 'base64').toString('ascii');
  return JSON.parse(decoded);
}

export function authorize(headers: Headers, slug: string) {
  const authorization = headers.get('x-ms-client-principal');
  const userRoles = authorization ? base64ToJSON(authorization).userRoles : [];
  const role = slug.replace('-', '_');
  if (!userRoles.includes(role)) throw error(401, 'Not authorized to access this resource');
}

function getContainerClient() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECT_STR);
  return blobServiceClient.getContainerClient(CONTAINER);
}

// export async function readFile(blobName: string) {
//   const blobClient = getContainerClient().getBlockBlobClient(blobName);
//   const buffer = await blobClient.downloadToBuffer();
//   const { contentType } = await blobClient.getProperties();
//   const headers = { 'Content-Type': contentType ?? 'application/octet-stream' };
//   return { buffer, headers };
// }

export async function readFile(blobName: string) {
  try {
    const blobClient = getContainerClient().getBlockBlobClient(blobName);
    const blobResponse = await blobClient.getProperties();
    return blobResponse.contentType
  } catch (err) {
    throw error(503, err.toString());
  }
}

export async function updateFile(blobName: string, buffer: ArrayBuffer, blobContentType: string) {
  const blobClient = getContainerClient().getBlockBlobClient(blobName);
  await blobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType } });
}
