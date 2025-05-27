import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, XCircle, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPerfumeTypes, setSelectedPerfumeTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [perfumeTypes, setPerfumeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(500);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProductsAndFilters = async () => {
      setIsLoading(true);
      let query = supabase.from('products').select('*');
      
      const { data: productsData, error: productsError } = await query;

      if (productsError) {
        console.error('Error fetching products:', productsError);
        setAllProducts([]);
        setFilteredProducts([]);
      } else {
        setAllProducts(productsData || []);
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))].sort();
        setCategories(uniqueCategories);
        
        const uniquePerfumeTypes = [...new Set(productsData.map(p => p.perfume_type).filter(Boolean))].sort();
        setPerfumeTypes(uniquePerfumeTypes);
        
        const prices = productsData.map(p => p.price).filter(p => typeof p === 'number');
        const currentMaxPrice = prices.length > 0 ? Math.max(...prices) : 500;
        setMaxPrice(currentMaxPrice);
        setPriceRange([0, currentMaxPrice]);

        const queryParams = new URLSearchParams(location.search);
        const categoryFromQuery = queryParams.get('category');
        const perfumeTypeFromQuery = queryParams.get('perfume_type');
        const searchFromQuery = queryParams.get('search');

        if (categoryFromQuery) {
          const cats = categoryFromQuery.split(',').filter(c => uniqueCategories.includes(c));
          if(cats.length > 0) setSelectedCategories(cats);
        }
        if (perfumeTypeFromQuery) {
          const types = perfumeTypeFromQuery.split(',').filter(t => uniquePerfumeTypes.includes(t));
          if(types.length > 0) setSelectedPerfumeTypes(types);
        }
        if (searchFromQuery) {
          setSearchTerm(searchFromQuery);
        }
      }
      setIsLoading(false);
    };
    fetchProductsAndFilters();
  }, []); 
  
  useEffect(() => {
    let tempProducts = [...allProducts];
    
    tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedPerfumeTypes.length > 0) {
      tempProducts = tempProducts.filter(p => selectedPerfumeTypes.includes(p.perfume_type));
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.name?.toLowerCase().includes(lowerSearchTerm) || 
        p.description?.toLowerCase().includes(lowerSearchTerm) || 
        p.category?.toLowerCase().includes(lowerSearchTerm) ||
        p.perfume_type?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredProducts(tempProducts);
    
    // Update URL with filter parameters
    const queryParams = new URLSearchParams();
    if (selectedCategories.length > 0) {
      queryParams.set('category', selectedCategories.join(','));
    }
    if (selectedPerfumeTypes.length > 0) {
      queryParams.set('perfume_type', selectedPerfumeTypes.join(','));
    }
    if (searchTerm.trim() !== '') {
      queryParams.set('search', searchTerm);
    }
    
    const queryString = queryParams.toString();
    navigate(
      { pathname: location.pathname, search: queryString ? `?${queryString}` : '' },
      { replace: true }
    );
  }, [allProducts, priceRange, selectedCategories, selectedPerfumeTypes, searchTerm, navigate, location.pathname]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePerfumeTypeChange = (type) => {
    setSelectedPerfumeTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSelectedPerfumeTypes([]);
    setSearchTerm('');
  };

  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-title">جميع العطور</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-primary text-primary"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter size={16} />
          الفلاتر
        </Button>
      </div>
      
      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-background overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-title">الفلاتر</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} />
              </Button>
            </div>
            
            <div className="mb-6">
              <Label className="text-base font-medium mb-2 block text-brand-price">نطاق السعر</Label>
              <div className="mt-6 px-2">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} ر.ع.</span>
                  <span>{priceRange[1]} ر.ع.</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-base font-medium mb-2 block text-brand-price">الفئة</Label>
              {categories.length > 0 ? categories.map(category => (
                <div key={category} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <Checkbox 
                    id={`mobile-cat-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border text-primary focus:ring-ring"
                  />
                  <Label htmlFor={`mobile-cat-${category}`} className="text-foreground/80 hover:text-foreground cursor-pointer">{category}</Label>
                </div>
              )) : <p className="text-sm text-muted-foreground">لا توجد فئات متاحة.</p>}
            </div>

            <div className="mb-6">
              <Label className="text-base font-medium mb-2 block text-brand-price">نوع العطر</Label>
              {perfumeTypes.length > 0 ? perfumeTypes.map(type => (
                <div key={type} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <Checkbox 
                    id={`mobile-type-${type}`} 
                    checked={selectedPerfumeTypes.includes(type)}
                    onCheckedChange={() => handlePerfumeTypeChange(type)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border text-primary focus:ring-ring"
                  />
                  <Label htmlFor={`mobile-type-${type}`} className="text-foreground/80 hover:text-foreground cursor-pointer">{type}</Label>
                </div>
              )) : <p className="text-sm text-muted-foreground">لا توجد أنواع عطور متاحة.</p>}
            </div>

            <Button onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }} variant="outline" className="w-full mt-4 mb-4">إعادة تعيين الفلاتر</Button>
            <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-primary text-white">تطبيق الفلاتر</Button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:w-1/4 bg-background/80 p-6 rounded-xl border border-border/50 shadow-subtle h-fit">
          <h2 className="text-2xl font-bold mb-6 text-brand-title">الفلاتر</h2>
          
          <div className="mb-6">
            <Label className="text-lg font-medium mb-3 block text-brand-price">نطاق السعر</Label>
            <div className="mt-6 px-2">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} ر.ع.</span>
                <span>{priceRange[1]} ر.ع.</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-lg font-medium mb-3 block text-brand-price">الفئة</Label>
            {categories.length > 0 ? categories.map(category => (
              <div key={category} className="flex items-center space-x-2 rtl:space-x-reverse mb-2.5">
                <Checkbox 
                  id={`cat-${category}`} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border text-primary focus:ring-ring"
                />
                <Label htmlFor={`cat-${category}`} className="text-foreground/80 hover:text-foreground cursor-pointer">{category}</Label>
              </div>
            )) : <p className="text-sm text-muted-foreground">لا توجد فئات متاحة.</p>}
          </div>

          <div className="mb-6">
            <Label className="text-lg font-medium mb-3 block text-brand-price">نوع العطر</Label>
            {perfumeTypes.length > 0 ? perfumeTypes.map(type => (
              <div key={type} className="flex items-center space-x-2 rtl:space-x-reverse mb-2.5">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={selectedPerfumeTypes.includes(type)}
                  onCheckedChange={() => handlePerfumeTypeChange(type)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border text-primary focus:ring-ring"
                />
                <Label htmlFor={`type-${type}`} className="text-foreground/80 hover:text-foreground cursor-pointer">{type}</Label>
              </div>
            )) : <p className="text-sm text-muted-foreground">لا توجد أنواع عطور متاحة.</p>}
          </div>

          <Button onClick={resetFilters} variant="outline" className="w-full mt-4">إعادة تعيين الفلاتر</Button>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 hidden md:block text-right text-brand-title">جميع العطور</h1>
            <div className="relative">
              <Input 
                type="search" 
                placeholder="ابحث بالاسم, الوصف, الفئة ..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 rtl:pr-10 py-3 text-base rounded-lg border-border focus:border-primary focus:ring-primary bg-secondary/50 w-full"
              />
              <Search className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {searchTerm && (
                <Button variant="ghost" size="icon" className="absolute left-10 rtl:right-10 top-1/2 transform -translate-y-1/2 h-7 w-7" onClick={clearSearch}>
                  <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          </div>
          
          {isLoading && filteredProducts.length === 0 ? (
             <div className="text-center text-muted-foreground text-xl py-10">جاري تحميل المنتجات...</div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              layout 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 lg:gap-x-4 lg:gap-y-6"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground text-xl py-10">لا توجد منتجات تطابق معايير البحث الحالية.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;