
import React, { useRef, useEffect, useState } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function createData(
    collection: string,
    floor: number,
    vol: number,
    owner: number,
    items: number,
  ) {
    return { collection, floor, vol, owner, items };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

const CollectionTable = () => {

  useEffect(() => {}, []);

  return (
    <TableContainer component={Paper} style={{ "width": "70vw" }} > 
      <Table aria-label="collections table">
        <TableHead>
          <TableRow>
            <TableCell>Collection</TableCell>
            <TableCell align="right">Floor</TableCell>
            <TableCell align="right">24h Vol</TableCell>
            <TableCell align="right">Owners</TableCell>
            <TableCell align="right">Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <b>{row.collection}</b> 
              </TableCell>
              <TableCell align="right"><b>{row.floor}</b></TableCell>
              <TableCell align="right"><b>{row.vol}</b> </TableCell>
              <TableCell align="right"><b>{row.owner}</b></TableCell>
              <TableCell align="right"><b> {row.items}</b></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollectionTable;
