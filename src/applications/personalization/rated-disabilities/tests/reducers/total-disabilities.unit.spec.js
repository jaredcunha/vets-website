import { expect } from 'chai';
import {
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../../actions';
import { totalRating } from '../../reducers/total-disabilities';

const initialState = {
  loading: true, // app starts in loading state
  error: false,
  totalDisabilityRating: null,
};

describe('totalDisabilities reducer', () => {
  it('should return the initial state', () => {
    const state = totalRating(initialState, {});
    expect(state.loading).to.equal(true);
    expect(state.error).to.equal(false);
    expect(state.totalDisabilityRating).to.equal(null);
  });

  it('should handle an error from the API call', () => {
    const state = totalRating(initialState, {
      type: FETCH_TOTAL_RATING_FAILED,
    });

    expect(state.loading).to.equal(false);
    expect(state.error).to.equal(true);
    expect(state.totalDisabilityRating).to.equal(null);
  });

  it('should handle a successful API call', () => {
    const state = totalRating(initialState, {
      type: FETCH_TOTAL_RATING_SUCCEEDED,
    });

    expect(state.loading).to.equal(false);
    expect(state.error).to.equal(false);
    expect(state.totalDisabilityRating).to.not.equal(null);
  });

  it('should return the state if a type is not matched', () => {
    const state = totalRating(initialState, {
      type: 'BLERG',
    });

    expect(state.loading).to.equal(true);
    expect(state.error).to.equal(false);
    expect(state.totalDisabilityRating).to.equal(null);
  });
});
