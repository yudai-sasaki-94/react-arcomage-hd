import { RESOURCE_PROD, UPDATE_STATUS } from '../constants/ActionTypes'
import { RootActionType } from '../types/actionObj'
import { withLatestFrom, filter, map } from 'rxjs/operators'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../types/state'
import { entries } from '../utils/typeHelpers'
import { resProdMap } from '../constants/resourceNames'

export const resourceProdEpic = (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(RESOURCE_PROD)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const currentStatus = state.status[action.owner]

      const payload = entries(resProdMap).map(([prod, res]) => ({
        isPlayer: action.owner === 'player',
        statusProp: res,
        diff: currentStatus[prod],
        noSound: true,
      }))

      return {
        type: UPDATE_STATUS,
        payload,
      }
    }),
  )

export default resourceProdEpic
