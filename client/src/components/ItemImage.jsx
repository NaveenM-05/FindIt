import { useState } from 'react';
import { FiSmartphone, FiCreditCard, FiBookOpen, FiBriefcase, FiKey, FiWatch, FiPackage } from 'react-icons/fi';
import { PiTShirt } from 'react-icons/pi';

// each category gets an icon and a colour so items without a photo still look distinct
export const CATEGORY_STYLE = {
  Electronics: { icon: FiSmartphone, color: '#4f6bed' },
  'ID Cards': { icon: FiCreditCard, color: '#0e9f8e' },
  'Books & Notes': { icon: FiBookOpen, color: '#d97706' },
  Bags: { icon: FiBriefcase, color: '#9333ea' },
  Keys: { icon: FiKey, color: '#dc2626' },
  Clothing: { icon: PiTShirt, color: '#db2777' },
  Accessories: { icon: FiWatch, color: '#0284c7' },
  Other: { icon: FiPackage, color: '#64748b' },
};

export default function ItemImage({ item, className = '' }) {
  const [broken, setBroken] = useState(false);
  if (item.image && !broken) {
    return <img className={`item-img ${className}`} src={item.image} alt={item.title} onError={() => setBroken(true)} />;
  }
  // fallback tile when there is no photo, or the photo link fails to load
  const { icon: Icon, color } = CATEGORY_STYLE[item.category] || CATEGORY_STYLE.Other;
  return (
    <div className={`item-img tile ${className}`} style={{ '--c': color }} aria-label={item.category}>
      <Icon />
    </div>
  );
}
