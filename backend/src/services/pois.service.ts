import { createPoi, getAllPois, getPoiByName, getPoiByCoordinates, searchPoisByProximity, CreatePoiInput } from '@/repository/pois.repository';

export async function createPoiService(data: CreatePoiInput) {
  const result = await createPoi(data);
  
  if (!result) {
    const [existingName, existingCoords] = await Promise.all([
      getPoiByName(data.name),
      getPoiByCoordinates(data.x, data.y)
    ]);

    if (existingName) throw new Error('Conflito: Nome de POI já cadastrado.');
    if (existingCoords) throw new Error('Conflito: Coordenadas já ocupadas.');
    
    throw new Error('Falha na persistência do Ponto de Interesse.');
  }

  return result;
}

export async function getAllPoisService() {
  return await getAllPois();
}

export async function searchPoisService(x: number, y: number, dmax: number) {
  return await searchPoisByProximity(x, y, dmax);
}
