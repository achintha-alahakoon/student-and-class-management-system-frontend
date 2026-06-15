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
import AddIcon from '@mui/icons-material/Add';
import Folder from './Folder';

const SectionRow = ({ section, onRowClick, onAddClick }) => {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleAddClick = async (sectionName) => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      try {
        const response = await fetch('http://localhost:8081/api/lectureMaterial/createFolder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ folder: folderName }),
        });
  
        if (!response.ok) {
          const errorText = await response.text(); // Get the error message from the response
          throw new Error(errorText); // Throw an error to be caught in the catch block
        }
  
        const result = await response.json();
        console.log('Folder created:', result);
        onAddClick(sectionName, folderName);
      } catch (error) {
        console.error('Error creating folder:', error.message);
      }
    }
  };
  
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
          <IconButton
            aria-label="add"
            size="small"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleAddClick(section.name)}
          >
            <AddIcon />
          </IconButton>
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


SectionRow.propTypes = {
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
  onAddClick: PropTypes.func.isRequired,
};

export default SectionRow;

