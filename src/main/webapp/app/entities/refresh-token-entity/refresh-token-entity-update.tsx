import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './refresh-token-entity.reducer';
import { IRefreshTokenEntity } from 'app/shared/model/refresh-token-entity.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRefreshTokenEntityUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RefreshTokenEntityUpdate = (props: IRefreshTokenEntityUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { refreshTokenEntityEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/refresh-token-entity');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.expiryDate = convertDateTimeToServer(values.expiryDate);

    if (errors.length === 0) {
      const entity = {
        ...refreshTokenEntityEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jHipsterApp.refreshTokenEntity.home.createOrEditLabel" data-cy="RefreshTokenEntityCreateUpdateHeading">
            <Translate contentKey="jHipsterApp.refreshTokenEntity.home.createOrEditLabel">Create or edit a RefreshTokenEntity</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : refreshTokenEntityEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="refresh-token-entity-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="refresh-token-entity-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="expiryDateLabel" for="refresh-token-entity-expiryDate">
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.expiryDate">Expiry Date</Translate>
                </Label>
                <AvInput
                  id="refresh-token-entity-expiryDate"
                  data-cy="expiryDate"
                  type="datetime-local"
                  className="form-control"
                  name="expiryDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.refreshTokenEntityEntity.expiryDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tokenLabel" for="refresh-token-entity-token">
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.token">Token</Translate>
                </Label>
                <AvField id="refresh-token-entity-token" data-cy="token" type="text" name="token" />
              </AvGroup>
              <AvGroup>
                <Label for="refresh-token-entity-user">
                  <Translate contentKey="jHipsterApp.refreshTokenEntity.user">User</Translate>
                </Label>
                <AvInput id="refresh-token-entity-user" data-cy="user" type="select" className="form-control" name="userId">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/refresh-token-entity" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  refreshTokenEntityEntity: storeState.refreshTokenEntity.entity,
  loading: storeState.refreshTokenEntity.loading,
  updating: storeState.refreshTokenEntity.updating,
  updateSuccess: storeState.refreshTokenEntity.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokenEntityUpdate);
