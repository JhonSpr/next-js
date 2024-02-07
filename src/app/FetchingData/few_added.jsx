export const Few__added = () => {
  return fetch(`https://api-rest.up.railway.app/api/v1/recien-agregados`, {
    next: { revalidate: 100 },
  }).then((res) => res.json())
}
