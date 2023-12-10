import { authorize } from '$lib/utils';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  return new Response();
}
