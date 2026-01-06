import axios from 'axios';

export const getCitiesByUf = (uf: string | number) => axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
