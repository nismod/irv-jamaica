// This file is auto-generated by @hey-api/openapi-ts

export type Adaptation = {
    adaptation_cost: number;
    avoided_ead_amin: number;
    avoided_ead_mean: number;
    avoided_ead_amax: number;
    avoided_eael_amin: number;
    avoided_eael_mean: number;
    avoided_eael_amax: number;
    hazard: string;
    rcp: string;
    adaptation_name: string;
    adaptation_protection_level: number;
};

export type ExpectedDamage = {
    ead_amin: number;
    ead_mean: number;
    ead_amax: number;
    eael_amin: number;
    eael_mean: number;
    eael_amax: number;
    hazard: string;
    rcp: string;
    epoch: string | number;
    protection_standard: number;
};

export type FeatureListItemOutFloat = {
    id: number;
    string_id: string;
    layer: string;
    bbox_wkt: string;
    value: number;
};

export type FeatureOut = {
    id: number;
    string_id: string;
    layer: string;
    sublayer?: string | null;
    properties: {
        [key: string]: unknown;
    };
    damages_expected?: Array<ExpectedDamage>;
    damages_return_period?: Array<ReturnPeriodDamage>;
    damages_npv?: Array<NpvDamage>;
    adaptation?: Array<Adaptation>;
};

export type HttpValidationError = {
    detail?: Array<ValidationError>;
};

export type NpvDamage = {
    ead_amin: number;
    ead_mean: number;
    ead_amax: number;
    eael_amin: number;
    eael_mean: number;
    eael_amax: number;
    hazard: string;
    rcp: string;
};

export type PageFeatureListItemOutFloat = {
    items: Array<FeatureListItemOutFloat>;
    total: number | null;
    page: number | null;
    size: number | null;
    pages?: number | null;
};

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

export type ReturnPeriodDamage = {
    exposure: number;
    damage_amin: number;
    damage_mean: number;
    damage_amax: number;
    loss_amin: number;
    loss_mean: number;
    loss_amax: number;
    hazard: string;
    rcp: string;
    epoch: string | number;
    rp: number;
};

export type ValidationError = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

export type FeaturesReadFeatureData = {
    body?: never;
    path: {
        feature_id: number;
    };
    query?: never;
    url: '/features/{feature_id}';
};

export type FeaturesReadFeatureErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type FeaturesReadFeatureError = FeaturesReadFeatureErrors[keyof FeaturesReadFeatureErrors];

export type FeaturesReadFeatureResponses = {
    /**
     * Successful Response
     */
    200: FeatureOut;
};

export type FeaturesReadFeatureResponse = FeaturesReadFeatureResponses[keyof FeaturesReadFeatureResponses];

export type FeaturesReadSortedFeaturesData = {
    body?: never;
    path: {
        field_group: string;
    };
    query: {
        field: string;
        dimensions: string;
        parameters: string;
        layer?: string | null;
        sector?: string | null;
        subsector?: string | null;
        asset_type?: string | null;
        page?: number;
        size?: number;
    };
    url: '/features/sorted-by/{field_group}';
};

export type FeaturesReadSortedFeaturesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type FeaturesReadSortedFeaturesError = FeaturesReadSortedFeaturesErrors[keyof FeaturesReadSortedFeaturesErrors];

export type FeaturesReadSortedFeaturesResponses = {
    /**
     * Successful Response
     */
    200: PageFeatureListItemOutFloat;
};

export type FeaturesReadSortedFeaturesResponse = FeaturesReadSortedFeaturesResponses[keyof FeaturesReadSortedFeaturesResponses];

export type FeaturesReadProtectedFeaturesData = {
    body?: never;
    path: {
        protector_id: number;
    };
    query: {
        rcp: string;
        protection_level: number;
    };
    url: '/features/{protector_id}/protected-by';
};

export type FeaturesReadProtectedFeaturesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type FeaturesReadProtectedFeaturesError = FeaturesReadProtectedFeaturesErrors[keyof FeaturesReadProtectedFeaturesErrors];

export type FeaturesReadProtectedFeaturesResponses = {
    /**
     * Successful Response
     */
    200: Array<ProtectedFeatureListItem>;
};

export type FeaturesReadProtectedFeaturesResponse = FeaturesReadProtectedFeaturesResponses[keyof FeaturesReadProtectedFeaturesResponses];

export type AttributesReadAttributesData = {
    body: Array<number>;
    path: {
        field_group: string;
    };
    query: {
        layer: string;
        field: string;
        dimensions: string;
        parameters: string;
    };
    url: '/attributes/{field_group}';
};

export type AttributesReadAttributesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type AttributesReadAttributesError = AttributesReadAttributesErrors[keyof AttributesReadAttributesErrors];

export type AttributesReadAttributesResponses = {
    /**
     * Successful Response
     */
    200: {
        [key: string]: unknown | null;
    };
};

export type AttributesReadAttributesResponse = AttributesReadAttributesResponses[keyof AttributesReadAttributesResponses];

export type ClientOptions = {
    baseUrl: 'http://localhost:8888' | (string & {});
};