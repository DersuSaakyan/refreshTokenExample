import dayjs from 'dayjs';

export interface IRefreshTokenn {
  id?: number;
  regionName?: string | null;
  expiryDate?: string | null;
  token?: string | null;
}

export const defaultValue: Readonly<IRefreshTokenn> = {};
