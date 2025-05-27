import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Tag, Layers, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLazyImage, useDebounce, useIntersectionObserver } from '@/lib/performance';
import { useFocusTrap, useEscapeKey, useAnnounce, AccessibleImage } from '@/lib/accessibility';

// Lazy load the ProductCard component
const ProductCard = lazy(() => import('@/components/ProductCard'));

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Accessibility hooks
  const modalRef = useFocusTrap(isModalOpen);
  const { announce, AriaLiveRegion } = useAnnounce();

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching product:', fetchError);
        setError('لم نتمكن من العثور على هذا المنتج.');
        setProduct(null);
        announce('حدث خطأ أثناء تحميل المنتج', 'assertive');
      } else {
        setProduct(data);
        setError(null);
        announce(`تم تحميل المنتج: ${data.name}`, 'polite');
        
        if (data) {
          // Preload main product image
          if (data.image_urls && data.image_urls.length > 0) {
            const img = new Image();
            img.src = data.image_urls[0];
          }
          
          // Fetch related products
          let query = supabase
            .from('products')
            .select('*')
            .neq('id', data.id)
            .limit(4);
          
          if (data.category) {
            query = query.eq('category', data.category);
          } else if (data.perfume_type) {
            query = query.eq('perfume_type', data.perfume_type);
          }
          
          const { data: relatedData, error: relatedError } = await query;
            
          if (!relatedError && relatedData) {
            setRelatedProducts(relatedData);
          } else {
            console.error('Error fetching related products:', relatedError);
            setRelatedProducts([]);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      announce('حدث خطأ غير متوقع', 'assertive');
    } finally {
      setLoading(false);
    }
  }, [id, announce]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    
    // Cleanup function
    return () => {
      // Cancel any pending requests or timers if needed
    };
  }, [id, fetchProduct]);

  // Optimized image navigation handlers
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % (product?.image_urls?.length || 1)
    );
    announce('الصورة التالية', 'polite');
  }, [product?.image_urls?.length, announce]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + (product?.image_urls?.length || 1)) % (product?.image_urls?.length || 1)
    );
    announce('الصورة السابقة', 'polite');
  }, [product?.image_urls?.length, announce]);

  const handleThumbnailClick = useCallback((index) => {
    setCurrentImageIndex(index);
    announce(`الصورة ${index + 1} من ${product?.image_urls?.length || 1}`, 'polite');
  }, [product?.image_urls?.length, announce]);
  
  // Handle modal open/close
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    announce('تم فتح معرض الصور', 'polite');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }, [announce]);
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    announce('تم إغلاق معرض الصور', 'polite');
    document.body.style.overflow = ''; // Restore scrolling
  }, [announce]);
  
  // Use escape key to close modal
  useEscapeKey(closeModal, isModalOpen);

  // Memoize display images to prevent unnecessary re-renders
  const displayImages = useMemo(() => {
    return product?.image_urls && product.image_urls.length > 0 
      ? product.image_urls 
      : ['/placeholder-image.jpg'];
  }, [product?.image_urls]);
  
  // Use lazy loading for the current image
  const currentImage = useLazyImage(displayImages[currentImageIndex] || '/placeholder-image.jpg');

  // Loading and error states with improved accessibility
  if (loading) {
    return (
      <div className="container mx-auto text-center py-20" aria-live="polite" role="status">
        <div className="text-2xl">جاري تحميل المنتج...</div>
        <div className="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center py-20" role="alert">
        <h1 className="text-3xl text-destructive mb-4">{error}</h1>
        <Button asChild variant="outline">
          <Link to="/products">العودة إلى المنتجات</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto text-center py-20 text-2xl" role="alert">المنتج غير متوفر.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12"
    >
      {/* Accessibility live region */}
      <AriaLiveRegion />
      
      {/* Lightbox Modal with focus trap */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            className="relative max-w-6xl w-full max-h-[90vh] flex justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <span id="modal-title" className="sr-only">معرض صور {product.name}</span>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
              aria-label="إغلاق"
            >
              <X size={32} />
            </button>
            
            <div className="relative w-full h-full flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft size={32} />
              </button>
              
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-[90vh] mx-auto"
              >
                <AccessibleImage
                  src={currentImage}
                  alt={`${product.name} - صورة ${currentImageIndex + 1} من ${displayImages.length}`}
                  className="max-w-full max-h-[90vh] object-contain mx-auto"
                />
                <div className="text-white text-center mt-2" aria-live="polite">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              </motion.div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                aria-label="الصورة التالية"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full md:w-1/2 lg:w-2/5 bg-background p-3 sm:p-4 md:p-6 rounded-lg md:rounded-xl shadow-medium"
        >
          <div 
            className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl shadow-md mb-3 md:mb-4"
            role="button"
            tabIndex="0"
            aria-label={`عرض صور ${product.name} في معرض كامل الشاشة`}
            onClick={openModal}
            onKeyDown={(e) => e.key === 'Enter' && openModal()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentImageIndex}
              transition={{ duration: 0.3 }}
            >
              <AccessibleImage
                src={currentImage}
                alt={`${product.name} - صورة ${currentImageIndex + 1} من ${displayImages.length}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {displayImages.length > 1 && (
              <>
                <button 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-1.5 md:p-2 rounded-full shadow-md z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft size={18} />
                  <span className="sr-only">الصورة السابقة</span>
                </button>
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-1.5 md:p-2 rounded-full shadow-md z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="الصورة التالية"
                >
                  <ChevronRight size={18} />
                  <span className="sr-only">الصورة التالية</span>
                </button>
              </>
            )}
          </div>
          
          {displayImages.length > 1 && (
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {displayImages.map((imgSrc, index) => (
                <motion.button 
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ease-in-out ${
                    currentImageIndex === index 
                      ? 'border-primary scale-105' 
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <AccessibleImage 
                    src={imgSrc} 
                    alt={`${product.name} - صورة ${index + 1} من ${displayImages.length}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2 lg:w-3/5 mt-4 md:mt-0 p-2 md:p-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-title mb-2 md:mb-3">{product.name}</h1>
          
          <div className="flex items-center mb-3 md:mb-4">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-price">{product.price} ر.ع.</p>
          </div>

          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none mb-4 md:mb-6 text-foreground/90">
            <p>{product.description || 'لا يوجد وصف متوفر لهذا المنتج حاليًا.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2 mb-4 md:mb-6">
            {product.category && (
              <div className="flex items-center text-muted-foreground" aria-label={`الفئة: ${product.category}`}>
                <Layers size={18} className="mr-2 rtl:ml-2 text-primary" aria-hidden="true" />
                <span className="font-medium text-sm md:text-base">الفئة:</span>
                <Badge variant="secondary" className="ml-2 rtl:mr-2 text-xs md:text-sm">
                  {product.category}
                </Badge>
              </div>
            )}
            {product.perfume_type && (
              <div className="flex items-center text-muted-foreground" aria-label={`اسم العطر: ${product.perfume_type}`}>
                <Tag size={18} className="mr-2 rtl:ml-2 text-primary" aria-hidden="true" />
                <span className="font-medium text-sm md:text-base">اسم العطر:</span>
                <Badge variant="secondary" className="ml-2 rtl:mr-2 text-xs md:text-sm">
                  {product.perfume_type}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="mt-2 md:mt-4">
            <Button 
              size="lg" 
              className="w-full text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-5 bg-primary hover:bg-primary/90 text-white transition-all duration-300 ease-in-out bg-green-500"
              asChild
            >
              <a 
                href={`https://wa.me/96876347266?text=مرحباً، أرغب في الاستفسار عن ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`تواصل عبر واتساب للاستفسار عن ${product.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 rtl:ml-2 h-5 w-5 inline-block">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      <div className="mt-10 md:mt-16 pt-6 md:pt-10 border-t border-border/50">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-brand-title">
          منتجات مشابهة قد تعجبك
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct, index) => {
              // Use intersection observer for lazy loading related products
              const [ref, isVisible] = useIntersectionObserver({
                threshold: 0.1,
                rootMargin: '100px'
              });
              
              return (
                <motion.div
                  ref={ref}
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isVisible && (
                    <Suspense fallback={
                      <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                        <span className="sr-only">جاري تحميل المنتج المشابه</span>
                      </div>
                    }>
                      <ProductCard product={relatedProduct} />
                    </Suspense>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-4 text-center py-10 text-muted-foreground" role="status">
              لا توجد منتجات مشابهة متاحة حالياً
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;