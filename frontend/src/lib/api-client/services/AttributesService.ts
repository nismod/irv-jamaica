
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export type TDataAttributesReadAttributes = {
                dimensions: string
field: string
fieldGroup: string
layer: string
parameters: string
requestBody: Array<number>
            }

export class AttributesService {

	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Read Attributes
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public attributesReadAttributes(data: TDataAttributesReadAttributes): CancelablePromise<Record<string, unknown | null>> {
		const {
dimensions,
field,
fieldGroup,
layer,
parameters,
requestBody,
} = data;
		return this.httpRequest.request({
			method: 'POST',
			url: '/attributes/{field_group}',
			path: {
				field_group: fieldGroup
			},
			query: {
				layer, field, dimensions, parameters
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

}