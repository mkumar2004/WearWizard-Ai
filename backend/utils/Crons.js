const cron = require('node-cron');
const SeasonalPlan = require('../models/SeasonalPlan');
const generateSeason = require('../Services/generateSeason');

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

async function runSeasonJob() {
  console.log('🔥 Seasonal AI refresh started');

  
  await SeasonalPlan.deleteMany({});
  console.log(' Old seasonal data removed');

  
  for (const season of SEASONS) {
    try {
      const data = await generateSeason(season);

      await SeasonalPlan.create({
        seasonType: season,
        data
      });

      console.log(` ${season} generated & saved`);
    } catch (err) {
      console.error(` ${season} failed`, err.message);
    }
  }

  console.log('Seasonal refresh completed');
}


runSeasonJob();

cron.schedule('*/2 * * * *', async () => {
  await runSeasonJob();
});
