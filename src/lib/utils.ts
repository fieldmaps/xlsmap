import { SAS_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

const [AZURE_URL, SAS_TOKEN] = SAS_URL.split('?');

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

export async function readFile(blobName: string) {
  const res = await fetch(`${AZURE_URL}/${blobName}?${SAS_TOKEN}`);
  return await res.blob();
}

export async function updateFile(blobName: string, body: Blob) {
  const options: RequestInit = { method: 'PUT', body };
  await fetch(`${AZURE_URL}/${blobName}?${SAS_TOKEN}`, options);
}
