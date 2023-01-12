
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
    <TableContainer  style={{ "width": "70vw" }} > 
      <Table aria-label="collections table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Collection</TableCell>
            <TableCell align="left">Floor</TableCell>
            <TableCell align="left">24h Vol</TableCell>
            <TableCell align="left">Owners</TableCell>
            <TableCell align="left">Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="left" style={{"width":"30%"}}>
              <div className="collection-name-table-row">
              <img className="mr-5" alt="collection image" src="https://looksrare.mo.cloudinary.net/0x656D34A8309363302e46De99853F4cef30B85A1D/0x9c910484ca91f1e4169a247dc4ced55e6b73faacedc2f40532a3e786d954e674?resource_type=image&f=auto&c=limit&w=40&q=auto" 
              />
                <b>{row.collection}</b> 
                </div>
              </TableCell>
              <TableCell align="left"><b>{row.floor}</b></TableCell>
              <TableCell align="left"><b>{row.vol}</b> </TableCell>
              <TableCell align="left"><b>{row.owner}</b></TableCell>
              <TableCell align="left"><b> {row.items}</b></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollectionTable;
