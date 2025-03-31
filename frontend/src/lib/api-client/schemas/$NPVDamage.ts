export const $NPVDamage = {
	properties: {
		ead_amin: {
	type: 'number',
	isRequired: true,
},
		ead_mean: {
	type: 'number',
	isRequired: true,
},
		ead_amax: {
	type: 'number',
	isRequired: true,
},
		eael_amin: {
	type: 'number',
	isRequired: true,
},
		eael_mean: {
	type: 'number',
	isRequired: true,
},
		eael_amax: {
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
	},
} as const;