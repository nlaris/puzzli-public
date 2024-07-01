import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Item from './Item';

interface SortableItemProps {
  id: string;
  pattern: string;
  rotation: number;
  activeId: string | null;
  disabled: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, pattern, rotation, activeId, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: disabled ? '' : CSS.Transform.toString(transform),
    transition: disabled ? '' : transition + ' 65ms',
    opacity: activeId === id ? 0 : 1,
    zIndex: disabled ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
      className='tile'
    >
      <Item pattern={pattern} rotation={rotation} isDragging={isDragging} disabled={disabled} />
    </div>
  );
};

export default SortableItem;
