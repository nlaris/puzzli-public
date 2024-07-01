import React, { forwardRef, CSSProperties } from 'react';
import useImage from '../utils/useImage';

interface ItemProps {
  pattern: string;
  rotation: number;
  isDragging?: boolean;
  withOpacity?: boolean;
  style?: CSSProperties;
  disabled: boolean;
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ isDragging, style, pattern, rotation, disabled, ...props }, ref) => {
    const borderRadius = 8;
    const mobileProportions = window.outerWidth < window.outerHeight * 0.75;
    const width = Math.min(
      mobileProportions
        ? window.outerWidth * 0.3
        : window.outerHeight * 0.19,
      250
    );
    const lockedTileWidth = mobileProportions ? width * .95 : width * .965;
    const inlineStyles: CSSProperties = {
      height: width,
      width: width,
      borderRadius,
      backgroundColor: disabled ? '#0d6efd' : '',
      cursor: isDragging ? 'grabbing' : 'grab',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: isDragging
        ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px'
        : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
      transform: isDragging ? 'scale(1.1)' : 'scale(1)',
      ...style,
    };

    const { image } = useImage("tiles/" + pattern + ".webp");

    return (
      <div ref={ref} style={inlineStyles} {...props} className='grid-item'>
        <img src={image} width={disabled ? lockedTileWidth : width} height={disabled ? lockedTileWidth : width} style={{borderRadius, rotate: `${rotation * 90}deg`}}/>
      </div>
    );
  }
);

export default Item;
