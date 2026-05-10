import { createPoi, CreatePoiInput } from '@/repository/pois.repository';

export async function createPoiService(data: CreatePoiInput) {
  return await createPoi(data);
}
