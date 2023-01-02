import dayjs from "dayjs"
import("./DayjsConfig.js")

const CurrentDate = () => {
  const date = dayjs().format()
  return date
}

export default CurrentDate
