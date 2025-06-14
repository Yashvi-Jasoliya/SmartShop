
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../models/product.js';
interface DisplayProduct extends Product {
    displayText: string;
    discountPercentage?: number;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    stock: number;
    images: string[];
}

export const geminiShoppingAssistant = async (req: Request, res: Response) => {
    try {
        console.log('=== AI Assistant Request ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const { query, currentProducts, userId } = req.body;

        if (!userId) {
            console.log('Unauthorized access attempt - no userId');
            res.status(401).json({
                success: false,
                response: "I can't help you right now. Please login first to use the shopping assistant.",
                products: [],
            });
            return;
        }

        if (!query || typeof query !== 'string') {
            console.log('Invalid query:', query);
            res.status(400).json({
                success: false,
                response: "Please provide a valid question.",
                products: [],
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment variables');
            res.status(500).json({
                success: false,
                response: "Service configuration error. Please contact support.",
                products: [],
                error: "Missing API key"
            });
        }

        console.log('Gemini API Key present:', !!process.env.GEMINI_API_KEY);
        console.log('Products count:', currentProducts?.length || 0);


        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.5,
            }
        });

        const discountMatch = query.match(/(\d+)% off|\b(\d+) percent|\b(\d+)%/i);
        const requestedDiscount = discountMatch ?
            parseInt(discountMatch[1] || discountMatch[2] || discountMatch[3]) :
            null;


        const limitedProducts = (currentProducts || []).slice(0, 20);

        const productsWithDiscounts = limitedProducts.map((product: Product): DisplayProduct => {
            let discountPercentage: number | undefined;
            let discountInfo = '';
            let priceInfo = `Rs.${product.price}`;

            if (product.originalPrice && product.originalPrice > product.price) {
                discountPercentage = Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice * 100)
                );
                discountInfo = ` Discount: (${discountPercentage}% OFF)`;
                priceInfo = `Rs.${product.price}${discountInfo}`;
            }

            return {
                ...product,
                discountPercentage,
                displayText: `*${product.name}* - ${priceInfo}`
            };
        });

        const filteredProducts = requestedDiscount ?
            productsWithDiscounts.filter((p: DisplayProduct) => p.discountPercentage && p.discountPercentage >= requestedDiscount) :
            productsWithDiscounts;

        const categories: Record<string, string[]> = {};
        filteredProducts.forEach((product: DisplayProduct) => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product.displayText);
        });

        const categoryText = Object.entries(categories)
            .map(([category, products]) => `${category}: ${products.join(', ')}`)
            .join(' | ');

        const prompt = `You are a shopping assistant for Smartshop with these strict rules:
1. Greeting Rules:
- For greetings (reply only once, not in all response) "welcome To SmartShop" then never show with reply
- For farewells: Reply with "Thank you! Visit us again."

2. Discount Handling:
${requestedDiscount ? `- ONLY show products with ${requestedDiscount}% or higher discounts` : '- Show all available discounts'}
- Always display: *Product Name* - Rs.Price Discount: (X% OFF)
- Never show products that don't match the requested discount filter

3. Current ${requestedDiscount ? `${requestedDiscount}%+ OFF ` : ''}Inventory:
${categoryText}

4. Response Format:
Categories => [category]: [products] | [other category]: [products]
Suggested Products: [2-3 most relevant products]

5. Example Response:
"Categories => Electronics: *Laptop* - Rs.750 Discount: (25% OFF) | Fashion: *Watch* - Rs.50 Discount: (30% OFF)
Suggested Products: *Laptop* (25% OFF), *Watch* (30% OFF)"

Now respond to: "${query}"`;

     
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        const suggestedProducts = filteredProducts
            .filter((product: DisplayProduct) => {
                const responseLower = aiResponse.toLowerCase();
                return responseLower.includes(product.name.toLowerCase()) ||
                    responseLower.includes(product._id.slice(-4).toLowerCase());
            })
            .slice(0, 1); 

        res.status(200).json({
            success: true,
            response: aiResponse,
            products: suggestedProducts,
            discountFilter: requestedDiscount || 'none',
            discountDetails: suggestedProducts.map((p: DisplayProduct) => ({
                id: p._id,
                name: p.name,
                currentPrice: p.price,
                originalPrice: p.originalPrice,
                discountPercent: p.discountPercentage || 0
            }))

        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            response: "I'm experiencing technical difficulties.",
            products: []
        });
    }
};


export const testEndpoint = async (req: Request, res: Response) => {
    console.log('Test endpoint hit');
    res.json({
        success: true,
        message: 'AI assistant route is working!',
        timestamp: new Date().toISOString()
    });
};



