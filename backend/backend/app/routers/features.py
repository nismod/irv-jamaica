from typing import Optional

import sqlalchemy.exc
from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import desc, select
from geoalchemy2 import functions

from backend.app import schemas
from backend.app.internal.attribute_access import (
    add_value_query,
    parse_dimensions,
    parse_parameters,
)
from backend.db import models
from backend.db.database import SessionDep


router = APIRouter(tags=["features"])


@router.get("/{feature_id}", response_model=schemas.FeatureOut)
def read_feature(feature_id: int, session: SessionDep):
    try:
        feature = session.get(models.Feature, feature_id)
    except sqlalchemy.exc.NoResultFound:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature


def get_layer_spec(
    layer: Optional[str] = None,
    sector: Optional[str] = None,
    subsector: Optional[str] = None,
    asset_type: Optional[str] = None,
):
    return schemas.LayerSpec(
        layer_name=layer,
        sector=sector,
        subsector=subsector,
        asset_type=asset_type,
    )


@router.get(
    "/sorted-by/{field_group}",
    response_model=Page[schemas.FeatureListItemOut[float]]
)
def read_sorted_features(
    field_group: str,
    field: str,
    session: SessionDep,
    field_dimensions: schemas.DataDimensions = Depends(parse_dimensions),
    field_params: schemas.DataParameters = Depends(parse_parameters),
    layer_spec: schemas.LayerSpec = Depends(get_layer_spec),
    page_params: Params = Depends(),
):
    filled_layer_spec = {
        k: v for k, v in layer_spec.dict().items() if v is not None
    }
    base_query = (
        select(
            models.Feature.id.label("id"),
            models.Feature.string_id.label("string_id"),
            models.Feature.layer.label("layer"),
            functions.ST_AsText(
                functions.Box2D(models.Feature.geom)
            ).label("bbox_wkt"),
        )
        .select_from(models.Feature)
        .join(models.FeatureLayer)
        .filter_by(**filled_layer_spec)
    )

    q = add_value_query(
        base_query, field_group, field_dimensions, field, field_params
    ).order_by(desc("value"))

    return paginate(session, q, page_params)


@router.get(
    "/{protector_id}/protected-by",
    response_model=list[schemas.ProtectedFeatureListItem],
)
def read_protected_features(
    protector_id: int,
    rcp: str,
    session: SessionDep,
):
    """
    Get all adaptation options, by feature ID and layer, for features
    protected by a given protector feature.
    """

    adaptation_options = select(
        models.Feature.id.label("id"),
        models.Feature.string_id.label("string_id"),
        models.Feature.layer.label("layer"),
        models.AdaptationCostBenefit.adaptation_cost.label(
            "adaptation_cost"
        ),
        models.AdaptationCostBenefit.adaptation_protection_level.label(
            "adaptation_protection_level"
        ),
        models.AdaptationCostBenefit.adaptation_name.label(
            "adaptation_name"
        ),
        models.AdaptationCostBenefit.avoided_ead_mean.label(
            "avoided_ead_mean"
        ),
        models.AdaptationCostBenefit.avoided_eael_mean.label(
            "avoided_eael_mean"
        ),
        models.AdaptationCostBenefit.rcp.label("rcp"),
        models.AdaptationCostBenefit.hazard.label("hazard"),
    ).select_from(
        models.Feature
    ).join(
        models.FeatureLayer
    ).join(
        models.Feature.adaptation
    ).filter_by(
        rcp=rcp,
    ).where(
        models.AdaptationCostBenefit.protector_feature_id == protector_id
    )
    print(adaptation_options)
    return session.execute(adaptation_options)
