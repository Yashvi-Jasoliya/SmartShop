// // utils/reviewChecker.ts
// import { Product, Review } from '../types/types';

// export const isGenuineReview = (review: Review, product: Product): boolean => {
//     const productNameWords = product.name.toLowerCase().split(/\s+/);
//     const reviewWords = review.comment.toLowerCase().split(/\W+/).filter(word => word.length > 0);
//     return reviewWords.some(reviewWord =>
//         productNameWords.some(productWord => reviewWord === productWord)
//     );
// };
