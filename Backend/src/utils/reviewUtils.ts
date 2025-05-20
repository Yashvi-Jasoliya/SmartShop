import natural from 'natural';
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = natural;

export interface ReviewType {
    comment: string;
    rating?: number;
    date?: Date;
    reviewer?: string;
}

export interface ProductType {
    name: string;
    brand?: string;
}

const sentimentAnalyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
const tokenizer = new WordTokenizer();

const FAKE_REVIEW_PATTERNS = [
    /!!+|\?{2,}/, // Excessive punctuation
    /\b[A-Z]{4,}\b/, // ALL CAPS words
    /\b(?:love|hate|worst)\b.{0,5}\b(?:perfect|awful|scam|terrible)\b/i, // Extreme positive/negative
    /\b(?:my (?:son|daughter|husband)|gift for|bought this for)\b/i, // Scripted/gift
    /\b(?:compared to|vs|better than|unlike)\b.{1,10}\b(?:[A-Z][a-z]+)\b/i, // Brand comparisons
    /5 stars?|1 star|★★★★★|☆☆☆☆☆/i, // Star rating mentions
    /received (?:this|it) (?:as a gift|at a discount|for free|for review)/i, // Incentivized reviews
    /changed my life|must buy|everyone should get this/i, // Unrealistic claims
    /\b(?:great|amazing|awesome|perfect)\b.*\b(?:great|amazing|awes ome|perfect)\b/i, // Repetitive praise
];

export const isGenuineReview = (review: ReviewType, product: ProductType): boolean => {
    const text = review.comment.trim();
    const textLower = text.toLowerCase();
    const tokens = tokenizer.tokenize(textLower);
    const productWords = product.name.toLowerCase().split(/\s+/);

    // Reject very short reviews
    if (tokens.length < 4) return false;

    // Reject if product mention is spammy (fix: properly count matches)
    const productMentions = productWords.filter(pw =>
        tokens.includes(pw) && !['steel', 'case', 'cover'].includes(pw)
    ).length;
    if (productMentions > 3) return false;

    // Reject reviews matching fake patterns
    if (FAKE_REVIEW_PATTERNS.some(pattern => pattern.test(text))) return false;

    // Sentiment extremes rejection
    const sentimentScore = sentimentAnalyzer.getSentiment(tokens);
    if (sentimentScore > 4 && tokens.length < 8) return false; // Overly positive short reviews
    if (sentimentScore < -3) return false; // Strong negative reviews rejected

    // Passed all checks, considered genuine
    return true;
};

export const analyzeReviewBatch = (reviews: ReviewType[], product: ProductType): boolean => {
    const reviewTexts = reviews.map(r => r.comment.trim().toLowerCase());

    // Reject batches with duplicates or missing reviewers
    if (new Set(reviewTexts).size !== reviewTexts.length) return false;
    if (reviews.some(r => !r.reviewer)) return false;

    const genuineCount = reviews.filter(r => isGenuineReview(r, product)).length;
    return genuineCount / reviews.length > 0.7; // At least 70% genuine reviews required
};
