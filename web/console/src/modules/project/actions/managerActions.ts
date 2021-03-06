import { ProjectEdition } from './../models/Project';
import { extend } from '@tencent/qcloud-lib';
import { RootState, Manager, ManagerFilter } from '../models';
import * as WebAPI from '../WebAPI';
import { createListAction } from '@tencent/redux-list';
import * as ActionType from '../constants/ActionType';
import { generateWorkflowActionCreator, OperationTrigger, isSuccessWorkflow } from '@tencent/qcloud-redux-workflow';
import { projectActions } from './projectActions';

type GetState = () => RootState;

const FFModelManagerActions = createListAction<Manager, ManagerFilter>({
  actionName: 'manager',
  fetcher: async (query, getState: GetState) => {
    let response = await WebAPI.fetchUser(query);
    return response;
  },
  getRecord: (getState: GetState) => {
    return getState().manager;
  }
});
const restActions = {
  selectManager: (manager: Manager[]) => {
    return async (dispatch: Redux.Dispatch, getState: GetState) => {
      dispatch(FFModelManagerActions.selects(manager));
    };
  },

  fetchAdminstratorInfo: () => {
    return async (dispatch: Redux.Dispatch, getState: GetState) => {
      let response = await WebAPI.fetchAdminstratorInfo();
      dispatch({
        type: ActionType.FetchAdminstratorInfo,
        payload: response
      });
    };
  },

  modifyAdminstrator: generateWorkflowActionCreator<ProjectEdition, void>({
    actionType: ActionType.ModifyAdminstrator,
    workflowStateLocator: (state: RootState) => state.modifyAdminstrator,
    operationExecutor: WebAPI.modifyAdminstrator,
    after: {
      [OperationTrigger.Done]: (dispatch, getState) => {
        let { modifyAdminstrator, route } = getState();
        if (isSuccessWorkflow(modifyAdminstrator)) {
          dispatch(restActions.modifyAdminstrator.reset());
          dispatch(restActions.fetchAdminstratorInfo());
          dispatch(projectActions.clearEdition());
        }
      }
    }
  }),

  initAdminstrator: () => {
    return async (dispatch: Redux.Dispatch, getState: GetState) => {
      let {
        adminstratorInfo,
        manager: { list }
      } = getState();
      if (adminstratorInfo.spec) {
        let members = adminstratorInfo.spec.administrators
          ? adminstratorInfo.spec.administrators.map(item => {
              let finder = list.data.records.find(manager => manager.name === item);
              if (finder) {
                return finder;
              } else {
                return {
                  name: item,
                  displayName: '用户不存在'
                };
              }
            })
          : [];
        dispatch({
          type: ActionType.UpdateProjectEdition,
          payload: Object.assign({}, getState().projectEdition, {
            members,
            resourceVersion: adminstratorInfo.metadata.resourceVersion,
            id: adminstratorInfo.metadata.name
          })
        });
      }
    };
  }
};

export const managerActions = extend({}, FFModelManagerActions, restActions);
