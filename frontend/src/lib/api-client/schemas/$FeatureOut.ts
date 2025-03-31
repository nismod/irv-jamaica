export const $FeatureOut = {
	properties: {
		id: {
	type: 'number',
	isRequired: true,
},
		string_id: {
	type: 'string',
	isRequired: true,
},
		layer: {
	type: 'string',
	isRequired: true,
},
		sublayer: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		properties: {
	type: 'dictionary',
	contains: {
	properties: {
	},
},
	isRequired: true,
},
		damages_expected: {
	type: 'array',
	contains: {
		type: 'ExpectedDamage',
	},
},
		damages_return_period: {
	type: 'array',
	contains: {
		type: 'ReturnPeriodDamage',
	},
},
		damages_npv: {
	type: 'array',
	contains: {
		type: 'NPVDamage',
	},
},
		adaptation: {
	type: 'array',
	contains: {
		type: 'Adaptation',
	},
},
	},
} as const;