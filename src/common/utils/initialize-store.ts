export type InitializeStore = { initialize(): Promise<void>; isInitialized: boolean };
type FunctionType = (...args: any[]) => void | Promise<void>;

type Initialization = InitializeStore | FunctionType | Promise<any>;

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
