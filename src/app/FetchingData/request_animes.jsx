export const Request_Animes = ({
  page,
  search,
  estado,
  años,
  tipo,
  sortBy,
  rate,
  genero,
  info,
  letra,
  recien,
}) => {
  let url = `https://api-rest.up.railway.app/api/v1/${
    recien ? 'recien-agregados' : 'animes'
  }?`

  if (letra !== undefined) {
    url += `letra=${letra}&`
  }

  if (search !== undefined) {
    url += `name=${search}&`
  }

  if (info !== '' && info !== 'null' && info !== undefined) {
    url += `info=${info}&`
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

  return fetch(url, { next: { revalidate: 0 } }).then((res) => res.json())
}
