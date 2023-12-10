import { authorize } from '../../utils.js';

export async function GET({ params, request }) {
  authorize(request.headers, params.slug);
  return new Response();
}
