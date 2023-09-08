export interface Profile {
	id: string
	rank: number
	username: string
	followers: number
	following: number
	likes: number
	replies: number
	recasts: number
	mentions: number
}

export interface Strategy {
	name: string
	description: string
}

export const strategies = [
	{ name: 'follows', description: 'This strategy emphasizes only on the relevant and meaningful follows as peer-to-peer attestations, disregarding recasts and replies.'},
	{ name: 'engagement', description: 'This strategy emphasizes on social engagements as attestations, combining follows, recasts, likes, replies and mentions.'},
	{ name: 'creator', description: 'Similar to the followship strategy, but increases the influence of a few OG profiles on the social graph.'},
	{ name: 'active OGs', description: 'Similar to the engagement strategy, but increases the influence of a few OG profiles on the social graph.'},
] satisfies Strategy[]

const API_URL = 'https://api.cast.k3l.io'
export const PER_PAGE = 100

export async function globalRankings(sName: Strategy['name'], page: number) {
	const url = new URL((process.env.API_URL || API_URL) + `/rankings`)
	url.searchParams.set('strategy', sName)
	url.searchParams.set('offset', String((Math.max(page - 1, 0)) * PER_PAGE))
	url.searchParams.set('limit', String(PER_PAGE))

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		console.error(`API response for url=${url.toString()}: ${await resp.text()}`)
		throw new Error('Error fetching the profile global rankings')
	}

	const data = await resp.json() as Profile[]
	
	return data
}

export async function rankingCounts(sName: Strategy['name']) {
	const url = new URL((process.env.API_URL || API_URL) + `/rankings_count`)
	url.searchParams.set('strategy', sName)

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		console.error(`API response for url=${url.toString()}: ${await resp.text()}`)
		throw new Error('Error fetching rankings count')
	}

	const { count } = await resp.json() as { count: number }
	
	return count
}

export async function globalRankByUsername(sName: Strategy['name'], username: string) {
	const url = new URL((process.env.API_URL || API_URL) + `/ranking_index`)
	console.log('username', username)

	url.searchParams.set('strategy', sName)
	url.searchParams.set('username', username)

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (resp.ok !== true) {
		const text = await resp.text()
		if(text === 'Username does not exist') {
			return null
		}

		console.error(`API response for url=${url.toString()}: ${text}`)
		throw new Error('Error fetching ranking index')
	}

	const { rank } = await resp.json() as { rank: number }
	
	return rank
}

export async function personalisedRankings(username: string, page: number) {
	const url = new URL((process.env.API_URL || API_URL) + `/suggest`)
	url.searchParams.set('username', username)
	// url.searchParams.set('strategy', sName)
	url.searchParams.set('offset', String((page -1) * PER_PAGE))
	url.searchParams.set('limit', String(PER_PAGE))

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		const text = await resp.text()
		if(text === 'Username does not exist') {
			return []
		}

		console.error(`API response for url=${url.toString()}: ${text}`)
		throw new Error('Error fetching personalised profiles')
	}

	const data = await resp.json() as Profile[]
	
	return data
}