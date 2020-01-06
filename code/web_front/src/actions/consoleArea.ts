
export const CLEAR_CONSOLE = 'CLEAR_CONSOLE' as const;
export const clearConsole = () => ({
  type: CLEAR_CONSOLE,
})

export const ADD_CONSOLE = 'ADD_CONSOLE' as const;
export const addConsole = (text : string) => ({
  type: ADD_CONSOLE,
  payload: text,
})

export const addConsoleLine = (text : string) => ({
  type: ADD_CONSOLE,
  payload: text+'\n',
})

export type Actions = ReturnType<typeof clearConsole | typeof addConsole | typeof addConsoleLine >