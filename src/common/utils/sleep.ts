export const sleep = (time: number): Promise<void> => new Promise(r => setTimeout(r, time));
