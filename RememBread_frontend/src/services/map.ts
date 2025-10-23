import http from "@/services/httpCommon";

interface StartRecordRequest {
  count?: number;
  mode?: string;
  latitude: number;
  longitude: number;
}

interface StopRecordRequest {
  lastCardId: number;
  latitude: number;
  longitude: number;
}

interface StartRecordResponse {
  cardId: number;
  number: number;
  concept: string;
  description: string;
  conceptImageUrl: string;
  descriptionImageUrl: string;
}

interface RecordResponse<T = any> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface LocationAlertResponse {
  notificationLocationLatitude: number;
  notificationLocationLongitude: number;
  notificationLocationEnable: boolean;
}

export const getRoutes = async (cardSetId: number, page: number, size: number) => {
  const response = await http.get(`/studies/${cardSetId}/routes`, { params: { page, size } });
  return response.data;
};

export const startRecord = async (
  cardSetId: number,
  data: StartRecordRequest,
): Promise<RecordResponse<StartRecordResponse>> => {
  const response = await http.post(`/studies/${cardSetId}/start`, data);
  return response.data;
};

export const stopRecord = async (
  cardSetId: number,
  data: StopRecordRequest,
): Promise<RecordResponse> => {
  const response = await http.post(`/studies/${cardSetId}/stop`, data);
  return response.data;
};

export const postLocation = async (cardSetId: number, latitude: number, longitude: number) => {
  const response = await http.post(`/studies/${cardSetId}/location`, {
    latitude,
    longitude,
  });
  return response.data;
};

export const patchNotificationLocation = async (
  latitude: number,
  longitude: number,
  notificationEnable: boolean,
) => {
  const response = await http.patch(`/users/location`, {
    notificationLocationLatitude: latitude,
    notificationLocationLongitude: longitude,
    notificationLocationEnable: notificationEnable,
  });
  return response.data;
};

export const sendNotificationByLocation = async (
  latitude: number,
  longitude: number,
): Promise<RecordResponse<boolean>> => {
  const response = await http.post("/notifications", null, {
    params: {
      latitude,
      longitude,
    },
  });
  return response.data;
};

export const getLocationAlertPosition = async (): Promise<
  RecordResponse<LocationAlertResponse>
> => {
  const response = await http.get("/users/location");
  return response.data;
};
