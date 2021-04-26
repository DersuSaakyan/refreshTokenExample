import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IRefreshTokenEntity, defaultValue } from 'app/shared/model/refresh-token-entity.model';

export const ACTION_TYPES = {
  FETCH_REFRESHTOKENENTITY_LIST: 'refreshTokenEntity/FETCH_REFRESHTOKENENTITY_LIST',
  FETCH_REFRESHTOKENENTITY: 'refreshTokenEntity/FETCH_REFRESHTOKENENTITY',
  CREATE_REFRESHTOKENENTITY: 'refreshTokenEntity/CREATE_REFRESHTOKENENTITY',
  UPDATE_REFRESHTOKENENTITY: 'refreshTokenEntity/UPDATE_REFRESHTOKENENTITY',
  PARTIAL_UPDATE_REFRESHTOKENENTITY: 'refreshTokenEntity/PARTIAL_UPDATE_REFRESHTOKENENTITY',
  DELETE_REFRESHTOKENENTITY: 'refreshTokenEntity/DELETE_REFRESHTOKENENTITY',
  RESET: 'refreshTokenEntity/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRefreshTokenEntity>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type RefreshTokenEntityState = Readonly<typeof initialState>;

// Reducer

export default (state: RefreshTokenEntityState = initialState, action): RefreshTokenEntityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REFRESHTOKENENTITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REFRESHTOKENENTITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_REFRESHTOKENENTITY):
    case REQUEST(ACTION_TYPES.UPDATE_REFRESHTOKENENTITY):
    case REQUEST(ACTION_TYPES.DELETE_REFRESHTOKENENTITY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENENTITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_REFRESHTOKENENTITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REFRESHTOKENENTITY):
    case FAILURE(ACTION_TYPES.CREATE_REFRESHTOKENENTITY):
    case FAILURE(ACTION_TYPES.UPDATE_REFRESHTOKENENTITY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENENTITY):
    case FAILURE(ACTION_TYPES.DELETE_REFRESHTOKENENTITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFRESHTOKENENTITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFRESHTOKENENTITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_REFRESHTOKENENTITY):
    case SUCCESS(ACTION_TYPES.UPDATE_REFRESHTOKENENTITY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENENTITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_REFRESHTOKENENTITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/refresh-token-entities';

// Actions

export const getEntities: ICrudGetAllAction<IRefreshTokenEntity> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_REFRESHTOKENENTITY_LIST,
  payload: axios.get<IRefreshTokenEntity>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IRefreshTokenEntity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REFRESHTOKENENTITY,
    payload: axios.get<IRefreshTokenEntity>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IRefreshTokenEntity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REFRESHTOKENENTITY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRefreshTokenEntity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REFRESHTOKENENTITY,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IRefreshTokenEntity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENENTITY,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRefreshTokenEntity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REFRESHTOKENENTITY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
