import React, { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  url: string;
  platform: "mobile" | "facebook" | "twitter" | "linkedin" | "copy";
  className?: string;
  theme?: string;
};

const mobileIconThemeMap: { [key: string]: string } = {
  blog: "/share/general-share-blog.svg",
  projects: "/share/general-share-projects.svg",
};

const copyIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-icon-blog.svg",
  projects: "/share/copy-icon-projects.svg",
};

const copiedIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-success-blog.svg",
  projects: "/share/copy-success-projects.svg",
};

const failedIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-failed-blog.svg",
  projects: "/share/copy-failed-projects.svg",
};

function ShareButton({
  title,
  description,
  url,
  platform,
  className = "",
  theme = "blog",
}: Props) {
  const iconMap: { [key: string]: string } = {
    mobile: mobileIconThemeMap[theme],
    mobileprojects: "/zimo-favicon.svg",
    facebook: "/share/facebook-icon.svg",
    twitter: "/share/twitter-icon.svg",
    linkedin: "/share/linkedin-icon.svg",
    copy: copyIconThemeMap[theme],
    copied: copiedIconThemeMap[theme],
    failed: failedIconThemeMap[theme],
  };

  const [iconState, setIconState] = useState<string>(platform);
  const [isOpaque, setOpacity] = useState<boolean>(true);
  const [shareInProgress, setShareInProgress] = useState<boolean>(false);
  const [isButtonAvailable, setButtonAvailable] = useState<boolean>(true);

  const initiateAnimation = (newIconState: string) => {
    setOpacity(false);
    setButtonAvailable(false);
    setTimeout(() => {
      setIconState(newIconState);
      setOpacity(true);
    }, 300); // animation duration
    setTimeout(() => {
      setOpacity(false);
    }, 1300); // time until next fade-out
    setTimeout(() => {
      setIconState(platform);
      setOpacity(true);
    }, 1600); // time until icon reset
    setTimeout(() => {
      setButtonAvailable(true);
    }, 1900);
  };

  const handleShare = () => {
    if (!isButtonAvailable) return;

    if (platform === "mobile") {
      handleMobileShare();
      return;
    }

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
          description
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(url)
          .then(() => {
            initiateAnimation("copied");
          })
          .catch(() => {
            initiateAnimation("failed");
          });
        return;
    }
    window.open(shareUrl, "_blank");
  };

  const handleMobileShare = async () => {
    if (shareInProgress) return; // Exit function if a share operation is already in progress

    setShareInProgress(true); // Mark mobile share operation as in-progress
    try {
      await navigator.share({ title, text: description, url });
      // You can handle a successful share here if needed
    } catch (e) {
      // Handle failure or cancelation
    } finally {
      setShareInProgress(false); // Reset mobile share operation status
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`${
        isOpaque ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-in-out ${className}`}
    >
      <Image src={iconMap[iconState]} alt={iconState} width={24} height={24} />
    </button>
  );
}

export default ShareButton;
