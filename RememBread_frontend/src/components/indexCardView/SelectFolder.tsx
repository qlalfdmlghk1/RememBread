import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/common/Button";
import CreateFolderDialog from "@/components/dialog/CreateFolderDialog";
import FolderPathBreadcrumb from "@/components/folder/FolderPathBreadcrumb";
import { patchMoveCardSet, postForkCardSet } from "@/services/cardSet";
import { getFolder, getSubFolder } from "@/services/folder";
import { Folder } from "@/types/folder";
import { useToast } from "@/hooks/use-toast";

const SEPARATOR = "퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁";

type FolderTreeItem = Folder & {
  children?: FolderTreeItem[];
  isOpen?: boolean;
  parent?: FolderTreeItem;
};

interface SelectFolderProps {
  isMyCardSet: boolean;
  selectedCardSetId: number | null;
  setFolderSelect: (folderSelect: boolean) => void;
  setSelectedFolderId: (id: number | null) => void;
}

const SelectFolder = ({
  isMyCardSet,
  selectedCardSetId,
  setFolderSelect,
  setSelectedFolderId,
}: SelectFolderProps) => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<FolderTreeItem[]>([]);
  const [folderPath, setFolderPath] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setFolderPath(calculatePath(folder));
  };

  const handleSelectFolder = () => {
    setSelectedFolderId(selectedFolder?.id ?? null);
    setFolderSelect(false);
  };

  const handleMoveCardSet = async () => {
    if (selectedCardSetId === null || selectedFolder === null) {
      return;
    }

    try {
      await patchMoveCardSet(selectedFolder.id, selectedCardSetId);

      toast({
        variant: "success",
        title: "이동 완료",
        description: "카드셋이 성공적으로 이동되었습니다.",
      });

      setFolderSelect(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "이동 실패",
        description: "카드셋 이동 중 오류가 발생했습니다.",
      });
    }
  };

  const handleForkCardSet = async () => {
    if (selectedCardSetId === null || selectedFolder === null) {
      return;
    }

    try {
      await postForkCardSet(selectedCardSetId, { folderId: selectedFolder.id });

      toast({
        variant: "success",
        title: "포크 완료",
        description: "카드셋이 성공적으로 복사되었습니다.",
      });

      setFolderSelect(false);
    } catch {
      toast({
        variant: "destructive",
        title: "포크 실패",
        description: "카드셋 복사 중 오류가 발생했습니다.",
      });
    }
  };

  const fetchRootFolders = async () => {
    try {
      const response = await getFolder();
      // 루트 폴더 요청
      const rootFolders = response.result.subFolders;

      // 루트 폴더를 FolderTreeItem 형태로 변환
      setFolders(rootFolders.map((f: Folder) => ({ ...f })));
    } catch (error) {
      // console.error("루트 폴더 불러오기 실패:", error);
    }
  };

  const toggleFolder = async (folderId: number) => {
    const updateTree = async (nodes: FolderTreeItem[]): Promise<FolderTreeItem[]> => {
      return Promise.all(
        nodes.map(async (node) => {
          if (node.id === folderId) {
            handleFolderSelect(node);

            if (node.isOpen) {
              // 접기
              return { ...node, isOpen: false, children: [] };
            } else {
              // 펼치기: 하위 폴더 API 요청
              try {
                const folderResponse = await getSubFolder(folderId);
                const childrenFolders = folderResponse.result.subFolders;

                return {
                  ...node,
                  isOpen: true,
                  children: childrenFolders.map((child: Folder) => ({ ...child, parent: node })),
                };
              } catch (error) {
                // console.error("하위 폴더 불러오기 실패:", error);
                return node;
              }
            }
          }

          // 자식 노드 재귀
          if (node.children) {
            const updatedChildren = await updateTree(node.children);
            return { ...node, children: updatedChildren };
          }

          return node;
        }),
      );
    };

    const updated = await updateTree(folders);
    setFolders(updated);
  };

  const CreateFolder = async () => {
    if (selectedFolder) {
      const response = await getSubFolder(selectedFolder.id);

      const updatedSubFolders = response.result.subFolders.map((f: Folder) => ({
        ...f,
        parent: selectedFolder,
      }));

      // 폴더 트리 갱신
      const updateFolders = (nodes: FolderTreeItem[]): FolderTreeItem[] => {
        return nodes.map((node) => {
          if (node.id === selectedFolder.id) {
            return { ...node, children: updatedSubFolders };
          }
          if (node.children) {
            return { ...node, children: updateFolders(node.children) };
          }
          return node;
        });
      };

      const updatedFolders = updateFolders(folders);
      setFolders(updatedFolders);
    } else {
      setFolders([]);

      // 루트 폴더 요청
      await fetchRootFolders();
    }
  };

  const calculatePath = (folder: FolderTreeItem | null): string => {
    if (!folder) return "";

    let path = folder.id + SEPARATOR + folder.name;
    let currentFolder = folder.parent;

    while (currentFolder) {
      path = currentFolder.id + SEPARATOR + currentFolder.name + " > " + path;
      currentFolder = currentFolder.parent;
    }

    return path;
  };

  const renderFolderTree = (nodes: FolderTreeItem[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="flex flex-col w-full items-center">
        <span
          className="w-full text-left"
          onClick={() => {
            handleFolderSelect(node);
            toggleFolder(node.id);
          }}
        >
          <span
            className={`flex w-full text-left cursor-pointer ${
              selectedFolder?.id === node.id ? "font-bold" : ""
            }`}
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            {node.isOpen ? "📂" : "📁"} {node.name}
          </span>
        </span>

        {node.isOpen && node.children && renderFolderTree(node.children, depth + 1)}
      </div>
    ));
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setFolderSelect(false);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    fetchRootFolders();
  }, []);

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-env(safe-area-inset-top) top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
            <ArrowLeft className="cursor-pointer" onClick={() => setFolderSelect(false)} />
            <h1 className="text-xl font-bold">폴더 선택</h1>
            <div className="w-8 h-8"></div>
          </ul>
        </nav>
      </header>

      <div
        className="flex flex-col justify-between w-full h-full mt-14 text-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {/* 경로 표시 */}
          <div className="flex justify-between my-5 text-left items-center gap-5">
            <div className="min-w-0 flex-1">
              <FolderPathBreadcrumb path={`${folderPath}`} toggleFolder={toggleFolder} />
            </div>
            <div className="shrink-0">
              <CreateFolderDialog
                selectedFolderName={selectedFolder?.name ?? null}
                selectedFolderId={selectedFolder?.id ?? null}
                onCreateFolder={CreateFolder}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-start items-start overflow-auto rounded-md border p-5 scrollbar-hide bg-neutral-50">
            {isMyCardSet && (
              <span
                className="flex w-full text-left cursor-pointer"
                onClick={() => {
                  const likeFolder = { id: -1, name: "즐겨찾기" };
                  setSelectedFolder(likeFolder);
                  setFolderPath(calculatePath(likeFolder));
                }}
              >
                ⭐ 즐겨찾기
              </span>
            )}

            {/* 폴더 트리 렌더링 */}
            {renderFolderTree(folders)}
          </div>
        </div>
        {selectedCardSetId === null ? (
          <Button variant="primary" className="mt-5" onClick={handleSelectFolder}>
            선택하기
          </Button>
        ) : isMyCardSet ? (
          <Button variant="primary" className="mt-5" onClick={handleMoveCardSet}>
            이동하기
          </Button>
        ) : (
          <Button variant="primary" className="mt-5" onClick={handleForkCardSet}>
            가져오기
          </Button>
        )}
      </div>
    </>
  );
};

export default SelectFolder;
