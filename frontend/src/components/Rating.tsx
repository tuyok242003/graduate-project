
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
interface IRatingProps {
  valueRating: number
  text: string;
 
}

const Rating: React.FC<IRatingProps> = ({ valueRating, text }) => {
  return (
    <div className='rating'>
      <span>
        {valueRating >= 1 ? (
          <FaStar />
        ) : valueRating >= 0.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {valueRating >= 2 ? (
          <FaStar />
        ) : valueRating >= 1.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {valueRating >= 3 ? (
          <FaStar />
        ) : valueRating >= 2.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {valueRating >= 4 ? (
          <FaStar />
        ) : valueRating >= 3.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {valueRating >= 5 ? (
          <FaStar />
        ) : valueRating >= 4.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className='rating-text'>{text && text}</span>
    </div>
  );
};


export default Rating;
