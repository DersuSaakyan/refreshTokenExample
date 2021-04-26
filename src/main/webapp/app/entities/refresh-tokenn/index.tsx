import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RefreshTokenn from './refresh-tokenn';
import RefreshTokennDetail from './refresh-tokenn-detail';
import RefreshTokennUpdate from './refresh-tokenn-update';
import RefreshTokennDeleteDialog from './refresh-tokenn-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RefreshTokennUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RefreshTokennUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RefreshTokennDetail} />
      <ErrorBoundaryRoute path={match.url} component={RefreshTokenn} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RefreshTokennDeleteDialog} />
  </>
);

export default Routes;
