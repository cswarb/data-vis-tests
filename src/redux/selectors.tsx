import { createSelector } from "@reduxjs/toolkit";

export const selectAppState = (state: any) => {
  return state;
};

export const selectVehicles = createSelector([selectAppState], state => {
  return state.vehicles;
});