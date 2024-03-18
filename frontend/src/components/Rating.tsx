import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
interface IRatingProps {
  valueRating: number;
  text: string;
}
const Rating: React.FC<IRatingProps> = ({ valueRating, text }) => {
  const renderStars = (value: number) => {
    const stars = [];
    const ceilValue = Math.ceil(value);
    const floorValue = Math.floor(value);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorValue) {
        stars.push(<FaStar key={i} />);
      } else if (i === ceilValue && ceilValue !== floorValue) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };
  return (
    <div className="rating">
      <span>{renderStars(valueRating)}</span>
      <span className="rating-text">{text && text}</span>
    </div>
  );
};
export default Rating;
