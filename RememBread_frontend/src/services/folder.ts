import http from "@/services/httpCommon";

interface Folder {
  id: number;
  name: string;
}

interface GetMyFoldersResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    total: number;
    subFolders: Folder[];
  };
}

// 루트 폴더 조회
export const getFolder = async () => {
  const response = await http.get("/folders");
  return response.data;
};

// 하위 폴더 조회
export const getSubFolder = async (folderId: number) => {
  const response = await http.get(`/folders/${folderId}/sub-folders`);
  return response.data;
};

// 폴더 생성
export const postFolder = async (name: string, upperFolderId: number | null) => {
  const response = await http.post("/folders", {
    name,
    upperFolderId,
  });
  return response.data;
};

// 나의 폴더 조회
export const getMyFolders = async (): Promise<GetMyFoldersResponse> => {
  const response = await http.get<GetMyFoldersResponse>(`/folders`);
  return response.data;
};
