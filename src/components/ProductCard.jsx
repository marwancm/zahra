import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Star import removed
import { motion } from 'framer-motion';

    const ProductCard = ({ product }) => {
  const displayImage = product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : '/placeholder-image.jpg';
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if screen is mobile or tablet size
  useEffect(() => {
    const checkScreenSize = () => {
      // Consider both mobile and tablet as small screens where we want to hide WhatsApp button
      setIsMobile(window.innerWidth <= 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
        <motion.div
          whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(143, 67, 106, 0.2)" }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full bg-gradient-to-br from-background to-secondary/30 border-border/50 rounded-xl">
            <CardHeader className="p-0 relative">
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                  <img  
                    src={displayImage} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110" />
                </div>
              </Link>
              {/* Stock information removed */}
              {product.category && (
                <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs md:text-sm">{product.category}</Badge>
              )}
            </CardHeader>
            <CardContent className="p-3 sm:p-5 flex-grow">
              <Link to={`/products/${product.id}`}>
                <CardTitle className="text-lg sm:text-lg lg:text-xl font-semibold mb-1 lg:mb-2 text-brand-title hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
              </Link>
              <p className="text-muted-foreground text-xs sm:text-xs lg:text-sm mb-2 lg:mb-3 h-8 lg:h-10 overflow-hidden">
                {product.description ? `${product.description.substring(0, 60)}...` : 'عطر فاخر يناسب جميع الأذواق.'}
              </p>
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg sm:text-lg lg:text-xl font-bold text-brand-price">{product.price} ر.ع.</p>
              </div>
            </CardContent>
            <CardFooter className="p-3 sm:p-3 lg:p-4 border-t border-border/30">
              <Button 
                asChild 
                className="w-full bg-primary hover:bg-primary/90 text-sm md:text-base py-2 text-white transition-all duration-300 ease-in-out"
              >
                <Link to={`/products/${product.id}`}>عرض التفاصيل</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ProductCard;