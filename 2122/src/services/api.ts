// import { fetchBootstrap } from "fpl-api"
import { useQuery } from "react-query"
import {
  Array,
  Boolean,
  Null,
  Number,
  Record,
  Runtype,
  Static,
  String,
  ValidationError
} from "runtypes"
import appConfig from "src/appConfig"
import { keyBy } from "src/util/keyBy"
import { ItemsOf } from "src/util/utilityTypes"
import betterFetch from "../util/betterFetch"

// NB: If you're trying to add more endpoints and you get a confusing error -
// for some reason you need to end the url with a / for the proxy to work
const BASE_URL =
  "https://dronz-proxy.herokuapp.com/https://fantasy.premierleague.com/api"
const LEAGUE_ID = appConfig.LEAGUE_ID

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
  selected_by_percent: String,
  element_type: Number,
  now_cost: Number
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
  entry_history: Record({
    points: Number
  }),
  picks: Array(PickRT)
})
type GameweekRT = Static<typeof GameweekRT>

const TransferRT = Record({
  element_in: Number,
  element_in_cost: Number,
  element_out: Number,
  element_out_cost: Number,
  entry: Number,
  event: Number
})
type TransferRT = Static<typeof TransferRT>

const StatRT = Record({ value: Number, element: Number })
const FixtureRT = Record({
  id: Number,
  kickoff_time: String,
  finished_provisional: Boolean,
  started: Boolean,
  stats: Array(
    Record({ identifier: String, a: Array(StatRT), h: Array(StatRT) })
  ),
  team_h: Number,
  team_h_score: Number.Or(Null),
  team_a: Number,
  team_a_score: Number.Or(Null)
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
export function fetchTransfers(opts: { teamId: number }) {
  const url = `${BASE_URL}/entry/${opts.teamId}/transfers/`
  return runtypeFetch(Array(TransferRT), url)
}
export function fetchFixtures(opts: { eventId: number }) {
  const url = `${BASE_URL}/fixtures/?event=${opts.eventId}`
  return runtypeFetch(Array(FixtureRT), url)
}

export const playerPositions = ["GKP", "DEF", "MID", "FWD"] as const
export type PlayerPosition = ItemsOf<typeof playerPositions> | "???"
export interface Player {
  id: number
  firstName: string
  lastName: string
  webName: string
  teamId: number
  teamCode: number
  selectedBy: string
  position: PlayerPosition
  cost: number
}
export type Players = { [id: number]: Player }
export interface Team {
  id: number
  code: number
  name: string
  shortName: string
}
export type Teams = { [id: number]: Team }

export interface GameweekTransfers {
  in: number[]
  out: number[]
}

export type PickType = "STARTING" | "BENCHED" | "CAPTAIN" | "VICE"
export interface Manager {
  id: number
  name: string
  teamName: string
  rank: number
  totalPoints: number
  eventPoints: number
  picks: {
    [id: number]: PickType
  }
  transfers: {
    in: number[]
    out: number[]
  }
}
export interface League {
  id: number
  name: string
  managers: Manager[]
}

export interface FixtureTeam {
  teamId: number
  team: Team
  score: number | null
}
export interface Fixture {
  id: number
  kickoffTime: string
  started: boolean
  finished: boolean
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
    selected_by_percent,
    element_type,
    now_cost
  } = element
  const position = playerPositions[element_type - 1] || "???"
  const cost = 0.1 * now_cost
  return {
    id,
    firstName: first_name,
    lastName: second_name,
    webName: web_name,
    teamId: team,
    teamCode: team_code,
    selectedBy: selected_by_percent,
    position,
    cost
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
    team_a_score,
    started,
    finished_provisional
  } = fixture
  return {
    id,
    kickoffTime: kickoff_time,
    started,
    finished: finished_provisional,
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
function parseGameweekTransfers(
  allTransfers: TransferRT[],
  currentEventId: number
): GameweekTransfers {
  const transfers: GameweekTransfers = {
    in: [],
    out: []
  }
  allTransfers.map((transferPayload) => {
    transfers.in.push(transferPayload.element_in)
    transfers.out.push(transferPayload.element_out)
  })
  return transfers
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
      const [gw, transfersResponse] = await Promise.all([
        fetchGameweek({
          teamId: result.entry,
          eventId: currentEventId
        }),
        fetchTransfers({ teamId: result.entry })
      ])

      const picks = gw.picks.reduce((acc, pick) => {
        acc[pick.element] = getPickType(pick)
        return acc
      }, {} as Manager["picks"])

      const transfers = parseGameweekTransfers(
        transfersResponse,
        currentEventId
      )

      const manager: Manager = {
        id: result.entry,
        name: result.player_name,
        teamName: result.entry_name,
        rank: result.rank,
        totalPoints: result.total,
        eventPoints: gw.entry_history.points,
        picks,
        transfers
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
