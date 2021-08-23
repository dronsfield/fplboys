import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

// get create-react-app env var (REACT_APP_*)
function craEnv(suffix: string) {
  return process.env[`REACT_APP_${suffix}`] || ""
}

const appConfig = {
  BUILD_ID: craEnv("BUILD_ID"),
  LEAGUE_ID: 1011990
}
export default appConfig
