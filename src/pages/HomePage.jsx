import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { ChevronRight, Gift, ShieldCheck, Truck } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import ProductCard from '@/components/ProductCard';
    import { supabase } from '@/lib/supabaseClient';
    import feimg from '../../public/fe.jpg'
    import maimg from '../../public/ma.jpg'
    import allimg from '../../public/all.jpg'

    const HeroCarousel = () => {
      const [currentIndex, setCurrentIndex] = React.useState(0);
      const [slides, setSlides] = React.useState([]);
      const [isLoading, setIsLoading] = React.useState(true);
      const defaultSlides = [ 
        { image_url: 'https://placehold.co/1920x1080/a65b86/ffffff?text=Zahra+Perfumes+Banner+1', title: 'عطور فاخرة لكل مناسبة', subtitle: 'اكتشف تشكيلتنا المميزة من العطور العالمية والشرقية', link_to: '/products' },
        { image_url: 'https://placehold.co/1920x1080/8f436a/ffffff?text=Zahra+Perfumes+Banner+2', title: 'نفحات من الطبيعة', subtitle: 'أفضل المكونات لعطر يدوم', link_to: '/products' },
      ];

      React.useEffect(() => {
        const fetchBanners = async () => {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('banners')
              .select('image_url, title, subtitle, link_to')
              .eq('is_active', true)
              .order('created_at', { ascending: false });
            
            if (error) {
              console.error("Error fetching banners:", error);
              setSlides(defaultSlides);
            } else if (data && data.length > 0) {
              setSlides(data.map(banner => ({
                image_url: banner.image_url,
                title: banner.title,
                subtitle: banner.subtitle,
                link_to: banner.link_to || '/products'
              })));
            } else {
               setSlides(defaultSlides);
            }
          } catch (err) {
            console.error("Exception fetching banners:", err);
            setSlides(defaultSlides);
          }
          setIsLoading(false);
        };
        fetchBanners();
      }, []);

      React.useEffect(() => {
        if (slides.length === 0) return;
        const timer = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 6000);
        return () => clearTimeout(timer);
      }, [currentIndex, slides.length]);

      const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
      };

      if (isLoading) {
        return (
          <div className="relative w-full h-[70vh] md:h-[85vh] bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-500">جاري تحميل البانر...</p>
          </div>
        );
      }
      
      if (slides.length === 0) {
         return (
          <div className="relative w-full h-[70vh] md:h-[85vh] bg-gray-200 flex items-center justify-center">
             <img src={defaultSlides[0].image_url} alt="Default Banner" className="w-full h-full object-cover"/>
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">{defaultSlides[0].title}</h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">{defaultSlides[0].subtitle}</p>
             </div>
          </div>
        );
      }


      return (
        <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-gradient-to-br from-primary/30 via-brand-subtle-bg to-secondary/30">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.image_url || index}
              custom={index - currentIndex}
              variants={slideVariants}
              initial="enter"
              animate={index === currentIndex ? "center" : "exit"}
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
              className="absolute inset-0 w-full h-full"
            >
              <img  
                className="w-full h-full object-cover object-center" 
                alt={slide.title || "Banner image"}
                src={slide.image_url || "https://placehold.co/1920x1080/a65b86/ffffff?text=Default+Banner"} 
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : -30 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                   style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, scale: index === currentIndex ? 1 : 0.8 }}
                  transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                >
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-brand-primary-hover transition-all duration-300 transform hover:scale-105 shadow-medium px-10 py-6 text-lg" asChild>
                    <Link to={slide.link_to || '/products'}>اكتشف الآن <ChevronRight className="mr-2 rtl:ml-2 h-5 w-5" /></Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 rtl:space-x-reverse z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${currentIndex === index ? 'bg-primary scale-125' : 'bg-white/70 hover:bg-white'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      );
    };

    const FeaturedBanner = () => (
      <section className="py-16 bg-brand-subtle-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.1}}
              className="flex flex-col items-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-medium transition-shadow"
            >
              <Gift size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold text-brand-title mb-2">هدايا مميزة</h3>
              <p className="text-muted-foreground text-sm">عطور فاخرة تصلح لأجمل الهدايا في جميع المناسبات.</p>
            </motion.div>
            <motion.div 
              initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.2}}
              className="flex flex-col items-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-medium transition-shadow"
            >
              <ShieldCheck size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold text-brand-title mb-2">جودة مضمونة</h3>
              <p className="text-muted-foreground text-sm">نضمن أصالة وجودة جميع منتجاتنا 100%.</p>
            </motion.div>
            <motion.div 
              initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.3}}
              className="flex flex-col items-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-medium transition-shadow"
            >
              <Truck size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold text-brand-title mb-2">توصيل سريع</h3>
              <p className="text-muted-foreground text-sm">توصيل سريع وآمن لجميع مناطق السلطنة.</p>
            </motion.div>
          </div>
        </div>
      </section>
    );

    const HomePage = () => {
      const [bestSellingProducts, setBestSellingProducts] = React.useState([]);
      const [newArrivals, setNewArrivals] = React.useState([]);
      
      React.useEffect(() => {
        const fetchProducts = async () => {
          try {
            const { data: bestData, error: bestError } = await supabase
              .from('products')
              .select('*')
              .order('rating', { ascending: false })
              .limit(4);
            if (bestError) console.error('Error fetching best selling products:', bestError);
            else setBestSellingProducts(bestData || []);

            const { data: newData, error: newError } = await supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(8);
            if (newError) console.error('Error fetching new arrivals:', newError);
            else setNewArrivals(newData || []);
          } catch (err) {
            console.error("Exception fetching products for homepage:", err);
          }
        };
        fetchProducts();
      }, []);

      const featuredCategories = [
        { name: 'عطور نسائية', image_url: feimg, link: '/products?category=نسائي' },
        { name: 'عطور رجالية', image_url: maimg, link: '/products?category=رجالي' },
        { name: 'عطور للجنسين', image_url: allimg, link: '/products?category=للجنسين' },
      ];

      return (
        <div className="bg-background min-h-screen animate-fadeIn">
          <HeroCarousel />
          <FeaturedBanner />
          
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center mb-12 text-brand-title">اكتشف حسب الفئة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredCategories.map((category, idx) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="relative rounded-xl overflow-hidden shadow-strong group h-80"
                  >
                    <img  
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                      alt={category.name} 
                      src={category.image_url} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 flex flex-col items-center justify-end p-8">
                      <h3 className="text-3xl font-semibold text-white mb-4 text-center" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{category.name}</h3>
                      <Button variant="default" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm" asChild>
                        <Link to={category.link}>تسوق الآن</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {newArrivals.length > 0 && (
            <section className="py-10 md:py-16 bg-brand-subtle-bg">
              <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-brand-title">جميع العطور</h2>
                <p className="text-center text-muted-foreground text-sm md:text-base mb-6 md:mb-12">اكتشف جميع العطور المميزة وافضل العروض في زهرة .</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 lg:gap-x-4 lg:gap-y-6">
                  {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10" asChild>
                    <Link to="/products">تصفح جميع العطور</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
          

        </div>
      );
    };

    export default HomePage;