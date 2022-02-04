import { nanoid } from 'nanoid'
import { Router } from 'itty-router'

// now let's create a router (note the lack of "new")
const router = Router()

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

router.all('*', () => new Response('', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request)),
)
