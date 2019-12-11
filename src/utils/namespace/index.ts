import { BEM, createBEM } from './bem';
import { createComponent } from './component';
import { createI18N, Translate } from './i18n';

type CreateNamespaceReturn = [
  ReturnType<typeof createComponent>,
  BEM,
  Translate
];

export function createNamespace(name: string, prefix: string = 'line'): CreateNamespaceReturn {
  name = `${ prefix }-${ name }`;
  return [createComponent(name), createBEM(name), createI18N(name)];
}
