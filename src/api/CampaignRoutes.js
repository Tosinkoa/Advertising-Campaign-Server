import express from "express"
const router = express.Router()
import MW_Check_Connection from "../MIDDLEWARES/NetworkConnectionCheck.js"
import { validateCampaign } from "../VALIDATORS/CampaignValidator.js"
import { CampaignQueries } from "./CampaignQueries.js"
import CurrentDate from "../LIB/CurrentDate.js"
import cloudinary from "../LIB/cloudinary.js"
import upload from "../LIB/multer.js"

const CAMPAIGN_IMAGES = upload.single("campaignImage")

//=======================================================================
// ===================This Route Create a New Campaign ==================
//=======================================================================
router.post("/create-campaign", MW_Check_Connection, async (req, res) => {
  CAMPAIGN_IMAGES(req, res, async (err) => {
    try {
      const { name, from_date, to_date, total_budget, daily_budget } = req.body
      const { error, value } = validateCampaign(req.body)
      if (error) return res.status(400).json({ error: error.details.map((e) => e.context.label) })
      if (!req.file) res.status(400).json({ error: "Make sure you upload at least one image" })
      if (err)
        return res
          .status(400)
          .send({ error: "You're uploading a wrong file format, make sure file end with '.jpg' or .jpeg or .png" })

      // Upload image on cloudinary
      const createImageOnCloudinary = await cloudinary.uploader.upload(
        req.file.path,
        { folder: "CampaignImages/creative-upload" },
        (err, result) => {
          if (err) return res.status(400).json({ error: "An error occur while uploading:", err })
          return result
        }
      )

      const creative_upload = createImageOnCloudinary.secure_url
      const creative_upload_id = createImageOnCloudinary.public_id
      // Save created data
      await CampaignQueries.createNewCampaign(
        name,
        from_date,
        to_date,
        total_budget,
        daily_budget,
        creative_upload,
        creative_upload_id
      )
      return res.status(200).json({ data: "Campaign Created Successfully" })
    } catch (e) {
      console.error(e)
      return res.status(500)
    }
  })
})

//=======================================================================
// ===================This Route Update a Campaign ======================
//=======================================================================
router.put("/update-campaign/:campaignId", MW_Check_Connection, async (req, res) => {
  try {
    console.log("Outside All")
    CAMPAIGN_IMAGES(req, res, async (err) => {
      const { campaignId } = req.params
      const { name, from_date, to_date, total_budget, daily_budget } = req.body
      const { error, value } = validateCampaign(req.body)
      if (error) return res.status(400).json({ error: error.details.map((e) => e.context.label) })

      console.log("Before All")
      const alreadyExistCampaignImages = await CampaignQueries.selectCampaignWithId(campaignId)
      console.log("After already exist")
      if (alreadyExistCampaignImages.rowCount < 1) return res.status(400).json({ error: "Campaign didnot exist" })
      // Delete the previous image on cloudinary with cloudinary public id and create a new one
      let createImageOnCloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(alreadyExistCampaignImages.rows[0].creative_upload_id)
        createImageOnCloudinary = await cloudinary.uploader.upload(
          req.file.path,
          { folder: "CampaignImages/creative-upload" },
          (err, result) => {
            if (err) return res.status(400).json({ error: "An error occur while uploading:", err })
            return result
          }
        )
      }

      const creative_upload = req.file
        ? createImageOnCloudinary.secure_url
        : alreadyExistCampaignImages.rows[0].creative_upload
      const creative_upload_id = req.file
        ? createImageOnCloudinary.public_id
        : alreadyExistCampaignImages.rows[0].creative_upload_id
      // Save updated data
      await CampaignQueries.updateCampaign(
        name,
        from_date,
        to_date,
        total_budget,
        daily_budget,
        creative_upload,
        creative_upload_id,
        CurrentDate(),
        campaignId
      )
      console.log("After update")
      return res.status(200).json({ data: "Campaign Updated Successfully" })
    })
  } catch (e) {
    console.error(e)
    return res.status(500)
  }
})

//=======================================================================
// ===================This Route Select a Campaign ======================
//=======================================================================
router.get("/select-a-campaign/:campaignId", MW_Check_Connection, async (req, res) => {
  const { campaignId } = req.params
  try {
    const selectedCampaign = await CampaignQueries.selectCampaignWithId(campaignId)
    if (selectedCampaign.rowCount < 1) return res.status(400).json({ error: "Campaign didnot exist" })
    return res.status(200).json({ data: selectedCampaign.rows[0] })
  } catch (e) {
    console.error(e)
    return res.status(500)
  }
})

//=======================================================================
// ===================This Route Select All Campaign ======================
//=======================================================================
router.get("/select-all-campaign", MW_Check_Connection, async (req, res) => {
  try {
    const selectedCampaign = await CampaignQueries.selectAllCampaign()
    if (selectedCampaign.rowCount < 1) return res.status(400).json({ error: "No campaign yet" })
    return res.status(200).json({ data: selectedCampaign.rows })
  } catch (e) {
    console.error(e)
    return res.status(500)
  }
})

//=======================================================================
// ===================This Route Delete a Campaign ======================
//=======================================================================
router.delete("/delete-campaign/:campaignId", MW_Check_Connection, async (req, res) => {
  const { campaignId } = req.params
  try {
    const selectedCampaign = await CampaignQueries.selectCampaignWithId(campaignId)
    await cloudinary.uploader.destroy(selectedCampaign.rows[0].creative_upload_id)
    if (selectedCampaign.rowCount < 1) return res.status(400).json({ error: "Campaign didnot exist" })
    await CampaignQueries.deleteCampaign(campaignId)
    return res.status(200).json({ data: "Campaign Deleted Successfully" })
  } catch (e) {
    console.error(e)
    return res.status(500)
  }
})

export default router
