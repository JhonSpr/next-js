export const Request_Animes = (
  page,
  search,
  estado,
  años,
  tipo,
  sortBy,
  rate,
  genero
) => {
  let url = 'https://api-rest.up.railway.app/api/v1/animes?'

  if (search && search !== '' && search !== 'null') {
    url += `name=${search}&`
  }
  if (años && años.length > 0) {
    const listAños = años?.join('&años=')
    url += `años=${listAños}&`
  }

  if (estado && estado.length > 0) {
    const estadoQuery = estado?.join('&estado=')
    url += `estado=${estadoQuery}&`
  }

  if (tipo && tipo.length > 0) {
    const tipoQuery = tipo.join('&type=')
    url += `type=${tipoQuery}&`
  }

  if (sortBy) {
    url += `sortBy=${sortBy}&`
  }

  if (rate) {
    url += `rating=${rate}&`
  }

  if (genero && genero.length > 0) {
    const generoQuery = genero.join('&genero=')
    url += `genero=${generoQuery}&`
  }
  if (page) {
    url += `page=${page}`
  }
  return fetch(url, { next: { revalidate: 10 } }).then((res) => res.json())
}
