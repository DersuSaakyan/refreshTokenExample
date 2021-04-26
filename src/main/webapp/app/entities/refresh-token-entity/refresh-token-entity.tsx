import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './refresh-token-entity.reducer';
import { IRefreshTokenEntity } from 'app/shared/model/refresh-token-entity.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRefreshTokenEntityProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const RefreshTokenEntity = (props: IRefreshTokenEntityProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { refreshTokenEntityList, match, loading } = props;
  return (
    <div>
      <h2 id="refresh-token-entity-heading" data-cy="RefreshTokenEntityHeading">
        <Translate contentKey="jHipsterApp.refreshTokenEntity.home.title">Refresh Token Entities</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="jHipsterApp.refreshTokenEntity.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jHipsterApp.refreshTokenEntity.home.createLabel">Create new Refresh Token Entity</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {refreshTokenEntityList && refreshTokenEntityList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.expiryDate">Expiry Date</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.token">Token</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {refreshTokenEntityList.map((refreshTokenEntity, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${refreshTokenEntity.id}`} color="link" size="sm">
                      {refreshTokenEntity.id}
                    </Button>
                  </td>
                  <td>
                    {refreshTokenEntity.expiryDate ? (
                      <TextFormat type="date" value={refreshTokenEntity.expiryDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{refreshTokenEntity.token}</td>
                  <td>{refreshTokenEntity.user ? refreshTokenEntity.user.id : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${refreshTokenEntity.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${refreshTokenEntity.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${refreshTokenEntity.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="jHipsterApp.refreshTokenEntity.home.notFound">No Refresh Token Entities found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ refreshTokenEntity }: IRootState) => ({
  refreshTokenEntityList: refreshTokenEntity.entities,
  loading: refreshTokenEntity.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokenEntity);
