import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { formatAddress } from 'platform/forms/address/helpers';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import {
  isFailedTransaction,
  isPendingTransaction,
} from 'vet360/util/transactions';
import {
  selectAddressValidation,
  selectAddressValidationType,
} from 'vet360/selectors';

import Vet360EditModalErrorMessage from 'vet360/components/base/Vet360EditModalErrorMessage';

import * as VET360 from '../constants';
import {
  openModal,
  createTransaction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  closeModal,
  resetAddressValidation as resetAddressValidationAction,
} from '../actions';
import { getValidationMessageKey } from '../../utilities';
import { ADDRESS_VALIDATION_MESSAGES } from '../../constants/addressValidationMessages';

class AddressValidationView extends React.Component {
  componentWillUnmount() {
    focusElement(`#${this.props.addressValidationType}-edit-link`);
  }

  onChangeSelectedAddress = (address, selectedAddressId) => {
    this.props.updateSelectedAddress(address, selectedAddressId);
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      validationKey,
      addressValidationType,
      selectedAddress,
      selectedAddressId,
      analyticsSectionName,
    } = this.props;

    const payload = {
      ...selectedAddress,
      validationKey,
    };

    const suggestedAddressSelected = selectedAddressId !== 'userEntered';

    const method = payload.id ? 'PUT' : 'POST';

    recordEvent({
      event: 'profile-transaction',
      'profile-section': analyticsSectionName,
      'profile-addressSuggestionUsed': suggestedAddressSelected ? 'yes' : 'no',
    });

    if (suggestedAddressSelected) {
      this.props.updateValidationKeyAndSave(
        VET360.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    } else {
      this.props.createTransaction(
        VET360.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    }
  };

  onEditClick = () => {
    const {
      addressValidationType,
      addressFromUser,
      analyticsSectionName,
    } = this.props;
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'edit-link',
      'profile-section': analyticsSectionName,
    });
    this.props.openModal(addressValidationType, addressFromUser);
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      validationKey,
      isLoading,
      confirmedSuggestions,
    } = this.props;

    let buttonText = 'Update';

    if (confirmedSuggestions.length === 0 && validationKey) {
      buttonText = 'Use this address';
    }

    if (confirmedSuggestions.length === 1 && !validationKey) {
      buttonText = 'Use suggested address';
    }

    if (
      addressValidationError ||
      (!confirmedSuggestions.length && !validationKey)
    ) {
      return (
        <button className="usa-button-primary" onClick={this.onEditClick}>
          Edit Address
        </button>
      );
    }

    return (
      <LoadingButton isLoading={isLoading} className="usa-button-primary">
        {buttonText}
      </LoadingButton>
    );
  };

  renderAddressOption = (address, id = 'userEntered') => {
    const {
      addressValidationError,
      confirmedSuggestions,
      selectedAddressId,
      validationKey,
    } = this.props;

    const isAddressFromUser = id === 'userEntered';
    const hasConfirmedSuggestions =
      (confirmedSuggestions.length > 0 && validationKey) ||
      confirmedSuggestions.length > 1;
    const showEditLinkErrorState = addressValidationError && validationKey;
    const showEditLinkNonErrorState = !addressValidationError;
    const showEditLink = showEditLinkErrorState || showEditLinkNonErrorState;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && validationKey) || !isAddressFromUser;

    const { street, cityStateZip, country } = formatAddress(address);

    return (
      <div
        key={id}
        className="vads-u-margin-bottom--1p5 address-validation-container"
      >
        {isFirstOptionOrEnabled &&
          hasConfirmedSuggestions && (
            <input
              className="address-validation-input"
              type="radio"
              id={id}
              onChange={() => {
                this.onChangeSelectedAddress(address, id);
              }}
              checked={selectedAddressId === id}
            />
          )}
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--0p5">
            <span>{street}</span>
            <span>{cityStateZip}</span>
            <span>{country}</span>

            {isAddressFromUser &&
              showEditLink && (
                <button className="va-button-link" onClick={this.onEditClick}>
                  Edit Address
                </button>
              )}
          </div>
        </label>
      </div>
    );
  };

  render() {
    const {
      addressFromUser,
      addressValidationError,
      clearErrors,
      confirmedSuggestions,
      resetAddressValidation,
      suggestedAddresses,
      title,
      transaction,
      transactionRequest,
      validationKey,
    } = this.props;

    const resetDataAndCloseModal = () => {
      resetAddressValidation();
      this.props.closeModal();
    };

    const validationMessageKey = getValidationMessageKey(
      suggestedAddresses,
      validationKey,
      addressValidationError,
      confirmedSuggestions,
    );

    const addressValidationMessage =
      ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

    const shouldShowSuggestions = confirmedSuggestions.length > 0;

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <>
        {error && (
          <div className="vads-u-margin-bottom--1">
            <Vet360EditModalErrorMessage
              title={title}
              error={error}
              clearErrors={clearErrors}
            />
          </div>
        )}
        <AlertBox
          className="vads-u-margin-bottom--1"
          status="warning"
          headline={addressValidationMessage.headline}
        >
          <addressValidationMessage.ModalText editFunction={this.onEditClick} />
        </AlertBox>
        <form onSubmit={this.onSubmit}>
          <span className="vads-u-font-weight--bold">You entered:</span>
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && (
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
          )}
          {shouldShowSuggestions &&
            confirmedSuggestions.map((address, index) =>
              this.renderAddressOption(address, String(index)),
            )}
          {this.renderPrimaryButton()}
          <button
            type="button"
            className="usa-button-secondary"
            onClick={resetDataAndCloseModal}
          >
            Cancel
          </button>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const {
    addressFromUser,
    addressValidationError,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    validationKey,
  } = selectAddressValidation(state);

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vet360.fieldTransactionMap[addressValidationType]?.isPending ||
      isPendingTransaction(transaction),
    addressFromUser,
    addressValidationError,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    validationKey,
  };
};

const mapDispatchToProps = {
  closeModal,
  openModal,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  createTransaction,
  resetAddressValidation: resetAddressValidationAction,
};

AddressValidationView.propTypes = {
  analyticsSectionName: PropTypes.string,
  addressValidationError: PropTypes.bool.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  confirmedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      addressType: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      countryName: PropTypes.string.isRequired,
      countryCodeIso3: PropTypes.string.isRequired,
      countyCode: PropTypes.string.isRequired,
      countyName: PropTypes.string.isRequired,
      stateCode: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      addressPou: PropTypes.string.isRequired,
    }),
  ),
  addressValidationType: PropTypes.string.isRequired,
  validationKey: PropTypes.number,
  addressFromUser: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
  updateValidationKeyAndSave: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationView);
