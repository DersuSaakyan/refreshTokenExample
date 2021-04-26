import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './refresh-tokenn.reducer';
import { IRefreshTokenn } from 'app/shared/model/refresh-tokenn.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRefreshTokennUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RefreshTokennUpdate = (props: IRefreshTokennUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { refreshTokennEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/refresh-tokenn');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
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
        ...refreshTokennEntity,
        ...values,
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
          <h2 id="jHipsterApp.refreshTokenn.home.createOrEditLabel" data-cy="RefreshTokennCreateUpdateHeading">
            <Translate contentKey="jHipsterApp.refreshTokenn.home.createOrEditLabel">Create or edit a RefreshTokenn</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : refreshTokennEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="refresh-tokenn-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="refresh-tokenn-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="regionNameLabel" for="refresh-tokenn-regionName">
                  <Translate contentKey="jHipsterApp.refreshTokenn.regionName">Region Name</Translate>
                </Label>
                <AvField id="refresh-tokenn-regionName" data-cy="regionName" type="text" name="regionName" />
              </AvGroup>
              <AvGroup>
                <Label id="expiryDateLabel" for="refresh-tokenn-expiryDate">
                  <Translate contentKey="jHipsterApp.refreshTokenn.expiryDate">Expiry Date</Translate>
                </Label>
                <AvInput
                  id="refresh-tokenn-expiryDate"
                  data-cy="expiryDate"
                  type="datetime-local"
                  className="form-control"
                  name="expiryDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.refreshTokennEntity.expiryDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tokenLabel" for="refresh-tokenn-token">
                  <Translate contentKey="jHipsterApp.refreshTokenn.token">Token</Translate>
                </Label>
                <AvField id="refresh-tokenn-token" data-cy="token" type="text" name="token" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/refresh-tokenn" replace color="info">
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
  refreshTokennEntity: storeState.refreshTokenn.entity,
  loading: storeState.refreshTokenn.loading,
  updating: storeState.refreshTokenn.updating,
  updateSuccess: storeState.refreshTokenn.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTokennUpdate);
