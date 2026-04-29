const currentYear = new Date().getFullYear();

export function AppFooter() {
  return (
    <footer className="appFooter">
      <div className="container appFooterContent">
        <p className="appFooterCopy">© {currentYear} Quiz Builder</p>
      </div>
    </footer>
  );
}
