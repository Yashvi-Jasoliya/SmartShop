// // src/utils/reviewValidator.ts
// import natural from 'natural';
// const { TfIdf } = natural;

// interface ProductData {
//     title: string;
//     description: string;
// }

// interface ReviewValidationResult {
//     isValid: boolean;
//     score: number;
//     mismatchedTerms: string[];
// }

// export const validateReview = (
//     product: ProductData,
//     review: { text: string }
// ): ReviewValidationResult => {
//     const tfidf = new TfIdf();

//     // Add documents
//     tfidf.addDocument(product.title.toLowerCase());
//     tfidf.addDocument(product.description.toLowerCase());
//     tfidf.addDocument(review.text.toLowerCase());

//     const productTerms = tfidf.listTerms(0) as { term: string; tfidf: number }[];
//     let totalScore = 0;
//     const mismatchedTerms: string[] = [];

//     // Calculate term relevance
//     productTerms.forEach(term => {
//         const termScore = tfidf.tfidf(term.term, 2);
//         totalScore += termScore;

//         if (termScore < 0.1) {
//             mismatchedTerms.push(term.term);
//         }
//     });

//     // Calculate normalized score (0-1)
//     const normalizedScore = productTerms.length > 0
//         ? totalScore / productTerms.length
//         : 0;

//     return {
//         isValid: normalizedScore > 0.2,
//         score: normalizedScore,
//         mismatchedTerms: mismatchedTerms.slice(0, 3)
//     };
// };