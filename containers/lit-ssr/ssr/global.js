export async function renderGlobal(html) {
  await import('./shims.js');
  const { ssr } = await import('./ssr.js');
  return ssr(html);
}
