import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Phone, MessageCircle } from 'lucide-react';
import { SkipToContent } from '@/lib/accessibility';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

    const TopBar = () => (
  <div 
    style={{ backgroundColor: '#d9d3d5', color: '#736f70' }} 
    className="py-0.5 md:py-2 px-2 md:px-4 text-center w-full"
    role="region"
    aria-label="معلومات التواصل"
  >
    <div className="container mx-auto flex items-center justify-center">
      <Phone size={10} className="ml-1 md:ml-2 rtl:mr-1 rtl:md:mr-2" aria-hidden="true" />
      <span className="text-[10px] md:text-sm">اطلب الآن 76396934 - التوصيل لأي مكان داخل سلطنة عمان</span>
    </div>
  </div>
);

// Loading fallback component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" aria-hidden="true"></div>
      <p className="mt-4 text-lg">جاري التحميل...</p>
    </div>
  </div>
);

function App() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Handle scroll for WhatsApp button visibility
  useEffect(() => {
    // Throttle function to improve performance
    let lastScrollTime = 0;
    const throttleDelay = 100; // ms
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime > throttleDelay) {
        lastScrollTime = now;
        if (window.scrollY > 300) {
          setShowWhatsApp(true);
        } else {
          setShowWhatsApp(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Test Supabase connection on mount
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        if (error) {
          console.error("Supabase connection error:", error.message);
        }
      } catch (err) {
        console.error("Exception during Supabase connection test:", err);
      }
    };
    testSupabaseConnection();
  }, []);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-[Cairo]" dir="rtl">
        {/* Offline notification */}
        {!isOnline && (
          <div 
            className="bg-destructive text-white text-center py-2 px-4 w-full" 
            role="alert"
            aria-live="assertive"
          >
            أنت غير متصل بالإنترنت. يرجى التحقق من اتصالك.
          </div>
        )}
        
        <TopBar />
        <SkipToContent />
        
        <div className="relative">
          {showWhatsApp && (
            <a 
              href="https://wa.me/+96876347266" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
              style={{ width: '50px', height: '50px' }}
              aria-label="تواصل معنا عبر واتساب"
            >
              <MessageCircle size={24} aria-hidden="true" />
            </a>
          )}
          
          <Header />
          
          <main id="main-content" className="flex-grow" tabIndex="-1">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPageWrapper />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
          <Toaster />
        </div>
      </div>
    </Router>
  );
    }
    
// Wrapper for ProductDetailPage to handle params
const ProductDetailPageWrapper = () => {
  const params = useParams();
  return <ProductDetailPage {...params} />;
};

    export default App;