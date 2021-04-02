export type InitializeStore = { initialize(): Promise<void> };
type FunctionType = (...args: any[]) => void | Promise<void>;

type Initialization = InitializeStore | FunctionType | Promise<any>;

interface Type<T> {
  new (...args: any[]): T;
}

const isPromise = (promise: any): promise is Promise<any> => promise instanceof Promise;

export const initialize = async (...initializations: Initialization[]): Promise<void> => {
  for (const initialization of initializations) {
    const module = await initialization;
    if (typeof module === 'function') {
      await module();
      continue;
    }
    await module.initialize();
  }
};
