import React from 'react';
import loader from './loader.gif';

export default () => {
  return (
    <div>
      <img
        src={loader}
        alt="loading"
        style={{ width: '200px', margin: 'auto', display: 'block' }}
      />
    </div>
  );
};
