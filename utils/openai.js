const OpenAI = require('openai');

let openai = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    console.warn('Warning: OPENAI_API_KEY not set. AI features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
}

async function generateRecipe(ingredients, dietaryPreferences, cookingTime) {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Cannot generate recipe.');
  }
  const prompt = `Generate a detailed recipe using the following:
- Available ingredients: ${ingredients.join(', ')}
- Dietary preferences: ${dietaryPreferences.join(', ') || 'none'}
- Maximum cooking time: ${cookingTime || 'any'} minutes

Please provide:
1. Recipe title
2. Description
3. Complete ingredients list with amounts
4. Step-by-step instructions
5. Prep time and cook time
6. Servings
7. Difficulty level (easy/medium/hard)
8. Cuisine type
9. Nutritional information estimate (calories, protein, carbs, fat)

Respond in JSON format with these fields: title, description, ingredients (array of {name, amount, unit}), instructions (array of strings), prepTime, cookTime, servings, difficulty, cuisine, nutrition {calories, protein, carbs, fat}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and recipe creator. Generate creative, delicious, and well-balanced recipes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048
    });

    const recipe = JSON.parse(response.choices[0].message.content);
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe with AI');
  }
}

async function analyzeRecipeImage(base64Image) {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Cannot analyze image.');
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide a detailed recipe based on what you see. Include ingredients, instructions, and nutritional estimates. Respond in JSON format."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048
    });

    const recipe = JSON.parse(response.choices[0].message.content);
    return recipe;
  } catch (error) {
    console.error('Error analyzing recipe image:', error);
    throw new Error('Failed to analyze recipe image');
  }
}

module.exports = {
  generateRecipe,
  analyzeRecipeImage
};