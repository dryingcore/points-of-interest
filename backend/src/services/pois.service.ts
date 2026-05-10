import { createPoi, getAllPois, CreatePoiInput } from '@/repository/pois.repository';

export async function createPoiService(data: CreatePoiInput) {
  return await createPoi(data);
}

export async function getAllPoisService() {
  return await getAllPois();
}
