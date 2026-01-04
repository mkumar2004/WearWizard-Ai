const express = require("express");
const openai = require("../Config/openRouter");
const chatPrompt = require("../Content/ChatModule");
const TravelPlan = require("../models/AiTravelPlan");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { msg } = req.body;

    if (!msg || typeof msg !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string"
      });
    }

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: chatPrompt },
        { role: "user", content: msg }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    if (
      !completion?.choices?.length ||
      !completion.choices[0].message?.content
    ) {
      return res.status(500).json({
        success: false,
        error: "Empty response from AI"
      });
    }

    const rawText = completion.choices[0].message.content.trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "AI response is not valid JSON",
        raw: rawText
      });
    }

    if (!parsedResponse.travelPlan) {
      return res.status(400).json({
        success: false,
        error: "Missing travelPlan object"
      });
    }

    
    const travelPlanDoc = new TravelPlan(parsedResponse.travelPlan);

    try {
      await travelPlanDoc.validate();
    } catch (schemaError) {
      return res.status(400).json({
        success: false,
        error: "Schema validation failed",
        details: schemaError.message
      });
    }

    
    await travelPlanDoc.save();

    return res.json({
      success: true,
      reply: travelPlanDoc
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

module.exports = router;
