export const $Page_FeatureListItemOut_float__ = {
	properties: {
		items: {
	type: 'array',
	contains: {
		type: 'FeatureListItemOut_float_',
	},
	isRequired: true,
},
		total: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
	isRequired: true,
},
		page: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		size: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		pages: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
	},
} as const;