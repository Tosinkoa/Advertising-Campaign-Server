import dayjs from "dayjs"

const CurrentDate = () => {
  const date = dayjs().format()
  return date
}

export default CurrentDate
