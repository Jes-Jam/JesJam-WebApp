import { Star } from "lucide-react";
import Image from "next/image";
import profileHolder from "../../public/images/static-images/vector-users-icon.webp";
import { FaStar, FaRegStar } from "react-icons/fa";

/**
 * A component to render a review card.
 *
 * @param {{ review: { id: string, reviewer: string, profileImage: string, comment: string, rating: number, createdAt: string } } } props
 * @returns {JSX.Element}
 */
function ReviewCard({
  review,
}: {
  review: {
    id: string;
    reviewer: string;
    profileImage: string;
    comment: string;
    rating: number;
    createdAt: string;
  };
}): JSX.Element {
  const ratingStars = [];

  for (let i = 0; i < 5; i++) {
   i < review.rating ? ratingStars.push(<FaStar key={i} className="text-yellow-300 text-lg" />) : ratingStars.push(<FaRegStar key={i} className="text-gray-400" />);
  }

  return (
    <div className="p-4 rounded-lg bg-[#89cff3] flex flex-col justify-between gap-2">

      <div className="flex items-between flex-col gap-2">
        <p>{review.comment}</p>

      </div>

      <div className="flex justify-between flex-col gap-3">
        <div className="flex gap-3 justify-start items-center">
          <p className="font-semibold text-lg">{review.reviewer}</p>
          <Image
            src={review.profileImage || profileHolder}
            alt="user image"
            width={30}
            height={30}
            className="object-cover w-[30px] h-[30px] rounded-full"
          />
        </div>
        <div className="flex gap-1">{ratingStars}</div>
        <p>{review.createdAt}</p>
      </div>
    </div>
  );
}

export default ReviewCard;
