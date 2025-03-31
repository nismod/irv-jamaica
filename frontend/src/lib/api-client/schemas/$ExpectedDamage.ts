export const $ExpectedDamage = {
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
		epoch: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'number',
}],
	isRequired: true,
},
		protection_standard: {
	type: 'number',
	isRequired: true,
},
	},
} as const;