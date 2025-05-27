import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

const BannerFormModal = ({ isOpen, setIsOpen, currentBanner, fetchBanners, toast }) => {
  const [bannerForm, setBannerForm] = React.useState({ image_url: '', title: '', subtitle: '', link_to: '/products', is_active: true });
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);

  React.useEffect(() => {
    if (currentBanner) {
      setBannerForm({
        image_url: currentBanner.image_url || '',
        title: currentBanner.title || '',
        subtitle: currentBanner.subtitle || '',
        link_to: currentBanner.link_to || '/products',
        is_active: currentBanner.is_active === undefined ? true : currentBanner.is_active,
      });
      setPreviewImage(currentBanner.image_url || null);
    } else {
      setBannerForm({ image_url: '', title: '', subtitle: '', link_to: '/products', is_active: true });
      setPreviewImage(null);
    }
    setSelectedFile(null); 
  }, [currentBanner, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewImage(currentBanner ? currentBanner.image_url : null);
    }
  };

  const uploadImage = async (fileToUpload) => {
    if (!fileToUpload) return bannerForm.image_url; 

    const fileName = `${uuidv4()}-${fileToUpload.name}`;
    const { data, error } = await supabase.storage
      .from('banners')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading banner image:', error);
      toast({ title: "خطأ في رفع صورة البانر", description: `Supabase Storage: ${error.message}`, variant: "destructive" });
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage.from('banners').getPublicUrl(fileName);
     if (!publicUrlData || !publicUrlData.publicUrl) {
        const urlError = new Error("Failed to get public URL for uploaded banner image.");
        console.error(urlError.message);
        toast({ title: "خطأ في الحصول على رابط صورة البانر", description: urlError.message, variant: "destructive" });
        throw urlError;
    }
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    let imageUrl = bannerForm.image_url;

    try {
      if (selectedFile) {
        if (currentBanner && currentBanner.image_url) {
          const oldImageParts = currentBanner.image_url.split('/');
          const oldImageName = oldImageParts[oldImageParts.length -1];
          if(oldImageName && oldImageName.trim() !== '') {
             const { error: removeError } = await supabase.storage.from('banners').remove([oldImageName]);
             if (removeError && removeError.message !== 'The resource was not found') { // Ignore not found errors
                console.warn('Could not remove old banner image:', removeError.message);
             }
          }
        }
        imageUrl = await uploadImage(selectedFile);
      }

      const bannerDataToSave = { ...bannerForm, image_url: imageUrl };

      let dbError;
      if (currentBanner) {
        const { data, error: updateError } = await supabase
          .from('banners')
          .update(bannerDataToSave)
          .eq('id', currentBanner.id)
          .select();
        dbError = updateError;
        if (!dbError) toast({ title: "تم تعديل البانر بنجاح!" });
      } else {
        const { data, error: insertError } = await supabase
          .from('banners')
          .insert([bannerDataToSave])
          .select();
        dbError = insertError;
        if (!dbError) toast({ title: "تم إضافة البانر بنجاح!" });
      }

      if (dbError) {
        console.error('Error saving banner to DB:', dbError);
        toast({ title: "خطأ في حفظ البانر", description: `Database: ${dbError.message}`, variant: "destructive" });
      } else {
        setIsOpen(false);
        fetchBanners();
      }
    } catch (err) {
      console.error('Exception during banner save process:', err);
      if (err.message.includes("violates row-level security policy")) {
         toast({ title: "خطأ في الأذونات", description: "ليس لديك الإذن الكافي لحفظ البانر. يرجى مراجعة إعدادات RLS.", variant: "destructive" });
      } else if (!err.message.includes("Supabase Storage") && !err.message.includes("Database")) { // Avoid double toasting if already handled by uploadImage or db ops
        toast({ title: "خطأ فادح أثناء عملية الحفظ", description: err.message, variant: "destructive" });
      }
    } finally {
        setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="banner-form-modal-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
      >
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={20} aria-hidden="true" />
        </Button>
        <h2 id="banner-form-modal-title" className="text-2xl font-bold mb-6" style={{ color: '#8f436a' }}>
          {currentBanner ? 'تعديل البانر' : 'إضافة بانر جديد'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="banner_image">صورة البانر</Label>
            <Input id="banner_image" name="banner_image" type="file" onChange={handleFileChange} accept="image/*" disabled={isProcessing} />
            {previewImage && <img src={previewImage} alt="معاينة البانر" className="mt-2 h-32 w-auto object-contain rounded-md" />}
             <p className="text-xs text-gray-500 mt-1">
              {currentBanner && currentBanner.image_url && !selectedFile ? "الصورة الحالية معروضة. اختر ملفًا جديدًا لتغييرها." : "اختر ملف صورة للبانر."}
            </p>
          </div>
          <div>
            <Label htmlFor="banner_title">عنوان البانر</Label>
            <Input id="banner_title" name="title" value={bannerForm.title} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="banner_subtitle">العنوان الفرعي للبانر (اختياري)</Label>
            <Input id="banner_subtitle" name="subtitle" value={bannerForm.subtitle} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="banner_link_to">الرابط (عند الضغط على البانر)</Label>
            <Input id="banner_link_to" name="link_to" value={bannerForm.link_to} onChange={handleInputChange} defaultValue="/products" />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox id="banner_is_active" name="is_active" checked={bannerForm.is_active} onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, is_active: checked }))} />
            <Label htmlFor="banner_is_active">تفعيل البانر</Label>
          </div>
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>إلغاء</Button>
            <Button type="submit" style={{ backgroundColor: '#a65b86', color: 'white' }} className="hover:bg-[#c07faa]" disabled={isProcessing}>
              {isProcessing ? 'جاري الحفظ...' : (currentBanner ? 'حفظ التعديلات' : 'إضافة البانر')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BannerFormModal;