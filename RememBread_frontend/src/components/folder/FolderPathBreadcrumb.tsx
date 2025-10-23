import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SEPARATOR = "퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁";

type FolderPathBreadcrumbProps = {
  path: string;
  toggleFolder: (folderId: number) => void;
};

const FolderPathBreadcrumb = ({ path, toggleFolder }: FolderPathBreadcrumbProps) => {
  const segments = path
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm text-muted-foreground">
        위치를 선택해주세요
      </div>
    );
  }

  if (segments.length === 1) {
    return (
      <div className="flex w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem
              className="min-w-0 cursor-pointer"
              onClick={() => toggleFolder(Number(segments[0].split(SEPARATOR)[0]))}
            >
              <p className="truncate">
                {segments[0].split(SEPARATOR)[1] === "즐겨찾기" ? "⭐ " : "📁 "}
                {segments[0].split(SEPARATOR)[1]}
              </p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  const first = segments[0];
  const middle = segments.slice(1, -1);
  const last = segments[segments.length - 1];

  return (
    <div className="flex w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm">
      <Breadcrumb className="w-full overflow-hidden">
        <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap min-w-0 overflow-hidden">
          <BreadcrumbItem className="min-w-0 max-w-full">
            <p
              className="truncate cursor-pointer"
              onClick={() => toggleFolder(Number(first.split(SEPARATOR)[0]))}
            >
              {"📁 " + first.split(SEPARATOR)[1]}
            </p>
          </BreadcrumbItem>

          {middle.length > 0 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {middle.map((item, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => toggleFolder(Number(item.split(SEPARATOR)[0]))}
                      >
                        {"📁 " + item.split(SEPARATOR)[1]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </>
          )}

          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 max-w-full">
            <p className="truncate cursor-pointer">
              {last.split(SEPARATOR)[1].startsWith("🍞")
                ? last.split(SEPARATOR)[1]
                : "📁 " + last.split(SEPARATOR)[1]}
            </p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default FolderPathBreadcrumb;
