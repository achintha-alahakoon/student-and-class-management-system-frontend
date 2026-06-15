import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SectionRow from './SectionRow';
import CreateFolderModal from './CreateFolderModal';

const SubjectContent = () => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { name: 'Announcements', rows: [] },
    { name: 'Lecture Materials', rows: [] },
  ]);

  useEffect(() => {
    // Fetch initial data from the backend if needed
  }, []);

  const handleRowClick = (sectionName, content) => {
    if (sectionName === 'Submission') {
      setSelectedContent(content);
      setCurrentView('submission');
    } else if (sectionName === 'Lecture Materials') {
      setSelectedContent(content);
      setCurrentView('download');
    }
  };

  const handleAddClick = (sectionName, folderName) => {
    if (sectionName === 'Lecture Materials') {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.name === 'Lecture Materials'
            ? { ...section, rows: [...section.rows, { id: section.rows.length + 1, content: folderName }] }
            : section
        )
      );
    }
  };

  const handleCreateFolder = (folderName) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.name === 'Lecture Materials'
          ? { ...section, rows: [...section.rows, { id: section.rows.length + 1, content: folderName }] }
          : section
      )
    );
  };

  return (
    <>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {sections.map((section) => (
                <SectionRow
                  key={section.name}
                  section={section}
                  onRowClick={handleRowClick}
                  onAddClick={handleAddClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      <CreateFolderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateFolder} />
    </>
  );
};

SubjectContent.propTypes = {
  subject: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default SubjectContent;
