import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './refresh-token-entity.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRefreshTokenEntityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RefreshTokenEntityDetail = (props: IRefreshTokenEntityDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { refreshTokenEntityEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="refreshTokenEntityDetailsHeading">
          <Translate contentKey="jHipsterApp.refreshTokenEntity.detail.title">RefreshTokenEntity</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{refreshTokenEntityEntity.id}</dd>
          <dt>
            <span id="expiryDate">
              <Translate contentKey="jHipsterApp.refreshTokenEntity.expiryDate">Expiry Date</Translate>
            </span>
          </dt>
          <dd>
            {refreshTokenEntityEntity.expiryDate ? (
              <TextFormat value={refreshTokenEntityEntity.expiryDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="token">
              <Translate contentKey="jHipsterApp.refreshTokenEntity.token">Token</Translate>
            </span>
          </dt>
          <dd>{refreshTokenEntityEntity.token}</dd>
          <dt>
            <Translate contentKey="jHipsterApp.refreshTokenEntity.user">User</Translate>
          </dt>
          <dd>{refreshTokenEntityEntity.user ? refreshTokenEntityEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/refresh-token-entity" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/refresh-token-entity/${refreshTokenEntityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ refreshTokenEntity }: IRootState) => ({
  refreshTokenEntityEntity: refreshTokenEntity.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokenEntityDetail);
