import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RefreshTokenn from './refresh-tokenn';
import RefreshTokenEntity from './refresh-token-entity';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}refresh-tokenn`} component={RefreshTokenn} />
      <ErrorBoundaryRoute path={`${match.url}refresh-token-entity`} component={RefreshTokenEntity} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
