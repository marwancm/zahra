import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import Header from '@/components/Layout/Header';
    import Footer from '@/components/Layout/Footer';
    import HomePage from '@/pages/HomePage';
    import ProductsPage from '@/pages/ProductsPage';
    import ProductDetailPage from '@/pages/ProductDetailPage';
    import ContactPage from '@/pages/ContactPage';
    import AboutPage from '@/pages/AboutPage';
    import DashboardPage from '@/pages/DashboardPage';
    import { supabase } from '@/lib/supabaseClient';
    import { Phone, MessageCircle } from 'lucide-react';

    const TopBar = () => (
  <div style={{ backgroundColor: '#d9d3d5', color: '#333333' }} className="py-0.5 md:py-2 px-2 md:px-4 text-center w-full">
    <div className="container mx-auto flex items-center justify-center">
      <Phone size={10} className="ml-1 md:ml-2 rtl:mr-1 rtl:md:mr-2" aria-label="Phone" />
      <span className="text-[10px] md:text-sm" data-component-name="TopBar">اطلب الآن 76396934 - التوصيل لأي مكان داخل سلطنة عمان</span>
    </div>
  </div>
);

    function App() {
      const [showWhatsApp, setShowWhatsApp] = useState(false);
      
      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 300) {
            setShowWhatsApp(true);
          } else {
            setShowWhatsApp(false);
          }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
      
      useEffect(() => {
        const testSupabaseConnection = async () => {
          try {
            const { data, error } = await supabase.from('products').select('id').limit(1);
            if (error) {
              console.error("Supabase connection error:", error.message);
            } else {
              // console.log("Supabase connection successful. Test data:", data);
            }
          } catch (err) {
            console.error("Exception during Supabase connection test:", err);
          }
        };
        testSupabaseConnection();
      }, []);


      return (
        <Router>
          <div className="flex flex-col min-h-screen font-[Cairo]" dir="rtl">
            <TopBar />
            <div className="relative">
              {showWhatsApp && (
                <a
                  href="https://wa.me/+96876347266"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                  style={{ width: '50px', height: '50px' }}
                >
                  <MessageCircle size={24} />
                </a>
              )}
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPageWrapper />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </div>
        </Router>
      );
    }
    
    const ProductDetailPageWrapper = () => {
      const params = useParams();
      return <ProductDetailPage {...params} />;
    };

    export default App;