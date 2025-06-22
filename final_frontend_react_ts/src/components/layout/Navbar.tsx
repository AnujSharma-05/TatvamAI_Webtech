import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-primary mr-8">
            TatvamAI
          </div>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center items-center space-x-6">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}

              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Products
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Voice Dataset</DropdownMenuItem>
                  <DropdownMenuItem>ASR Tools</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Resources
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>Case Studies</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* CTA Buttons and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* CTA Buttons */}
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.name}
            </a>
          ))}
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">Products</p>
            <a href="#" className="block text-sm text-muted-foreground">Voice Dataset</a>
            <a href="#" className="block text-sm text-muted-foreground">ASR Tools</a>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">Resources</p>
            <a href="#" className="block text-sm text-muted-foreground">Documentation</a>
            <a href="#" className="block text-sm text-muted-foreground">Case Studies</a>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full">Sign In</Button>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
