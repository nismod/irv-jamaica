/**
 * Colour scheme and range for exposure values.
 */
export const exposureValue = {
  scheme: 'reds',
  range: [0, 1e10],
};
/**
 * Colour scheme and range for Expected Annual Damage values.
 */
export const EAD = {
  scheme: 'purd',
  range: [0, 1e7],
};
/**
 * Colour scheme and range for GDP values.
 */
export const lossGdp = {
  scheme: 'blues',
  range: [0, 5e6],
};
export const lossGdpIsolation = lossGdp;
export const lossGdpRerouting = {
  scheme: 'blues',
  range: [0, 2.5e5],
};
/**
 * Colour scheme and range for population values.
 */
export const populationAffected = {
  scheme: 'purples',
  range: [0, 1e4],
};
/**
 * Colour scheme and range for demand values.
 */
export const demandAffected = {
  scheme: 'greens',
  range: [0, 1e3],
};
