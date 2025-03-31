export const $ReturnPeriodDamage = {
	properties: {
		exposure: {
	type: 'number',
	isRequired: true,
},
		damage_amin: {
	type: 'number',
	isRequired: true,
},
		damage_mean: {
	type: 'number',
	isRequired: true,
},
		damage_amax: {
	type: 'number',
	isRequired: true,
},
		loss_amin: {
	type: 'number',
	isRequired: true,
},
		loss_mean: {
	type: 'number',
	isRequired: true,
},
		loss_amax: {
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
		rp: {
	type: 'number',
	isRequired: true,
},
	},
} as const;