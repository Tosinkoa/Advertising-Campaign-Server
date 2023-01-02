import utc from "dayjs/plugin/utc.js"
import weekOfYear from "dayjs/plugin/weekOfYear.js"
import isoWeek from "dayjs/plugin/isoWeek.js"
import timezone from "dayjs/plugin/timezone.js"
import dayjs from "dayjs"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
