import got from "got"
import CurrentDate from "./CurrentDate.js"
import pool from "./DB-Client.js"

const SendTransaction = async (amount, email, req) => {
  console.log("Inside send transaction component......")

  const BackendBaseUrl = process.env.BACKEND_URL

  const { body } = await got.post("https://sandbox-api-d.squadco.com/transaction/initiate", {
    headers: { Authorization: "Bearer sandbox_sk_1a1598bb2f68511b205b478a43652ac616193e3c05b7" },
    json: {
      email: email,
      amount: amount * 100,
      initiate_type: "inline",
      currency: "NGN",
      callback_url: `${BackendBaseUrl}/payment-callback`,
    },
  })

  const data = JSON.parse(body)
  const CurrentWeek = await pool.query("SELECT slot_position FROM slot_number ORDER BY id DESC LIMIT 1")
  await pool.query(
    "INSERT INTO transactions ( tx_ref, amount, user_id, slot_number_position, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [data?.data?.transaction_ref, amount, req.session.user, CurrentWeek.rows[0].slot_position, CurrentDate()]
  )

  return body
}
export default SendTransaction
