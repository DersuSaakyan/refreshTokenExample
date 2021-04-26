import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IRefreshTokenEntity {
  id?: number;
  expiryDate?: string | null;
  token?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IRefreshTokenEntity> = {};
