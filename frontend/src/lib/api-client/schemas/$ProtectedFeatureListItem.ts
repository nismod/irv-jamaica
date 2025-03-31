export const $ProtectedFeatureListItem = {
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
		adaptation_name: {
	type: 'string',
	isRequired: true,
},
		adaptation_protection_level: {
	type: 'number',
	isRequired: true,
},
		adaptation_cost: {
	type: 'number',
	isRequired: true,
},
		avoided_ead_mean: {
	type: 'number',
	isRequired: true,
},
		avoided_eael_mean: {
	type: 'number',
	isRequired: true,
},
		hazard: {
	type: 'string',
	isRequired: true,
},
		rcp: {
	type: 'number',
	isRequired: true,
},
	},
} as const;