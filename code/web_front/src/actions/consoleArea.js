
export const CLEAR_CONSOLE = 'CLEAR_CONSOLE';
export const clearConsole = () => ({
  type: CLEAR_CONSOLE,
})

export const ADD_CONSOLE = 'ADD_CONSOLE';
export const addConsole = (text) => ({
  type: ADD_CONSOLE,
  payload: text,
})

export const addConsoleLine = (text) => ({
  type: ADD_CONSOLE,
  payload: text+'\n',
})
