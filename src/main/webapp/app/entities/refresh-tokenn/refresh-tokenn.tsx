import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './refresh-tokenn.reducer';
import { IRefreshTokenn } from 'app/shared/model/refresh-tokenn.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRefreshTokennProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const RefreshTokenn = (props: IRefreshTokennProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { refreshTokennList, match, loading } = props;
  return (
    <div>
      <h2 id="refresh-tokenn-heading" data-cy="RefreshTokennHeading">
        <Translate contentKey="jHipsterApp.refreshTokenn.home.title">Refresh Tokenns</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="jHipsterApp.refreshTokenn.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jHipsterApp.refreshTokenn.home.createLabel">Create new Refresh Tokenn</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {refreshTokennList && refreshTokennList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenn.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenn.regionName">Region Name</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenn.expiryDate">Expiry Date</Translate>
                </th>
                <th>
                  <Translate contentKey="jHipsterApp.refreshTokenn.token">Token</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {refreshTokennList.map((refreshTokenn, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${refreshTokenn.id}`} color="link" size="sm">
                      {refreshTokenn.id}
                    </Button>
                  </td>
                  <td>{refreshTokenn.regionName}</td>
                  <td>
                    {refreshTokenn.expiryDate ? <TextFormat type="date" value={refreshTokenn.expiryDate} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{refreshTokenn.token}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${refreshTokenn.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${refreshTokenn.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${refreshTokenn.id}/delete`}
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
              <Translate contentKey="jHipsterApp.refreshTokenn.home.notFound">No Refresh Tokenns found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ refreshTokenn }: IRootState) => ({
  refreshTokennList: refreshTokenn.entities,
  loading: refreshTokenn.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokenn);
