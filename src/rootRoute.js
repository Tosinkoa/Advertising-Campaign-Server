import CampaignRoutes from "./api/CampaignRoutes.js"

const rootRoute = (app) => {
  app.use(CampaignRoutes)
}

export default rootRoute
