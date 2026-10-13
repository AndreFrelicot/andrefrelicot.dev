import type { ComponentPropsWithoutRef } from "react";
import { AppStoreLink } from "./app-store-link";
import { AppExpressSourceBanner } from "./app-express-source-banner";
import { Callout } from "./callout";
import { GitHubLink } from "./github-link";
import { OsibitsLogo } from "./osibits-logo";
import { PlayStoreLink } from "./play-store-link";
import { PocketAnatomy } from "./pocket/pocket-anatomy";
import { PocketBridge } from "./pocket/pocket-bridge";
import { PocketFeedSignals } from "./pocket/pocket-feed-signals";
import { PocketKnowns } from "./pocket/pocket-knowns";
import { PocketLoop } from "./pocket/pocket-loop";
import { PocketPhotoFlow } from "./pocket/pocket-photo-flow";
import { PocketPipeline } from "./pocket/pocket-pipeline";
import { PocketRuntime } from "./pocket/pocket-runtime";
import { PocketSandbox } from "./pocket/pocket-sandbox";
import { PocketScenarios } from "./pocket/pocket-scenarios";
import { PocketStats } from "./pocket/pocket-stats";
import { PocketTimeline } from "./pocket/pocket-timeline";
import { PubDevLink } from "./pub-dev-link";
import { ScreenshotGallery } from "./screenshot-gallery";
import { ThreeCube } from "./three-cube";
import { VideoEmbed } from "./video-embed";
import { YouTubeEmbed } from "./youtube-embed";
import { ZoomableThemeImage } from "./zoomable-theme-image";

function MdxTable({ children, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mdx-table-wrapper">
      <table {...props}>{children}</table>
    </div>
  );
}

export const mdxComponents = {
  AppExpressSourceBanner,
  AppStoreLink,
  Callout,
  GitHubLink,
  OsibitsLogo,
  PlayStoreLink,
  PocketAnatomy,
  PocketBridge,
  PocketFeedSignals,
  PocketKnowns,
  PocketLoop,
  PocketPhotoFlow,
  PocketPipeline,
  PocketRuntime,
  PocketSandbox,
  PocketScenarios,
  PocketStats,
  PocketTimeline,
  PubDevLink,
  ScreenshotGallery,
  ThreeCube,
  VideoEmbed,
  // Article images are zoomable everywhere: ThemeImage routes to the
  // ZoomableThemeImage so the shared full-screen viewer applies to all posts.
  ThemeImage: ZoomableThemeImage,
  table: MdxTable,
  YouTubeEmbed,
  ZoomableThemeImage,
};
