import request from "supertest"
import assert from "assert"

const runTest = () => {
  request(app)
    .get("/user")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200)
    .end(function (err, res) {
      if (err) throw err
    })
}

runTest()
