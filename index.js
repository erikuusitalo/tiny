import { nanoid } from 'nanoid'
import { Router } from 'itty-router'

// now let's create a router (note the lack of "new")
const router = Router()

const auth = req => {
  const apiToken = API_TOKEN
  const reqToken = req.headers.get('Authorization')

  if (!req.headers.has('Authorization')) {
    return new Response('', { status: 400 })
  }

  if (apiToken != reqToken) {
    return new Response('', { status: 400 })
  }
}

// GET collection index
router.get('/:id', async ({ params }) => {
  const { id } = params

  if (!id) {
    return new Response('', { status: 400 })
  }

  const destinationURL = await TINY_URL.get(String(id))

  if (destinationURL === null) {
    return new Response('', { status: 400 })
  }

  return Response.redirect(destinationURL, 301)
})

router.post('/', auth, async req => {
  const body = await req.json()

  const destination = body.destination
  const id = nanoid(parseInt(ID_LENGTH))

  await TINY_URL.put(id, destination)

  const json = JSON.stringify(
    { tinyUrl: `https://${HOST}/${id}`, destination },
    null,
    2,
  )

  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
})

router.all('*', () => new Response('', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request)),
)
