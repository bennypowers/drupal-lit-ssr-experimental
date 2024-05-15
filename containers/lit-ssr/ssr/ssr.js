import { render } from '@lit-labs/ssr';

import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@rhds/elements/rh-card/rh-card.js';
import '@rhds/elements/rh-cta/rh-cta.js';

export async function ssr(input) {
  return collectResult(render(html`${unsafeHTML(input)}`));
}

