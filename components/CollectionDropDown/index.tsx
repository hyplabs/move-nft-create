
import { FormControl, FormControlLabel, InputLabel, MenuItem, NativeSelect, Select, SelectChangeEvent } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";

const CollectionDropDown = () => {

  const [timeSpan, setTimeSpan] = React.useState("1");

  const handleChange = (event: SelectChangeEvent) => {
    setTimeSpan(event.target.value);
  };

  return (
    <div style={{ "width": "70vw"}}>
    <FormControl sx={{ m: 1 }} className="float-left mb-10 collection-dropdown">
        <Select
          value={timeSpan}
          onChange={handleChange}
          autoWidth
        >

          <MenuItem value={1}>Highest 24h Vol</MenuItem>
          <MenuItem value={2}>Hightest Total Vol</MenuItem>

        </Select>
      </FormControl>
      </div>
  );
};

export default CollectionDropDown;
