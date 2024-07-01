import React, { FC } from 'react';

type GridProps = {
  columns: number;
  children: any;
};

const Grid: FC<GridProps> = ({ children, columns }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: 4,
        maxWidth: 10,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 'auto'
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
