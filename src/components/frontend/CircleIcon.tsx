import React from 'react';

const Circle = ({ icon: Icon }: any) => {
  return (
    <div className="circle">
      <div className="circle__main">
        <Icon />
      </div>
    </div>
  );
};

export default Circle;
