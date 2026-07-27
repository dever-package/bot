import type { ComponentProps, ReactNode } from "react";
import { bodyResolvedLinkHref, type BodyResolvedLink } from "./body-link";

export function BodySiteLinkAnchor({
  link,
  onClick,
  children,
  className,
  role,
  title,
  ariaHasPopup,
}: {
  link: BodyResolvedLink;
  onClick?: ComponentProps<"a">["onClick"];
  children?: ReactNode;
  className?: string;
  role?: ComponentProps<"a">["role"];
  title?: string;
  ariaHasPopup?: ComponentProps<"a">["aria-haspopup"];
}) {
  return (
    <a
      className={className}
      href={bodyResolvedLinkHref(link)}
      target={link.target}
      rel={link.target === "_blank" ? "noreferrer noopener" : undefined}
      role={role}
      title={title}
      aria-haspopup={ariaHasPopup}
      onClick={onClick}
    >
      {children ?? link.name}
    </a>
  );
}

export function BodySiteLinkList({
  links,
  ariaLabel,
  className,
  id,
  onLinkClick,
}: {
  links: BodyResolvedLink[];
  ariaLabel: string;
  className: string;
  id?: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav id={id} className={className} aria-label={ariaLabel}>
      {links.map((link) => (
        <BodySiteLinkAnchor
          key={link.id}
          link={link}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  );
}
