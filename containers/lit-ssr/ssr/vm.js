
import { ModuleLoader } from '@lit-labs/ssr/lib/module-loader.js';

export async function renderInVm(html) {
  const moduleLoader = new ModuleLoader();
  const importResult = await moduleLoader.importModule('./ssr.js', import.meta.url);
  return importResult.module.namespace.ssr(html);
}
