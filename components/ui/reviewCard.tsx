import { Star } from "lucide-react";
import Image from "next/image";

/**
 * A component to render a review card.
 *
 * @param {{ review: { id: string, userName: string, profileImage: string, comment: string, rating: number, createdAt: Date }}} props
 * @returns {JSX.Element}
 */
function ReviewCard ({
  review,
}: {
  review: {
    id: string;
    userName: string;
    profileImage: string;
    comment: string;
    rating: number;
    createdAt: Date;
  };
}): JSX.Element {

  const ratingStars =  [];

  for (let i = 0; i < 5; i++) {
    if (i < review.rating) {
      ratingStars.push(<Star key={i} />);
    }

    ratingStars.push(<Star key={i} />);
  }

  return (
    <div className="p-4 rounded-lg bg-[#009aff] gap-2">
      <p>{review.comment}</p>

      <div className="flex gap-2 justify-center items-center">
        <p>{review.userName}</p>
        <Image
          src={review.profileImage}
          alt="user image"
          width={30}
          height={30}
          className="object-cover w-full h-full"
        />
      </div>

      <div>
        {ratingStars}
      </div>
      <p>{review.createdAt.toLocaleString()}</p>
    </div>
  );
};
