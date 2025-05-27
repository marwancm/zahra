import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import ProductManagement from '@/components/Dashboard/ProductManagement';
    import BannerManagement from '@/components/Dashboard/BannerManagement';
    import ProductFormModal from '@/components/Dashboard/ProductFormModal';
    import BannerFormModal from '@/components/Dashboard/BannerFormModal';
    import { Loader2 } from 'lucide-react';

    const DashboardPage = () => {
      const [products, setProducts] = React.useState([]);
      const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
      const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
      const [currentProduct, setCurrentProduct] = React.useState(null);
      
      const [banners, setBanners] = React.useState([]);
      const [isLoadingBanners, setIsLoadingBanners] = React.useState(true);
      const [isBannerModalOpen, setIsBannerModalOpen] = React.useState(false);
      const [currentBanner, setCurrentBanner] = React.useState(null);

      const { toast } = useToast();

      const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          setProducts(data || []);
        } catch (err) {
          console.error('Error fetching products:', err);
          toast({ title: "خطأ في جلب المنتجات", description: err.message, variant: "destructive" });
          setProducts([]);
        }
        setIsLoadingProducts(false);
      };

      const fetchBanners = async () => {
        setIsLoadingBanners(true);
        try {
          const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          setBanners(data || []);
        } catch (err) {
          console.error('Error fetching banners:', err);
          toast({ title: "خطأ في جلب البانرات", description: err.message, variant: "destructive" });
          setBanners([]);
        }
        setIsLoadingBanners(false);
      };

      React.useEffect(() => {
        fetchProducts();
        fetchBanners();
      }, []);

      const openAddProductModal = () => {
        setCurrentProduct(null);
        setIsProductModalOpen(true);
      };

      const openEditProductModal = (product) => {
        setCurrentProduct(product);
        setIsProductModalOpen(true);
      };

      const deleteProduct = async (productId) => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) {
          try {
            const { data: productData } = await supabase.from('products').select('image').eq('id', productId).single();
            if (productData && productData.image) {
                const imageParts = productData.image.split('/');
                const imageName = imageParts[imageParts.length -1];
                if (imageName) {
                    const { error: storageError } = await supabase.storage.from('product_images').remove([imageName]);
                    if (storageError) console.warn("Could not remove product image from storage:", storageError.message);
                }
            }
            
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            toast({ title: "تم حذف المنتج بنجاح!", variant: "default" });
            fetchProducts();
          } catch (err) {
            console.error('Error deleting product:', err);
            toast({ title: "خطأ في حذف المنتج", description: err.message, variant: "destructive" });
          }
        }
      };

      const openAddBannerModal = () => {
        setCurrentBanner(null);
        setIsBannerModalOpen(true);
      };

      const openEditBannerModal = (banner) => {
        setCurrentBanner(banner);
        setIsBannerModalOpen(true);
      };

      const deleteBanner = async (bannerId) => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذا البانر؟")) {
          try {
            const { data: bannerData } = await supabase.from('banners').select('image_url').eq('id', bannerId).single();
             if (bannerData && bannerData.image_url) {
                const imageParts = bannerData.image_url.split('/');
                const imageName = imageParts[imageParts.length -1];
                 if (imageName) {
                    const { error: storageError } = await supabase.storage.from('banners').remove([imageName]);
                    if (storageError) console.warn("Could not remove banner image from storage:", storageError.message);
                 }
            }

            const { error } = await supabase.from('banners').delete().eq('id', bannerId);
            if (error) throw error;
            toast({ title: "تم حذف البانر بنجاح!", variant: "default" });
            fetchBanners();
          } catch (err) {
            console.error('Error deleting banner:', err);
            toast({ title: "خطأ في حذف البانر", description: err.message, variant: "destructive" });
          }
        }
      };
      
      const showLoadingState = (isLoadingProducts && products.length === 0) || (isLoadingBanners && banners.length === 0);

      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#8f436a' }}>لوحة التحكم</h1>
          
          {showLoadingState ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
              <p className="ml-4 rtl:mr-4 text-xl text-gray-600">جاري تحميل بيانات لوحة التحكم...</p>
            </div>
          ) : (
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="products">إدارة المنتجات</TabsTrigger>
                <TabsTrigger value="banners">إدارة البانرات</TabsTrigger>
              </TabsList>
              <TabsContent value="products">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold" style={{ color: '#8f436a' }}>إدارة المنتجات</h2>
                  <Button onClick={openAddProductModal} style={{ backgroundColor: '#a65b86', color: 'white' }} className="hover:bg-[#c07faa]">
                    إضافة منتج جديد
                  </Button>
                </div>
                <ProductManagement 
                  products={products} 
                  isLoading={isLoadingProducts} 
                  openEditModal={openEditProductModal} 
                  deleteProduct={deleteProduct} 
                />
              </TabsContent>
              <TabsContent value="banners">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold" style={{ color: '#8f436a' }}>إدارة البانرات</h2>
                  <Button onClick={openAddBannerModal} style={{ backgroundColor: '#a65b86', color: 'white' }} className="hover:bg-[#c07faa]">
                    إضافة بانر جديد
                  </Button>
                </div>
                <BannerManagement 
                  banners={banners}
                  isLoading={isLoadingBanners}
                  openEditModal={openEditBannerModal}
                  deleteBanner={deleteBanner}
                />
              </TabsContent>
            </Tabs>
          )}

          {isProductModalOpen && (
            <ProductFormModal
              isOpen={isProductModalOpen}
              setIsOpen={setIsProductModalOpen}
              currentProduct={currentProduct}
              fetchProducts={fetchProducts}
              toast={toast}
            />
          )}

          {isBannerModalOpen && (
            <BannerFormModal
              isOpen={isBannerModalOpen}
              setIsOpen={setIsBannerModalOpen}
              currentBanner={currentBanner}
              fetchBanners={fetchBanners}
              toast={toast}
            />
          )}
        </div>
      );
    };

    export default DashboardPage;