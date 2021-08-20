// import { fetchBootstrap } from "fpl-api"
import { useQuery } from "react-query"
import {
  Array,
  Boolean,
  Number,
  Record,
  Runtype,
  Static,
  String,
  ValidationError
} from "runtypes"
import { keyBy } from "src/util/keyBy"
import betterFetch from "../util/betterFetch"

// NB: If you're trying to add more endpoints and you get a confusing error -
// for some reason you need to end the url with a / for the proxy to work
const BASE_URL =
  "https://dronz-proxy.herokuapp.com/https://fantasy.premierleague.com/api"
const LEAGUE_ID = 1011990

async function runtypeFetch<T, R>(runtype: Runtype<R>, url: string) {
  try {
    const result = await betterFetch<T>(url, { contentType: "json" })
    const checkedResult = runtype.check(result)
    return checkedResult
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(err, { url })
    }
    throw err
  }
}

const ElementRT = Record({
  id: Number,
  first_name: String,
  second_name: String,
  web_name: String,
  team: Number,
  team_code: Number,
  selected_by_percent: String
})
type ElementRT = Static<typeof ElementRT>

const TeamRT = Record({
  code: Number,
  id: Number,
  name: String,
  short_name: String
})
type TeamRT = Static<typeof TeamRT>

const EventRT = Record({
  id: Number,
  finished: Boolean,
  is_current: Boolean
})
type EventRT = Static<typeof EventRT>

const BootstrapRT = Record({
  events: Array(EventRT),
  elements: Array(ElementRT),
  teams: Array(TeamRT)
})
type BootstrapRT = Static<typeof BootstrapRT>

const LeagueRT = Record({
  league: Record({ id: Number, name: String }),
  standings: Record({
    results: Array(
      Record({
        entry: Number,
        entry_name: String,
        player_name: String,
        rank: Number,
        total: Number
      })
    )
  })
})
type LeagueRT = Static<typeof LeagueRT>

const PickRT = Record({
  element: Number,
  is_captain: Boolean,
  is_vice_captain: Boolean,
  position: Number
})
type PickRT = Static<typeof PickRT>

const GameweekRT = Record({
  picks: Array(PickRT)
})
type GameweekRT = Static<typeof GameweekRT>

const StatRT = Record({ value: Number, element: Number })
const FixtureRT = Record({
  id: Number,
  kickoff_time: String,
  stats: Array(
    Record({ identifier: String, a: Array(StatRT), h: Array(StatRT) })
  ),
  team_h: Number,
  team_h_score: Number,
  team_a: Number,
  team_a_score: Number
})

type FixtureRT = Static<typeof FixtureRT>

export function fetchBootstrap() {
  const url = `${BASE_URL}/bootstrap-static/`
  return runtypeFetch(BootstrapRT, url)
}
export function fetchLeague(opts: { leagueId: number }) {
  const url = `${BASE_URL}/leagues-classic/${opts.leagueId}/standings/`
  return runtypeFetch(LeagueRT, url)
}
export function fetchGameweek(opts: { teamId: number; eventId: number }) {
  const url = `${BASE_URL}/entry/${opts.teamId}/event/${opts.eventId}/picks/`
  return runtypeFetch(GameweekRT, url)
}
export function fetchFixtures(opts: { eventId: number }) {
  const url = `${BASE_URL}/fixtures/?event=${opts.eventId}`
  console.log({ url })
  return runtypeFetch(Array(FixtureRT), url)
}

export interface Player {
  id: number
  firstName: string
  lastName: string
  webName: string
  teamId: number
  teamCode: number
  selectedBy: string
}
export type Players = { [id: number]: Player }
export interface Team {
  id: number
  code: number
  name: string
  shortName: string
}
export type Teams = { [id: number]: Team }

export type PickType = "STARTING" | "BENCHED" | "CAPTAIN" | "VICE"
export interface Manager {
  id: number
  name: string
  teamName: string
  rank: number
  totalPoints: number
  picks: {
    [id: number]: PickType
  }
}
export interface League {
  id: number
  name: string
  managers: Manager[]
}

export interface FixtureTeam {
  // goals: Array<{ }
  teamId: number
  team: Team
  score: number
}
export interface Fixture {
  id: number
  kickoffTime: string
  home: FixtureTeam
  away: FixtureTeam
}

function parseCurrentEventId(events: EventRT[]): number {
  let currentEventId = 0
  for (let eventData of events) {
    if (eventData.is_current) {
      currentEventId = eventData.id
      break
    }
  }
  return currentEventId
}
function parsePlayerFromElement(element: ElementRT): Player {
  const {
    id,
    first_name,
    web_name,
    second_name,
    team,
    team_code,
    selected_by_percent
  } = element
  return {
    id,
    firstName: first_name,
    lastName: second_name,
    webName: web_name,
    teamId: team,
    teamCode: team_code,
    selectedBy: selected_by_percent
  }
}
function parseTeam(team: TeamRT): Team {
  const { id, code, name, short_name } = team
  return {
    id,
    code,
    name,
    shortName: short_name
  }
}
function parseFixture(fixture: FixtureRT, teams: Teams): Fixture {
  const {
    id,
    kickoff_time,
    stats,
    team_h,
    team_h_score,
    team_a,
    team_a_score
  } = fixture
  return {
    id,
    kickoffTime: kickoff_time,
    home: {
      teamId: team_h,
      team: teams[team_h],
      score: team_h_score
    },
    away: {
      teamId: team_a,
      team: teams[team_a],
      score: team_a_score
    }
  }
}

export async function init() {
  const bootstrap = await fetchBootstrap()
  const playerList = bootstrap.elements.map(parsePlayerFromElement)
  const players = keyBy(playerList, "id")
  const teamList = bootstrap.teams.map(parseTeam)
  const teams = keyBy(teamList, "id")
  const currentEventId = parseCurrentEventId(bootstrap.events)
  const fixturesResponse = await fetchFixtures({ eventId: currentEventId || 1 })
  const fixtures = fixturesResponse.map((fixture) =>
    parseFixture(fixture, teams)
  )
  console.log({ players, teams, currentEventId, fixtures })
  return { players, teams, currentEventId, fixtures }
}

export function useInitQuery() {
  return useQuery("INIT", init)
}

function getPickType(pick: PickRT): PickType {
  if (pick.is_captain) return "CAPTAIN"
  if (pick.is_vice_captain) return "VICE"
  return pick.position <= 11 ? "STARTING" : "BENCHED"
}

export async function getLeague(
  leagueId: number,
  currentEventId: number
): Promise<League> {
  const league = await fetchLeague({ leagueId })
  const {
    league: { name, id },
    standings: { results }
  } = league
  const managers = await Promise.all(
    results.map(async (result) => {
      const gw = await fetchGameweek({
        teamId: result.entry,
        eventId: currentEventId
      })
      const picks = gw.picks.reduce((acc, pick) => {
        acc[pick.element] = getPickType(pick)
        return acc
      }, {} as Manager["picks"])
      const manager: Manager = {
        id: result.entry,
        name: result.player_name,
        teamName: result.entry_name,
        rank: result.rank,
        totalPoints: result.total,
        picks
      }
      return manager
    })
  )
  return {
    name,
    id,
    managers
  }
}

export function useGetLeagueQuery(leagueId = LEAGUE_ID) {
  const { data } = useInitQuery()
  return useQuery(
    ["LEAGUE", leagueId],
    () => getLeague(leagueId, data?.currentEventId || 0),
    { enabled: !!data, retry: false }
  )
}
