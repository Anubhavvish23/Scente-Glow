import "./ProductSheetSkeleton.css";

function ProductSheetSkeleton() {
  return (
    <div className="sg-sheet-skeleton">
      <div className="sg-sheet-skeleton__image" />
      <div className="sg-sheet-skeleton__line sg-sheet-skeleton__line--title" />
      <div className="sg-sheet-skeleton__line sg-sheet-skeleton__line--scent" />
      <div className="sg-sheet-skeleton__line sg-sheet-skeleton__line--price" />
      <div className="sg-sheet-skeleton__btn" />
    </div>
  );
}

export default ProductSheetSkeleton;
