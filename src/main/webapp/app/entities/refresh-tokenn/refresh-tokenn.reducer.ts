import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IRefreshTokenn, defaultValue } from 'app/shared/model/refresh-tokenn.model';

export const ACTION_TYPES = {
  FETCH_REFRESHTOKENN_LIST: 'refreshTokenn/FETCH_REFRESHTOKENN_LIST',
  FETCH_REFRESHTOKENN: 'refreshTokenn/FETCH_REFRESHTOKENN',
  CREATE_REFRESHTOKENN: 'refreshTokenn/CREATE_REFRESHTOKENN',
  UPDATE_REFRESHTOKENN: 'refreshTokenn/UPDATE_REFRESHTOKENN',
  PARTIAL_UPDATE_REFRESHTOKENN: 'refreshTokenn/PARTIAL_UPDATE_REFRESHTOKENN',
  DELETE_REFRESHTOKENN: 'refreshTokenn/DELETE_REFRESHTOKENN',
  RESET: 'refreshTokenn/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRefreshTokenn>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type RefreshTokennState = Readonly<typeof initialState>;

// Reducer

export default (state: RefreshTokennState = initialState, action): RefreshTokennState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REFRESHTOKENN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REFRESHTOKENN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_REFRESHTOKENN):
    case REQUEST(ACTION_TYPES.UPDATE_REFRESHTOKENN):
    case REQUEST(ACTION_TYPES.DELETE_REFRESHTOKENN):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_REFRESHTOKENN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REFRESHTOKENN):
    case FAILURE(ACTION_TYPES.CREATE_REFRESHTOKENN):
    case FAILURE(ACTION_TYPES.UPDATE_REFRESHTOKENN):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENN):
    case FAILURE(ACTION_TYPES.DELETE_REFRESHTOKENN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFRESHTOKENN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFRESHTOKENN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_REFRESHTOKENN):
    case SUCCESS(ACTION_TYPES.UPDATE_REFRESHTOKENN):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_REFRESHTOKENN):
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

const apiUrl = 'api/refresh-tokenns';

// Actions

export const getEntities: ICrudGetAllAction<IRefreshTokenn> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_REFRESHTOKENN_LIST,
  payload: axios.get<IRefreshTokenn>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IRefreshTokenn> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REFRESHTOKENN,
    payload: axios.get<IRefreshTokenn>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IRefreshTokenn> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REFRESHTOKENN,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRefreshTokenn> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REFRESHTOKENN,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IRefreshTokenn> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_REFRESHTOKENN,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRefreshTokenn> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REFRESHTOKENN,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
