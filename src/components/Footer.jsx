import GitHubIcon from "./icons/GitHubIcon.jsx";

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-border px-3 pt-4 text-xs text-muted">
      <div className="flex flex-col gap-1">
        <p>Site non affilié a Decathlon.</p>
        <p>Tous droits reservés.</p>
        <p>Les marques et logos appartiennent a leurs proprietaires respectifs.</p>
        <a
          href="https://github.com/lmchzromain/decathlon-schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted transition hover:text-text underline"
        >
          <GitHubIcon className="size-[14px]" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
