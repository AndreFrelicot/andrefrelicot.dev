import type { ComponentPropsWithoutRef } from "react";
import { AppStoreLink } from "./app-store-link";
import { AppExpressSourceBanner } from "./app-express-source-banner";
import { Callout } from "./callout";
import { GitHubLink } from "./github-link";
import { OsibitsLogo } from "./osibits-logo";
import { PlayStoreLink } from "./play-store-link";
import { PubDevLink } from "./pub-dev-link";
import { ScreenshotGallery } from "./screenshot-gallery";
import { ThreeCube } from "./three-cube";
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
  PubDevLink,
  ScreenshotGallery,
  ThreeCube,
  // Article images are zoomable everywhere: ThemeImage routes to the
  // ZoomableThemeImage so the shared full-screen viewer applies to all posts.
  ThemeImage: ZoomableThemeImage,
  table: MdxTable,
  YouTubeEmbed,
  ZoomableThemeImage,
};
