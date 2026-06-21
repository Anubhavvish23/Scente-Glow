import "./ProductReviews.css";

function ProductReviews({ rating, review_count, product_name, className = "" }) {
  const score = Number(rating || 0).toFixed(1);
  const total = review_count || 0;

  const reviews = [
    {
      id: 1,
      name: "Ananya S.",
      stars: 5,
      text: `The ${product_name} scent fills the room without being overpowering. Burns evenly and the jar looks beautiful on my shelf.`,
    },
    {
      id: 2,
      name: "Rohan K.",
      stars: 5,
      text: "Clean burn, no soot, and the fragrance lasts for hours. Already ordered a second one as a gift.",
    },
    {
      id: 3,
      name: "Meera P.",
      stars: 4,
      text: "Lovely warm notes and great packaging. Arrived quickly and smelled amazing even before lighting.",
    },
  ];

  return (
    <section className={`sg-product-reviews ${className}`}>
      <h3 className="sg-product-reviews__title">Ratings &amp; Reviews</h3>

      <div className="sg-product-reviews__summary">
        <span className="sg-product-reviews__score">{score}</span>
        <span className="sg-product-reviews__stars">★★★★★</span>
        <span className="sg-product-reviews__count">{total} reviews</span>
      </div>

      <ul className="sg-product-reviews__list">
        {reviews.map((review) => (
          <li key={review.id} className="sg-product-reviews__item">
            <div className="sg-product-reviews__item-head">
              <span className="sg-product-reviews__author">{review.name}</span>
              <span className="sg-product-reviews__item-stars">
                {"★".repeat(review.stars)}
                {"☆".repeat(5 - review.stars)}
              </span>
            </div>
            <p className="sg-product-reviews__text">{review.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProductReviews;
