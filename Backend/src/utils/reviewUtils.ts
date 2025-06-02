    import natural from 'natural';
import { Review } from '../types/types.js';
    const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = natural;

    export interface ReviewType {
        comment: string;
        rating?: number;
        date?: Date;
        reviewer?: string;
        image?: string;
    }

    export interface ProductType {
        name: string;
        brand?: string;
        image?: string[];
    }

    const sentimentAnalyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const tokenizer = new WordTokenizer();

    // Fake review detection patterns
    const FAKE_REVIEW_PATTERNS = [
        /!!+|\?{2,}/, // Excessive punctuation
        /\b[A-Z]{4,}\b/, // ALL CAPS words
        /\b(?:love|hate|worst)\b.{0,5}\b(?:perfect|awful|scam|terrible)\b/i, // Extreme sentiment
        /\b(?:my (?:son|daughter|husband)|bought this for)\b/i, // Gift scripts
        /\b(?:compared to|vs|better than|unlike)\b.{1,10}\b(?:[A-Z][a-z]+)\b/i, // Brand comparisons
        /5 stars?|1 star|★★★★★|☆☆☆☆☆/i, // Star mentions
        /received (?:this|it) (?:as a gift|at a discount|for free|for review)/i, // Incentivized
        /changed my life|must buy|everyone should get this|must go for it/i, // Unrealistic
        /\b(?:great|amazing|awesome|perfect)\b.*\b(?:great|amazing|awesome|perfect)\b/i, // Repetitive praise
    ];


    const CATEGORY_KEYWORDS: Record<string, string[]> = {
        chocolate: ['chocolate', 'taste', 'sweet', 'dark', 'milk', 'bitter', 'creamy', 'delicious', 'snack', 'flavor'],
        phone: ['phone', 'battery', 'screen', 'camera', 'android', 'ios', 'charging', 'display', 'performance', 'signal'],
        sofa: ['sofa', 'cushion', 'comfort', 'fabric', 'recline', 'seat', 'leather', 'living room', 'support'],
        smartfiretv: ['tv', 'screen', 'picture', 'black', 'hdr', 'brightness', 'slow', 'motion', 'display', 'mount', 'stand', 'screw', 'wall'],
        purse: ['purse', 'zipper', 'leather', 'quality', 'size', 'bag', 'design', 'pretty', 'strap', 'pocket'],
        biscuit: ['biscuit', 'biscuits', 'cookie', 'cookies', 'crunchy', 'snack', 'flavor', 'sweet', 'buttery', 'tasty', 'crispy'],
        kurtiset: ['kurti', 'kurti set', 'fabric', 'cotton', 'silk', 'embroidered', 'pattern', 'ethnic', 'design', 'sleeves', 'fit', 'comfortable', 'look', 'style'],
        watch: ['watch', 'strap', 'dial', 'battery', 'display', 'chronograph', 'analog', 'digital', 'smartwatch', 'fitness', 'band', 'bezel'],
        chips: ['chips', 'crunchy', 'salty', 'spicy', 'flavor', 'snack', 'crispy', 'potato', 'corn', 'packaging'],
        shoes: ['shoes', 'sole', 'comfortable', 'fit', 'sneakers', 'running', 'heels', 'boots', 'leather', 'grip', 'durable', 'walking'],
        salt: ['salt', 'iodized', 'fine', 'coarse', 'table salt', 'sea salt', 'flavor', 'cooking', 'taste', 'kitchen'],
        laptop: ['laptop', 'screen', 'keyboard', 'battery', 'performance', 'processor', 'ram', 'storage', 'ssd', 'display', 'windows', 'mac'],
        indoorplants: ['plant', 'indoor', 'greenery', 'pot', 'leaf', 'watering', 'sunlight', 'grow', 'soil', 'fresh', 'aesthetic', 'air'],
        headphone: ['headphone', 'sound', 'bass', 'noise', 'mic', 'bluetooth', 'wireless', 'audio', 'ear', 'comfort', 'voice', 'music'],
        football: ['ball', 'football', 'pump', 'nivia', 'storm', 'rubber', 'size 5', 'kick', 'bounce', 'durable', 'outdoor', 'grip', 'air', 'inflate', 'game', 'match', 'training', 'practice', 'field', 'control', 'white']

    };


    const detectCategoryFromProduct = (productName: string): string => {
        const name = productName.toLowerCase();
        if (name.includes('chocolate')) return 'chocolate';
        if (name.includes('phone') || name.includes('smartphone')) return 'phone';
        if (name.includes('sofa') || name.includes('couch')) return 'sofa';
        if (name.includes('tv') || name.includes('firetv')) return 'smartfiretv';
        if (name.includes('purse') || name.includes('bag')) return 'purse';
        if (name.includes('biscuit') || name.includes('bag')) return 'biscuit';
        if (name.includes('kurtiset') || name.includes('bag')) return 'kurtiset';
        if (name.includes('ball') || name.includes('football')) return 'ball';
        return 'unknown';
    };


    // Check if review matches expected category
    const isReviewRelevant = (comment: string, productName: string): boolean => {
        const category = detectCategoryFromProduct(productName);
        const keywords = CATEGORY_KEYWORDS[category];
        if (!keywords) return true; // fallback: assume relevant

        const allOtherKeywords = Object.entries(CATEGORY_KEYWORDS)
            .filter(([key]) => key !== category)
            .flatMap(([, kws]) => kws);

        const tokens = tokenizer.tokenize(comment.toLowerCase());

        const matchCount = tokens.filter(token => keywords.includes(token)).length;
        const offTopicCount = tokens.filter(token => allOtherKeywords.includes(token)).length;

        // Must have at least 2 relevant keywords and no more than 1 off-topic
        return matchCount >= 2 && offTopicCount <= 1;
    };


    // Main genuine review check
    export const isGenuineReview = (review: ReviewType, product: ProductType): boolean => {
        const text = review.comment.trim();
        const textLower = text.toLowerCase();
        const tokens = tokenizer.tokenize(textLower);
        const productWords = product.name.toLowerCase().split(/\s+/);

        // Reject very short reviews
        if (tokens.length < 4) return false;

        // Reject if off-topic or mismatched to product
        if (!isReviewRelevant(text, product.name)) return false;

        // Reject if product mention is spammy
        const productMentions = productWords.filter(pw =>
            tokens.includes(pw) && !['steel', 'case', 'cover'].includes(pw)
        ).length;
        if (productMentions > 3) return false;

        // Reject based on fake patterns
        if (FAKE_REVIEW_PATTERNS.some(pattern => pattern.test(text))) return false;

        // Sentiment-based filtering
        const sentimentScore = sentimentAnalyzer.getSentiment(tokens);
        if (sentimentScore > 4 && tokens.length < 8) return false; // Short & too positive
        if (sentimentScore < -3) return false; // Strong negative

        // Passed all checks
        return true;
    };

    // Analyze a batch of reviews
    export const analyzeReviewBatch = (reviews: ReviewType[], product: ProductType): boolean => {
        const reviewTexts = reviews.map(r => r.comment.trim().toLowerCase());

        // Reject batch with duplicates or missing reviewers
        if (new Set(reviewTexts).size !== reviewTexts.length) return false;
        if (reviews.some(r => !r.reviewer)) return false;

        const genuineCount = reviews.filter(r => isGenuineReview(r, product)).length;
        return genuineCount / reviews.length > 0.7; // Minimum 70% genuine required
    };


