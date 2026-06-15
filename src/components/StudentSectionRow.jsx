import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Folder from './Folder';

const StudentSectionRow = ({ section, onRowClick }) => {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch folders when the component mounts
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/lectureMaterial/getFolders');
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      const data = await response.json();
      setFolders(data.folders); // Access the folders array from the response object
    } catch (error) {
      console.error('Error fetching folders:', error.message);
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell colSpan={2} style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            style={{ marginLeft: '10px', fontSize: '24px', color: '#526d82' }}
          >
            {section.name}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label={section.name}>
                <TableBody>
                  {folders.map((folder, index) => (
                    <TableRow key={index} onClick={() => onRowClick(section.name, folder)}>
                      <TableCell style={{ cursor: 'pointer' }}>
                        <Folder name={folder} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

StudentSectionRow.propTypes = {
  section: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default StudentSectionRow;
