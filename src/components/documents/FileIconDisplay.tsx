
import React from 'react';
import { 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File
} from 'lucide-react';

interface FileIconDisplayProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

export const getFileTypeInfo = (type: string) => {
  if (type.startsWith('image/')) {
    return {
      icon: Image,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      badgeColor: 'bg-purple-500'
    };
  }
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
    return {
      icon: FileText,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-500'
    };
  }
  if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
    return {
      icon: FileSpreadsheet,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-500'
    };
  }
  return {
    icon: File,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    badgeColor: 'bg-orange-500'
  };
};

const FileIconDisplay = ({ type, size = 'medium' }: FileIconDisplayProps) => {
  const fileInfo = getFileTypeInfo(type);
  const FileIcon = fileInfo.icon;

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const iconSizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl ${fileInfo.bgColor} flex items-center justify-center shadow-sm`}>
      <FileIcon className={`${iconSizeClasses[size]} ${fileInfo.textColor}`} />
    </div>
  );
};

export default FileIconDisplay;
