import { Exit } from 'effect'

/**
 * Utility function to extract error from an Exit.
 * Returns the error if the exit is a failure with a Fail cause, otherwise returns null.
 */
export const getExitError = <A, E = never>(exit: Exit.Exit<A, E>) => {
  if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
    return exit.cause.error
  }

  // console.log(exit)

  return null
}
