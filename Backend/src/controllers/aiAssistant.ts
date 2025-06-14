
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';


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

        const limitedProducts = (currentProducts || []).slice(0, 20);
        console.log('Using products:', limitedProducts.length);


        const prompt = `You are a shopping assistant for Smartshop with these strict rules:

        1. Greeting Rules:
        - FIRST MESSAGE ONLY: Start with "Welcome to Smartshop!" 
        - NEVER repeat this greeting in subsequent messages
        - For "ok thanks" or similar: ONLY reply "Okk thanks! See you next time."
        
        2. Response Formatting:
        - ALWAYS use this exact structure:
        Categories => Category1: Product1, Product2 | Category2: Product3, Product4
        Suggested Products: RandomProduct1, RandomProduct2
        
        3. Product Display Rules:
        - When showing categories: 
          * List ALL available products per category
          * Format: "CategoryName: Product1, Product2, Product3 |"
          * One line per category
          * End with "|" separator
        - For suggestions: Pick 2-3 random products across categories
        
        4. Current Inventory:
        Grocery: Salt, Almonds |
        Electronics: HeadPhone, Laptop, SmartFire Tv, Phone |
        Fashion: Purse, Kurti Set, Watch, Shoes |
        Food: Biscuits, Noodles, Chocolate, Chips |
        Garden: Indoor Plants |
        Furniture: Table, Sofa set |
        Sports: Football|
        
        5. Behavior Rules:
        - Keep responses under 100 words
        - Be conversational but professional
        - NEVER invent products - only use listed items
        - For product questions: Include ID (last 4 chars) and price
        
        Example Responses:
        First message:
        "Welcome to Smartshop!
        Categories => Grocery: Salt, Almonds | Electronics: HeadPhone, Laptop
        Suggested Products: Almonds (ID: x3aF), Laptop (ID: 9bK2)"
        
        Subsequent message:
        "Categories => Fashion: Purse, Kurti Set | Food: Biscuits, Noodles
        Suggested Products: Kurti Set (ID: pQ7m), Biscuits (ID: yT4n)"
        
        Now respond to: "${query}"`;

        console.log('Sending request to Gemini...');
        console.log('Prompt length:', prompt.length);

        // Call Gemini API
        let result;
        let response;
        let aiResponse;

        try {
            result = await model.generateContent(prompt);
            response = await result.response;
            aiResponse = response.text();
            console.log('Gemini response received:', aiResponse.substring(0, 100) + '...');
        } catch (geminiError) {
            console.error('Gemini API call failed:', geminiError);
            res.status(500).json({
                success: false,
                response: "I'm having trouble processing your request right now. Please try again.",
                products: [],
            });
            return;

        }

        const suggestedProducts: Product[] = [];

        if (limitedProducts && limitedProducts.length > 0) {
            limitedProducts.forEach((product: Product) => {

                const productNameWords = product.name.toLowerCase().split(' ');
                const responseText = aiResponse.toLowerCase();

                const hasMatch = productNameWords.some(word =>
                    word.length > 3 && responseText.includes(word)
                ) || responseText.includes(product._id);

                if (hasMatch && suggestedProducts.length < 1) {
                    suggestedProducts.push(product);
                }
            });
        }

        console.log('Suggested products:', suggestedProducts.length);

        const finalResponse = {
            success: true,
            response: aiResponse,
            products: suggestedProducts,
        };

        console.log('Sending successful response');
        res.status(200).json(finalResponse);

    } catch (error) {
        res.status(500).json({
            success: false,
            response: "I'm experiencing technical difficulties. Please try again in a moment.",
            products: [],
            error: process.env.NODE_ENV === 'development'
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



