export const Few__added = () => {
  return fetch(`https://api-rest.up.railway.app/api/v1/recien-agregados`).then(
    (res) => res.json()
  )
}
