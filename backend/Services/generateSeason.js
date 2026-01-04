// const openai = require('../Config/openRouter');
// const seasonPrompt = require('../Content/SeasonalModule');

// async function generateSeason(seasonType) {
//   const completion = await openai.chat.completions.create({
//     model: "meta-llama/llama-3.1-8b-instruct",
//     messages: [
//       { role: "system", content: seasonPrompt },
//       {
//         role: "user",
//         content: `Generate travel plan ONLY for ${seasonType} season`
//       }
//     ],
//     temperature: 0.3,
//     max_tokens: 1200
//   });

//   let aiResponse = completion.choices[0].message.content
//     .replace(/```json/g, '')
//     .replace(/```/g, '')
//     .trim();

//   const start = aiResponse.indexOf('{');
//   const end = aiResponse.lastIndexOf('}');

//   if (start === -1 || end === -1) {
//     throw new Error("Invalid JSON from AI");
//   }

//   return JSON.parse(aiResponse.substring(start, end + 1));
// }

// module.exports = generateSeason;
const openai = require('../Config/openRouter');
const seasonPrompt = require('../Content/SeasonalModule');

async function generateSeason(seasonType) {
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct",
    messages: [
      { role: "system", content: seasonPrompt },
      {
        role: "user",
        content: `Generate travel plan ONLY for ${seasonType} season. Use "${seasonType}" as the key name in your JSON response.`
      }
    ],
    temperature: 0.3,
    max_tokens: 1200
  });

  let aiResponse = completion.choices[0].message.content
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const start = aiResponse.indexOf('{');
  const end = aiResponse.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON from AI");
  }

  const parsedData = JSON.parse(aiResponse.substring(start, end + 1));

  // Validation: Check if the season key exists
  if (!parsedData[seasonType]) {
    console.warn(`⚠️ AI returned wrong key. Expected "${seasonType}", got:`, Object.keys(parsedData));
    
    // Fallback: If AI used "season" key, restructure it
    if (parsedData.season) {
      return { [seasonType]: parsedData.season };
    }
    
    throw new Error(`AI did not return data with key "${seasonType}"`);
  }

  return parsedData;
}

module.exports = generateSeason;