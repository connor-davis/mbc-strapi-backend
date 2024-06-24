import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';

import PropTypes from 'prop-types';
import React from 'react';

const MediaLib = ({ isOpen, onChange, onToggle }) => {
  const { components } = useLibrary();
  const MediaLibraryDialog = components['media-library'];

  const handleSelectAssets = files => {
    const formattedFiles = files.map(f => {
      console.log(f);
      
      return ({
        alt: f.alternativeText || f.name,
        url: prefixFileUrlWithBackendUrl(f.url),
        mime: f.mime,
        width: f.width,
        height: f.height,
      });
    });

    onChange(formattedFiles);
  };

  // console.log(handleSelectAssets);

  if(!isOpen) {
    return null
  };

  return(
    <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />
  );
};

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {},
  onToggle: () => {},
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;
