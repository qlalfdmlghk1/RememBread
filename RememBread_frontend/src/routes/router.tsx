import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { tokenUtils } from "@/lib/queryClient";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/LoginPage";
import GamesPage from "@/pages/GamesPage";
import MapPage from "@/pages/MapPage";
import SignupTermsPage from "@/pages/login/SignupTermsPage";
import TermDetailPage from "@/pages/login/TermDetailPage";
import CreateFromPDFPage from "@/pages/createIndexCard/CreateFromPDFPage";
import CreateFromSelfPage from "@/pages/createIndexCard/CreateFromSelfPage";
import CreateFromTextFPage from "@/pages/createIndexCard/CreateFromTextPage";
import CreateFromImageFPage from "@/pages/createIndexCard/CreateFromImagePage";
import SaveCardPage from "@/pages/createIndexCard/SaveCardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SocialCallbackPage from "@/pages/login/SocialCallbackPage";
import CardTestConceptPage from "@/pages/cardTest/CardTestConceptPage";
import CardTestExplainPage from "@/pages/cardTest/CardTestExplainPage";
import CardViewPage from "@/pages/indexCardSetView/CardViewPage";
import GameModePage from "@/pages/games/GameModePage";
import GameHomePage from "@/pages/games/GameHomePage";
import MemoryGamePage from "@/pages/games/MemoryGamePage";
import GameResultPage from "@/pages/games/GameResultPage";
import CompareGamePage from "@/pages/games/CompareGamePage";
import GameDetectivePage from "@/pages/games/DetectiveGamePage";
import GameShadowPage from "@/pages/games/ShadowGamePage";
import RankPage from "@/pages/games/RankPage";
import CardStudyPage from "@/pages/indexCardSetView/CardStudyPage";
import Loading from "@/components/common/Loading";

// 보호된 라우트 Wrapper
const ProtectedOutlet = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [redirectPath] = useState<string>("/login");
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = tokenUtils.getToken();

      // 토큰이 없는 경우 현재 경로를 state로 포함하여 로그인 페이지로 리다이렉트
      if (!currentToken) {
        setShouldRedirect(true);
        setIsLoading(false);
        return;
      }

      // 토큰이 있는 경우에만 재발급 시도
      const isRefreshed = await tokenUtils.tryRefreshToken();

      if (!isRefreshed) {
        tokenUtils.removeToken();
        setShouldRedirect(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (shouldRedirect) {
    // 로그인 페이지로 리다이렉트할 때 현재 경로를 state로 전달
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

// 로그인 라우트 컴포넌트
const LoginRoute = () => {
  const accessToken = tokenUtils.getToken();
  return accessToken ? <Navigate to="/card-view" replace /> : <LoginPage />;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // 비회원 접근 가능
      {
        path: "/login",
        element: <LoginRoute />,
        handle: { header: false, footer: false },
      },
      {
        path: "/account/login/:socialType",
        element: <SocialCallbackPage />,
        handle: { header: false, footer: false },
      },
      {
        path: "/signup/terms",
        element: <SignupTermsPage />,
        handle: { header: false, footer: false },
        children: [
          {
            path: ":termId",
            element: <TermDetailPage />,
            handle: { header: false, footer: false },
          },
        ],
      },
    ],
  },
  // 로그인 필요 구간 (protected)
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedOutlet />,
        children: [
          {
            index: true,
            element: <CardViewPage />,
            handle: { header: false, footer: true },
          },
          {
            path: "create",
            handle: { header: false, footer: true },
            children: [
              {
                index: true,
                element: <CreateFromSelfPage />,
              },
              { path: "pdf", element: <CreateFromPDFPage /> },
              { path: "text", element: <CreateFromTextFPage /> },
              { path: "image", element: <CreateFromImageFPage /> },
            ],
          },
          {
            path: "save",
            element: <SaveCardPage />,
            handle: { header: false, footer: true },
          },
          {
            path: "card-view",
            element: <CardViewPage />,
            handle: { header: false, footer: true },
          },
          {
            path: "study/:cardSetId",
            element: <CardStudyPage />,
          },
          {
            path: "test/:indexCardId",
            children: [
              { path: "concept", element: <CardTestConceptPage /> },
              { path: "explain", element: <CardTestExplainPage /> },
            ],
            handle: { header: false, footer: false },
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "games",
            element: <GamesPage />,
            children: [
              {
                index: true,
                element: <GameHomePage />,
              },
              {
                path: "game-mode",
                element: <GameModePage />,
              },
              {
                path: "memory",
                element: <MemoryGamePage />,
              },
              {
                path: "compare",
                element: <CompareGamePage />,
              },
              {
                path: "detective",
                element: <GameDetectivePage />,
              },
              {
                path: "shadow",
                element: <GameShadowPage />,
              },
              {
                path: "result",
                element: <GameResultPage />,
              },
              {
                path: "rank",
                element: <RankPage />,
              },
            ],
          },
          {
            path: "/map",
            element: <MapPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
