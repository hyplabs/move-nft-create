
import { FormControl, FormControlLabel, InputLabel, NativeSelect } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";

const CollectionDropDown = () => {

  useEffect(() => {}, []);

  return (
    <FormControl fullWidth>
  <NativeSelect
    defaultValue={30}
    inputProps={{
      name: 'time',
      id: 'uncontrolled-native',
    }}
  >
    <option value={1}>Last 24 hours</option>
    <option value={2}>Last 48 hours</option>
  </NativeSelect>
</FormControl>
  );
};

export default CollectionDropDown;
