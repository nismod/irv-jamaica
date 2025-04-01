

export type ProtectedFeatureListItem = {
	id: number;
	string_id: string;
	layer: string;
	adaptation_name: string;
	adaptation_protection_level: number;
	adaptation_cost: number;
	avoided_ead_mean: number;
	avoided_eael_mean: number;
	hazard: string;
	rcp: number;
};

