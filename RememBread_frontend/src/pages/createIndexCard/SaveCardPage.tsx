import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/common/Button";
import CreateFolderDialog from "@/components/dialog/CreateFolderDialog";
import MergeCardAlertDialog from "@/components/dialog/MergeCardAlertDialog";
import CreateIndexCardSetDialog from "@/components/dialog/CreateIndexCardSetDialog";
import FolderPathBreadcrumb from "@/components/folder/FolderPathBreadcrumb";
import { getFolder, getSubFolder } from "@/services/folder";
import { getCardSetSimple } from "@/services/cardSet";
import { indexCardSet } from "@/types/indexCard";
import { Folder } from "@/types/folder";

const SEPARATOR = "퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁";

type FolderTreeItem = Folder & {
  children?: FolderTreeItem[];
  isOpen?: boolean;
  parent?: FolderTreeItem;
  cardSets?: indexCardSet[];
};

const SaveCardPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<FolderTreeItem[]>([]);
  const [folderPath, setFolderPath] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedCardSet, setSelectedCardSet] = useState<indexCardSet | null>(null);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setFolderPath(calculatePath(folder));
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
    // 카드셋 초기화
    setSelectedCardSet(null);

    const updateTree = async (nodes: FolderTreeItem[]): Promise<FolderTreeItem[]> => {
      return Promise.all(
        nodes.map(async (node) => {
          if (node.id === folderId) {
            handleFolderSelect(node);

            if (node.isOpen) {
              // 접기
              return { ...node, isOpen: false, children: [], cardSets: [] };
            } else {
              // 펼치기: 하위 폴더, 카드셋 API 요청
              try {
                const folderResponse = await getSubFolder(folderId);
                const childrenFolders = folderResponse.result.subFolders;

                const cardSetResponse = await getCardSetSimple(folderId);
                const childerenCardSets = cardSetResponse.result.cardSets;

                return {
                  ...node,
                  isOpen: true,
                  cardSets: childerenCardSets,
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
      <div key={node.id} className="flex flex-col w-full h-full items-center">
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
          {node.isOpen &&
            node.cardSets?.map((cardSet) => (
              <span
                key={cardSet.cardSetId}
                className={`flex w-full text-left cursor-pointer ${
                  selectedCardSet?.cardSetId === cardSet.cardSetId
                    ? "font-bold text-primary-500"
                    : ""
                }`}
                style={{ paddingLeft: `${(depth + 1) * 16}px` }}
                onClick={(e) => {
                  setSelectedCardSet(cardSet);
                  setFolderPath(calculatePath(node));
                  setSelectedFolder(node);
                  e.stopPropagation();
                }}
              >
                🍞 {cardSet.name}
              </span>
            ))}
        </span>

        {node.isOpen && node.children && renderFolderTree(node.children, depth + 1)}
      </div>
    ));
  };

  useEffect(() => {
    fetchRootFolders();
  }, []);

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-env(safe-area-inset-top) top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
            <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
            <h1 className="text-xl font-bold">저장 위치 선택</h1>
            <div className="w-8 h-8"></div>
          </ul>
        </nav>
      </header>

      <div
        className="flex flex-col justify-between w-full h-full mt-14 text-center"
        style={{ minHeight: "calc(100vh - 126px)" }}
      >
        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 196px)" }}>
          {/* 경로 표시 */}
          <div className="flex justify-between m-5 text-left items-center gap-5">
            <div className="min-w-0 flex-1">
              <FolderPathBreadcrumb
                path={`${folderPath}${
                  selectedCardSet ? " > " + SEPARATOR + "🍞" + selectedCardSet.name : ""
                }`}
                toggleFolder={toggleFolder}
              />
            </div>
            <div className="shrink-0">
              <CreateFolderDialog
                selectedFolderName={selectedFolder?.name ?? null}
                selectedFolderId={selectedFolder?.id ?? null}
                onCreateFolder={CreateFolder}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-start items-start mx-5 overflow-auto rounded-md border p-5 scrollbar-hide bg-neutral-50">
            {/* 폴더 트리 렌더링 */}
            {renderFolderTree(folders)}
          </div>
        </div>

        {selectedCardSet ? (
          <MergeCardAlertDialog selectedCardSet={selectedCardSet} />
        ) : selectedFolder ? (
          <CreateIndexCardSetDialog selectedFolder={selectedFolder} />
        ) : (
          <Button variant="primary" className="m-5" disabled={true}>
            저장하기
          </Button>
        )}
      </div>
    </>
  );
};

export default SaveCardPage;
