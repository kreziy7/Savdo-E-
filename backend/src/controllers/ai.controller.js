const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product.model");
const Sale = require("../models/Sale.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.askAI = async (req, res) => {
    try {
        // Support both 'prompt' and 'question' field names
        const { prompt, question, language } = req.body;
        const finalPrompt = prompt || question;

        // Validate prompt/question is provided
        if (!finalPrompt) {
            return res.status(400).json({
                success: false,
                message: "Savol (prompt yoki question) talab qilinadi"
            });
        }

        console.log(`[AI Request] Lang: ${language}, Prompt: ${finalPrompt.substring(0, 50)}...`);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not defined in backend .env!");
            return res.status(500).json({ success: false, message: "AI API key is missing" });
        }

        // Fetch context data (top products, current stock)
        const products = await Product.find().limit(20);
        const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(10);
        console.log(`[AI Context] Products: ${products.length}, Sales: ${recentSales.length}`);

        const context = `
      Siz "Savdo-E" do'kon boshqaruv tizimining aqlli yordamchisiz.
      Do'kon ma'lumotlari:
      Mahsulotlar soni: ${products.length}
      Oxirgi sotuvlar soni: ${recentSales.length}

      Mahsulotlar ro'yxati (namuna):
      ${products.map(p => `${p.name}: ${p.sellPrice} so'm, Qoldiq: ${p.stock} ${p.unit}`).join('\n')}

      Foydalanuvchi tili: ${language || 'uz'}

      Vazifangiz:
      1. Mahsulotlar to'g'risidagi savollarga aniq javob bering.
      2. Biznesni rivojlantirish bo'yicha maslahatlar bering.
      3. Savolga qisqa va lo'nda, do'stona tarzda ${language === 'ru' ? 'rus' : language === 'en' ? 'ingliz' : 'o\'zbek'} tilida javob bering.
      4. Agar biror narsani bilmasangiz, muloyimlik bilan ayting.

      Foydalanuvchi so'rovi: ${finalPrompt}
    `;

        console.log("[AI] Requesting Gemini...");
        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();
        console.log("[AI] Gemini response received.");

        res.json({
            success: true,
            data: text
        });
    } catch (error) {
        console.error("AI Error Full:", error);
        res.status(500).json({
            success: false,
            message: error.message || "AI xizmatida xatolik yuz berdi"
        });
    }
};
