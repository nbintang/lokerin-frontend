import Link from "next/link";
 const bottomLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
      <p className="text-xs text-muted-foreground">
        &copy; {year} Lokerin. All rights reserved.
      </p>
      <div className="flex gap-4">
        {bottomLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
