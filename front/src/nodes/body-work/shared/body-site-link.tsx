import {
  bodyResolvedLinkHref,
  type BodyResolvedLink,
} from "./body-link";

export function BodySiteLinkAnchor({
  link,
  onClick,
}: {
  link: BodyResolvedLink;
  onClick?: () => void;
}) {
  return (
    <a
      href={bodyResolvedLinkHref(link)}
      target={link.target}
      rel={link.target === "_blank" ? "noreferrer noopener" : undefined}
      onClick={onClick}
    >
      {link.name}
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
