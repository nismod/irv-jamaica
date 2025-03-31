import type { FeatureOut } from '../models/FeatureOut';
import type { Page_FeatureListItemOut_float__ } from '../models/Page_FeatureListItemOut_float__';
import type { ProtectedFeatureListItem } from '../models/ProtectedFeatureListItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export type TDataFeaturesReadFeature = {
                featureId: number
            }
export type TDataFeaturesReadSortedFeatures = {
                assetType?: string | null
dimensions: string
field: string
fieldGroup: string
layer?: string | null
page?: number
parameters: string
sector?: string | null
size?: number
subsector?: string | null
            }
export type TDataFeaturesReadProtectedFeatures = {
                protectionLevel: number
protectorId: number
rcp: string
            }

export class FeaturesService {

	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Read Feature
	 * @returns FeatureOut Successful Response
	 * @throws ApiError
	 */
	public featuresReadFeature(data: TDataFeaturesReadFeature): CancelablePromise<FeatureOut> {
		const {
featureId,
} = data;
		return this.httpRequest.request({
			method: 'GET',
			url: '/features/{feature_id}',
			path: {
				feature_id: featureId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Sorted Features
	 * @returns Page_FeatureListItemOut_float__ Successful Response
	 * @throws ApiError
	 */
	public featuresReadSortedFeatures(data: TDataFeaturesReadSortedFeatures): CancelablePromise<Page_FeatureListItemOut_float__> {
		const {
assetType,
dimensions,
field,
fieldGroup,
layer,
page = 1,
parameters,
sector,
size = 50,
subsector,
} = data;
		return this.httpRequest.request({
			method: 'GET',
			url: '/features/sorted-by/{field_group}',
			path: {
				field_group: fieldGroup
			},
			query: {
				field, dimensions, parameters, layer, sector, subsector, asset_type: assetType, page, size
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Protected Features
	 * Get all adaptation options, by feature ID and layer, for features
 * protected by a given protector feature.
	 * @returns ProtectedFeatureListItem Successful Response
	 * @throws ApiError
	 */
	public featuresReadProtectedFeatures(data: TDataFeaturesReadProtectedFeatures): CancelablePromise<Array<ProtectedFeatureListItem>> {
		const {
protectionLevel,
protectorId,
rcp,
} = data;
		return this.httpRequest.request({
			method: 'GET',
			url: '/features/{protector_id}/protected-by',
			path: {
				protector_id: protectorId
			},
			query: {
				rcp, protection_level: protectionLevel
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}