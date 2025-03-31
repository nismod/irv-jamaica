export const $FeatureListItemOut_float_ = {
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
		bbox_wkt: {
	type: 'string',
	isRequired: true,
},
		value: {
	type: 'number',
	isRequired: true,
},
	},
} as const;