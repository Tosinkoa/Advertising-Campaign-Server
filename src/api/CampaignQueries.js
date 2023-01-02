import pool from "../LIB/DB-Client.js"

// This is called a façade pattern, read more here: https://en.wikipedia.org/wiki/Facade_pattern
export const CampaignQueries = {
  selectCampaignWithId(campaignId) {
    const data = pool.query("SELECT * FROM campaign WHERE id = $1", [campaignId])
    return data
  },

  selectAllCampaign() {
    const data = pool.query("SELECT * FROM campaign")
    return data
  },

  createNewCampaign(name, fromDate, toDate, totalBudget, dailyBudget, creativeUpload, creativeUploadId) {
    const data = pool.query(
      "INSERT INTO campaign (name, from_date, to_date, total_budget, daily_budget, creative_upload, creative_upload_id)  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, fromDate, toDate, totalBudget, dailyBudget, creativeUpload, creativeUploadId]
    )
    return data
  },

  updateCampaign(
    name,
    fromDate,
    toDate,
    totalBudget,
    dailyBudget,
    creativeUpload,
    creativeUploadId,
    currentDate,
    campaignId
  ) {
    const data = pool.query(
      "UPDATE campaign SET name = $1, from_date = $2, to_date = $3, total_budget = $4, daily_budget = $5, creative_upload = $6, creative_upload_id = $7, updated_at = $8 WHERE id = $9 RETURNING *",
      [name, fromDate, toDate, totalBudget, dailyBudget, creativeUpload, creativeUploadId, currentDate, campaignId]
    )
    return data
  },

  deleteCampaign(campaignId) {
    const data = pool.query("DELETE FROM campaign WHERE id = $1", [campaignId])
    return data
  },
}
