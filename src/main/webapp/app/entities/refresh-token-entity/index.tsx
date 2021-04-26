import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RefreshTokenEntity from './refresh-token-entity';
import RefreshTokenEntityDetail from './refresh-token-entity-detail';
import RefreshTokenEntityUpdate from './refresh-token-entity-update';
import RefreshTokenEntityDeleteDialog from './refresh-token-entity-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RefreshTokenEntityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RefreshTokenEntityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RefreshTokenEntityDetail} />
      <ErrorBoundaryRoute path={match.url} component={RefreshTokenEntity} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RefreshTokenEntityDeleteDialog} />
  </>
);

export default Routes;
