import natural from 'natural';
import { GoogleGenerativeAI } from "@google/generative-ai";
import categoryKeywords from '../data/categoryKeywords.json' with { type: 'json' };

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

const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = natural;
const sentimentAnalyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
const tokenizer = new WordTokenizer();
const CATEGORY_KEYWORDS: Record<string, string[]> = categoryKeywords;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.5,
    }
});

const keywordCache = new Map<string, string[]>();
const contrastCache = new Map<string, string[]>();

// Fake review regex patterns
const FAKE_REVIEW_PATTERNS = [
    /!!+|\?{2,}/, // Excessive punctuation
    /\b[A-Z]{4,}\b/,
    /\b(?:love|hate|worst)\b.{0,5}\b(?:perfect|awful|scam|terrible)\b/i, // Extreme sentiment
    /\b(?:my (?:son|daughter|husband)|bought this for)\b/i, // Gift scripts
    /\b(?:compared to|vs|better than|unlike)\b.{1,10}\b(?:[A-Z][a-z]+)\b/i, // Brand comparisons
    /5 stars?|1 star|★★★★★|☆☆☆☆☆/i, // Star mentions
    /received (?:this|it) (?:as a gift|at a discount|for free|for review)/i, // Incentivized
    /changed my life|must buy|everyone should get this|must go for it/i, // Unrealistic
    /\b(?:great|amazing|awesome|perfect)\b.*\b(?:great|amazing|awesome|perfect)\b/i, // Repetitive praise
    /(very\s+){2,}/i,
    /(excellent)\s+\w+!?\s+(excellent)\s+\w+!?/i,
    /\bmissing\b.*?\band\b.*?\bcheap\b/i
];

// Detect category from product name for JSON fallback
const detectCategoryWithGemini = async (productName: string): Promise<string> => {
    try {
        const prompt = `Categorize this product: "${productName}"
        
        Choose the most specific category from these options:
        - headphone, indoorplants, purse, biscuit, salt, chocolate, kurtiset, sofaset, shoes, phone, laptop, smartfiretv, chips, watch, noodles, table, football, almonds, ketchup
        
        If none match exactly, choose the closest one or return "electronics", "food", "clothing", "furniture", or "other".
        
        Return ONLY the category name in lowercase.`;

        const result = await model.generateContent(prompt);
        const category = result.response.text().trim().toLowerCase();

        // Validate the response
        const validCategories = [
            'headphone', 'indoorplants', 'purse', 'biscuit', 'salt', 'chocolate',
            'kurtiset', 'sofaset', 'shoes', 'phone', 'laptop', 'smartfiretv',
            'chips', 'watch', 'noodles', 'table', 'football', 'almonds', 'ketchup',
            'electronics', 'food', 'clothing', 'furniture', 'other'
        ];

        return validCategories.includes(category) ? category : 'other';
    } catch (error) {
        console.error('Error detecting category:', error);
        return 'other';
    }
};

// Cache categories to avoid repeated API calls
const categoryCache = new Map<string, string>();

const getCachedCategory = async (productName: string): Promise<string> => {
    if (!categoryCache.has(productName)) {
        const category = await detectCategoryWithGemini(productName);
        categoryCache.set(productName, category);
    }
    return categoryCache.get(productName)!;
};

// Generate keywords with Gemini AI
const generateKeywords = async (productName: string): Promise<string[]> => {
    try {
        const prompt = `Generate 20 specific keywords for "${productName}" focusing on:
        - Key features
        - Technical specifications
        - Physical attributes
        - Common usage
        Return ONLY comma-separated lowercase keywords.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text()
            .trim()
            .replace(/["'\[\]]/g, '')
            .replace(/^keywords?:?/i, '');

        return text.split(',')
            .map(k => k.trim().toLowerCase())
            .filter(k => k.length > 0);
    } catch (error) {
        console.error('Error generating keywords:', error);
        return [productName.toLowerCase()];
    }
};

// Generate match keywords
const generateContrastKeywords = async (productName: string): Promise<string[]> => {
    try {
        const prompt = `List 5 words that would NEVER describe "${productName}" 
        (e.g., for headphones: "camera, android"). 
        Return ONLY comma-separated lowercase words.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text()
            .trim()
            .replace(/["'\[\]]/g, '');

        return text.split(',')
            .map(k => k.trim().toLowerCase())
            .filter(k => k.length > 0);
    } catch (error) {
        console.error('Error generating contrast keywords:', error);
        return [];
    }
};

// Cache and get keywords and matches
const getKeywordsForProduct = async (productName: string): Promise<{ keywords: string[], contrasts: string[] }> => {
    if (!keywordCache.has(productName)) {
        const [keywords, contrasts] = await Promise.all([
            generateKeywords(productName),
            generateContrastKeywords(productName)
        ]);
        keywordCache.set(productName, keywords);
        contrastCache.set(productName, contrasts);
    }
    return {
        keywords: keywordCache.get(productName)!,
        contrasts: contrastCache.get(productName)!
    };
};

const CONFIG = {
    MIN_REVIEW_LENGTH: 3,
    MIN_KEYWORD_MATCHES: 1,
    MAX_CONTRAST_MATCHES: 1,
    SENTIMENT_THRESHOLD: 6,
    BATCH_GENUINE_RATIO: 0.7,
    JSON_VERIFICATION_LENIENCY: 1,
    DEBUG_MODE: true
};

// vrify Json
const verifyWithJsonKeywords = async (review: ReviewType, product: ProductType): Promise<boolean> => {
    const category = await getCachedCategory(product.name);
    const keywords = CATEGORY_KEYWORDS[category] || [];
    const text = review.comment.toLowerCase();

    return keywords.some(kw => text.includes(kw)) ||
        product.name.toLowerCase().split(/\s+/).some(word => text.includes(word));
};

// Gemini AI-based analysis
const analyzeWithGemini = async (review: ReviewType, product: ProductType): Promise<boolean> => {
    const { keywords, contrasts } = await getKeywordsForProduct(product.name);
    const text = review.comment.toLowerCase();


    const relevantKeywords = keywords.filter(kw => text.includes(kw));
    if (relevantKeywords.length < 2) return false;


    const badMatches = contrasts.filter(kw => text.includes(kw));
    if (badMatches.length > 0) return false;


    const tokens = tokenizer.tokenize(text) || [];
    const sentiment = sentimentAnalyzer.getSentiment(tokens);
    return Math.abs(sentiment) <= 8;
};

// review validation function
export const isGenuineReview = async (review: ReviewType, product: ProductType): Promise<boolean> => {
    const text = review.comment.trim().toLowerCase();

    // Basic universal checks (apply to all reviews)
    if (text.length < 6) return false;
    if (FAKE_REVIEW_PATTERNS.some(p => p.test(text))) return false;

    // First verification: Gemini AI
    const geminiResult = await analyzeWithGemini(review, product);

    if (geminiResult) return true;

    // If Gemini rejects -> give second chance via JSON verification
    return verifyWithJsonKeywords(review, product);
};

// analyze review
export const analyzeReviewBatch = async (reviews: ReviewType[], product: ProductType): Promise<boolean> => {
    try {
        const texts = reviews.map(r => r.comment.trim().toLowerCase());

        if (new Set(texts).size !== texts.length) return false;
        if (reviews.some(r => !r.reviewer)) return false;

        const results = await Promise.all(
            reviews.map(r => isGenuineReview(r, product))
        );

        const genuineCount = results.filter(Boolean).length;
        return genuineCount / reviews.length > CONFIG.BATCH_GENUINE_RATIO;
    } catch (error) {
        console.error('Error analyzing batch:', error);
        return false;
    }
};

