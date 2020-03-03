import { BEM, createBEM } from 'skyline/utils/bem';
import { CreateComponent, defineComponent } from 'skyline/utils/component';

type CreateNamespaceReturn = {
  createComponent: CreateComponent;
  bem: BEM;
};

export function createNamespace(name: string, prefix = 'line'): CreateNamespaceReturn {
  name = `${ prefix }-${ name }`;
  return {
    createComponent : defineComponent(name),
    bem             : createBEM(name),
  };
}
