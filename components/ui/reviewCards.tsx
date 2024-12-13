import ReviewCard from "./reviewCard";

/**
 * A component to render a list of review cards.
 *
 * @param {{ reviews: Array<{ id: string, reviewer: string, profileImage: string, comment: string, rating: number, createdAt: string }>, secondary: boolean }} props
 * @returns {JSX.Element}
 */
function ReviewCards({
  reviews,
  secondary
}: {
  reviews: Array<{
    id: string, 
    reviewer: string, 
    profileImage: string, 
    comment: string, 
    rating: number, 
    createdAt: string,
  }>,
  secondary: boolean,
}): JSX.Element {
  return (
    <div className="w-full grid md:grid-cols-2 gap-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} secondary={secondary}/>
      ))}
    </div>
  );
}

export default ReviewCards;