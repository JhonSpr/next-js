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
  visitas,
  studio,
  limit,
  ova,
  calendario,
  proximos,
}) => {
  let url = `https://api-rest.up.railway.app/api/v1/${
    recien
      ? 'recien-agregados'
      : 'animes' && ova
      ? 'animes/ova'
      : 'animes' && calendario
      ? 'animes/calendario/data'
      : 'animes' && proximos
      ? 'animes/proximos-animes/data'
      : 'animes'
  }?`

  if (studio) {
    url += `studio=${studio}&`
  }
  if (visitas) {
    url += `visitas=${visitas}&`
  }

  if (letra && letra.length > 0) {
    const letraQuery = letra.join('&letra')
    url += `letra=${letraQuery}&`
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

  if (sortBy && sortBy.length > 0) {
    const sortByQuery = sortBy?.join('&sortBy=')

    if (sortBy.includes('mayor') || sortBy.includes('menor')) {
      url += `rating=${sortBy}&`
    } else {
      url += `sortBy=${sortByQuery}&`
    }
  }

  if (rate) {
    url += `rating=${rate}&`
  }

  if (genero && genero.length > 0) {
    const generoQuery = genero.join('&genero=')
    url += `genero=${generoQuery}&`
  }

  if (limit) {
    url += `limit=${limit}&`
  }

  if (page) {
    url += `page=${page}`
  }

  return fetch(url, { next: { revalidate: 0 } }).then((res) => res.json())
}
