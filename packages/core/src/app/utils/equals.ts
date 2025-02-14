import { Range } from '../../types/db'
import { StateObject, StateUpdate } from '../../types/serialization'

/**
 * All of the below functions check whether or not the two provided objects are equal,
 * returning true if they are and false otherwise
 */

export const objectsEqual = (obj1: {}, obj2: {}): boolean => {
  if (obj1 === undefined && obj2 === undefined) {
    return true
  }

  if (obj1 === undefined || obj2 === undefined) {
    return false
  }

  const props: string[] = Object.getOwnPropertyNames(obj1)
  if (props.length !== Object.getOwnPropertyNames(obj2).length) {
    return false
  }

  for (const prop of props) {
    if (!obj2.hasOwnProperty(prop)) {
      return false
    }

    // TODO: This won't work for reference types, but it'll work for now
    if (obj1[prop] !== obj2[prop]) {
      return false
    }
  }

  return true
}

export const rangesEqual = (range1: Range, range2: Range): boolean => {
  return (
    range1 !== undefined &&
    range2 !== undefined &&
    range1.start.eq(range2.start) &&
    range1.end.eq(range2.end)
  )
}

export const stateObjectsEqual = (
  stateObject1: StateObject,
  stateObject2: StateObject
): boolean => {
  return (
    stateObject1 !== undefined &&
    stateObject2 !== undefined &&
    stateObject1.predicateAddress === stateObject2.predicateAddress &&
    objectsEqual(stateObject1.data, stateObject2.data)
  )
}

export const stateUpdatesEqual = (
  stateUpdate1: StateUpdate,
  stateUpdate2: StateUpdate
): boolean => {
  return (
    stateUpdate1 !== undefined &&
    stateUpdate2 !== undefined &&
    stateUpdate1.plasmaBlockNumber.eq(stateUpdate2.plasmaBlockNumber) &&
    stateUpdate1.depositAddress === stateUpdate2.depositAddress &&
    rangesEqual(stateUpdate1.range, stateUpdate2.range) &&
    stateObjectsEqual(stateUpdate1.stateObject, stateUpdate2.stateObject)
  )
}
