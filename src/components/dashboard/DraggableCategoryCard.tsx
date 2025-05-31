
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import EmailCategoryCard from '../EmailCategoryCard';

interface DraggableCategoryCardProps {
  category: EmailCategory;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

interface DragItem {
  type: string;
  index: number;
}

const DraggableCategoryCard: React.FC<DraggableCategoryCardProps> = ({
  category,
  index,
  onReorder,
  isExpanded,
  onToggle
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'category',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'category',
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
    >
      <EmailCategoryCard 
        category={category} 
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
    </div>
  );
};

export default DraggableCategoryCard;
