"""
Used to extend adaptation-options.json to include coastal defence records
Use from irv-jamaica repository root
Created 20250724
"""

import json

import numpy as np
import pandas as pd


if __name__ == "__main__":

    #protection_levels = (0.5, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5)
    protection_levels = (100,)

    # relative to irv-jamaica repository root, run from there
    path = "frontend/src/data-layers/networks/adaptation-options.json"
    with open(path, "r") as fp:
        data = json.load(fp)

    df = pd.DataFrame(data)
    df = df[df.hazard=="flooding"]
    df = df.drop(columns=["adaptation_name", "adaptation_protection_level"])
    df = df.drop_duplicates()
    df["adaptation_name"] = "Building revetment along coastline"

    mat = np.full((len(df), len(protection_levels)), protection_levels)
    df["levels"] = mat.tolist()
    df = df.explode("levels").rename(columns={"levels": "adaptation_protection_level"})

    df.to_json("adaptation-options-coastal-defence.json", orient="records", indent=2)
