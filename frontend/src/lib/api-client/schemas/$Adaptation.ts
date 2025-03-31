export const $Adaptation = {
	properties: {
		adaptation_cost: {
	type: 'number',
	isRequired: true,
},
		avoided_ead_amin: {
	type: 'number',
	isRequired: true,
},
		avoided_ead_mean: {
	type: 'number',
	isRequired: true,
},
		avoided_ead_amax: {
	type: 'number',
	isRequired: true,
},
		avoided_eael_amin: {
	type: 'number',
	isRequired: true,
},
		avoided_eael_mean: {
	type: 'number',
	isRequired: true,
},
		avoided_eael_amax: {
	type: 'number',
	isRequired: true,
},
		hazard: {
	type: 'string',
	isRequired: true,
},
		rcp: {
	type: 'string',
	isRequired: true,
},
		adaptation_name: {
	type: 'string',
	isRequired: true,
},
		adaptation_protection_level: {
	type: 'number',
	isRequired: true,
},
	},
} as const;