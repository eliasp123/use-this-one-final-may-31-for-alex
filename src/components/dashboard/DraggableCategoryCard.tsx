
import React, { useRef } from 'react';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import EmailCategoryCard from '../EmailCategoryCard';

interface DraggableCategoryCardProps {
  category: EmailCategory;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableCategoryCard: React.FC<DraggableCategoryCardProps> = ({
  category,
  index,
  onReorder
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Add visual feedback
    if (ref.current) {
      ref.current.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== index) {
      onReorder(dragIndex, index);
    }
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`cursor-move transition-all duration-200 ${
        isDragging ? 'scale-95 rotate-1 shadow-lg' : ''
      }`}
    >
      <EmailCategoryCard category={category} />
    </div>
  );
};

export default DraggableCategoryCard;
