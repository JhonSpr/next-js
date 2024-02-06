export const Request_episode = (name) => {
  return fetch(
    `https://api-rest.up.railway.app/api/v1/animes?info=${name}`
  ).then((res) => res.json())
}
