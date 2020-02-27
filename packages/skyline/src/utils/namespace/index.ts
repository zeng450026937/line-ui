import { BEM, createBEM } from './bem';
import { createComponent } from './component';

type CreateNamespaceReturn = [
  ReturnType<typeof createComponent>,
  BEM,
];

export function createNamespace(name: string, prefix = 'line'): CreateNamespaceReturn {
  name = `${ prefix }-${ name }`;
  return [createComponent(name), createBEM(name)];
}
