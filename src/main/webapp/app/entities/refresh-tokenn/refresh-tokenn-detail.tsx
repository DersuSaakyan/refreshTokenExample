import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './refresh-tokenn.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRefreshTokennDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RefreshTokennDetail = (props: IRefreshTokennDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { refreshTokennEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="refreshTokennDetailsHeading">
          <Translate contentKey="jHipsterApp.refreshTokenn.detail.title">RefreshTokenn</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{refreshTokennEntity.id}</dd>
          <dt>
            <span id="regionName">
              <Translate contentKey="jHipsterApp.refreshTokenn.regionName">Region Name</Translate>
            </span>
          </dt>
          <dd>{refreshTokennEntity.regionName}</dd>
          <dt>
            <span id="expiryDate">
              <Translate contentKey="jHipsterApp.refreshTokenn.expiryDate">Expiry Date</Translate>
            </span>
          </dt>
          <dd>
            {refreshTokennEntity.expiryDate ? (
              <TextFormat value={refreshTokennEntity.expiryDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="token">
              <Translate contentKey="jHipsterApp.refreshTokenn.token">Token</Translate>
            </span>
          </dt>
          <dd>{refreshTokennEntity.token}</dd>
        </dl>
        <Button tag={Link} to="/refresh-tokenn" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/refresh-tokenn/${refreshTokennEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ refreshTokenn }: IRootState) => ({
  refreshTokennEntity: refreshTokenn.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokennDetail);
