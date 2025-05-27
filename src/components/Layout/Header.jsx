import React, { useState, useEffect, useRef } from 'react';
    import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
    import { Search, Menu, X } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import logo from '../../../public/logo.png'

    const ZahraLogo = () => (
      <Link to="/" className="text-4xl font-bold" style={{ fontFamily: "'Ms Madi', cursive", color: 'hsl(var(--primary))' }}>
        <img src={logo} alt="Logo" className="w-24 h-24" />
      </Link>
    );

    const NavItem = ({ to, children, onClick }) => (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `text-lg font-medium hover:text-primary transition-colors duration-300 ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground/70'}`
        }
      >
        {children}
      </NavLink>
    );

    const SearchBar = ({ onSearchHandled, placeholder = "ابحث عن عطرك..." }) => {
      const navigate = useNavigate();
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const initialSearchTerm = queryParams.get('search') || '';
      const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm);
      const inputRef = useRef(null);

      React.useEffect(() => {
        setSearchTerm(initialSearchTerm);
      }, [initialSearchTerm]);

      const handleSearch = (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
          navigate(`/products?search=${encodeURIComponent(trimmedSearchTerm)}`);
        } else {
          navigate('/products'); 
        }
        if (onSearchHandled) {
          onSearchHandled();
        }
      };

      const handleSearchIconClick = (e) => {
        e.preventDefault();
        // Focus on the input field
        inputRef.current?.focus();
      };

      return (
        <form onSubmit={handleSearch} className="relative w-full">
          <Input 
            ref={inputRef}
            type="search" 
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 rtl:pr-7 rounded-full border-border focus:border-primary focus:ring-primary bg-secondary/50 w-full" 
          />
          <button 
            type="button" 
            onClick={handleSearchIconClick}
            aria-label="Search"
            className="absolute left-1 rtl:right-1 top-1/2 transform -translate-y-1/2 p-0.5 bg-transparent border-none cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </form>
      );
    };

    const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
      
      return (
        <header className="bg-background/70 backdrop-blur-sm shadow-subtle z-50 border-b border-border/50 transition-all duration-300 sticky top-0 left-0 right-0 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <ZahraLogo />
              <nav className="hidden md:flex space-x-8 items-center rtl:space-x-reverse">
                <NavItem to="/">الرئيسية</NavItem>
                <NavItem to="/products">جميع المنتجات</NavItem>
                <NavItem to="/contact">تواصل معنا</NavItem>
                <NavItem to="/about">عنا</NavItem>
                <NavItem to="/dashboard">لوحة التحكم</NavItem>
              </nav>
              <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse  max-w-md">
                <SearchBar />
              </div>
              <div className="md:hidden flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? <X className="h-7 w-7 text-primary" /> : <Menu className="h-7 w-7 text-primary" />}
                </Button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-background shadow-medium absolute w-full border-t border-border/50 z-50"
            >
              <nav className="flex flex-col items-center space-y-6 py-6">
                <NavItem to="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</NavItem>
                <NavItem to="/products" onClick={() => setIsMobileMenuOpen(false)}>جميع المنتجات</NavItem>
                <NavItem to="/contact" onClick={() => setIsMobileMenuOpen(false)}>تواصل معنا</NavItem>
                <NavItem to="/about" onClick={() => setIsMobileMenuOpen(false)}>عنا</NavItem>
                <NavItem to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>لوحة التحكم</NavItem>
                <div className="mt-4 w-4/5">
                  <SearchBar onSearchHandled={() => setIsMobileMenuOpen(false)} />
                </div>
              </nav>
            </motion.div>
          )}
        </header>
      );
    };

    export default Header;